import { useRef, useState } from 'react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import { InstallIcon } from '../icons/icons'
import './InstallButton.css'

const LABEL = 'Add to home screen'

// Safari before 15.4 has no <dialog>. There the element is shown and hidden through its `open`
// attribute instead, and InstallButton.css positions it.
const HAS_DIALOG = typeof HTMLDialogElement === 'function'

export function InstallButton() {
  const { canPrompt, needsManualInstall, promptInstall } = useInstallPrompt()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [fallbackOpen, setFallbackOpen] = useState(false)

  if (!canPrompt && !needsManualInstall) return null

  function openDialog() {
    if (HAS_DIALOG) dialogRef.current?.showModal()
    else setFallbackOpen(true)
  }

  function closeDialog() {
    if (HAS_DIALOG) dialogRef.current?.close()
    else setFallbackOpen(false)
  }

  return (
    <>
      <button
        type="button"
        className="icon-button"
        onClick={() => (canPrompt ? void promptInstall() : openDialog())}
        aria-label={LABEL}
        title={LABEL}
      >
        <InstallIcon />
      </button>
      {needsManualInstall && (
        <dialog
          ref={dialogRef}
          className="install-dialog"
          data-fallback={HAS_DIALOG ? undefined : true}
          open={HAS_DIALOG ? undefined : fallbackOpen}
          aria-labelledby="install-dialog-title"
        >
          <h2 id="install-dialog-title" className="install-dialog__title">
            {LABEL}
          </h2>
          <p>
            In Safari, tap the <strong>Share</strong> button, then choose{' '}
            <strong>Add to Home Screen</strong>. The app will then work without an internet
            connection.
          </p>
          {/* A plain button rather than <form method="dialog">: without <dialog> support that form
              would submit as a page load and lose the typed text. */}
          <button type="button" className="install-dialog__close" onClick={closeDialog}>
            OK
          </button>
        </dialog>
      )}
    </>
  )
}
