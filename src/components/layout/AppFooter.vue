<script setup lang="ts">
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="site-footer">
    <div class="container">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div class="footer-logo">
            <el-icon><Location /></el-icon>
            <span>浙江旅游</span>
          </div>
          <p>探索浙江的美丽风景和丰富文化，让我们带您领略这个充满活力的省份的独特魅力。</p>
          <div class="social-links flex gap-4 mt-4">
            <a href="#" class="social-link">
              <el-icon><ChatDotRound /></el-icon>
            </a>
            <a href="#" class="social-link">
              <el-icon><Share /></el-icon>
            </a>
            <a href="#" class="social-link">
              <el-icon><Link /></el-icon>
            </a>
          </div>
        </div>
        
        <div>
          <h3 class="footer-heading">热门景点</h3>
          <div class="footer-links">
            <a href="#">西湖</a>
            <a href="#">千岛湖</a>
            <a href="#">雁荡山</a>
            <a href="#">普陀山</a>
            <a href="#">乌镇</a>
          </div>
        </div>
        
        <div>
          <h3 class="footer-heading">实用信息</h3>
          <div class="footer-links">
            <a href="#">旅游指南</a>
            <a href="#">交通信息</a>
            <a href="#">住宿推荐</a>
            <a href="#">美食攻略</a>
            <a href="#">旅游季节</a>
          </div>
        </div>
        
        <div>
          <h3 class="footer-heading">联系我们</h3>
          <div class="footer-links">
            <a href="#">关于我们</a>
            <a href="#">帮助中心</a>
            <a href="#">隐私政策</a>
            <a href="#">条款和条件</a>
            <a href="#">联系方式</a>
          </div>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} 浙江旅游景点. 保留所有权利.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.grid {
  display: grid;
}

.grid-cols-1 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

@media (min-width: 768px) {
  .md\:grid-cols-4 {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--color-background);
  color: var(--color-primary);
  transition: all 0.3s;
}

.social-link:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-3px);
}

.dark .social-link {
  background-color: var(--color-background-mute);
}
</style>
