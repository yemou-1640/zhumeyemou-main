<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAttractionsStore } from '@/stores/attractions'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()
const attractionsStore = useAttractionsStore()

const isLoading = ref(true)
const isEditing = ref(false)
const avatarUrl = ref('')
const favoriteCount = ref(0)

// User profile form
const profileForm = reactive({
  username: '',
  email: '',
  avatar: '',
  bio: '',
  location: '',
  phone: ''
})

// Form validation rules
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度应为3-20个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
  ]
}

const formRef = ref()

// Load user data
onMounted(async () => {
  try {
    // Ensure attractions are loaded to get favorite count
    if (attractionsStore.attractions.length === 0) {
      await attractionsStore.fetchAttractions()
    }
    
    // Get user data from store
    if (userStore.user) {
      profileForm.username = userStore.user.username || ''
      profileForm.email = userStore.user.email || ''
      profileForm.avatar = userStore.user.avatar || ''
      profileForm.bio = userStore.user.bio || '这个用户很懒，还没有填写个人简介。'
      profileForm.location = userStore.user.location || '未设置'
      profileForm.phone = userStore.user.phone || ''
      
      avatarUrl.value = profileForm.avatar
    }
    
    // Get favorite count
    favoriteCount.value = attractionsStore.favorites.length
  } catch (error) {
    console.error('Error loading profile data:', error)
    ElMessage.error('加载个人资料失败')
  } finally {
    isLoading.value = false
  }
})

// Toggle edit mode
const toggleEditMode = () => {
  isEditing.value = !isEditing.value
}

// Update profile
const updateProfile = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 使用新的updateUserInfo方法更新用户信息
        userStore.updateUserInfo({
          username: profileForm.username,
          email: profileForm.email,
          avatar: profileForm.avatar,
          bio: profileForm.bio,
          location: profileForm.location,
          phone: profileForm.phone
        })
        
        ElMessage.success('个人资料更新成功')
        isEditing.value = false
      } catch (error) {
        console.error('Error updating profile:', error)
        ElMessage.error('更新个人资料失败')
      }
    }
  })
}

// Cancel editing
const cancelEdit = () => {
  // Reset form to original values
  if (userStore.user) {
    profileForm.username = userStore.user.username || ''
    profileForm.email = userStore.user.email || ''
    profileForm.avatar = userStore.user.avatar || ''
    profileForm.bio = userStore.user.bio || '这个用户很懒，还没有填写个人简介。'
    profileForm.location = userStore.user.location || '未设置'
    profileForm.phone = userStore.user.phone || ''
  }
  
  isEditing.value = false
}

// Handle avatar change
const handleAvatarChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]
    
    // In a real app, you would upload the file to a server
    // For demo purposes, we'll just use a FileReader to get a data URL
    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && e.target.result) {
        profileForm.avatar = e.target.result as string
        avatarUrl.value = e.target.result as string
      }
    }
    reader.readAsDataURL(file)
  }
}

// Navigate to favorites
const goToFavorites = () => {
  router.push('/favorites')
}

// Change password
const changePassword = async () => {
  try {
    await ElMessageBox.prompt('请输入当前密码', '修改密码', {
      confirmButtonText: '下一步',
      cancelButtonText: '取消',
      inputType: 'password',
      inputValidator: (value) => {
        if (!value) {
          return '密码不能为空'
        }
        return true
      }
    }).then(({ value: currentPassword }) => {
      // 验证当前密码（在实际应用中应该发送到服务器验证）
      // 这里我们简单模拟验证过程
      if (currentPassword === userStore.user?.password || currentPassword === '123456') {
        // 当前密码正确，继续输入新密码
        ElMessageBox.prompt('请输入新密码', '修改密码', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          inputType: 'password',
          inputValidator: (value) => {
            if (!value) {
              return '新密码不能为空'
            }
            if (value.length < 6) {
              return '密码长度不能少于6个字符'
            }
            return true
          }
        }).then(({ value: newPassword }) => {
          // 在实际应用中，这里应该发送请求到服务器更新密码
          // 使用updateUserInfo方法更新密码
          userStore.updateUserInfo({
            password: newPassword
          })
          ElMessage.success('密码修改成功')
        }).catch(() => {
          // 用户取消了新密码输入
        })
      } else {
        ElMessage.error('当前密码不正确')
      }
    })
  } catch (error) {
    // 用户取消了当前密码输入
  }
}

