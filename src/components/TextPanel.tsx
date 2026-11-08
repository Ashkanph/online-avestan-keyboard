import { useEffect, useRef, useState, type RefObject } from 'react'
import { AVESTAN_FONTS } from '../data/fonts'
import type { Layout } from '../data/layouts'
import { copyTextareaContent } from '../lib/clipboard'
import { CheckIcon, CopyIcon } from './icons'

const COPY_STATUS_MS = 1800

const COPY_LABELS = { idle: 'Copy', copied: 'Copied', failed: 'Copy failed' } as const

interface TextPanelProps {
  layout: Layout
  text: string
  textareaRef: RefObject<HTMLTextAreaElement | null>
  onTextChange: (text: string) => void
  fontId: string
  onFontChange: (id: string) => void
}

export function TextPanel({
  layout,
  text,
  textareaRef,
  onTextChange,
  fontId,
  onFontChange,
}: TextPanelProps) {
  const [copyStatus, setCopyStatus] = useState<keyof typeof COPY_LABELS>('idle')
  const resetTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(resetTimer.current), [])

  async function handleCopy() {
    const textarea = textareaRef.current
    if (!textarea) return
    const copied = await copyTextareaContent(textarea)
    setCopyStatus(copied ? 'copied' : 'failed')
    window.clearTimeout(resetTimer.current)
    resetTimer.current = window.setTimeout(() => setCopyStatus('idle'), COPY_STATUS_MS)
  }

  return (
    <section className="text-panel">
      {/* inputMode="none" keeps the phone's own keyboard closed but leaves the caret usable. */}
      <textarea
        ref={textareaRef}
        className="text-panel__input"
        value={text}
        onChange={(event) => onTextChange(event.target.value)}
        dir={layout.dir}
        lang={layout.id}
        placeholder={layout.placeholder}
        inputMode="none"
        aria-label="Typed text"
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        autoFocus
      />
      <div className="text-panel__toolbar">
        <label className="font-picker">
          <span>Avestan font</span>
          <select value={fontId} onChange={(event) => onFontChange(event.target.value)}>
            {AVESTAN_FONTS.map((font) => (
              <option key={font.id} value={font.id}>
                {font.label}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="copy-button"
          onClick={handleCopy}
          onMouseDown={(event) => event.preventDefault()}
          disabled={text === ''}
        >
          {copyStatus === 'copied' ? <CheckIcon /> : <CopyIcon />}
          <span aria-live="polite">{COPY_LABELS[copyStatus]}</span>
        </button>
      </div>
    </section>
  )
}
