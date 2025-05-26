<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const isLoading = ref(false)
const agreeTerms = ref(false)

const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度应为6-20个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: Function) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const formRef = ref()

const handleRegister = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      if (!agreeTerms.value) {
        ElMessage.warning('请同意用户协议和隐私政策')
        return
      }
      
      try {
        isLoading.value = true
        const success = await userStore.register(
          registerForm.username,
          registerForm.email,
          registerForm.password
        )
        
        if (success) {
          ElMessage.success('注册成功')
          router.push('/')
        } else {
          ElMessage.error('注册失败，请稍后再试')
        }
      } catch (error) {
        console.error('Registration error:', error)
        ElMessage.error('注册过程中发生错误')
      } finally {
        isLoading.value = false
      }
    }
  })
}
</script>

<template>
  <div class="auth-view register-view">
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <h1 class="auth-title">注册</h1>
          <p class="auth-subtitle">创建您的浙江旅游账号</p>
        </div>
        
        <el-form
          ref="formRef"
          :model="registerForm"
          :rules="rules"
          label-position="top"
        >
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model="registerForm.username" 
              placeholder="请输入用户名"
              prefix-icon="User"
            />
          </el-form-item>
          
          <el-form-item label="邮箱" prop="email">
            <el-input 
              v-model="registerForm.email" 
              placeholder="请输入邮箱"
              prefix-icon="Message"
            />
          </el-form-item>
          
          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="registerForm.password" 
              type="password" 
              placeholder="请输入密码"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <el-form-item label="确认密码" prop="confirmPassword">
            <el-input 
              v-model="registerForm.confirmPassword" 
              type="password" 
              placeholder="请再次输入密码"
              prefix-icon="Lock"
              show-password
            />
          </el-form-item>
          
          <div class="terms-agreement">
            <el-checkbox v-model="agreeTerms">
              我已阅读并同意
              <el-link type="primary" href="#">用户协议</el-link>
              和
              <el-link type="primary" href="#">隐私政策</el-link>
            </el-checkbox>
          </div>
          
          <el-button 
            type="primary" 
            class="register-button" 
            :loading="isLoading"
            @click="handleRegister"
          >
            注册
          </el-button>
        </el-form>
        
        <div class="auth-footer">
          <p>已有账号? <router-link to="/login">立即登录</router-link></p>
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

.terms-agreement {
  margin-bottom: 1.5rem;
}

.register-button {
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
