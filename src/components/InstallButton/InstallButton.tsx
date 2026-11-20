import { useCallback, useState } from 'react'
import { useInstallPrompt } from '../../hooks/useInstallPrompt'
import { Dialog } from '../Dialog/Dialog'
import { InstallIcon } from '../icons/icons'
import './InstallButton.css'

const LABEL = 'Add to home screen'

export function InstallButton() {
  const { canPrompt, needsManualInstall, promptInstall } = useInstallPrompt()
  const [dialogOpen, setDialogOpen] = useState(false)
  const closeDialog = useCallback(() => setDialogOpen(false), [])

  if (!canPrompt && !needsManualInstall) return null

  return (
    <>
      <button
        type="button"
        className="icon-button"
        onClick={() => (canPrompt ? void promptInstall() : setDialogOpen(true))}
        aria-label={LABEL}
        title={LABEL}
      >
        <InstallIcon />
      </button>
      {needsManualInstall && (
        <Dialog
          open={dialogOpen}
          onClose={closeDialog}
          labelledBy="install-dialog-title"
          className="install-dialog"
        >
          <h2 id="install-dialog-title" className="dialog__title">
            {LABEL}
          </h2>
          <p>
            In Safari, tap the <strong>Share</strong> button, then choose{' '}
            <strong>Add to Home Screen</strong>. The app will then work without an internet
            connection.
          </p>
          <button type="button" className="dialog__button" onClick={closeDialog}>
            OK
          </button>
        </Dialog>
      )}
    </>
  )
}
