import { useRef, useState } from 'react'

export type ShiftMode = 'off' | 'once' | 'locked'

const DOUBLE_TAP_MS = 320

/** On-screen Shift: one tap applies to the next character, a double tap locks it. */
export function useVirtualShift() {
  const [mode, setMode] = useState<ShiftMode>('off')
  const lastTap = useRef(0)

  function tap() {
    const now = performance.now()
    const isDoubleTap = now - lastTap.current < DOUBLE_TAP_MS
    lastTap.current = now
    setMode((current) => {
      if (current === 'off') return 'once'
      return current === 'once' && isDoubleTap ? 'locked' : 'off'
    })
  }

  function toggleLock() {
    setMode((current) => (current === 'locked' ? 'off' : 'locked'))
  }

  function consume() {
    setMode((current) => (current === 'once' ? 'off' : current))
  }

  return { mode, tap, toggleLock, consume }
}
