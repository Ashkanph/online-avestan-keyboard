import { useEffect, useState } from 'react'
import { useMediaQuery } from './useMediaQuery'

// Chromium-only event, so it is missing from TypeScript's DOM types.
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
}

// iPadOS Safari reports itself as a Mac, but Macs have no touch screen.
const IS_IOS =
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1)

// iOS has no install API; its home-screen apps are detected by this non-standard flag.
const IOS_STANDALONE = (navigator as Navigator & { standalone?: boolean }).standalone === true

export function useInstallPrompt() {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(false)
  const standalone = useMediaQuery('(display-mode: standalone)') || IOS_STANDALONE

  useEffect(() => {
    function handlePrompt(event: Event) {
      // Keep the event so the install button can trigger the browser's dialog later.
      event.preventDefault()
      setPromptEvent(event as BeforeInstallPromptEvent)
    }
    function handleInstalled() {
      setInstalled(true)
      setPromptEvent(null)
    }
    window.addEventListener('beforeinstallprompt', handlePrompt)
    window.addEventListener('appinstalled', handleInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt)
      window.removeEventListener('appinstalled', handleInstalled)
    }
  }, [])

  async function promptInstall() {
    if (!promptEvent) return
    await promptEvent.prompt()
    // The event can only be used once.
    setPromptEvent(null)
  }

  return {
    canPrompt: !standalone && !installed && promptEvent !== null,
    needsManualInstall: !standalone && IS_IOS,
    promptInstall,
  }
}