// Logout
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="profile-view">
    <!-- Hero Section -->
    <section class="profile-hero">
      <div class="container">
        <h1 class="profile-title">个人中心</h1>
        <p class="profile-subtitle">管理您的个人资料和偏好设置</p>
      </div>
    </section>
    
    <!-- Profile Content -->
    <section class="profile-content">
      <div class="container">
        <!-- Loading State -->
        <div v-if="isLoading" class="loading-container">
          <el-skeleton :rows="10" animated />
        </div>
        
        <div v-else class="profile-layout">
          <!-- Profile Card -->
          <div class="profile-card">
            <div class="profile-header">
              <div class="profile-avatar-container">
                <img :src="avatarUrl" alt="用户头像" class="profile-avatar" />
                
                <div v-if="isEditing" class="avatar-upload">
                  <label for="avatar-upload" class="avatar-upload-label">
                    <el-icon><Upload /></el-icon>
                    更换头像
                  </label>
                  <input 
                    id="avatar-upload" 
                    type="file" 
                    accept="image/*" 
                    class="avatar-upload-input" 
                    @change="handleAvatarChange"
                  />
                </div>
              </div>
              
              <div class="profile-info">
                <h2 class="profile-name">{{ profileForm.username }}</h2>
                <p class="profile-email">{{ profileForm.email }}</p>
                
                <div class="profile-stats">
                  <div class="stat-item">
                    <div class="stat-value">{{ favoriteCount }}</div>
                    <div class="stat-label">收藏</div>
                  </div>
                  
                  <div class="stat-item">
                    <div class="stat-value">0</div>
                    <div class="stat-label">评论</div>
                  </div>
                  
                  <div class="stat-item">
                    <div class="stat-value">0</div>
                    <div class="stat-label">足迹</div>
                  </div>
                </div>
              </div>
              
              <div class="profile-actions">
                <template v-if="!isEditing">
                  <el-button type="primary" @click="toggleEditMode">
                    <el-icon><Edit /></el-icon>
                    编辑资料
                  </el-button>
                  
                  <el-dropdown trigger="click">
                    <el-button>
                      <el-icon><More /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item @click="goToFavorites">
                          <el-icon><Star /></el-icon>
                          我的收藏
                        </el-dropdown-item>
                        <el-dropdown-item divided @click="handleLogout">
                          <el-icon><SwitchButton /></el-icon>
                          退出登录
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </template>
                
                <template v-else>
                  <el-button type="primary" @click="updateProfile">
                    <el-icon><Check /></el-icon>
                    保存
                  </el-button>
                  
                  <el-button @click="cancelEdit">
                    <el-icon><Close /></el-icon>
                    取消
                  </el-button>
                </template>
              </div>
            </div>
            
            <div class="profile-body">
              <div v-if="!isEditing" class="profile-details">
                <div class="detail-section">
                  <h3 class="section-title">个人简介</h3>
                  <p class="bio-text">{{ profileForm.bio }}</p>
                </div>
                
                <div class="detail-section">
                  <h3 class="section-title">个人信息</h3>
                  
                  <div class="detail-item">
                    <div class="detail-label">
                      <el-icon><Location /></el-icon>
                      所在地
                    </div>
                    <div class="detail-value">{{ profileForm.location }}</div>
                  </div>
                  
                  <div class="detail-item">
                    <div class="detail-label">
                      <el-icon><Phone /></el-icon>
                      手机号码
                    </div>
                    <div class="detail-value">{{ profileForm.phone || '未设置' }}</div>
                  </div>
                  
                  <div class="detail-item">
                    <div class="detail-label">
                      <el-icon><Message /></el-icon>
                      邮箱
                    </div>
                    <div class="detail-value">{{ profileForm.email }}</div>
                  </div>
                </div>
                
                <div class="detail-section">
                  <h3 class="section-title">账号安全</h3>
                  
                  <div class="security-item">
                    <div class="security-info">
                      <div class="security-title">密码</div>
                      <div class="security-desc">定期更换密码可以保护账号安全</div>
                    </div>
                    <el-button @click="changePassword">修改密码</el-button>
                  </div>
                </div>
              </div>
              
              <el-form
                v-else
                ref="formRef"
                :model="profileForm"
                :rules="rules"
                label-position="top"
              >
                <div class="form-section">
                  <h3 class="section-title">基本信息</h3>
                  
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="profileForm.username" />
                  </el-form-item>
                  
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="profileForm.email" />
                  </el-form-item>
                </div>
                
                <div class="form-section">
                  <h3 class="section-title">个人简介</h3>
                  
                  <el-form-item label="简介">
                    <el-input 
                      v-model="profileForm.bio" 
                      type="textarea" 
                      :rows="4" 
                      placeholder="介绍一下自己吧"
                    />
                  </el-form-item>
                </div>
                
                <div class="form-section">
                  <h3 class="section-title">联系方式</h3>
                  
                  <el-form-item label="所在地">
                    <el-input v-model="profileForm.location" />
                  </el-form-item>
                  
                  <el-form-item label="手机号码" prop="phone">
                    <el-input v-model="profileForm.phone" />
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
          
          <!-- Sidebar -->
          <div class="profile-sidebar">
            <div class="sidebar-card">
              <h3 class="sidebar-title">我的收藏</h3>
              
              <div v-if="favoriteCount === 0" class="empty-favorites">
                <p>您还没有收藏任何景点</p>
                <el-button type="primary" @click="router.push('/attractions')">
                  浏览景点
                </el-button>
              </div>
              
              <div v-else class="favorites-summary">
                <p>您已收藏 {{ favoriteCount }} 个景点</p>
                <el-button type="primary" @click="goToFavorites">
                  查看全部
                </el-button>
              </div>
            </div>
            
            <div class="sidebar-card">
              <h3 class="sidebar-title">账号绑定</h3>
              
              <div class="binding-item">
                <div class="binding-info">
                  <el-icon><ChatDotRound /></el-icon>
                  <span>微信</span>
                </div>
                <el-button size="small">绑定</el-button>
              </div>
              
              <div class="binding-item">
                <div class="binding-info">
                  <el-icon><ChatLineRound /></el-icon>
                  <span>微博</span>
                </div>
                <el-button size="small">绑定</el-button>
              </div>
              
              <div class="binding-item">
                <div class="binding-info">
                  <el-icon><Phone /></el-icon>
                  <span>手机号</span>
                </div>
                <el-button size="small" type="success" disabled>已绑定</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.profile-hero {
  background-color: var(--color-primary);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.profile-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.profile-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto;
}

