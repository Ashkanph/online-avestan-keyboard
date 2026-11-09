import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // Updates apply on the next launch; reloading a running page would lose the typed text.
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      workbox: {
        // Fonts load on demand, so they must be precached for offline use.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Avestan online keyboard',
        short_name: 'Avestan',
        description: 'Type Avestan, Persian and English online.',
        lang: 'en',
        display: 'standalone',
        theme_color: '#f6f8fc',
        background_color: '#f6f8fc',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          {
            src: 'icons/maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
})
