export async function copyTextareaContent(el: HTMLTextAreaElement): Promise<boolean> {
  // navigator.clipboard only exists on secure origins, which excludes testing a phone over LAN.
  if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(el.value)
      return true
    } catch {
      // Fall through to the legacy path.
    }
  }

  const { selectionStart, selectionEnd } = el
  el.select()
  const copied = document.execCommand('copy')
  el.setSelectionRange(selectionStart, selectionEnd)
  return copied
}
