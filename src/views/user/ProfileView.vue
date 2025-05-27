<template>
    <div class="profile-container">
        <el-card class="profile-card">
            <template #header>
                <div class="card-header">
                    <h2>个人资料</h2>
                </div>
            </template>

            <el-form ref="formRef" :model="form.value" :rules="rules" label-width="100px" class="profile-form">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="form.value.username" />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="form.value.email" />
                </el-form-item>

                <el-form-item label="手机号" prop="phone">
                    <el-input v-model="form.value.phone" />
                </el-form-item>

                <el-form-item label="所在地" prop="location">
                    <el-input v-model="form.value.location" />
                </el-form-item>

                <el-form-item label="个人简介" prop="bio">
                    <el-input v-model="form.value.bio" type="textarea" :rows="4" placeholder="介绍一下自己吧..." />
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="updateProfile">保存修改</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import type { FormInstance } from 'element-plus'

const userStore = useUserStore()
const formRef = ref<FormInstance>()

// 表单数据
const form = ref({
    username: '',
    email: '',
    phone: '',
    location: '',
    bio: ''
})

// 表单验证规则
const rules = {
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
    ],
    phone: [
        { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号码', trigger: 'blur' }
    ]
}

// 初始化表单数据
onMounted(() => {
    if (userStore.user) {
        form.value = {
            username: userStore.user.username,
            email: userStore.user.email,
            phone: userStore.user.phone || '',
            location: userStore.user.location || '',
            bio: userStore.user.bio || ''
        }
    }
})

// 更新个人资料
const updateProfile = async () => {
    try {
        // 表单验证
        await formRef.value?.validate()

        // 更新用户信息
        const updatedUser = await userStore.updateProfile({
            username: form.value.username,
            email: form.value.email,
            phone: form.value.phone,
            location: form.value.location,
            bio: form.value.bio
        })

        // 更新成功提示
        ElMessage.success('个人资料已更新')

        // 更新表单数据
        form.value = {
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone || '',
            location: updatedUser.location || '',
            bio: updatedUser.bio || ''
        }

    } catch (error: any) {
        console.error('更新个人资料失败:', error)
        if (error.message) {
            ElMessage.error(error.message)
        } else {
            ElMessage.error('更新失败，请稍后重试')
        }
    }
}
</script>

<style scoped>
.profile-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 0 20px;
}

.profile-card {
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card-header h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #303133;
}

.profile-form {
    margin-top: 20px;
}

:deep(.el-form-item__label) {
    font-weight: 500;
}

:deep(.el-input__inner) {
    border-radius: 4px;
}

:deep(.el-textarea__inner) {
    border-radius: 4px;
    resize: vertical;
}
</style>