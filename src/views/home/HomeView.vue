<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

// 导入图片
import xihuImg from '@/image/xihu.jpg'
import qiandaohuImg from '@/image/千岛湖.jpg'
import wuzhenImg from '@/image/乌镇.jpg'
import yandangshanImg from '@/image/雁荡山.jpg'

const router = useRouter()

// Carousel data
const currentSlide = ref(0)
const slides = ref([
  {
    id: 1,
    title: '西湖',
    subtitle: '杭州的明珠，中国十大风景名胜之一',
    image: xihuImg,
    link: '/attractions/1',
  },
  {
    id: 2,
    title: '千岛湖',
    subtitle: '中国最大的人工湖，拥有1078个岛屿',
    image: qiandaohuImg,
    link: '/attractions/2',
  },
  {
    id: 3,
    title: '乌镇',
    subtitle: '江南六大古镇之一，千年历史的水乡古镇',
    image: wuzhenImg,
    link: '/attractions/3',
  },
])

// Featured attractions
const featuredAttractions = ref([
  {
    id: 1,
    name: '西湖',
    description:
      '西湖是中国浙江省杭州市区西部的一个淡水湖，国家5A级旅游景区，中国十大风景名胜之一。',
    image: xihuImg,
    location: '杭州市',
    rating: 4.9,
  },
  {
    id: 2,
    name: '千岛湖',
    description:
      '千岛湖是1959年建成的新安江水电站拦坝蓄水后形成的人工湖，因湖中有1078个岛屿而得名。',
    image: qiandaohuImg,
    location: '淳安县',
    rating: 4.8,
  },
  {
    id: 3,
    name: '乌镇',
    description: '乌镇是江南六大古镇之一，有着1300年历史的水乡古镇，被誉为"中国最后的枕水人家"。',
    image: wuzhenImg,
    location: '桐乡市',
    rating: 4.7,
  },
  {
    id: 4,
    name: '雁荡山',
    description:
      '雁荡山是中国著名的山岳风景区，以怪石、奇峰、古洞、飞瀑见长，素有"海上名山，寰中绝胜"之誉。',
    image: yandangshanImg,
    location: '温州市',
    rating: 4.6,
  },
])

// Categories
const categories = ref([
  {
    id: 1,
    name: '自然风光',
    icon: 'Sunny',
    color: '#4CAF50',
  },
  {
    id: 2,
    name: '历史古迹',
    icon: 'House',
    color: '#FF9800',
  },
  {
    id: 3,
    name: '文化体验',
    icon: 'Tickets',
    color: '#9C27B0',
  },
  {
    id: 4,
    name: '美食之旅',
    icon: 'Food',
    color: '#F44336',
  },
])

// Testimonials
const testimonials = ref([
  {
    id: 1,
    name: '张先生',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    content: '西湖的美景让我流连忘返，尤其是断桥残雪的景色，真是美不胜收！',
    rating: 5,
  },
  {
    id: 2,
    name: '李女士',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    content: '千岛湖的水质非常好，空气清新，是放松身心的好地方。',
    rating: 5,
  },
  {
    id: 3,
    name: '王先生',
    avatar: 'https://randomuser.me/api/portraits/men/62.jpg',
    content: '乌镇的夜景非常美丽，古色古香的建筑配上灯光，仿佛穿越回古代。',
    rating: 4,
  },
])

// Carousel functions
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % slides.value.length
}

const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + slides.value.length) % slides.value.length
}

const goToSlide = (index: number) => {
  currentSlide.value = index
}

// Auto slide
let autoSlideInterval: number | null = null

const startAutoSlide = () => {
  autoSlideInterval = window.setInterval(() => {
    nextSlide()
  }, 5000)
}

const stopAutoSlide = () => {
  if (autoSlideInterval) {
    clearInterval(autoSlideInterval)
    autoSlideInterval = null
  }
}

onMounted(() => {
  startAutoSlide()
})

// Navigation
const navigateToAttraction = (id: number) => {
  router.push(`/attractions/${id}`)
}
</script>

