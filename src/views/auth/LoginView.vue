<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const isLoading = ref(false)
const rememberMe = ref(false)

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' }
  ]
}

const formRef = ref()

const handleLogin = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        isLoading.value = true
        const success = await userStore.login(loginForm.username, loginForm.password)
        
        if (success) {
          ElMessage.success('登录成功')
          
          // Redirect to the page the user was trying to access, or to home
          const redirectPath = route.query.redirect as string || '/'
          router.push(redirectPath)
        } else {
          ElMessage.error('登录失败，请检查用户名和密码')
        }
      } catch (error) {
        console.error('Login error:', error)
        ElMessage.error('登录过程中发生错误')
      } finally {
        isLoading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="auth-view login-view">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">登录</h1>
          <p class="auth-subtitle">登录您的浙江旅游账号</p>
        </div>
        
        <el-form
          ref="formRef"
          :model="loginForm"
          :rules="rules"
          label-position="top"
          @keyup.enter="handleLogin"
        >
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="请输入用户名"
              prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <div class="form-options">
            <el-checkbox v-model="rememberMe">记住我</el-checkbox>
            <el-link type="primary" href="#">忘记密码?</el-link>
          </div>
          
          <el-button 
            type="primary" 
            class="login-button" 
            :loading="isLoading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form>
        
        <div class="auth-footer">
          <p>还没有账号? <router-link to="/register">立即注册</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  background-color: var(--color-background-soft);
}

.auth-container {
  width: 100%;
  max-width: 480px;
}

.auth-card {
  background-color: var(--color-background);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-medium);
  padding: 2.5rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.auth-subtitle {
  color: var(--color-text-soft);
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
}

.auth-footer {
  text-align: center;
  margin-top: 2rem;
  color: var(--color-text-soft);
}

.auth-footer a {
  color: var(--color-primary);
  font-weight: 500;
}
</style>
