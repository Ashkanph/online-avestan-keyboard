import { useEffect, useRef, type ReactNode } from 'react'
import './Dialog.css'

// Safari before 15.4 has no <dialog>. There the element is shown and hidden through its `open`
// attribute instead, and Dialog.css positions it.
const HAS_DIALOG = typeof HTMLDialogElement === 'function'

interface DialogProps {
  open: boolean
  onClose: () => void
  /** The id of the element that names the dialog, usually its heading. */
  labelledBy: string
  className?: string
  children: ReactNode
}

/**
 * A modal dialog that closes on Escape and on a click outside its panel. Close buttons inside it
 * should be plain buttons that call `onClose`, not `<form method="dialog">`: without <dialog>
 * support that form would submit as a page load and lose the typed text.
 */
export function Dialog({ open, onClose, labelledBy, className, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!HAS_DIALOG || !dialog) return
    if (open && !dialog.open) dialog.showModal()
    else if (!open && dialog.open) dialog.close()
  }, [open])

  // A native modal dialog closes itself on Escape and reports it through `onClose`.
  useEffect(() => {
    if (HAS_DIALOG || !open) return
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, onClose])

  return (
    <dialog
      ref={dialogRef}
      className={className ? `dialog ${className}` : 'dialog'}
      data-fallback={HAS_DIALOG ? undefined : true}
      open={HAS_DIALOG ? undefined : open}
      aria-labelledby={labelledBy}
      onClose={onClose}
      // The panel fills the dialog, so a click that lands on the dialog itself is on the backdrop.
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <div className="dialog__panel">{children}</div>
    </dialog>
  )
}
