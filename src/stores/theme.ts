import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: useStorage('zhejiang-theme-dark', false)
  }),
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      this.applyTheme()
    },
    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    initTheme() {
      this.applyTheme()
    }
  }
})
