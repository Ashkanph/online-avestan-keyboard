function replaceRange(el: HTMLTextAreaElement, start: number, end: number, text: string): void {
  const caretWasAtEnd = end === el.value.length
  const scrollTop = el.scrollTop

  // Assigning el.value (rather than setRangeText) keeps React's value tracking in sync, so
  // later native edits in the textarea still reach onChange.
  el.value = el.value.slice(0, start) + text + el.value.slice(end)
  const caret = start + text.length
  el.setSelectionRange(caret, caret)
  el.scrollTop = caretWasAtEnd ? el.scrollHeight : scrollTop
}

export function insertAtCaret(el: HTMLTextAreaElement, text: string): void {
  replaceRange(el, el.selectionStart, el.selectionEnd, text)
}

export function deleteBeforeCaret(el: HTMLTextAreaElement): void {
  const { selectionStart: start, selectionEnd: end, value } = el
  if (start !== end) {
    replaceRange(el, start, end, '')
    return
  }
  if (start === 0) return

  // Avestan letters are outside the BMP, so each one is a surrogate pair of two code units.
  const isPair =
    start >= 2 &&
    /[\uDC00-\uDFFF]/.test(value[start - 1]) &&
    /[\uD800-\uDBFF]/.test(value[start - 2])
  replaceRange(el, start - (isPair ? 2 : 1), start, '')
}
