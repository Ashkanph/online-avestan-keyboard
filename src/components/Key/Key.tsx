import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from 'react'
import './Key.css'

const LONG_PRESS_MS = 380
const REPEAT_DELAY_MS = 400
const REPEAT_INTERVAL_MS = 55
const HAPTIC_MS = 8

export interface Alternate {
  label: string
  onPress: () => void
}

interface KeyProps {
  label: ReactNode
  ariaLabel: string
  onPress: () => void
  kind?: 'char' | 'function' | 'accent' | 'space'
  /** Small legend in the key's corner. */
  hint?: string
  /** Typed instead of the main character when the key is long-pressed. */
  alternate?: Alternate
  /** Fires on press and keeps firing while held, as Backspace does. */
  repeats?: boolean
  /** Shows the phone-style magnified preview above the key while it is held. */
  preview?: boolean
  haptic?: boolean
  highlighted?: boolean
  active?: boolean
  /** Relative width for keys that share spare room in a row. */
  grow?: number
}

export function Key({
  label,
  ariaLabel,
  onPress,
  kind = 'char',
  hint,
  alternate,
  repeats = false,
  preview = false,
  haptic = false,
  highlighted = false,
  active = false,
  grow,
}: KeyProps) {
  const [isDown, setIsDown] = useState(false)
  const [showAlternate, setShowAlternate] = useState(false)
  const activePointer = useRef<number | null>(null)
  const longPressFired = useRef(false)
  const timers = useRef<{ timeout?: number; interval?: number }>({})

  function clearTimers() {
    window.clearTimeout(timers.current.timeout)
    window.clearInterval(timers.current.interval)
  }

  useEffect(() => clearTimers, [])

  function release() {
    clearTimers()
    activePointer.current = null
    setIsDown(false)
    setShowAlternate(false)
  }

  function handlePointerDown(event: PointerEvent<HTMLButtonElement>) {
    if (activePointer.current !== null || event.button !== 0) return
    activePointer.current = event.pointerId
    event.currentTarget.setPointerCapture(event.pointerId)
    longPressFired.current = false
    setIsDown(true)
    if (haptic) navigator.vibrate?.(HAPTIC_MS)

    if (repeats) {
      onPress()
      timers.current.timeout = window.setTimeout(() => {
        timers.current.interval = window.setInterval(onPress, REPEAT_INTERVAL_MS)
      }, REPEAT_DELAY_MS)
    } else if (alternate) {
      timers.current.timeout = window.setTimeout(() => {
        longPressFired.current = true
        setShowAlternate(true)
      }, LONG_PRESS_MS)
    }
  }

  function handlePointerUp(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerId !== activePointer.current) return
    release()
    if (repeats) return
    if (longPressFired.current && alternate) alternate.onPress()
    else onPress()
  }

  function handlePointerCancel(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerId === activePointer.current) release()
  }

  return (
    <button
      type="button"
      className="key"
      data-kind={kind}
      data-down={isDown || highlighted || undefined}
      data-active={active || undefined}
      style={grow === undefined ? undefined : { flexGrow: grow }}
      aria-label={ariaLabel}
      title={preview ? undefined : ariaLabel}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      // Pointer input is handled above; detail 0 means the button was activated from the keyboard.
      onClick={(event) => {
        if (event.detail === 0) onPress()
      }}
    >
      <span className="key__face">
        <span className="key__label">{label}</span>
        {hint && <span className="key__hint">{hint}</span>}
      </span>
      {preview && isDown && (
        <span className="key__preview" data-alternate={showAlternate || undefined}>
          {showAlternate && alternate ? alternate.label : label}
        </span>
      )}
    </button>
  )
}
