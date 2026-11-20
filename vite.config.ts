import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import { ABOUT_TEXTS } from './src/data/about.ts'

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

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

/**
 * Writes the About dialog's text into about/index.html as plain HTML, in place of its
 * `<!-- about-text: … -->` comment. The page has no app script, so search engines and link
 * previews read the text without running JavaScript, and the text has a single source.
 */
function aboutPage(): Plugin {
  const placeholder = /<!-- about-text:[^>]*-->/

  return {
    name: 'about-page',
    // After Vite's own build plugins, so the HTML pages are in the bundle by generateBundle.
    enforce: 'post',
    transformIndexHtml(html) {
      if (!placeholder.test(html)) return html
      const articles = ABOUT_TEXTS.map((text) => {
        const sections = text.sections.map((section) => {
          const paragraphs = section.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')
          return `<section><h2>${escapeHtml(section.heading)}</h2>${paragraphs}</section>`
        })
        return `<article lang="${text.lang}" dir="${text.dir}">${sections.join('')}</article>`
      })
      return html.replace(placeholder, articles.join('\n'))
    },
    // VitePWA adds the web app manifest and the service worker registration to every page, with
    // paths relative to the top folder. From about/ they would point to missing files, and the
    // page isn't the app, so they are removed. Visiting the keyboard still installs the worker,
    // which then serves this page offline too.
    generateBundle(_, bundle) {
      const page = bundle['about/index.html']
      if (page?.type !== 'asset' || typeof page.source !== 'string') return
      page.source = page.source
        .replace(/<link rel="manifest"[^>]*>/, '')
        .replace(/<script id="vite-plugin-pwa:register-sw"[^>]*><\/script>/, '')
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: './',
  build: {
    target: BROWSER_TARGETS,
    rolldownOptions: {
      // The keyboard, and a static page about the Avestan language for search engines.
      input: {
        main: fileURLToPath(new URL('index.html', import.meta.url)),
        about: fileURLToPath(new URL('about/index.html', import.meta.url)),
      },
    },
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
        // The link-preview image is only fetched by social networks, never by the app.
        globIgnores: ['og-image.png'],
        cleanupOutdatedCaches: true,
      },
      manifest: {
        name: 'Avestan online keyboard',
        short_name: 'Avestan',
        description:
          'Free online keyboard for typing the Avestan script, as well as Persian and English. Works offline.',
        categories: ['utilities', 'education'],
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
    aboutPage(),
    copyRepositoryFiles(),
  ],
})
