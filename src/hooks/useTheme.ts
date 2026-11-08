import { useState } from 'react'
import { writePreference } from '../lib/storage'

export type Theme = 'light' | 'dark'

export function useTheme() {
  // index.html sets data-theme before first paint, from the saved choice or the OS preference.
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light',
  )

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.dataset.theme = next
    writePreference('theme', next)
    setTheme(next)
  }

  return { theme, toggleTheme }
}