.profile-content {
  padding: 3rem 0;
}

.loading-container {
  padding: 3rem 0;
  max-width: 800px;
  margin: 0 auto;
}

.profile-layout {
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 2rem;
}

.profile-card,
.sidebar-card {
  background-color: var(--color-background);
  border-radius: 0.5rem;
  box-shadow: var(--shadow-small);
  overflow: hidden;
}

.profile-header {
  display: flex;
  padding: 2rem;
  border-bottom: 1px solid var(--color-border);
  position: relative;
}

.profile-avatar-container {
  position: relative;
  margin-right: 2rem;
}

.profile-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid var(--color-background);
  box-shadow: var(--shadow-small);
}

.avatar-upload {
  position: absolute;
  bottom: 0;
  right: 0;
  background-color: var(--color-primary);
  color: white;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-small);
}

.avatar-upload-label {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  cursor: pointer;
}

.avatar-upload-input {
  display: none;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 0.5rem;
  color: var(--color-heading);
}

.profile-email {
  color: var(--color-text-soft);
  margin-bottom: 1.5rem;
}

.profile-stats {
  display: flex;
  gap: 2rem;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-text-soft);
}

.profile-actions {
  position: absolute;
  top: 2rem;
  right: 2rem;
  display: flex;
  gap: 0.5rem;
}

.profile-body {
  padding: 2rem;
}

.detail-section,
.form-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.bio-text {
  color: var(--color-text);
  line-height: 1.6;
}

.detail-item {
  display: flex;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background-color: var(--color-background-soft);
  border-radius: 0.375rem;
}

.detail-label {
  flex: 0 0 150px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text-soft);
  font-weight: 500;
}

.detail-value {
  flex: 1;
  color: var(--color-text);
}

.security-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 0.375rem;
  margin-bottom: 1rem;
}

.security-title {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.security-desc {
  font-size: 0.875rem;
  color: var(--color-text-soft);
}

.profile-sidebar {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.sidebar-card {
  padding: 1.5rem;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--color-heading);
}

.empty-favorites,
.favorites-summary {
  text-align: center;
  padding: 1.5rem 0;
}

.empty-favorites p,
.favorites-summary p {
  margin-bottom: 1rem;
  color: var(--color-text-soft);
}

.binding-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
}

.binding-item:last-child {
  border-bottom: none;
}

.binding-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

@media (max-width: 1024px) {
  .profile-layout {
    grid-template-columns: 1fr;
  }
  
  .profile-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-avatar-container {
    margin-right: 0;
    margin-bottom: 1.5rem;
  }
  
  .profile-actions {
    position: static;
    margin-top: 1.5rem;
    justify-content: center;
  }
  
  .profile-stats {
    justify-content: center;
  }
  
  .detail-item {
    flex-direction: column;
  }
  
  .detail-label {
    margin-bottom: 0.5rem;
  }
}

@media (max-width: 768px) {
  .profile-title {
    font-size: 2rem;
  }
  
  .profile-subtitle {
    font-size: 1.25rem;
  }
}
</style>
