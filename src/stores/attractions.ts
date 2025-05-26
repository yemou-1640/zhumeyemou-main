import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

// Define attraction interface
export interface Attraction {
  id: number
  name: string
  description: string
  fullDescription?: string
  image: string
  images?: string[]
  location: string
  rating: number
  category: string
  price: string
  openingHours: string
  tags: string[]
  features?: string[]
  latitude?: number
  longitude?: number
}

// Define attractions state interface
interface AttractionsState {
  attractions: Attraction[]
  favorites: number[]
  loading: boolean
  error: string | null
}

export const useAttractionsStore = defineStore('attractions', {
  state: (): AttractionsState => ({
    attractions: [],
    favorites: useStorage('zhejiang-favorites', [] as number[]),
    loading: false,
    error: null
  }),
  
  getters: {
    getAttractionById: (state) => (id: number) => {
      return state.attractions.find(attraction => attraction.id === id)
    },
    
    getFavorites: (state) => {
      return state.attractions.filter(attraction => 
        state.favorites.includes(attraction.id)
      )
    },
    
    isFavorite: (state) => (id: number) => {
      return state.favorites.includes(id)
    }
  },
  
  actions: {
    async fetchAttractions() {
      this.loading = true
      this.error = null
      
      try {
        // In a real app, this would be an API call
        // For demo purposes, we'll use mock data
        await new Promise(resolve => setTimeout(resolve, 500))
        
        this.attractions = [
          {
            id: 1,
            name: '西湖',
            description: '西湖是中国浙江省杭州市区西部的一个淡水湖，国家5A级旅游景区，中国十大风景名胜之一。',
            fullDescription: '西湖是中国浙江省杭州市区西部的一个淡水湖，国家5A级旅游景区，中国十大风景名胜之一。以秀丽的湖光山色和众多的人文景观闻名中外，被誉为"人间天堂"。西湖三面环山，面积约6.39平方千米，东西宽约2.8千米，南北长约3.2千米，绕湖一周近15千米。湖中被孤山、白堤、苏堤、杨公堤分隔，形成了外西湖、西里湖、北里湖、小南湖、岳湖等五片水面。',
            image: 'https://pic.vcg.com/veer/1212315/8c2e2a5b6c9e4c0b9a7d6f3c1e0a8d7f.jpg',
            images: [
              'https://pic.vcg.com/veer/1212315/8c2e2a5b6c9e4c0b9a7d6f3c1e0a8d7f.jpg',
              'https://pic.vcg.com/veer/1212316/7b3e5a9d2c1e8f4a6b9d7c5e3a1f8d6c.jpg',
              'https://pic.vcg.com/veer/1212317/6a4e8c2b1d9f7a5e3c1d9f7a5e3b1d9f.jpg',
              'https://pic.vcg.com/veer/1212318/5d9f7a3e1c8b6d4a2e9f7c5a3b1d9e7c.jpg'
            ],
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
            image: 'https://pic.vcg.com/veer/2212315/qiandaohu-main.jpg',
            images: [
              'https://pic.vcg.com/veer/2212315/qiandaohu-main.jpg',
              'https://pic.vcg.com/veer/2212316/qiandaohu-sunset.jpg',
              'https://pic.vcg.com/veer/2212317/qiandaohu-island.jpg'
            ],
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
            image: 'https://pic.vcg.com/veer/3212315/wuzhen-night.jpg',
            images: [
              'https://pic.vcg.com/veer/3212315/wuzhen-night.jpg',
              'https://pic.vcg.com/veer/3212316/wuzhen-bridge.jpg',
              'https://pic.vcg.com/veer/3212317/wuzhen-canal.jpg'
            ],
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
            description: '雁荡山是中国著名的山岳风景区，以怪石、奇峰、古洞、飞瀑见长，素有"海上名山，寰中绝胜"之誉。',
            fullDescription: '雁荡山是中国著名的山岳风景区，以怪石、奇峰、古洞、飞瀑见长，素有"海上名山，寰中绝胜"之誉。是国家AAAAA级旅游景区，世界地质公园。雁荡山位于浙江省温州市东北部，主要由大龙湫、灵峰、灵岩、三折瀑、羊角洞、报恩寺等景区组成。',
            image: 'https://pic.vcg.com/veer/4212315/yandangshan-main.jpg',
            images: [
              'https://pic.vcg.com/veer/4212315/yandangshan-main.jpg',
              'https://pic.vcg.com/veer/4212316/yandangshan-peak.jpg',
              'https://pic.vcg.com/veer/4212317/yandangshan-waterfall.jpg'
            ],
            location: '温州市',
            rating: 4.6,
            category: '自然风光',
            price: '¥135',
            openingHours: '07:30-16:30',
            tags: ['山岳', '自然', '地质'],
            features: ['大龙湫', '灵峰', '灵岩', '三折瀑'],
            latitude: 28.3852,
            longitude: 121.0711
          },
          {
            id: 5,
            name: '普陀山',
            description: '普陀山是中国四大佛教名山之一，以观音道场闻名于世。',
            fullDescription: '普陀山是中国四大佛教名山之一，以观音道场闻名于世。山上有众多寺庙和佛教文化遗址，是重要的佛教朝圣地和旅游胜地。普陀山位于浙江省舟山群岛东端，三面环海，风景秀丽，素有"海天佛国"之称。',
            image: 'https://pic.vcg.com/veer/5212315/putuoshan-temple.jpg',
            images: [
              'https://pic.vcg.com/veer/5212315/putuoshan-temple.jpg',
              'https://pic.vcg.com/veer/5212316/putuoshan-statue.jpg',
              'https://pic.vcg.com/veer/5212317/putuoshan-coast.jpg'
            ],
            location: '舟山市',
            rating: 4.5,
            category: '文化体验',
            price: '¥160',
            openingHours: '全天开放',
            tags: ['佛教', '文化', '岛屿'],
            features: ['普济寺', '法雨寺', '紫竹林', '南海观音'],
            latitude: 30.0059,
            longitude: 122.3868
          }
        ]
      } catch (e) {
        console.error('Failed to fetch attractions:', e)
        this.error = '加载景点数据失败'
      } finally {
        this.loading = false
      }
    },
    
    toggleFavorite(id: number) {
      const index = this.favorites.indexOf(id)
      if (index === -1) {
        // Add to favorites
        this.favorites.push(id)
      } else {
        // Remove from favorites
        this.favorites.splice(index, 1)
      }
    },
    
    clearFavorites() {
      this.favorites = []
    }
  }
})
