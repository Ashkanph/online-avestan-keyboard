// Checks that the app fits the screen without page scrolling at a range of screen sizes.
//
// Starts a Vite dev server, opens the app in headless Chromium at each size, fills the text area
// with more text than fits, then measures the page. A size fails if the page scrolls either way, or
// if the keyboard or the text panel's toolbar is cut off.
//
// Run with `npm run check:layout`. The first run needs `npx playwright install chromium`.

import { chromium } from 'playwright'
import { createServer } from 'vite'

interface Size {
  width: number
  height: number
  // Touch screens get mobile emulation, which also selects the phone layout in landscape.
  touch: boolean
}

const phone = (width: number, height: number): Size => ({ width, height, touch: true })
const desktop = (width: number, height: number): Size => ({ width, height, touch: false })

// Desktop windows shorter than about 390px don't fit the header, keyboard and toolbar together, so
// the smallest desktop height checked is 400.
const SIZES: Size[] = [
  // Phones, portrait and landscape.
  phone(320, 480),
  phone(320, 568),
  phone(360, 640),
  phone(375, 667),
  phone(390, 844),
  phone(412, 915),
  phone(430, 932),
  phone(568, 320),
  phone(667, 375),
  phone(844, 390),
  phone(932, 430),
  // Tablets.
  phone(768, 1024),
  phone(1024, 768),
  phone(1024, 1366),
  // Desktop windows, including the narrowest one that still gets the desktop layout.
  desktop(701, 400),
  desktop(800, 450),
  desktop(800, 600),
  desktop(1024, 600),
  desktop(1280, 400),
  desktop(1280, 720),
  desktop(1366, 768),
  desktop(1440, 900),
  desktop(1920, 1080),
  desktop(2560, 1440),
]

const server = await createServer({ logLevel: 'error', server: { port: 5199 } })
await server.listen()
const url = server.resolvedUrls?.local[0]
if (!url) throw new Error('The dev server did not report a URL')

const browser = await chromium.launch()
let failures = 0

try {
  for (const { width, height, touch } of SIZES) {
    const context = await browser.newContext({
      viewport: { width, height },
      hasTouch: touch,
      isMobile: touch,
    })
    const page = await context.newPage()
    await page.goto(url)
    await page.waitForSelector('.keyboard')
    await page.fill('textarea', 'A line of text\n'.repeat(200))

    const m = await page.evaluate(() => {
      const box = (selector: string) => {
        const el = document.querySelector(selector)
        if (!el) throw new Error(`Missing ${selector}`)
        return el.getBoundingClientRect()
      }
      const doc = document.documentElement
      const app = document.querySelector('.app')!
      const panel = box('.text-panel')
      const toolbar = box('.text-panel__toolbar')
      const keyboard = box('.keyboard')
      return {
        compact: app.hasAttribute('data-compact'),
        scrollY: doc.scrollHeight - window.innerHeight,
        scrollX: doc.scrollWidth - window.innerWidth,
        appClipped: app.scrollHeight - app.clientHeight,
        keyboardCut: keyboard.bottom - window.innerHeight,
        toolbarCut: Math.max(toolbar.bottom - panel.bottom, toolbar.bottom - keyboard.top),
        textHeight: Math.round(box('textarea').height),
      }
    })

    const problems: string[] = []
    if (m.scrollY > 0) problems.push(`page scrolls ${m.scrollY}px vertically`)
    if (m.scrollX > 0) problems.push(`page scrolls ${m.scrollX}px horizontally`)
    if (m.appClipped > 0) problems.push(`${m.appClipped}px of the app is hidden`)
    if (m.keyboardCut > 0.5) problems.push(`keyboard cut off by ${Math.round(m.keyboardCut)}px`)
    if (m.toolbarCut > 0.5) problems.push(`toolbar cut off by ${Math.round(m.toolbarCut)}px`)

    const label = `${width}x${height} ${touch ? 'touch' : 'mouse'} (${m.compact ? 'phone' : 'desktop'} layout)`
    if (problems.length > 0) {
      failures++
      console.log(`FAIL ${label}: ${problems.join(', ')}`)
    } else {
      console.log(`ok   ${label}: text area ${m.textHeight}px tall`)
    }
    await context.close()
  }
} finally {
  await browser.close()
  await server.close()
}

if (failures > 0) {
  console.log(`\n${failures} of ${SIZES.length} sizes don't fit the screen`)
  process.exitCode = 1
} else {
  console.log(`\nAll ${SIZES.length} sizes fit the screen without scrolling`)
}