<template>
  <div class="home-view">
    <!-- Hero Carousel -->
    <section class="carousel hero" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
      <div class="carousel-inner" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
        <div v-for="slide in slides" :key="slide.id" class="carousel-item">
          <img :src="slide.image" :alt="slide.title" class="hero-image" />
          <div class="hero-overlay"></div>
          <div class="hero-content">
            <h1 class="hero-title text-white">{{ slide.title }}</h1>
            <p class="hero-subtitle text-white">{{ slide.subtitle }}</p>
            <router-link :to="slide.link" class="btn btn-primary">
              <el-icon><ArrowRight /></el-icon>
              探索景点
            </router-link>
          </div>
        </div>
      </div>

      <!-- Carousel Controls -->
      <button class="carousel-arrow carousel-arrow-left" @click="prevSlide">
        <el-icon><ArrowLeft /></el-icon>
      </button>
      <button class="carousel-arrow carousel-arrow-right" @click="nextSlide">
        <el-icon><ArrowRight /></el-icon>
      </button>

      <div class="carousel-controls">
        <button
          v-for="(slide, index) in slides"
          :key="slide.id"
          class="carousel-dot"
          :class="{ active: index === currentSlide }"
          @click="goToSlide(index)"
        ></button>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="py-8">
      <div class="container">
        <h2 class="section-title text-center mb-8">探索浙江</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-card"
            :style="{ '--category-color': category.color }"
          >
            <div class="category-icon">
              <el-icon :size="32"><component :is="category.icon" /></el-icon>
            </div>
            <h3 class="category-name">{{ category.name }}</h3>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Attractions -->
    <section class="py-8 bg-accent">
      <div class="container">
        <div class="section-header flex justify-between items-center mb-8">
          <h2 class="section-title">热门景点</h2>
          <router-link to="/attractions" class="btn btn-outline">
            查看全部
            <el-icon><ArrowRight /></el-icon>
          </router-link>
        </div>

        <div class="featured-attractions-grid">
          <div
            v-for="attraction in featuredAttractions"
            :key="attraction.id"
            class="card attraction-card"
            @click="navigateToAttraction(attraction.id)"
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
              <p class="attraction-location">
                <el-icon><Location /></el-icon>
                {{ attraction.location }}
              </p>
              <p class="card-description">{{ attraction.description }}</p>
              <router-link
                :to="`/attractions/${attraction.id}`"
                class="btn btn-primary btn-sm mt-4"
              >
                了解更多
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials -->
    <section class="py-8">
      <div class="container">
        <h2 class="section-title text-center mb-8">游客评价</h2>
        <div class="testimonials-grid">
          <div v-for="testimonial in testimonials" :key="testimonial.id" class="testimonial-card">
            <div class="testimonial-content">
              <p>"{{ testimonial.content }}"</p>
            </div>
            <div class="testimonial-footer">
              <img :src="testimonial.avatar" :alt="testimonial.name" class="testimonial-avatar" />
              <div>
                <h4 class="testimonial-name">{{ testimonial.name }}</h4>
                <div class="testimonial-rating">
                  <el-icon
                    v-for="i in 5"
                    :key="i"
                    :class="{ 'text-muted': i > testimonial.rating }"
                  >
                    <Star />
                  </el-icon>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <div class="cta-content">
          <h2 class="cta-title">准备好开始您的浙江之旅了吗？</h2>
          <p class="cta-subtitle">注册账号，收藏您喜爱的景点，获取最新的旅游信息。</p>
          <div class="cta-buttons">
            <router-link to="/register" class="btn btn-primary"> 立即注册 </router-link>
            <router-link to="/attractions" class="btn btn-outline"> 浏览景点 </router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.text-white {
  color: white;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.bg-accent {
  background-color: var(--color-background-accent);
}

/* Carousel arrows */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s;
  border: none;
}

.carousel-arrow:hover {
  background-color: rgba(255, 255, 255, 0.4);
}

.carousel-arrow-left {
  left: 20px;
}

.carousel-arrow-right {
  right: 20px;
}

/* Category cards */
.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background-color: var(--color-background);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-small);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  --category-color: var(--color-primary);
}

.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background-color: var(--category-color);
}

.category-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.category-icon {
  margin-bottom: 1rem;
  color: var(--category-color);
}

.category-name {
  font-weight: 600;
  text-align: center;
}

/* Grid utilities */
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.featured-attractions-grid,
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .md\:grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .featured-attractions-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  .lg\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .featured-attractions-grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }

  .testimonials-grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

/* Attraction cards */
.attraction-card {
  cursor: pointer;
}

.attraction-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #ffb400;
  font-weight: 600;
}

.attraction-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--color-text-soft);
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Testimonial cards */
.testimonial-card {
  background-color: var(--color-background);
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-small);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
}

.testimonial-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.testimonial-content {
  margin-bottom: 1.5rem;
  font-style: italic;
  color: var(--color-text);
}

.testimonial-footer {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.testimonial-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.testimonial-name {
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.testimonial-rating {
  display: flex;
  gap: 0.25rem;
  color: #ffb400;
}

.text-muted {
  color: var(--color-text-mute);
}

/* CTA Section */
.cta-section {
  background-color: var(--color-primary);
  color: white;
  padding: 4rem 0;
  margin-top: 2rem;
}

.cta-content {
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-subtitle {
  font-size: 1.25rem;
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* .cta-section .btn-primary {
  border-color: white;
  color: white;
} */
.cta-section .btn-primary:hover {
  background-color: white;
  color: var(--color-primary);
}
.cta-section .btn-outline {
  border-color: white;
  color: white;
}
.cta-section .btn-outline:hover {
  background-color: white;
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.25rem;
  }

  .cta-title {
    font-size: 1.75rem;
  }

  .cta-subtitle {
    font-size: 1rem;
  }
}
.carousel {
  position: relative;
  width: 100%;
  height: 500px; /* 使用更适中的高度 */
  overflow: hidden;
}

.carousel-inner {
  display: flex;
  width: 100%;
  height: 100%;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  flex: 0 0 100%;
  width: 100%;
  height: 100%;
  position: relative;
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 确保图片覆盖整个容器而不变形 */
  object-position: center;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
}

.hero-content {
  position: absolute;
  bottom: 20%;
  left: 0;
  width: 100%;
  text-align: center;
  padding: 0 2rem;
  z-index: 2;
}

.carousel-controls {
  position: absolute;
  bottom: 2rem;
  left: 0;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  z-index: 10;
}

.carousel-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.carousel-dot.active {
  background-color: white;
}

.carousel-dot:hover {
  background-color: rgba(255, 255, 255, 0.8);
}
</style>
