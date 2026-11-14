import { useState, type CSSProperties } from 'react'
import {
  charsFor,
  describeChar,
  englishTopRowDigit,
  keyLabel,
  type Layout,
} from '../../data/layouts'
import { useVirtualShift } from '../../hooks/useVirtualShift'
import { BackspaceIcon, EnterIcon, GlobeIcon, ShiftIcon } from '../icons/icons'
import { Key, type Alternate } from '../Key/Key'
import './CompactKeyboard.css'

const SYMBOLS_COLUMNS = 10

interface CompactKeyboardProps {
  layout: Layout
  shiftHeld: boolean
  onInsert: (text: string) => void
  onBackspace: () => void
  onNextLanguage: () => void
}

/** Phone keyboard: letter rows, a `?123` symbols mode, long-press alternates and key previews. */
export function CompactKeyboard({
  layout,
  shiftHeld,
  onInsert,
  onBackspace,
  onNextLanguage,
}: CompactKeyboardProps) {
  const shift = useVirtualShift()
  const [symbolPage, setSymbolPage] = useState<number | null>(null)
  const shifted = (shift.mode !== 'off') !== shiftHeld

  function type(text: string) {
    onInsert(text)
    shift.consume()
  }

  function alternateFor(code: string): Alternate | undefined {
    const text = layout.id === 'en' ? englishTopRowDigit(code) : charsFor(layout, code, !shifted)
    if (text === undefined) return undefined
    return { label: keyLabel(text), onPress: () => type(text) }
  }

  const backspaceKey = (
    <Key
      kind="function"
      label={<BackspaceIcon />}
      ariaLabel="Backspace"
      onPress={onBackspace}
      repeats
      haptic
    />
  )

  function renderCharKey(text: string, alternate?: Alternate) {
    return (
      <Key
        key={text}
        label={keyLabel(text)}
        ariaLabel={describeChar(text)}
        hint={alternate?.label}
        alternate={alternate}
        onPress={() => type(text)}
        preview
        haptic
      />
    )
  }

  const inSymbols = symbolPage !== null
  const nextSymbolPage = symbolPage === 0 ? 1 : 0

  return (
    <>
      <div
        className="kb-rows"
        style={
          { '--columns': inSymbols ? SYMBOLS_COLUMNS : layout.compactColumns } as CSSProperties
        }
      >
        {inSymbols
          ? layout.symbolPages[symbolPage].map((row, rowIndex, rows) => (
              <div className="kb-row" key={rowIndex}>
                {rowIndex === rows.length - 1 && (
                  <Key
                    kind="function"
                    label={symbolPage === 0 ? '=\\<' : layout.symbolsLabel}
                    ariaLabel="More symbols"
                    onPress={() => setSymbolPage(nextSymbolPage)}
                  />
                )}
                {row.map((text) => renderCharKey(text))}
                {rowIndex === rows.length - 1 && backspaceKey}
              </div>
            ))
          : layout.compactRows.map((codes, rowIndex) => (
              <div className="kb-row" key={codes[0]}>
                {rowIndex === 2 && (
                  <Key
                    kind="function"
                    label={
                      <ShiftIcon filled={shift.mode !== 'off'} locked={shift.mode === 'locked'} />
                    }
                    ariaLabel="Shift"
                    onPress={shift.tap}
                    active={shift.mode !== 'off'}
                  />
                )}
                {codes.map((code) => {
                  const text = charsFor(layout, code, shifted)
                  return text === undefined ? null : renderCharKey(text, alternateFor(code))
                })}
                {rowIndex === 2 && backspaceKey}
              </div>
            ))}
      </div>

      <div className="kb-row kb-row--bottom">
        <Key
          kind="function"
          label={inSymbols ? layout.lettersLabel : layout.symbolsLabel}
          ariaLabel={inSymbols ? 'Letters' : 'Symbols'}
          onPress={() => setSymbolPage(inSymbols ? null : 0)}
          grow={1.5}
        />
        {renderCharKey(layout.compactBottom[0])}
        <Key
          kind="function"
          label={<GlobeIcon />}
          ariaLabel={`Change language, current: ${layout.name}`}
          onPress={onNextLanguage}
          haptic
        />
        <Key
          kind="space"
          label={layout.name}
          ariaLabel="Space"
          onPress={() => type(' ')}
          grow={4.5}
          haptic
        />
        {renderCharKey(layout.compactBottom[1])}
        <Key
          kind="accent"
          label={<EnterIcon />}
          ariaLabel="Enter"
          onPress={() => type('\n')}
          grow={1.5}
          haptic
        />
      </div>
    </>
  )
}
