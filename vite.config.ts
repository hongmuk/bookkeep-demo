import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/bookkeep-demo/', // 하위 경로 배포를 위한 필수 설정
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false, // 스타일 깨짐 방지를 위해 CSS 번들링 강제
  }
})
