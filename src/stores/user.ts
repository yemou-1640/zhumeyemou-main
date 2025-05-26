import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

interface User {
  id: string
  username: string
  email: string
  avatar?: string
  password?: string
  bio?: string
  location?: string
  phone?: string
}

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
}

// 用户数据库，用于存储用户信息
const userDatabase = useStorage('zhejiang-user-database', {} as Record<string, User>)

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: useStorage('zhejiang-user', null),
    token: useStorage('zhejiang-token', null),
    isAuthenticated: useStorage('zhejiang-authenticated', false)
  }),
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated
  },
  actions: {
    async login(username: string, password: string) {
      try {
        // 生成用户ID（在实际应用中，这将由后端提供）
        const userId = `user_${username.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
        
        // 检查用户是否已存在于数据库中
        let user: User
        
        if (userDatabase.value[userId]) {
          // 如果用户存在，使用存储的数据
          user = userDatabase.value[userId]
          // 更新密码（如果提供了新密码）
          user.password = password
        } else {
          // 如果是新用户，创建新的用户数据
          user = {
            id: userId,
            username,
            email: username.includes('@') ? username : `${username}@example.com`,
            avatar: 'https://placekitten.com/100/100',
            password,
            bio: '这是一个示例用户简介',
            location: '浙江省杭州市',
            phone: ''
          }
          
          // 将新用户添加到数据库
          userDatabase.value[userId] = user
        }
        
        // 设置当前用户
        this.user = { ...user }
        this.token = 'demo-token-' + Math.random().toString(36).substring(2)
        this.isAuthenticated = true
        return true
      } catch (e) {
        console.error('Login failed:', e)
        return false
      }
    },
    
    async register(username: string, email: string, password: string) {
      try {
        // 生成用户ID
        const userId = `user_${username.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
        
        // 检查用户是否已存在
        if (userDatabase.value[userId]) {
          console.error('User already exists')
          return false
        }
        
        // 创建新用户
        const user = {
          id: userId,
          username,
          email,
          avatar: 'https://placekitten.com/100/100',
          password,
          bio: '这是一个示例用户简介',
          location: '浙江省杭州市',
          phone: ''
        }
        
        // 将新用户添加到数据库
        userDatabase.value[userId] = user
        
        // 设置当前用户
        this.user = { ...user }
        this.token = 'demo-token-' + Math.random().toString(36).substring(2)
        this.isAuthenticated = true
        return true
      } catch (e) {
        console.error('Registration failed:', e)
        return false
      }
    },
    
    logout() {
      // 在退出登录前保存用户数据
      if (this.user && this.user.id) {
        userDatabase.value[this.user.id] = { ...this.user }
      }
      
      // 清除当前用户状态
      this.user = null
      this.token = null
      this.isAuthenticated = false
    },
    
    // 更新用户信息
    updateUserInfo(userData: Partial<User>) {
      if (!this.user) return
      
      // 更新当前用户信息
      this.user = { ...this.user, ...userData }
      
      // 同时更新数据库中的用户信息
      if (this.user.id) {
        userDatabase.value[this.user.id] = { ...this.user }
      }
    }
  }
})
