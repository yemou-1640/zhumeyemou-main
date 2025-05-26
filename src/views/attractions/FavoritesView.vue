<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAttractionsStore } from '@/stores/attractions'
import { ElMessage } from 'element-plus'

// 图片导入
const images = {
  xihu: new URL('@/image/xihu.jpg', import.meta.url).href,
  qiandaohu: new URL('@/image/千岛湖.jpg', import.meta.url).href,
  wuzhen: new URL('@/image/乌镇.jpg', import.meta.url).href,
  yandangshan: new URL('@/image/雁荡山.jpg', import.meta.url).href,
  putuoshan: new URL('@/image/普陀山.jpg', import.meta.url).href,
  hengdian: new URL('@/image/横店.jpg', import.meta.url).href,
  nanxun: new URL('@/image/南浔古镇.jpg', import.meta.url).href,
  luxun: new URL('@/image/鲁迅故里.jpg', import.meta.url).href
}

const router = useRouter()
const userStore = useUserStore()
const attractionsStore = useAttractionsStore()

const isLoading = ref(true)

// Fetch attractions data on component mount
onMounted(async () => {
  try {
    if (attractionsStore.attractions.length === 0) {
      await attractionsStore.fetchAttractions()
    }
  } catch (error) {
    console.error('Error fetching attractions:', error)
    ElMessage.error('加载景点数据失败')
  } finally {
    isLoading.value = false
  }
})

// Get favorite attractions
const favoriteAttractions = computed(() => {
  // 确保用户已登录并且景点数据已加载
  if (!userStore.isLoggedIn || attractionsStore.attractions.length === 0) {
    return []
  }
  
  // 获取收藏的景点并添加图片
  return attractionsStore.getFavorites.map(attraction => {
    // 根据景点名称获取对应的图片
    const imageKey = attraction.name === '西湖' ? 'xihu' :
                    attraction.name === '千岛湖' ? 'qiandaohu' :
                    attraction.name === '乌镇' ? 'wuzhen' :
                    attraction.name === '雁荡山' ? 'yandangshan' :
                    attraction.name === '普陀山' ? 'putuoshan' :
                    attraction.name === '横店影视城' ? 'hengdian' :
                    attraction.name === '南浔古镇' ? 'nanxun' :
                    attraction.name === '绍兴鲁迅故里' ? 'luxun' : null
    
    return {
      ...attraction,
      image: imageKey ? images[imageKey] : attraction.image
    }
  })
})

// Check if there are any favorites
const hasFavorites = computed(() => {
  return favoriteAttractions.value.length > 0
})

// Remove from favorites
const removeFromFavorites = (id: number) => {
  attractionsStore.toggleFavorite(id)
  ElMessage.success('已从收藏夹中移除')
}

// Clear all favorites
const clearAllFavorites = () => {
  attractionsStore.clearFavorites()
  ElMessage.success('已清空收藏夹')
}

// Navigate to attraction detail
const navigateToDetail = (id: number) => {
  router.push(`/attractions/${id}`)
}
</script>

<template>
  <div class="favorites-view">
    <!-- Hero Section -->
    <section class="favorites-hero">
      <div class="container">
        <h1 class="favorites-title">我的收藏</h1>
        <p class="favorites-subtitle">您收藏的浙江旅游景点</p>
      </div>
    </section>
    
    <!-- Favorites List -->
    <section class="favorites-content">
      <div class="container">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <el-skeleton :rows="5" animated />
        </div>
        
        <!-- Empty State -->
        <div v-else-if="!hasFavorites" class="empty-favorites">
          <el-empty description="您的收藏夹是空的">
            <el-button type="primary" @click="router.push('/attractions')">
              浏览景点
            </el-button>
          </el-empty>
        </div>
        
        <!-- Favorites List -->
        <template v-else>
          <div class="favorites-header">
            <h2 class="section-title">收藏的景点 ({{ favoriteAttractions.length }})</h2>
            <el-button type="danger" plain @click="clearAllFavorites">
              <el-icon><Delete /></el-icon>
              清空收藏夹
            </el-button>
          </div>
          
          <div class="favorites-list">
            <div 
              v-for="attraction in favoriteAttractions" 
              :key="attraction.id" 
              class="favorite-item"
            >
              <div class="favorite-image" @click="navigateToDetail(attraction.id)">
                <img :src="attraction.image" :alt="attraction.name" />
              </div>
              
              <div class="favorite-content">
                <div class="favorite-header">
                  <h3 class="favorite-title" @click="navigateToDetail(attraction.id)">
                    {{ attraction.name }}
                  </h3>
                  <div class="favorite-rating">
                    <el-icon><Star /></el-icon>
                    <span>{{ attraction.rating }}</span>
                  </div>
                </div>
                
                <div class="favorite-meta">
                  <div class="favorite-location">
                    <el-icon><Location /></el-icon>
                    <span>{{ attraction.location }}</span>
                  </div>
                  <div class="favorite-category">
                    <el-icon><Collection /></el-icon>
                    <span>{{ attraction.category }}</span>
                  </div>
                  <div class="favorite-price">
                    <el-icon><Ticket /></el-icon>
                    <span>{{ attraction.price }}</span>
                  </div>
                </div>
                
                <p class="favorite-description">
                  {{ attraction.description }}
                </p>
                
                <div class="favorite-tags">
                  <el-tag 
                    v-for="tag in attraction.tags" 
                    :key="tag" 
                    size="small" 
                    class="favorite-tag"
                  >
                    {{ tag }}
                  </el-tag>
                </div>
                
                <div class="favorite-actions">
                  <el-button type="primary" @click="navigateToDetail(attraction.id)">
                    查看详情
                  </el-button>
                  <el-button @click="removeFromFavorites(attraction.id)">
                    <el-icon><Delete /></el-icon>
                    取消收藏
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
.favorites-hero {
  background-color: var(--color-primary);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.favorites-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.favorites-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto;
}

.favorites-content {
  padding: 3rem 0;
}

.loading-container,
.empty-favorites {
  padding: 3rem 0;
  max-width: 800px;
  margin: 0 auto;
}

.favorites-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.favorite-item {
  display: flex;
  gap: 2rem;
  background-color: var(--color-background);
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-small);
  transition: transform 0.3s, box-shadow 0.3s;
}

.favorite-item:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.favorite-image {
  flex: 0 0 300px;
  cursor: pointer;
}

.favorite-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-content {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
}

.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.favorite-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  color: var(--color-heading);
  cursor: pointer;
}

.favorite-title:hover {
  color: var(--color-primary);
}

.favorite-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #FFB400;
  font-weight: 600;
}

.favorite-meta {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
}

.favorite-location,
.favorite-category,
.favorite-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-soft);
  font-size: 0.875rem;
}

.favorite-description {
  margin-bottom: 1.5rem;
  color: var(--color-text);
  flex: 1;
}

.favorite-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.favorite-tag {
  background-color: var(--color-background-accent);
  color: var(--color-primary);
  border: none;
}

.dark .favorite-tag {
  background-color: var(--color-background-mute);
  color: var(--color-primary-soft);
}

.favorite-actions {
  display: flex;
  gap: 1rem;
  margin-top: auto;
}

@media (max-width: 768px) {
  .favorites-title {
    font-size: 2rem;
  }
  
  .favorites-subtitle {
    font-size: 1.25rem;
  }
  
  .favorite-item {
    flex-direction: column;
  }
  
  .favorite-image {
    flex: 0 0 200px;
  }
  
  .favorite-meta {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .favorite-actions {
    flex-direction: column;
  }
}
</style>
