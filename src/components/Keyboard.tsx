import type { Layout } from '../data/layouts'
import { CompactKeyboard } from './CompactKeyboard'
import { DesktopKeyboard } from './DesktopKeyboard'
import './Keyboard.css'

interface KeyboardProps {
  layout: Layout
  compact: boolean
  pressedCodes: ReadonlySet<string>
  shiftHeld: boolean
  onInsert: (text: string) => void
  onBackspace: () => void
  onNextLanguage: () => void
}

export function Keyboard({ layout, compact, pressedCodes, ...actions }: KeyboardProps) {
  return (
    <section
      className="keyboard"
      data-compact={compact || undefined}
      data-language={layout.id}
      aria-label={`${layout.name} keyboard`}
      // Keeps focus, and so the caret, in the text area while keys are used.
      onMouseDown={(event) => event.preventDefault()}
      // Stops the browser's long-press menu from interrupting key long-presses.
      onContextMenu={(event) => event.preventDefault()}
    >
      {/* Keyed by language so Shift and the symbols page reset when the language changes. */}
      {compact ? (
        <CompactKeyboard key={layout.id} layout={layout} {...actions} />
      ) : (
        <DesktopKeyboard key={layout.id} layout={layout} pressedCodes={pressedCodes} {...actions} />
      )}
    </section>
  )
}
