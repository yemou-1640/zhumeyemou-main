<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'

// 导入图片
import xihuImg from '@/image/xihu.jpg'
import qiandaohuImg from '@/image/千岛湖.jpg'
import wuzhenImg from '@/image/乌镇.jpg'
import yandangshanImg from '@/image/雁荡山.jpg'
import putuoshanImg from '@/image/普陀山.jpg'
import hengdianImg from '@/image/横店.jpg'
import nanxunImg from '@/image/南浔古镇.jpg'
import luxunImg from '@/image/鲁迅故里.jpg'

const router = useRouter()

// Attractions data
const attractions = ref([
  {
    id: 1,
    name: '西湖',
    description: '西湖是中国浙江省杭州市区西部的一个淡水湖，国家5A级旅游景区，中国十大风景名胜之一。以秀丽的湖光山色和众多的人文景观闻名中外，被誉为"人间天堂"。',
    image: xihuImg,
    location: '杭州市',
    rating: 4.9,
    category: '自然风光',
    price: '免费',
    openingHours: '全天开放',
    tags: ['湖泊', '自然', '文化']
  },
  {
    id: 2,
    name: '千岛湖',
    description: '千岛湖是1959年建成的新安江水电站拦坝蓄水后形成的人工湖，因湖中有1078个岛屿而得名。是国家AAAAA级旅游景区，以"水清、岛奇、山秀、洞美"闻名于世。',
    image: qiandaohuImg,
    location: '淳安县',
    rating: 4.8,
    category: '自然风光',
    price: '¥150',
    openingHours: '08:00-17:00',
    tags: ['湖泊', '自然', '岛屿']
  },
  {
    id: 3,
    name: '乌镇',
    description: '乌镇是江南六大古镇之一，有着1300年历史的水乡古镇，被誉为"中国最后的枕水人家"。小镇依水而建，以水为脉，水镇一体，是典型的江南水乡古镇。',
    image: wuzhenImg,
    location: '桐乡市',
    rating: 4.7,
    category: '历史古迹',
    price: '¥120-150',
    openingHours: '全天开放',
    tags: ['古镇', '水乡', '文化']
  },
  {
    id: 4,
    name: '雁荡山',
    description: '雁荡山是中国著名的山岳风景区，以怪石、奇峰、古洞、飞瀑见长，素有"海上名山，寰中绝胜"之誉。是国家AAAAA级旅游景区，世界地质公园。',
    image: yandangshanImg,
    location: '温州市',
    rating: 4.6,
    category: '自然风光',
    price: '¥135',
    openingHours: '07:30-16:30',
    tags: ['山岳', '自然', '地质']
  },
  {
    id: 5,
    name: '普陀山',
    description: '普陀山是中国四大佛教名山之一，以观音道场闻名于世。山上有众多寺庙和佛教文化遗址，是重要的佛教朝圣地和旅游胜地。',
    image: putuoshanImg,
    location: '舟山市',
    rating: 4.5,
    category: '文化体验',
    price: '¥160',
    openingHours: '全天开放',
    tags: ['佛教', '文化', '岛屿']
  },
  {
    id: 6,
    name: '横店影视城',
    description: '横店影视城是亚洲最大的影视拍摄基地，被誉为"中国好莱坞"。这里有众多精美的影视场景，是电影爱好者的天堂。',
    image: hengdianImg,
    location: '金华市',
    rating: 4.3,
    category: '文化体验',
    price: '¥210',
    openingHours: '08:00-17:30',
    tags: ['影视', '文化', '娱乐']
  },
  {
    id: 7,
    name: '南浔古镇',
    description: '南浔古镇是江南六大古镇之一，是一座具有悠久历史的水乡古镇，以精美的古建筑和深厚的文化底蕴著称。',
    image: nanxunImg,
    location: '湖州市',
    rating: 4.4,
    category: '历史古迹',
    price: '¥100',
    openingHours: '08:00-17:00',
    tags: ['古镇', '水乡', '文化']
  },
  {
    id: 8,
    name: '绍兴鲁迅故里',
    description: '鲁迅故里是中国现代文学家鲁迅的出生和成长地，包括三味书屋、百草园等著名景点，是了解鲁迅生平和中国近代历史的重要场所。',
    image: luxunImg,
    location: '绍兴市',
    rating: 4.5,
    category: '历史古迹',
    price: '¥80',
    openingHours: '08:00-17:00',
    tags: ['文化', '历史', '名人']
  }
])

// Filter and sort options
const searchQuery = ref('')
const selectedCategory = ref('')
const sortOption = ref('rating')

// Filter by category options
const categories = ref([
  { value: '', label: '全部类别' },
  { value: '自然风光', label: '自然风光' },
  { value: '历史古迹', label: '历史古迹' },
  { value: '文化体验', label: '文化体验' },
  { value: '美食之旅', label: '美食之旅' }
])

// Sort options
const sortOptions = ref([
  { value: 'rating', label: '评分' },
  { value: 'name', label: '名称' },
  { value: 'price', label: '价格' }
])

