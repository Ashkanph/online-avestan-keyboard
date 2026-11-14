import { useRef } from 'react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import { InstallIcon } from '../icons/icons'
import './InstallButton.css'

const LABEL = 'Add to home screen'

export function InstallButton() {
  const { canPrompt, needsManualInstall, promptInstall } = useInstallPrompt()
  const dialogRef = useRef<HTMLDialogElement>(null)

  if (!canPrompt && !needsManualInstall) return null

  return (
    <>
      <button
        type="button"
        className="icon-button"
        onClick={() => (canPrompt ? void promptInstall() : dialogRef.current?.showModal())}
        aria-label={LABEL}
        title={LABEL}
      >
        <InstallIcon />
      </button>
      {needsManualInstall && (
        <dialog ref={dialogRef} className="install-dialog">
          <form method="dialog">
            <h2 className="install-dialog__title">{LABEL}</h2>
            <p>
              In Safari, tap the <strong>Share</strong> button, then choose{' '}
              <strong>Add to Home Screen</strong>. The app will then work without an internet
              connection.
            </p>
            <button type="submit" className="install-dialog__close">
              OK
            </button>
          </form>
        </dialog>
      )}
    </>
  )
}
