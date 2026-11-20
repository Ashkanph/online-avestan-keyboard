import { useCallback, useRef, useState, type CSSProperties } from 'react'
import './App.css'
import { Header } from './components/Header/Header'
import { Keyboard } from './components/Keyboard/Keyboard'
import { TextPanel } from './components/TextPanel/TextPanel'
import { DEFAULT_LANGUAGE, LANGUAGE_ORDER, LAYOUTS, type LanguageId } from './data/layouts'
import { useAvestanFont } from './hooks/useAvestanFont'
import { useMediaQuery } from './hooks/useMediaQuery'
import { usePhysicalKeyboard } from './hooks/usePhysicalKeyboard'
import { useTheme } from './hooks/useTheme'
import { deleteBeforeCaret, insertAtCaret } from './lib/editor'

// Phones in either orientation; landscape phones are wide but very short.
const COMPACT_QUERY = '(max-width: 700px), (pointer: coarse) and (max-height: 500px)'

function App() {
  const [languageId, setLanguageId] = useState<LanguageId>(DEFAULT_LANGUAGE)
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { theme, toggleTheme } = useTheme()
  const { font, selectFont } = useAvestanFont()
  const compact = useMediaQuery(COMPACT_QUERY)
  const layout = LAYOUTS[languageId]

  const handleInsert = useCallback((inserted: string) => {
    const textarea = textareaRef.current
    if (!textarea) return
    insertAtCaret(textarea, inserted)
    setText(textarea.value)
  }, [])

  const handleBackspace = useCallback(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    deleteBeforeCaret(textarea)
    setText(textarea.value)
  }, [])

  const { pressedCodes, shiftHeld } = usePhysicalKeyboard({
    layout,
    textareaRef,
    onInsert: handleInsert,
    onBackspace: handleBackspace,
  })

  function handleNextLanguage() {
    setLanguageId((current) => {
      const next = (LANGUAGE_ORDER.indexOf(current) + 1) % LANGUAGE_ORDER.length
      return LANGUAGE_ORDER[next]
    })
  }

  return (
    <div
      className="app"
      data-compact={compact || undefined}
      style={{ '--avestan-font': font.family } as CSSProperties}
    >
      <Header theme={theme} onToggleTheme={toggleTheme} compact={compact || undefined} />
      <main className="app__main">
        <TextPanel
          layout={layout}
          text={text}
          textareaRef={textareaRef}
          onTextChange={setText}
          fontId={font.id}
          onFontChange={selectFont}
        />
        <Keyboard
          layout={layout}
          compact={compact}
          pressedCodes={pressedCodes}
          shiftHeld={shiftHeld}
          onInsert={handleInsert}
          onBackspace={handleBackspace}
          onNextLanguage={handleNextLanguage}
        />
      </main>
    </div>
  )
}

export default App
