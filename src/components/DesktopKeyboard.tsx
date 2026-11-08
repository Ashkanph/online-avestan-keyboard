import type { ReactNode } from 'react'
import {
  charsFor,
  describeChar,
  DESKTOP_ROWS,
  isEnglishLetter,
  keyLabel,
  type Layout,
} from '../data/layouts'
import { useVirtualShift } from '../hooks/useVirtualShift'
import { BackspaceIcon, EnterIcon, GlobeIcon, ShiftIcon, TabIcon } from './icons'
import { Key } from './Key'

const FUNCTION_KEY_GROW: Record<string, number> = {
  Backspace: 2,
  Tab: 1.5,
  Backslash: 1.5,
  CapsLock: 1.8,
  Enter: 2.2,
  ShiftLeft: 2.4,
  ShiftRight: 2.6,
  Language: 2.5,
  Space: 12.5,
}

interface DesktopKeyboardProps {
  layout: Layout
  pressedCodes: ReadonlySet<string>
  shiftHeld: boolean
  onInsert: (text: string) => void
  onBackspace: () => void
  onNextLanguage: () => void
}

export function DesktopKeyboard({
  layout,
  pressedCodes,
  shiftHeld,
  onInsert,
  onBackspace,
  onNextLanguage,
}: DesktopKeyboardProps) {
  const shift = useVirtualShift()
  const shifted = (shift.mode !== 'off') !== shiftHeld

  function renderFunctionKey(code: string, label: ReactNode, ariaLabel: string, press: () => void) {
    return (
      <Key
        key={code}
        kind="function"
        label={label}
        ariaLabel={ariaLabel}
        onPress={press}
        grow={FUNCTION_KEY_GROW[code]}
        highlighted={pressedCodes.has(code)}
      />
    )
  }

  function renderKey(code: string) {
    switch (code) {
      case 'Backspace':
        return (
          <Key
            key={code}
            kind="function"
            label={<BackspaceIcon />}
            ariaLabel="Backspace"
            onPress={onBackspace}
            repeats
            grow={FUNCTION_KEY_GROW[code]}
            highlighted={pressedCodes.has(code)}
          />
        )
      case 'Tab':
        return renderFunctionKey(code, <TabIcon />, 'Tab', () => onInsert('\t'))
      case 'Enter':
        return renderFunctionKey(code, <EnterIcon />, 'Enter', () => onInsert('\n'))
      case 'CapsLock':
        return (
          <Key
            key={code}
            kind="function"
            label="Caps"
            ariaLabel="Caps Lock"
            onPress={shift.toggleLock}
            active={shift.mode === 'locked'}
            grow={FUNCTION_KEY_GROW[code]}
            highlighted={pressedCodes.has(code)}
          />
        )
      case 'ShiftLeft':
      case 'ShiftRight':
        return (
          <Key
            key={code}
            kind="function"
            label={
              <ShiftIcon
                filled={shift.mode !== 'off' || shiftHeld}
                locked={shift.mode === 'locked'}
              />
            }
            ariaLabel="Shift"
            onPress={shift.tap}
            active={shifted}
            grow={FUNCTION_KEY_GROW[code]}
            highlighted={pressedCodes.has(code)}
          />
        )
      case 'Language':
        return renderFunctionKey(
          code,
          <span className="key__language">
            <GlobeIcon /> {layout.name}
          </span>,
          `Change language, current: ${layout.name}`,
          onNextLanguage,
        )
    }

    const text = charsFor(layout, code, shifted)
    if (text === undefined) return null

    const other = charsFor(layout, code, !shifted)
    const showHint = other !== undefined && other !== text && !isEnglishLetter(layout, code)

    return (
      <Key
        key={code}
        kind={code === 'Space' ? 'space' : 'char'}
        label={code === 'Space' ? (shifted ? keyLabel(text) : '') : keyLabel(text)}
        ariaLabel={describeChar(text)}
        hint={showHint && code !== 'Space' ? keyLabel(other) : undefined}
        onPress={() => {
          onInsert(text)
          shift.consume()
        }}
        grow={FUNCTION_KEY_GROW[code]}
        highlighted={pressedCodes.has(code)}
      />
    )
  }

  return (
    <>
      {DESKTOP_ROWS.map((codes) => (
        <div className="kb-row" key={codes[0]}>
          {codes.map(renderKey)}
        </div>
      ))}
    </>
  )
}
