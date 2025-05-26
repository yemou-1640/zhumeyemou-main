<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="not-found-view">
    <div class="container">
      <div class="not-found-content">
        <div class="not-found-code">404</div>
        <h1 class="not-found-title">页面未找到</h1>
        <p class="not-found-message">
          抱歉，您访问的页面不存在或已被移除。
        </p>
        <div class="not-found-actions">
          <el-button type="primary" @click="goHome">返回首页</el-button>
          <el-button @click="goBack">返回上一页</el-button>
        </div>
        <div class="not-found-image">
          <img src="https://cdn.jsdelivr.net/gh/slidevjs/slidev/assets/safari-pinned-tab.svg" alt="404 Illustration" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-view {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;
  text-align: center;
}

.not-found-content {
  max-width: 600px;
  margin: 0 auto;
}

.not-found-code {
  font-size: 8rem;
  font-weight: 900;
  line-height: 1;
  color: var(--color-primary);
  margin-bottom: 1rem;
  text-shadow: 3px 3px 0 var(--color-background-accent);
}

.not-found-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: var(--color-heading);
}

.not-found-message {
  font-size: 1.25rem;
  color: var(--color-text-soft);
  margin-bottom: 2rem;
}

.not-found-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.not-found-image {
  max-width: 300px;
  margin: 0 auto;
  opacity: 0.7;
}

.not-found-image img {
  width: 100%;
  height: auto;
}

@media (max-width: 768px) {
  .not-found-code {
    font-size: 6rem;
  }
  
  .not-found-title {
    font-size: 2rem;
  }
  
  .not-found-message {
    font-size: 1.125rem;
  }
  
  .not-found-actions {
    flex-direction: column;
  }
}
</style>
