/**
 * Keeps `--app-height` on the root element equal to the visible height of the window, for browsers
 * without `dvh` units (Safari before 15.4, Chrome before 108, Firefox before 101).
 *
 * There `100vh` is the height with the browser's toolbars hidden, so on phones an app that is
 * `100vh` tall runs under the toolbar and its bottom row of keys can't be reached.
 */
export function trackViewportHeight(): void {
  if (typeof CSS !== 'undefined' && CSS.supports('height', '100dvh')) return

  const root = document.documentElement
  const update = () => root.style.setProperty('--app-height', `${window.innerHeight}px`)
  update()
  window.addEventListener('resize', update)
  window.addEventListener('orientationchange', update)
}
