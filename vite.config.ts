import { readFileSync } from 'node:fs'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

// The oldest browsers supported: the first versions of each released in 2020. The build lowers
// newer JavaScript and CSS syntax to what these understand. Features that can't be lowered (APIs,
// flexbox gap, :focus-visible, dvh units, <dialog>) have fallbacks in the source.
const BROWSER_TARGETS = ['chrome80', 'edge80', 'firefox72', 'safari13.1', 'ios13.4']

/**
 * Copies README.md and LICENSE into dist/, so the deployed GitHub Pages branch has them too. In the
 * README, links to files in public/ lose that prefix, because the build puts those files at the
 * top of dist/.
 */
function copyRepositoryFiles(): Plugin {
  // Next to this config file, whatever directory the build is started from.
  const read = (name: string) => readFileSync(new URL(name, import.meta.url), 'utf8')

  return {
    name: 'copy-repository-files',
    apply: 'build',
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'README.md',
        // Matches HTML attributes (src="public/…") and Markdown links (](public/…)).
        source: read('README.md').replace(/(="|\]\()(\.\/)?public\//g, '$1'),
      })
      this.emitFile({ type: 'asset', fileName: 'LICENSE', source: read('LICENSE') })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    target: BROWSER_TARGETS,
  },
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
    copyRepositoryFiles(),
  ],
})
