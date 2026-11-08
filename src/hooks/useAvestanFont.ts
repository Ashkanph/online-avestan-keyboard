import { useState } from 'react'
import { AVESTAN_FONTS, DEFAULT_AVESTAN_FONT } from '../data/fonts'
import { readPreference, writePreference } from '../lib/storage'

const STORAGE_KEY = 'avestan-font'

export function useAvestanFont() {
  const [font, setFont] = useState(() => {
    const saved = readPreference(STORAGE_KEY)
    return AVESTAN_FONTS.find((candidate) => candidate.id === saved) ?? DEFAULT_AVESTAN_FONT
  })

  function selectFont(id: string) {
    const next = AVESTAN_FONTS.find((candidate) => candidate.id === id)
    if (!next) return
    writePreference(STORAGE_KEY, next.id)
    setFont(next)
  }

  return { font, selectFont }
}
