export interface AvestanFont {
  id: string
  label: string
  /** CSS font-family value. The families are declared with @font-face in index.css. */
  family: string
}

export const AVESTAN_FONTS: readonly AvestanFont[] = [
  { id: 'noto-sans', label: 'Noto Sans Avestan', family: "'Noto Sans Avestan'" },
  { id: 'ahuramazda', label: 'Ahuramazda', family: "'Ahuramazda'" },
  { id: 'unifont', label: 'GNU Unifont (pixel)', family: "'Unifont Avestan'" },
]

export const DEFAULT_AVESTAN_FONT = AVESTAN_FONTS[0]
