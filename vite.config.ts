import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  base: '/home-inventory/',
  plugins: [
    react(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['favicon.svg', 'icons.svg'],
    //   manifest: {
    //     name: '우리집 물건 관리',
    //     short_name: '홈인벤토리',
    //     description: '개인용 물건 관리 앱',
    //     theme_color: '#ffffff',
    //     icons: [
    //       {
    //         src: 'icons.svg',
    //         sizes: 'any',
    //         type: 'image/svg+xml',
    //         purpose: 'any maskable'
    //       }
    //     ]
    //   }
    // })
  ],
})
