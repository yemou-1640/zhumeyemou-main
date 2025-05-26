<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()

const mobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

const toggleTheme = () => {
  themeStore.toggleTheme()
}

const logout = () => {
  userStore.logout()
  router.push('/login')
  mobileMenuOpen.value = false
}
</script>

<template>
  <header class="site-header">
    <div class="container">
      <div class="flex justify-between items-center">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <el-icon><Location /></el-icon>
          <span>浙江旅游</span>
        </router-link>

        <!-- Desktop Navigation -->
        <nav class="nav-links" :class="{ 'open': mobileMenuOpen }">
          <router-link to="/" class="nav-link" @click="mobileMenuOpen = false">
            首页
          </router-link>
          <router-link to="/attractions" class="nav-link" @click="mobileMenuOpen = false">
            景点
          </router-link>
          <router-link to="/about" class="nav-link" @click="mobileMenuOpen = false">
            关于
          </router-link>
          
          <template v-if="userStore.isLoggedIn">
            <el-dropdown trigger="click">
              <div class="user-avatar flex items-center gap-2 cursor-pointer">
                <img 
                  :src="userStore.user?.avatar || 'https://placekitten.com/100/100'" 
                  alt="User avatar" 
                  class="w-8 h-8 rounded-full"
                />
                <span>{{ userStore.user?.username }}</span>
                <el-icon><ArrowDown /></el-icon>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="router.push('/profile')">
                    <el-icon><User /></el-icon> 个人中心
                  </el-dropdown-item>
                  <el-dropdown-item @click="router.push('/favorites')">
                    <el-icon><Star /></el-icon> 我的收藏
                  </el-dropdown-item>
                  <el-dropdown-item divided @click="logout">
                    <el-icon><SwitchButton /></el-icon> 退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link" @click="mobileMenuOpen = false">
              登录
            </router-link>
            <router-link to="/register" class="btn btn-primary" @click="mobileMenuOpen = false">
              注册
            </router-link>
          </template>
          
          <!-- Theme Toggle -->
          <button class="theme-toggle" @click="toggleTheme">
            <el-icon v-if="themeStore.isDark"><Sunny /></el-icon>
            <el-icon v-else><Moon /></el-icon>
          </button>
        </nav>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-button" @click="toggleMobileMenu">
          <el-icon v-if="mobileMenuOpen"><Close /></el-icon>
          <el-icon v-else><Menu /></el-icon>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.user-avatar {
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  transition: background-color 0.3s;
}

.user-avatar:hover {
  background-color: var(--color-background-mute);
}

.user-avatar img {
  width: 2rem;
  height: 2rem;
  border-radius: 9999px;
  object-fit: cover;
}

.w-8 {
  width: 2rem;
}

.h-8 {
  height: 2rem;
}

.rounded-full {
  border-radius: 9999px;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
