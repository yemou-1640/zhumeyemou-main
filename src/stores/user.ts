import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { SHA256 } from 'crypto-js'

interface User {
  id: string
  username: string
  email: string
  avatar?: string
  passwordHash: string
  salt: string
  bio?: string
  location?: string
  phone?: string
  createdAt: number
  lastLoginAt?: number
  loginAttempts: number
  lockedUntil?: number
  updatedAt?: string
}

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  userStorage: any
}

// 用户数据库，使用localStorage存储用户信息
const userDatabase = useStorage('zhejiang-user-database', {} as Record<string, User>)

// 生成随机盐值
const generateSalt = () => {
  return Math.random().toString(36).substring(2, 15)
}

// 使用盐值对密码进行哈希
const hashPassword = (password: string, salt: string) => {
  return SHA256(password + salt).toString()
}

// 生成安全的token
const generateToken = () => {
  return 'auth-token-' + SHA256(Date.now().toString() + Math.random().toString()).toString()
}

// 生成用户ID
const generateUserId = (username: string) => {
  return `user_${username.toLowerCase().replace(/[^a-z0-9]/g, '_')}`
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: useStorage('zhejiang-user', null).value,
    token: useStorage('zhejiang-token', null).value,
    isAuthenticated: useStorage('zhejiang-authenticated', false).value,
    userStorage: useStorage('zhejiang-user', null)
  }),
  getters: {
    getUser: (state) => state.user,
    isLoggedIn: (state) => state.isAuthenticated && state.user !== null,
    // 获取所有用户（仅用于管理目的）
    getAllUsers: () => Object.values(userDatabase.value)
  },
  actions: {
    /**
     * 用户登录
     */
    async login(username: string, password: string) {
      try {
        // 生成用户ID
        const userId = generateUserId(username)
        
        // 检查用户是否存在
        const user = userDatabase.value[userId]
        
        if (!user) {
          return { success: false, message: '用户不存在，请先注册' }
        }
        
        // 检查账户是否被锁定
        if (user.lockedUntil && user.lockedUntil > Date.now()) {
          const minutesLeft = Math.ceil((user.lockedUntil - Date.now()) / 60000)
          return { 
            success: false, 
            message: `账户已被锁定，请${minutesLeft}分钟后再试` 
          }
        }
        
        // 验证密码
        const hashedPassword = hashPassword(password, user.salt)
        if (hashedPassword !== user.passwordHash) {
          // 增加登录失败次数
          user.loginAttempts = (user.loginAttempts || 0) + 1
          
          // 如果失败次数达到5次，锁定账户30分钟
          if (user.loginAttempts >= 5) {
            user.lockedUntil = Date.now() + 30 * 60 * 1000 // 30分钟
            userDatabase.value[userId] = user
            return { 
              success: false, 
              message: '登录失败次数过多，账户已被锁定30分钟' 
            }
          }
          
          userDatabase.value[userId] = user
          return { 
            success: false, 
            message: `密码错误，还剩${5 - user.loginAttempts}次尝试机会` 
          }
        }
        
        // 登录成功，重置登录失败次数
        user.loginAttempts = 0
        user.lockedUntil = undefined
        user.lastLoginAt = Date.now()
        userDatabase.value[userId] = user
        
        // 设置当前用户
        this.user = { ...user }
        this.token = generateToken()
        this.isAuthenticated = true
        
        // 保存状态到localStorage
        localStorage.setItem('zhejiang-user', JSON.stringify(this.user))
        localStorage.setItem('zhejiang-token', this.token)
        localStorage.setItem('zhejiang-authenticated', 'true')
        
        return { success: true, message: '登录成功' }
      } catch (e) {
        console.error('Login failed:', e)
        return { success: false, message: '登录失败，请稍后再试' }
      }
    },
    
    /**
     * 用户注册
     */
    async register(username: string, email: string, password: string) {
      try {
        // 输入验证
        if (!username || !email || !password) {
          return { success: false, message: '请填写所有必填字段' }
        }
        
        if (password.length < 6) {
          return { success: false, message: '密码长度至少为6位' }
        }
        
        // 生成用户ID
        const userId = generateUserId(username)
        
        // 检查用户是否已存在
        if (userDatabase.value[userId]) {
          return { success: false, message: '用户名已存在' }
        }
        
        // 检查邮箱是否已被使用
        const emailExists = Object.values(userDatabase.value).some(user => 
          user.email.toLowerCase() === email.toLowerCase()
        )
        
        if (emailExists) {
          return { success: false, message: '邮箱已被使用' }
        }
        
        // 生成盐值和密码哈希
        const salt = generateSalt()
        const passwordHash = hashPassword(password, salt)
        
        // 创建新用户
        const user: User = {
          id: userId,
          username,
          email,
          avatar: 'https://placekitten.com/100/100',
          passwordHash,
          salt,
          bio: '这是一个示例用户简介',
          location: '浙江省杭州市',
          phone: '',
          createdAt: Date.now(),
          loginAttempts: 0
        }
        
        // 将新用户添加到数据库
        userDatabase.value[userId] = user
        
        // 自动登录新注册用户
        this.user = { ...user }
        this.token = generateToken()
        this.isAuthenticated = true
        
        // 保存状态到localStorage
        localStorage.setItem('zhejiang-user', JSON.stringify(this.user))
        localStorage.setItem('zhejiang-token', this.token)
        localStorage.setItem('zhejiang-authenticated', 'true')
        
        return { success: true, message: '注册成功' }
      } catch (e) {
        console.error('Registration failed:', e)
        return { success: false, message: '注册失败，请稍后再试' }
      }
    },
    
    /**
     * 用户登出
     */
    logout() {
      // 在退出登录前保存用户数据
      if (this.user && this.user.id) {
        userDatabase.value[this.user.id] = { ...this.user }
      }
      
      // 清除当前用户状态
      this.user = null
      this.token = null
      this.isAuthenticated = false
      
      // 清除localStorage
      localStorage.removeItem('zhejiang-user')
      localStorage.removeItem('zhejiang-token')
      localStorage.removeItem('zhejiang-authenticated')
      
      return { success: true, message: '已成功登出' }
    },
    
    /**
     * 更新用户信息
     */
    async updateProfile(profileData: Partial<User>) {
      try {
        if (!this.user) {
          throw new Error('用户未登录')
        }

        // 不允许更新敏感字段
        const { id, createdAt, passwordHash, salt, loginAttempts, lockedUntil, ...allowedUpdates } = profileData as any

        // 更新用户信息
        const updatedUser = {
          ...this.user,
          ...allowedUpdates,
          updatedAt: new Date().toISOString()
        }

        // 更新本地存储
        this.user = updatedUser
        this.userStorage.value = updatedUser

        // 更新数据库
        if (this.user?.id) {
          userDatabase.value[this.user.id] = updatedUser
        }

        // 更新localStorage
        localStorage.setItem('zhejiang-user', JSON.stringify(updatedUser))

        return updatedUser
      } catch (error) {
        console.error('更新个人资料失败:', error)
        throw error
      }
    },
    
    /**
     * 修改密码
     */
    changePassword(currentPassword: string, newPassword: string) {
      if (!this.user) {
        return { success: false, message: '未登录' }
      }
      
      try {
        // 验证当前密码
        const currentHash = hashPassword(currentPassword, this.user.salt)
        if (currentHash !== this.user.passwordHash) {
          return { success: false, message: '当前密码错误' }
        }
        
        // 验证新密码
        if (newPassword.length < 6) {
          return { success: false, message: '新密码长度至少为6位' }
        }
        
        // 生成新的盐值和密码哈希
        const newSalt = generateSalt()
        const newPasswordHash = hashPassword(newPassword, newSalt)
        
        // 更新密码
        const updatedUser = {
          ...this.user,
          passwordHash: newPasswordHash,
          salt: newSalt
        }
        
        this.user = updatedUser
        
        // 更新数据库
        if (this.user.id) {
          userDatabase.value[this.user.id] = updatedUser
          // 更新localStorage
          localStorage.setItem('zhejiang-user', JSON.stringify(updatedUser))
        }
        
        return { success: true, message: '密码已成功修改' }
      } catch (e) {
        console.error('Failed to change password:', e)
        return { success: false, message: '密码修改失败，请稍后再试' }
      }
    },
    
    /**
     * 删除账户
     */
    deleteAccount(password: string) {
      if (!this.user) {
        return { success: false, message: '未登录' }
      }
      
      try {
        // 验证密码
        const passwordHash = hashPassword(password, this.user.salt)
        if (passwordHash !== this.user.passwordHash) {
          return { success: false, message: '密码错误' }
        }
        
        // 从数据库中删除用户
        if (this.user.id && userDatabase.value[this.user.id]) {
          delete userDatabase.value[this.user.id]
        }
        
        // 登出用户
        this.user = null
        this.token = null
        this.isAuthenticated = false
        
        // 清除localStorage
        localStorage.removeItem('zhejiang-user')
        localStorage.removeItem('zhejiang-token')
        localStorage.removeItem('zhejiang-authenticated')
        
        return { success: true, message: '账户已成功删除' }
      } catch (e) {
        console.error('Failed to delete account:', e)
        return { success: false, message: '账户删除失败，请稍后再试' }
      }
    }
  }
})