// Filtered and sorted attractions
const filteredAttractions = computed(() => {
  let result = [...attractions.value]
  
  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(attraction => 
      attraction.name.toLowerCase().includes(query) || 
      attraction.description.toLowerCase().includes(query) ||
      attraction.location.toLowerCase().includes(query) ||
      attraction.tags.some(tag => tag.toLowerCase().includes(query))
    )
  }
  
  // Apply category filter
  if (selectedCategory.value) {
    result = result.filter(attraction => attraction.category === selectedCategory.value)
  }
  
  // Apply sorting
  if (sortOption.value === 'rating') {
    result.sort((a, b) => b.rating - a.rating)
  } else if (sortOption.value === 'name') {
    result.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sortOption.value === 'price') {
    result.sort((a, b) => {
      const priceA = a.price === '免费' ? 0 : parseInt(a.price.replace(/[^\d]/g, ''))
      const priceB = b.price === '免费' ? 0 : parseInt(b.price.replace(/[^\d]/g, ''))
      return priceA - priceB
    })
  }
  
  return result
})

// Navigation
const navigateToDetail = (id: number) => {
  router.push(`/attractions/${id}`)
}
</script>

<template>
  <div class="attractions-view">
    <!-- Hero Section -->
    <section class="attractions-hero">
      <div class="container">
        <h1 class="attractions-title">浙江旅游景点</h1>
        <p class="attractions-subtitle">探索浙江省最美丽的景点和文化遗产</p>
      </div>
    </section>
    
    <!-- Filters Section -->
    <section class="filters-section">
      <div class="container">
        <div class="filters-container">
          <div class="search-container">
            <el-input
              v-model="searchQuery"
              placeholder="搜索景点..."
              clearable
              prefix-icon="Search"
            />
          </div>
          
          <div class="filter-options">
            <el-select v-model="selectedCategory" placeholder="类别">
              <el-option
                v-for="item in categories"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            
            <el-select v-model="sortOption" placeholder="排序">
              <el-option
                v-for="item in sortOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Attractions List -->
    <section class="attractions-list">
      <div class="container">
        <div v-if="filteredAttractions.length === 0" class="no-results">
          <el-empty description="没有找到符合条件的景点" />
        </div>
        
        <div v-else class="attractions-grid">
          <div 
            v-for="attraction in filteredAttractions" 
            :key="attraction.id" 
            class="card attraction-card"
            @click="navigateToDetail(attraction.id)"
          >
            <img :src="attraction.image" :alt="attraction.name" class="card-image" />
            <div class="card-content">
              <div class="flex justify-between items-start">
                <h3 class="card-title">{{ attraction.name }}</h3>
                <div class="attraction-rating">
                  <el-icon><Star /></el-icon>
                  <span>{{ attraction.rating }}</span>
                </div>
              </div>
              
              <div class="attraction-meta">
                <p class="attraction-location">
                  <el-icon><Location /></el-icon>
                  {{ attraction.location }}
                </p>
                <p class="attraction-price">
                  <el-icon><Ticket /></el-icon>
                  {{ attraction.price }}
                </p>
              </div>
              
              <p class="card-description">{{ attraction.description.substring(0, 100) }}...</p>
              
              <div class="attraction-tags">
                <el-tag 
                  v-for="tag in attraction.tags" 
                  :key="tag" 
                  size="small" 
                  class="attraction-tag"
                >
                  {{ tag }}
                </el-tag>
              </div>
              
              <button class="btn btn-primary btn-sm mt-4">
                查看详情
                <el-icon><ArrowRight /></el-icon>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.attractions-hero {
  background-color: var(--color-primary);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.attractions-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.attractions-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto;
}

.filters-section {
  background-color: var(--color-background-soft);
  padding: 1.5rem 0;
  position: sticky;
  top: 70px;
  z-index: 10;
  box-shadow: var(--shadow-small);
}

.filters-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
}

.search-container {
  flex: 1;
  min-width: 250px;
}

.filter-options {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.attractions-list {
  padding: 3rem 0;
}

.no-results {
  padding: 3rem 0;
  text-align: center;
}

.attraction-meta {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.attraction-location,
.attraction-price {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-text-soft);
  font-size: 0.875rem;
}

.attraction-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
}

.attraction-tag {
  background-color: var(--color-background-accent);
  color: var(--color-primary);
  border: none;
}

.dark .attraction-tag {
  background-color: var(--color-background-mute);
  color: var(--color-primary-soft);
}

/* Grid utilities */
.attractions-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
}

@media (min-width: 768px) {
  .attractions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .attractions-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.attraction-card {
  margin-bottom: 1rem;
}

@media (max-width: 768px) {
  .attractions-title {
    font-size: 2rem;
  }
  
  .attractions-subtitle {
    font-size: 1.25rem;
  }
  
  .filters-container {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-options {
    width: 100%;
  }
}
</style>
