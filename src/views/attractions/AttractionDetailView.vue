<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAttractionsStore } from '@/stores/attractions'
import '../../assets/attractionDetail.css'

// 图片导入
const images = {
  xihu: {
    main: new URL('@/image/xihu.jpg', import.meta.url).href,
    gallery: [
      new URL('@/image/xihu02.jpg', import.meta.url).href,
      new URL('@/image/xihu03.jpg', import.meta.url).href,
      new URL('@/image/xihu04.jpg', import.meta.url).href
    ]
  },
  qiandaohu: {
    main: new URL('@/image/千岛湖.jpg', import.meta.url).href,
    gallery: [
      new URL('@/image/千岛湖02.jpg', import.meta.url).href,
      new URL('@/image/千岛湖03.jpg', import.meta.url).href,
      new URL('@/image/千岛湖04.jpg', import.meta.url).href
    ]
  },
  wuzhen: {
    main: new URL('@/image/乌镇.jpg', import.meta.url).href,
    gallery: [
      new URL('@/image/乌镇02.jpg', import.meta.url).href,
      new URL('@/image/乌镇03.jpg', import.meta.url).href,
      new URL('@/image/乌镇04.jpg', import.meta.url).href
    ]
  },
  yandangshan: {
    main: new URL('@/image/雁荡山.jpg', import.meta.url).href,
    gallery: [
      new URL('@/image/雁荡山02.jpg', import.meta.url).href,
      new URL('@/image/雁荡山03.jpg', import.meta.url).href,
      new URL('@/image/雁荡山04.jpg', import.meta.url).href
    ]
  },
  putuoshan: {
    main: new URL('@/image/普陀山.jpg', import.meta.url).href,
    gallery: [
      new URL('@/image/普陀山02.jpg', import.meta.url).href,
      new URL('@/image/普陀山03.jpg', import.meta.url).href,
      new URL('@/image/普陀山04.jpg', import.meta.url).href
    ]
  },
  hengdian: {
    main: new URL('@/image/横店.jpg', import.meta.url).href,
    gallery: [
      new URL('@/image/横店02.jpg', import.meta.url).href,
      new URL('@/image/横店03.jpg', import.meta.url).href,
      new URL('@/image/横店04.jpg', import.meta.url).href
    ]
  },
  nanxun: {
    main: new URL('@/image/南浔古镇.jpg', import.meta.url).href,
    gallery: [
      new URL('@/image/南浔古镇02.jpg', import.meta.url).href,
      new URL('@/image/南浔古镇03.jpg', import.meta.url).href,
      new URL('@/image/南浔古镇04.jpg', import.meta.url).href
    ]
  },
  luxun: {
    main: new URL('@/image/鲁迅故里.jpg', import.meta.url).href,
    gallery: [
      new URL('@/image/鲁迅故里02.jpg', import.meta.url).href,
      new URL('@/image/鲁迅故居03.jpg', import.meta.url).href,
      new URL('@/image/鲁迅故居04.jpg', import.meta.url).href
    ]
  }
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const attractionsStore = useAttractionsStore()

const attractionId = computed(() => Number(route.params.id))
const isLoading = ref(true)
const isFavorite = computed(() => {
  return attractionsStore.isFavorite(attractionId.value)
})

// Attraction data
const attraction = ref({
  id: 0,
  name: '',
  description: '',
  fullDescription: '',
  image: '',
  images: [],
  location: '',
  rating: 0,
  category: '',
  price: '',
  openingHours: '',
  tags: [],
  features: [],
  latitude: 0,
  longitude: 0
})

// Related attractions
const relatedAttractions = ref([])

// Reviews
const reviews = ref([])

// 地图相关
const mapContainer = ref<HTMLElement | null>(null)
const map = ref<any>(null)
const marker = ref<any>(null)
const mapInitRetries = ref(0)
const MAX_RETRIES = 3

// 初始化地图
const initMap = async () => {
  if (!mapContainer.value || !attraction.value.latitude || !attraction.value.longitude) return
  
  await nextTick()
  
  try {
    // 检查 AMap 是否已加载
    if (typeof AMap === 'undefined') {
      throw new Error('高德地图 API 未加载')
    }
    
    // 创建地图实例
    map.value = new AMap.Map(mapContainer.value, {
      zoom: 13,
      center: [attraction.value.longitude, attraction.value.latitude],
      viewMode: '3D',
      resizeEnable: true
    })
    
    // 添加工具条和比例尺
    map.value.plugin(['AMap.ToolBar', 'AMap.Scale'], () => {
      map.value.addControl(new AMap.ToolBar())
      map.value.addControl(new AMap.Scale())
    })
    
    // 创建标记点
    marker.value = new AMap.Marker({
      position: [attraction.value.longitude, attraction.value.latitude],
      title: attraction.value.name,
      animation: 'AMAP_ANIMATION_DROP'
    })
    
    // 将标记点添加到地图
    map.value.add(marker.value)
    
    // 自适应地图大小
    map.value.resize()
    
    // 重置重试次数
    mapInitRetries.value = 0
  } catch (error) {
    console.error('地图初始化失败:', error)
    
    // 重试机制
    if (mapInitRetries.value < MAX_RETRIES) {
      mapInitRetries.value++
      console.log(`尝试重新初始化地图 (${mapInitRetries.value}/${MAX_RETRIES})`)
      setTimeout(initMap, 1000) // 1秒后重试
    }
  }
}

// Load attraction data
onMounted(async () => {
  try {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Mock data based on ID
    const mockAttractions = [
      {
        id: 1,
        name: '西湖',
        description: '西湖是中国浙江省杭州市区西部的一个淡水湖，国家5A级旅游景区，中国十大风景名胜之一。',
        fullDescription: '西湖是中国浙江省杭州市区西部的一个淡水湖，国家5A级旅游景区，中国十大风景名胜之一。以秀丽的湖光山色和众多的人文景观闻名中外，被誉为"人间天堂"。西湖三面环山，面积约6.39平方千米，东西宽约2.8千米，南北长约3.2千米，绕湖一周近15千米。湖中被孤山、白堤、苏堤、杨公堤分隔，形成了外西湖、西里湖、北里湖、小南湖、岳湖等五片水面。',
        image: images.xihu.main,
        images: images.xihu.gallery,
        location: '杭州市西湖区',
        rating: 4.9,
        category: '自然风光',
        price: '免费',
        openingHours: '全天开放',
        tags: ['湖泊', '自然', '文化', '世界遗产'],
        features: ['断桥残雪', '平湖秋月', '三潭印月', '雷峰夕照', '花港观鱼'],
        latitude: 30.2587,
        longitude: 120.1315
      },
      {
        id: 2,
        name: '千岛湖',
        description: '千岛湖是1959年建成的新安江水电站拦坝蓄水后形成的人工湖，因湖中有1078个岛屿而得名。',
        fullDescription: '千岛湖是1959年建成的新安江水电站拦坝蓄水后形成的人工湖，因湖中有1078个岛屿而得名。是国家AAAAA级旅游景区，以"水清、岛奇、山秀、洞美"闻名于世。千岛湖水域面积573平方公里，蓄水量178亿立方米，平均水深34米，最深处有108米，是长江三角洲地区重要的饮用水源地。',
        image: images.qiandaohu.main,
        images: images.qiandaohu.gallery,
        location: '淳安县',
        rating: 4.8,
        category: '自然风光',
        price: '¥150',
        openingHours: '08:00-17:00',
        tags: ['湖泊', '自然', '岛屿'],
        features: ['中心湖区', '东南湖区', '西北湖区', '千岛湖水怪'],
        latitude: 29.5889,
        longitude: 118.9333
      },
      {
        id: 3,
        name: '乌镇',
        description: '乌镇是江南六大古镇之一，有着1300年历史的水乡古镇，被誉为"中国最后的枕水人家"。',
        fullDescription: '乌镇是江南六大古镇之一，有着1300年历史的水乡古镇，被誉为"中国最后的枕水人家"。小镇依水而建，以水为脉，水镇一体，是典型的江南水乡古镇。乌镇分为东栅和西栅两部分，东栅以展示原汁原味的水乡风貌为主，西栅则在保留古镇风貌的基础上进行了旅游开发。',
        image: images.wuzhen.main,
        images: images.wuzhen.gallery,
        location: '桐乡市',
        rating: 4.7,
        category: '历史古迹',
        price: '¥120-150',
        openingHours: '全天开放',
        tags: ['古镇', '水乡', '文化'],
        features: ['西栅', '东栅', '乌镇戏剧节', '木心美术馆'],
        latitude: 30.7444,
        longitude: 120.4917
      },
      {
        id: 4,
        name: '雁荡山',
        description: '雁荡山是中国著名的山岳风景区，以怪石、奇峰、古洞、飞瀑见长，素有"海上名山，寰中绝胜"之誉。是国家AAAAA级旅游景区，世界地质公园。',
        fullDescription: '雁荡山是中国著名的山岳风景区，以怪石、奇峰、古洞、飞瀑见长，素有"海上名山，寰中绝胜"之誉。是国家AAAAA级旅游景区，世界地质公园。雁荡山分为南雁荡山和北雁荡山，瓯江断裂以北称为北雁荡，以南称为南雁荡。主峰为百岗尖，海拔1057米， [24-25]总面积450平方千米。',
        image: images.yandangshan.main,
        images: images.yandangshan.gallery,
        location: '温州市',
        rating: 4.6,
        category: '自然风光',
        price: '¥135',
        openingHours: '07:30-16:30',
        tags: ['山岳', '自然', '地质'],
        features: ['灵峰','三折瀑','灵岩','大龙湫'],
        latitude: 28.37,
        longitude: 121.06 
      },
      {
        id: 5,
        name: '普陀山',
        description: '普陀山是中国四大佛教名山之一，以观音道场闻名于世。山上有众多寺庙和佛教文化遗址，是重要的佛教朝圣地和旅游胜地。',
        fullDescription: '普陀山是中国四大佛教名山之一，以观音道场闻名于世。山上有众多寺庙和佛教文化遗址，是重要的佛教朝圣地和旅游胜地。全山开放有寺院共四十多座，最大的是普济寺、法雨寺、慧济寺和宝陀讲寺。最大的地标是总高33米的南海观音大佛。普陀山四面环海，被誉为"第一人间清静地"。',
        image: images.putuoshan.main,
        images: images.putuoshan.gallery,
        location: '舟山市',
        rating: 4.5,
        category: '文化体验',
        price: '¥160',
        openingHours: '全天开放',
        tags: ['佛教', '文化', '岛屿'],
        features: ['普济禅寺（前寺）','法雨禅寺（后寺）','慧济禅寺（佛顶山寺）'],
        latitude: 30.0108,
        longitude:  122.3864
      },
      {
        id: 6,
        name: '横店影视城',
        description: '横店影视城是亚洲最大的影视拍摄基地，被誉为"中国好莱坞"。这里有众多精美的影视场景，是电影爱好者的天堂。',
        fullDescription: '横店影视城是亚洲最大的影视拍摄基地，被誉为"中国好莱坞"。这里有众多精美的影视场景，是电影爱好者的天堂。日平均接待15个以上剧组，最多同时有50个剧组在影视城内同时拍摄。《英雄》《无极》《美人心计》《古今大战秦俑情》等多部影视剧在影视城内完成拍摄。。',
        image: images.hengdian.main,
        images: images.hengdian.gallery,
        location: '金华市',
        rating: 4.3,
        category: '文化体验',
        price: '¥210',
        openingHours: '08:00-17:30',
        tags: ['影视', '文化', '娱乐'],
        features: ['广州街·香港街','秦王宫','清明上河图','明清宫苑','梦幻谷'],
        latitude: 29.179068,
        longitude: 120.298083
      },
      {
        id: 7,
        name: '南浔古镇',
        description: '南浔古镇是江南六大古镇之一，是一座具有悠久历史的水乡古镇，以精美的古建筑和深厚的文化底蕴著称。',
        fullDescription: '南浔古镇是江南六大古镇之一，是一座具有悠久历史的水乡古镇，以精美的古建筑和深厚的文化底蕴著称。南浔古镇素有"文化之邦"和"诗书之乡"之称，出现过许多著名人物，如民国奇人张静江，"西泠印社"发起人之一张石铭，著名诗人、散文家徐迟等。',
        image: images.nanxun.main,
        images: images.nanxun.gallery,
        location: '湖州市',
        rating: 4.4,
        category: '历史古迹',
        price: '¥100',
        openingHours: '08:00-17:00',
        tags: ['古镇', '水乡', '文化'],
        features: ['张石铭故居','刘氏梯号','小莲庄','张静江故居','百间楼'],
        latitude: 30.8694,
        longitude: 120.41996
      },
      {
        id: 8,
        name: '绍兴鲁迅故里',
        description: '鲁迅故里是中国现代文学家鲁迅的出生和成长地，包括三味书屋、百草园等著名景点，是了解鲁迅生平和中国近代历史的重要场所。',
        fullDescription: '鲁迅故里是中国现代文学家鲁迅的出生和成长地，包括三味书屋、百草园等著名景点，是了解鲁迅生平和中国近代历史的重要场所。绍兴鲁迅故里保护和延续绍兴古城的传统风貌的典型，打造成生态型的"文物森林"，体现了绍兴古城保护的完整性，被誉为中国名人故居保护的范例',
        image: images.luxun.main,
        images: images.luxun.gallery,
        location: '绍兴市',
        rating: 4.5,
        category: '历史古迹',
        price: '¥80',
        openingHours: '08:00-17:00',
        tags: ['文化', '历史', '名人'],
        features: ['绍兴鲁迅故居','百草园','三味书屋','鲁迅祖居','土谷祠','长庆寺'],
        latitude: 29.995,
        longitude: 120.581111
      }
    ]
    
    // Find the attraction by ID
    const foundAttraction = mockAttractions.find(a => a.id === attractionId.value)
    if (foundAttraction) {
      attraction.value = foundAttraction
      // 在数据加载完成后初始化地图
      await initMap()
    } else {
      router.push('/attractions')
    }
    
    // Load related attractions
    relatedAttractions.value = mockAttractions
      .filter(a => a.id !== attractionId.value)
      .slice(0, 3)
    
    // Load reviews
    reviews.value = [
      {
        id: 1,
        user: {
          name: '张三',
          avatar: 'https://placekitten.com/50/50'
        },
        rating: 5,
        comment: '景色非常优美，值得一游！',
        date: '2024-03-15'
      },
      {
        id: 2,
        user: {
          name: '李四',
          avatar: 'https://placekitten.com/51/51'
        },
        rating: 4,
        comment: '交通便利，环境整洁。',
        date: '2024-03-14'
      }
    ]
    
    isLoading.value = false
  } catch (error) {
    console.error('加载景点数据失败:', error)
    isLoading.value = false
  }
})

// 组件卸载时销毁地图实例
onBeforeUnmount(() => {
  if (map.value) {
    map.value.destroy()
  }
})

// Toggle favorite
const toggleFavorite = () => {
  if (!userStore.isLoggedIn) {
    // Redirect to login if not logged in
    router.push({
      path: '/login',
      query: { redirect: route.fullPath }
    })
    return
  }
  
  // 调用attractionsStore的toggleFavorite方法
  attractionsStore.toggleFavorite(attractionId.value)
}

// Go back
const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="attraction-detail-view">
    <!-- Loading state -->
    <div v-if="isLoading" class="loading-container">
      <el-skeleton :rows="10" animated />
    </div>
    
    <template v-else>
      <!-- Hero Section -->
      <section class="attraction-hero">
        <img :src="attraction.image" :alt="attraction.name" class="attraction-hero-image" />
        <div class="attraction-hero-overlay"></div>
        <div class="container">
          <div class="attraction-hero-content">
            <button class="back-button" @click="goBack">
              <el-icon><Back /></el-icon>
              返回
            </button>
            <h1 class="attraction-title">{{ attraction.name }}</h1>
            <div class="attraction-meta">
              <div class="attraction-rating">
                <el-icon><Star /></el-icon>
                <span>{{ attraction.rating }}</span>
              </div>
              <div class="attraction-location">
                <el-icon><Location /></el-icon>
                <span>{{ attraction.location }}</span>
              </div>
              <div class="attraction-category">
                <el-icon><Collection /></el-icon>
                <span>{{ attraction.category }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <!-- Main Content -->
      <section class="attraction-content">
        <div class="container">
          <div class="attraction-layout">
            <!-- Main Info -->
            <div class="attraction-main">
              <div class="attraction-description card">
                <h2>景点介绍</h2>
                <p>{{ attraction.fullDescription }}</p>
                
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
              </div>
              
              <div class="attraction-gallery card">
                <h2>景点图片</h2>
                <div class="gallery-grid">
                  <div 
                    v-for="(image, index) in attraction.images" 
                    :key="index" 
                    class="gallery-item"
                  >
                    <img :src="image" :alt="`${attraction.name} - 图片 ${index + 1}`" />
                  </div>
                </div>
              </div>
              
              <div class="attraction-features card">
                <h2>景点特色</h2>
                <ul class="features-list">
                  <li v-for="(feature, index) in attraction.features" :key="index">
                    <el-icon><Check /></el-icon>
                    <span>{{ feature }}</span>
                  </li>
                </ul>
              </div>
              
              <div class="attraction-reviews card">
                <h2>游客评价</h2>
                <div class="reviews-list">
                  <div 
                    v-for="review in reviews" 
                    :key="review.id" 
                    class="review-item"
                  >
                    <div class="review-header">
                      <div class="review-user">
                        <img :src="review.user.avatar" :alt="review.user.name" class="review-avatar" />
                        <div>
                          <h4 class="review-name">{{ review.user.name }}</h4>
                          <div class="review-date">{{ review.date }}</div>
                        </div>
                      </div>
                      <div class="review-rating">
                        <el-icon v-for="i in 5" :key="i" :class="{ 'text-muted': i > review.rating }">
                          <Star />
                        </el-icon>
                      </div>
                    </div>
                    <div class="review-content">
                      {{ review.comment }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Sidebar -->
            <div class="attraction-sidebar">
              <div class="attraction-info card">
                <h3>景点信息</h3>
                <div class="info-item">
                  <el-icon><Ticket /></el-icon>
                  <div>
                    <div class="info-label">门票</div>
                    <div class="info-value">{{ attraction.price }}</div>
                  </div>
                </div>
                <div class="info-item">
                  <el-icon><Clock /></el-icon>
                  <div>
                    <div class="info-label">开放时间</div>
                    <div class="info-value">{{ attraction.openingHours }}</div>
                  </div>
                </div>
                <div class="info-item">
                  <el-icon><Location /></el-icon>
                  <div>
                    <div class="info-label">地址</div>
                    <div class="info-value">{{ attraction.location }}</div>
                  </div>
                </div>
                
                <div class="action-buttons">
                  <button class="btn btn-primary btn-block">
                    <el-icon><Ticket /></el-icon>
                    预订门票
                  </button>
                  <button class="btn btn-outline btn-block" @click="toggleFavorite">
                    <el-icon v-if="isFavorite"><StarFilled /></el-icon>
                    <el-icon v-else><Star /></el-icon>
                    {{ isFavorite ? '已收藏' : '收藏' }}
                  </button>
                </div>
              </div>
              
              <div class="attraction-map card">
                <h3>位置信息</h3>
                <div ref="mapContainer" class="map-container"></div>
              </div>
              
              <div class="related-attractions card">
                <h3>相关景点</h3>
                <div class="related-list">
                  <div 
                    v-for="related in relatedAttractions" 
                    :key="related.id" 
                    class="related-item"
                    @click="$router.push(`/attractions/${related.id}`)"
                  >
                    <img :src="related.images[0]" :alt="related.name" class="related-image" />
                    <div class="related-info">
                      <h4 class="related-name">{{ related.name }}</h4>
                      <div class="related-rating">
                        <el-icon><Star /></el-icon>
                        <span>{{ related.rating }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>

<style scoped>
.map-container {
  width: 100%;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  margin-top: 1rem;
}

.attraction-map {
  margin: 2rem 0;
  padding: 1rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.attraction-map h3 {
  margin-bottom: 1rem;
  color: #333;
  font-size: 1.2rem;
}
</style>
