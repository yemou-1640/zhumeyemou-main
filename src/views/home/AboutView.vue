<script setup lang="ts">
// About page for Zhejiang Tourist Attractions
</script>

<template>
  <div class="about-view">
    <!-- Hero Section -->
    <section class="about-hero">
      <div class="container">
        <h1 class="about-title">关于我们</h1>
        <p class="about-subtitle">了解浙江旅游网站的使命和愿景</p>
      </div>
    </section>
    
    <!-- Main Content -->
    <section class="about-content">
      <div class="container">
        <div class="about-card">
          <h2 class="section-title">我们的使命</h2>
          <p class="section-text">
            浙江旅游网站致力于向全球游客展示浙江省丰富多彩的旅游资源和文化遗产。我们的使命是通过提供全面、准确的旅游信息，帮助游客发现浙江的美丽风景、悠久历史和独特文化，促进浙江旅游业的可持续发展。
          </p>
          
          <div class="image-feature">
            <img src="https://images.unsplash.com/photo-1598257006458-087169a1f08d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80" alt="浙江风景" class="feature-image" />
          </div>
          
          <h2 class="section-title">我们的愿景</h2>
          <p class="section-text">
            我们希望成为浙江旅游资源的权威展示平台，让每一位游客都能轻松规划他们的浙江之旅，发现隐藏的宝藏景点，体验当地的文化和美食，创造难忘的旅行回忆。
          </p>
          
          <h2 class="section-title">我们的价值观</h2>
          <div class="values-grid">
            <div class="value-card">
              <el-icon class="value-icon"><Star /></el-icon>
              <h3 class="value-title">真实可靠</h3>
              <p class="value-text">提供准确、真实的旅游信息，让游客可以信赖我们的内容。</p>
            </div>
            
            <div class="value-card">
              <el-icon class="value-icon"><Compass /></el-icon>
              <h3 class="value-title">探索精神</h3>
              <p class="value-text">鼓励游客探索浙江的每一个角落，发现不为人知的美丽景点。</p>
            </div>
            
            <div class="value-card">
              <el-icon class="value-icon"><Connection /></el-icon>
              <h3 class="value-title">文化连接</h3>
              <p class="value-text">促进游客与当地文化的深度连接，增进对浙江历史和传统的理解。</p>
            </div>
            
            <div class="value-card">
              <el-icon class="value-icon"><Opportunity /></el-icon>
              <h3 class="value-title">可持续发展</h3>
              <p class="value-text">支持负责任的旅游，保护浙江的自然环境和文化遗产。</p>
            </div>
          </div>
          
          <h2 class="section-title">我们的团队</h2>
          <p class="section-text">
            我们的团队由一群热爱旅行和浙江文化的专业人士组成。我们有经验丰富的旅游顾问、内容创作者、摄影师和技术专家，他们共同努力，为您提供最佳的浙江旅游体验。
          </p>
          
          <div class="team-grid">
            <div class="team-member">
              <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="团队成员" class="member-avatar" />
              <h3 class="member-name">张明</h3>
              <p class="member-role">创始人 & CEO</p>
            </div>
            
            <div class="team-member">
              <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="团队成员" class="member-avatar" />
              <h3 class="member-name">李婷</h3>
              <p class="member-role">内容总监</p>
            </div>
            
            <div class="team-member">
              <img src="https://randomuser.me/api/portraits/men/62.jpg" alt="团队成员" class="member-avatar" />
              <h3 class="member-name">王强</h3>
              <p class="member-role">首席技术官</p>
            </div>
            
            <div class="team-member">
              <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="团队成员" class="member-avatar" />
              <h3 class="member-name">赵琳</h3>
              <p class="member-role">市场总监</p>
            </div>
          </div>
          
          <h2 class="section-title">联系我们</h2>
          <p class="section-text">
            如果您有任何问题、建议或合作意向，请随时与我们联系。我们期待听到您的声音！
          </p>
          
          <div class="contact-info">
            <div class="contact-item">
              <el-icon><Message /></el-icon>
              <span>info@zhejiangtravel.com</span>
            </div>
            
            <div class="contact-item">
              <el-icon><Phone /></el-icon>
              <span>+86 571 8888 8888</span>
            </div>
            
            <div class="contact-item">
              <el-icon><Location /></el-icon>
              <span>杭州市西湖区文三路188号</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.about-hero {
  background-color: var(--color-primary);
  color: white;
  padding: 4rem 0;
  text-align: center;
}

.about-title {
  font-size: 3rem;
  font-weight: 800;
  margin-bottom: 1rem;
}

.about-subtitle {
  font-size: 1.5rem;
  opacity: 0.9;
  max-width: 800px;
  margin: 0 auto;
}

.about-content {
  padding: 3rem 0;
}

.about-card {
  background-color: var(--color-background);
  border-radius: 0.5rem;
  padding: 2.5rem;
  box-shadow: var(--shadow-medium);
  max-width: 1000px;
  margin: 0 auto;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  margin: 2rem 0 1rem;
  color: var(--color-heading);
}

.section-title:first-child {
  margin-top: 0;
}

.section-text {
  font-size: 1.125rem;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  color: var(--color-text);
}

.image-feature {
  margin: 2rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: var(--shadow-medium);
}

.feature-image {
  width: 100%;
  height: auto;
  display: block;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}

.value-card {
  background-color: var(--color-background-soft);
  padding: 1.5rem;
  border-radius: 0.5rem;
  transition: transform 0.3s, box-shadow 0.3s;
}

.value-card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-medium);
}

.value-icon {
  font-size: 2.5rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.value-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: var(--color-heading);
}

.value-text {
  color: var(--color-text-soft);
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin: 2rem 0;
}

.team-member {
  text-align: center;
}

.member-avatar {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 1rem;
  border: 4px solid var(--color-background-soft);
}

.member-name {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-heading);
}

.member-role {
  color: var(--color-text-soft);
}

.contact-info {
  margin-top: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: var(--color-background-soft);
  border-radius: 0.375rem;
}

.contact-item i {
  color: var(--color-primary);
}

@media (max-width: 768px) {
  .about-title {
    font-size: 2rem;
  }
  
  .about-subtitle {
    font-size: 1.25rem;
  }
  
  .values-grid {
    grid-template-columns: 1fr;
  }
  
  .team-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
}
</style>
