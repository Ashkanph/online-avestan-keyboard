# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

A client-only React 19 + TypeScript + Vite app: an on-screen keyboard for typing Avestan, Persian and English, with a physical-keyboard mode and a phone-style layout on small screens. There is no backend and no runtime dependency beyond React.

## Commands

```sh
npm run dev           # Vite dev server
npm run build         # Type-check (tsc -b), then production build
npm run lint          # ESLint (lint:fix to autofix)
npm run format:check  # Prettier (format to write)
npx tsc -b            # Type-check only
npm run check:layout  # Check the app fits the screen without page scrolling at many screen sizes
```

There is no test framework or unit test suite. Verify changes with `npm run build`, `npm run lint`, and by running the app. After changing layout or CSS, also run `npm run check:layout` (`scripts/check-layout.ts`). It starts a Vite dev server and measures the app in headless Chromium through Playwright, so the first run needs `npx playwright install chromium`.

A Husky pre-commit hook runs `lint-staged` (ESLint and Prettier on staged files).

## Architecture

`App.tsx` owns the language, the text and a ref to the single `<textarea>`. All input paths converge on its `handleInsert` / `handleBackspace`:

- **On-screen keys**: `Keyboard` picks `DesktopKeyboard` or `CompactKeyboard` from a media query in `App.tsx`. Both are built on `Key`, which handles pointer input, long-press alternates and key repeat.
- **Physical keys**: `usePhysicalKeyboard` listens on `window`, translates keys through the active layout and reports pressed codes so the on-screen keys can highlight.
- **Native textarea edits** (cut, paste, keys with no layout mapping) reach state through the textarea's `onChange` instead.

Each component lives in its own folder, `src/components/<Name>/`, as `<Name>.tsx` plus `<Name>.css` holding that component's styles (including its `.app[data-compact]` phone overrides). The component imports its CSS after its other imports, so a child's styles load before the parent's overrides. `index.css` holds only global styles: fonts, theme variables and the shared `.icon-button`.

`src/lib/editor.ts` mutates the textarea directly, then `App` copies `textarea.value` into state.

`src/data/layouts.ts` is the source of truth for keyboard behavior. Each `Layout` maps `KeyboardEvent.code` to `[normal, shifted]` characters, and also defines the phone rows and symbol pages. Components stay language-agnostic and read everything through this data and its helpers (`charsFor`, `keyLabel`, `describeChar`).

The app is an installable PWA, configured through `VitePWA` in `vite.config.ts`. The service worker precaches the whole build (production only; it is not active under `npm run dev`). `useInstallPrompt` and `InstallButton` provide the "add to home screen" button. The icons in `public/icons` are generated PNGs.

The site has a second page, `about/index.html`: a static page about the Avestan language, built mainly for search engines. It has no app script. The `aboutPage` plugin in `vite.config.ts` fills it at build time from `src/data/about.ts`, the same text the About dialog shows, and removes the manifest and service worker tags that VitePWA adds, whose paths would be wrong from `about/`. New pages must be added to `build.rolldownOptions.input` and to `public/sitemap.xml`.

### Browser support

The app supports browsers from 2020 on: Chrome and Edge 80, Firefox 72, Safari 13.1 and iOS 13.4 (`BROWSER_TARGETS` in `vite.config.ts`). The build lowers newer JavaScript and CSS syntax, but not APIs or CSS features that can't be rewritten, so the source avoids or falls back from these:

- **Flexbox `gap`** (Chrome 84, Safari 14.1): space flex items with margins instead.
- **`dvh` units** (Safari 15.4): put a `vh` declaration before each `dvh` one. `.app` takes its height from `--app-height`, which `lib/viewportHeight.ts` sets from `window.innerHeight` where `dvh` is missing, because on old iOS `100vh` runs under Safari's toolbar.
- **`:focus-visible`** (Safari 15.4): pair it with a `:focus` rule; see `Key.css`.
- **`clamp()`, `min()`, `max()`** (Firefox 75): give a plain value first.
- **Logical properties** such as `margin-inline-start` (Chrome 87): use physical ones, since the page is always left to right.
- **`<dialog>`** (Safari 15.4): the shared `Dialog` component falls back to toggling the `open` attribute, and doesn't use `<form method="dialog">`, which would reload the page there.
- **`MediaQueryList.addEventListener`** (Safari 14): fall back to `addListener`, as `useMediaQuery` does.
- **Regex `\p{…}`, lookbehind, named groups and the `s` flag** (Firefox 78, lookbehind Safari 16.4): a syntax error there stops the whole app from loading.
- **Newer built-ins** such as `Array.prototype.at`, `structuredClone`, `Object.hasOwn` and `replaceAll`: no polyfills are included.

### Invariants that are easy to break

- **Avestan is outside the BMP** (U+10B00 block), so each letter is a surrogate pair. Don't index or split strings by code unit: use `Array.from` or code-point-aware logic, as `deleteBeforeCaret` does.
- **Keys are matched by `event.code`** (physical position), never `event.key`, so typing doesn't depend on the OS keyboard layout.
- **`editor.ts` assigns `el.value` rather than calling `setRangeText`** to keep React's value tracking in sync.
- **Focus must stay in the textarea** while keys are used. `Keyboard` calls `preventDefault` on `mousedown` for this, and the copy button does the same.
- **`inputMode="none"`** on the textarea keeps the phone's own keyboard closed while the caret stays usable.
- **The keyboards are keyed by `layout.id`** so Shift and the symbols page reset when the language changes.
- **New asset types must be added to `globPatterns`** in `vite.config.ts`, or they won't be available offline.
- **Don't reload the page when a service worker update arrives**: the typed text exists only in memory.
- **The page never scrolls**: `.app` is exactly one screen tall with `overflow: hidden`. The header and keyboard are `flex: none`, and the text area shrinks to fit the space left over and scrolls by itself.

### Extending

- **New language**: extend `LanguageId`, then add it to `LAYOUTS` and `LANGUAGE_ORDER`.
- **New Avestan font**: add the `.woff2` and its licence to `src/assets/fonts`, declare it with `@font-face` in `src/index.css`, and add it to `AVESTAN_FONTS` in `src/data/fonts.ts`. Fonts are self-hosted, so don't link a CDN. The selected font is applied through the `--avestan-font` CSS variable set in `App.tsx`.
- **Persisted preferences** go through `src/lib/storage.ts`, which tolerates blocked `localStorage`.
