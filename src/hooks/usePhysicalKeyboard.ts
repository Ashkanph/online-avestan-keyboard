import { useEffect, useState, type RefObject } from 'react'
import { charsFor, isEnglishLetter, type Layout } from '../data/layouts'

const NO_KEYS: ReadonlySet<string> = new Set()

interface Options {
  layout: Layout
  textareaRef: RefObject<HTMLTextAreaElement | null>
  onInsert: (text: string) => void
  onBackspace: () => void
}

/**
 * Types the selected language from a connected keyboard. Keys are matched by physical position
 * (`event.code`), so the result doesn't depend on the keyboard layout set in the OS.
 */
export function usePhysicalKeyboard({ layout, textareaRef, onInsert, onBackspace }: Options) {
  const [pressedCodes, setPressedCodes] = useState(NO_KEYS)

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const hasCommandModifier =
        event.ctrlKey || event.metaKey || event.altKey || event.getModifierState('AltGraph')
      if (hasCommandModifier || event.isComposing) return

      // An open dialog covers the text, so keys go to the dialog. Without <dialog> support the
      // dialog isn't modal and focus may still be outside it, so this checks the page.
      if (document.querySelector('dialog[open]')) return

      const target = event.target as HTMLElement
      if (target.closest('select, input')) return
      const activatesFocusedControl = event.code === 'Space' || event.code === 'Enter'
      if (activatesFocusedControl && target.closest('button, a')) return

      setPressedCodes((codes) => (codes.has(event.code) ? codes : new Set(codes).add(event.code)))

      const textarea = textareaRef.current
      if (!textarea) return

      if (target !== textarea && (event.code === 'Backspace' || event.code === 'Enter')) {
        event.preventDefault()
        textarea.focus()
        if (event.code === 'Backspace') onBackspace()
        else onInsert('\n')
        return
      }

      const capsAppliesToKey = isEnglishLetter(layout, event.code)
      const shifted = event.shiftKey !== (capsAppliesToKey && event.getModifierState('CapsLock'))
      const text = charsFor(layout, event.code, shifted)
      if (text === undefined) return

      event.preventDefault()
      textarea.focus()
      onInsert(text)
    }

    function handleKeyUp(event: KeyboardEvent) {
      setPressedCodes((codes) => {
        if (!codes.has(event.code)) return codes
        const next = new Set(codes)
        next.delete(event.code)
        return next
      })
    }

    // Key-up events are lost if the window loses focus while a key is held.
    function releaseAll() {
      setPressedCodes(NO_KEYS)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    window.addEventListener('blur', releaseAll)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
      window.removeEventListener('blur', releaseAll)
    }
  }, [layout, textareaRef, onInsert, onBackspace])

  const shiftHeld = pressedCodes.has('ShiftLeft') || pressedCodes.has('ShiftRight')
  return { pressedCodes, shiftHeld }
}
