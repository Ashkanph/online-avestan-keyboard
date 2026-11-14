export type LanguageId = 'ae' | 'fa' | 'en'

/** A key's characters: `[normal, with Shift]`. */
export type KeyChars = readonly [string, string]

export interface Layout {
  id: LanguageId
  name: string
  dir: 'ltr' | 'rtl'
  placeholder: string
  /** Characters by `KeyboardEvent.code`, so typing is independent of the OS keyboard layout. */
  keys: Record<string, KeyChars>
  /** Key codes for the three letter rows of the phone layout. */
  compactRows: readonly (readonly string[])[]
  /** Number of equal-width columns in the phone layout. */
  compactColumns: number
  /** The two character keys either side of the phone space bar. */
  compactBottom: readonly [string, string]
  lettersLabel: string
  symbolsLabel: string
  /** Symbol pages of the phone layout. Each page has three rows of characters. */
  symbolPages: readonly (readonly (readonly string[])[])[]
}

const AVESTAN_LETTERS = {
  A: '\u{10B00}',
  AA: '\u{10B01}',
  AO: '\u{10B02}',
  AAO: '\u{10B03}',
  AN: '\u{10B04}',
  AAN: '\u{10B05}',
  AE: '\u{10B06}',
  AEE: '\u{10B07}',
  E: '\u{10B08}',
  EE: '\u{10B09}',
  O: '\u{10B0A}',
  OO: '\u{10B0B}',
  I: '\u{10B0C}',
  II: '\u{10B0D}',
  U: '\u{10B0E}',
  UU: '\u{10B0F}',
  KE: '\u{10B10}',
  XE: '\u{10B11}',
  XYE: '\u{10B12}',
  XVE: '\u{10B13}',
  GE: '\u{10B14}',
  GGE: '\u{10B15}',
  GHE: '\u{10B16}',
  CE: '\u{10B17}',
  JE: '\u{10B18}',
  TE: '\u{10B19}',
  THE: '\u{10B1A}',
  DE: '\u{10B1B}',
  DHE: '\u{10B1C}',
  TTE: '\u{10B1D}',
  PE: '\u{10B1E}',
  FE: '\u{10B1F}',
  BE: '\u{10B20}',
  BHE: '\u{10B21}',
  NGE: '\u{10B22}',
  NGYE: '\u{10B23}',
  NGVE: '\u{10B24}',
  NE: '\u{10B25}',
  NYE: '\u{10B26}',
  NNE: '\u{10B27}',
  ME: '\u{10B28}',
  HME: '\u{10B29}',
  YYE: '\u{10B2A}',
  YE: '\u{10B2B}',
  VE: '\u{10B2C}',
  RE: '\u{10B2D}',
  LE: '\u{10B2E}',
  SE: '\u{10B2F}',
  ZE: '\u{10B30}',
  SHE: '\u{10B31}',
  ZHE: '\u{10B32}',
  SHYE: '\u{10B33}',
  SSHE: '\u{10B34}',
  HE: '\u{10B35}',
} as const

const AVESTAN_PUNCTUATION = {
  'Avestan abbreviation mark': '\u{10B39}',
  'Tiny two dots over one dot punctuation': '\u{10B3A}',
  'Small two dots over one dot punctuation': '\u{10B3B}',
  'Large two dots over one dot punctuation': '\u{10B3C}',
  'Large one dot over two dots punctuation': '\u{10B3D}',
  'Large two rings over one ring punctuation': '\u{10B3E}',
  'Large one ring over two rings punctuation': '\u{10B3F}',
} as const

// Not part of the Avestan block, but the chart cross-references them for Avestan word division.
const WORD_SEPARATOR_MIDDLE_DOT = '⸱'
const RING_POINT = '⸰'

const ZWNJ = '‌'
const ZWJ = '‍'

const CHAR_NAMES = new Map<string, string>([
  ...Object.entries(AVESTAN_LETTERS).map(
    ([name, char]) => [char, `Avestan letter ${name}`] as const,
  ),
  ...Object.entries(AVESTAN_PUNCTUATION).map(([name, char]) => [char, name] as const),
  [WORD_SEPARATOR_MIDDLE_DOT, 'Word separator middle dot'],
  [RING_POINT, 'Ring point'],
  [ZWNJ, 'Zero-width non-joiner'],
  [ZWJ, 'Zero-width joiner'],
  [' ', 'Space'],
])

export function describeChar(char: string): string {
  return CHAR_NAMES.get(char) ?? char
}

// Combining diacritics and Arabic-script marks. Spelled out instead of /\p{M}/u, which is a syntax
// error before Firefox 78 and would stop the whole app from loading there.
const COMBINING_MARK =
  /^[\u0300-\u036F\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06E4\u06E7\u06E8\u06EA-\u06ED]$/

/** What to draw on a key for a character that has no visible shape of its own. */
export function keyLabel(char: string): string {
  if (char === ZWNJ) return 'ZWNJ'
  if (char === ZWJ) return 'ZWJ'
  return COMBINING_MARK.test(char) ? `◌${char}` : char
}

const ENGLISH_NON_LETTERS: Record<string, KeyChars> = {
  Backquote: ['`', '~'],
  Digit1: ['1', '!'],
  Digit2: ['2', '@'],
  Digit3: ['3', '#'],
  Digit4: ['4', '$'],
  Digit5: ['5', '%'],
  Digit6: ['6', '^'],
  Digit7: ['7', '&'],
  Digit8: ['8', '*'],
  Digit9: ['9', '('],
  Digit0: ['0', ')'],
  Minus: ['-', '_'],
  Equal: ['=', '+'],
  BracketLeft: ['[', '{'],
  BracketRight: [']', '}'],
  Backslash: ['\\', '|'],
  Semicolon: [';', ':'],
  Quote: ["'", '"'],
  Comma: [',', '<'],
  Period: ['.', '>'],
  Slash: ['/', '?'],
  Space: [' ', ' '],
}

const QWERTY_TOP = 'QWERTYUIOP'
const QWERTY_MIDDLE = 'ASDFGHJKL'
const QWERTY_BOTTOM = 'ZXCVBNM'
const letterCodes = (letters: string) => Array.from(letters, (letter) => `Key${letter}`)

const englishLetters = Object.fromEntries(
  Array.from(QWERTY_TOP + QWERTY_MIDDLE + QWERTY_BOTTOM, (letter) => [
    `Key${letter}`,
    [letter.toLowerCase(), letter] as const,
  ]),
)

const L = AVESTAN_LETTERS
const P = AVESTAN_PUNCTUATION

const SYMBOLS_PAGE_2 = [Array.from('~`|•√π÷×§∆'), Array.from('£¥€¢^°={}\\'), Array.from('%©®™✓[]')]

export const LAYOUTS: Record<LanguageId, Layout> = {
  ae: {
    id: 'ae',
    name: 'Avestan',
    dir: 'rtl',
    placeholder: '𐬀𐬉𐬎𐬎𐬋 ⸱ 𐬞𐬀𐬧𐬙𐬃 ⸱ 𐬫𐬋 ⸱ 𐬀𐬴𐬀𐬵𐬈 ⸱',
    keys: {
      ...ENGLISH_NON_LETTERS,
      Digit1: ['1', RING_POINT],

      KeyQ: [L.AO, L.AAO],
      KeyW: [L.AN, L.AAN],
      KeyE: [L.E, L.EE],
      KeyR: [L.RE, P['Large one ring over two rings punctuation']],
      KeyT: [L.TE, L.THE],
      KeyY: [L.YE, L.YYE],
      KeyU: [L.U, L.UU],
      KeyI: [L.I, L.II],
      KeyO: [L.O, L.OO],
      KeyP: [L.PE, P['Large two rings over one ring punctuation']],
      BracketLeft: [L.AE, L.AEE],

      KeyA: [L.A, L.AA],
      KeyS: [L.SE, L.SHE],
      KeyD: [L.DE, L.DHE],
      KeyF: [L.FE, P['Large one dot over two dots punctuation']],
      KeyG: [L.GE, L.GGE],
      KeyH: [L.HE, L.GHE],
      KeyJ: [L.JE, P['Tiny two dots over one dot punctuation']],
      KeyK: [L.KE, P['Small two dots over one dot punctuation']],
      KeyL: [L.LE, P['Large two dots over one dot punctuation']],
      Semicolon: [L.NGE, L.NGYE],
      Quote: [L.NGVE, L.TTE],

      KeyZ: [L.ZE, L.ZHE],
      KeyX: [L.XE, L.XYE],
      KeyC: [L.CE, P['Avestan abbreviation mark']],
      KeyV: [L.VE, L.XVE],
      KeyB: [L.BE, L.BHE],
      KeyN: [L.NE, L.NNE],
      KeyM: [L.ME, L.HME],
      Comma: [L.NYE, WORD_SEPARATOR_MIDDLE_DOT],
      Period: [L.SHYE, L.SSHE],
    },
    compactRows: [
      [...letterCodes(QWERTY_TOP), 'BracketLeft'],
      [...letterCodes(QWERTY_MIDDLE), 'Semicolon', 'Quote'],
      [...letterCodes(QWERTY_BOTTOM), 'Comma', 'Period'],
    ],
    compactColumns: 11,
    compactBottom: [WORD_SEPARATOR_MIDDLE_DOT, P['Large two dots over one dot punctuation']],
    lettersLabel: `${L.A}${L.BE}${L.GE}`,
    symbolsLabel: '?123',
    symbolPages: [
      [
        Array.from('1234567890'),
        [...Object.values(P), WORD_SEPARATOR_MIDDLE_DOT, RING_POINT, '-'],
        Array.from('*"\':;!?'),
      ],
      SYMBOLS_PAGE_2,
    ],
  },

  // ISIRI 9147, the standard Persian keyboard layout.
  fa: {
    id: 'fa',
    name: 'فارسی',
    dir: 'rtl',
    placeholder: 'اینجا بنویسید',
    keys: {
      Backquote: [ZWJ, '÷'],
      Digit1: ['۱', '!'],
      Digit2: ['۲', '٬'],
      Digit3: ['۳', '٫'],
      Digit4: ['۴', '﷼'],
      Digit5: ['۵', '٪'],
      Digit6: ['۶', '×'],
      Digit7: ['۷', '،'],
      Digit8: ['۸', '*'],
      Digit9: ['۹', ')'],
      Digit0: ['۰', '('],
      Minus: ['-', 'ـ'],
      Equal: ['=', '+'],

      KeyQ: ['ض', 'ْ'],
      KeyW: ['ص', 'ٌ'],
      KeyE: ['ث', 'ٍ'],
      KeyR: ['ق', 'ً'],
      KeyT: ['ف', 'ُ'],
      KeyY: ['غ', 'ِ'],
      KeyU: ['ع', 'َ'],
      KeyI: ['ه', 'ّ'],
      KeyO: ['خ', ']'],
      KeyP: ['ح', '['],
      BracketLeft: ['ج', '}'],
      BracketRight: ['چ', '{'],
      Backslash: ['\\', '|'],

      KeyA: ['ش', 'ؤ'],
      KeyS: ['س', 'ئ'],
      KeyD: ['ی', 'ي'],
      KeyF: ['ب', 'إ'],
      KeyG: ['ل', 'أ'],
      KeyH: ['ا', 'آ'],
      KeyJ: ['ت', 'ة'],
      KeyK: ['ن', '»'],
      KeyL: ['م', '«'],
      Semicolon: ['ک', ':'],
      Quote: ['گ', '؛'],

      KeyZ: ['ظ', 'ك'],
      KeyX: ['ط', 'ٓ'],
      KeyC: ['ز', 'ژ'],
      KeyV: ['ر', 'ٰ'],
      KeyB: ['ذ', ZWNJ],
      KeyN: ['د', 'ٔ'],
      KeyM: ['پ', 'ء'],
      Comma: ['و', '>'],
      Period: ['.', '<'],
      Slash: ['/', '؟'],
      Space: [' ', ZWNJ],
    },
    compactRows: [
      [...letterCodes(QWERTY_TOP), 'BracketLeft'],
      [...letterCodes(QWERTY_MIDDLE), 'Semicolon', 'Quote'],
      [...letterCodes(QWERTY_BOTTOM), 'Comma', 'BracketRight'],
    ],
    compactColumns: 11,
    compactBottom: ['،', '.'],
    lettersLabel: 'ابپ',
    symbolsLabel: '؟۱۲۳',
    symbolPages: [
      [Array.from('۱۲۳۴۵۶۷۸۹۰'), Array.from('@#﷼_&-+()/'), Array.from('*«»:؛!؟')],
      SYMBOLS_PAGE_2,
    ],
  },

  en: {
    id: 'en',
    name: 'English',
    dir: 'ltr',
    placeholder: 'Start typing…',
    keys: { ...ENGLISH_NON_LETTERS, ...englishLetters },
    compactRows: [letterCodes(QWERTY_TOP), letterCodes(QWERTY_MIDDLE), letterCodes(QWERTY_BOTTOM)],
    compactColumns: 10,
    compactBottom: [',', '.'],
    lettersLabel: 'ABC',
    symbolsLabel: '?123',
    symbolPages: [
      [Array.from('1234567890'), Array.from('@#$_&-+()/'), Array.from('*"\':;!?')],
      SYMBOLS_PAGE_2,
    ],
  },
}

/** Avestan comes first because it is the default keyboard. */
export const LANGUAGE_ORDER: readonly LanguageId[] = ['ae', 'fa', 'en']

export const DEFAULT_LANGUAGE: LanguageId = 'ae'

/** Key codes of the full-size keyboard. Codes without characters are function keys. */
export const DESKTOP_ROWS: readonly (readonly string[])[] = [
  [
    'Backquote',
    'Digit1',
    'Digit2',
    'Digit3',
    'Digit4',
    'Digit5',
    'Digit6',
    'Digit7',
    'Digit8',
    'Digit9',
    'Digit0',
    'Minus',
    'Equal',
    'Backspace',
  ],
  ['Tab', ...letterCodes(QWERTY_TOP), 'BracketLeft', 'BracketRight', 'Backslash'],
  ['CapsLock', ...letterCodes(QWERTY_MIDDLE), 'Semicolon', 'Quote', 'Enter'],
  ['ShiftLeft', ...letterCodes(QWERTY_BOTTOM), 'Comma', 'Period', 'Slash', 'ShiftRight'],
  ['Language', 'Space'],
]

export function charsFor(layout: Layout, code: string, shifted: boolean): string | undefined {
  return layout.keys[code]?.[shifted ? 1 : 0]
}

/** English letters only differ by case, so their Shift variant is not worth showing on the key. */
export function isEnglishLetter(layout: Layout, code: string): boolean {
  return layout.id === 'en' && code.startsWith('Key')
}

/** Digit shown on, and typed by long-pressing, an English top-row key, as on phone keyboards. */
export function englishTopRowDigit(code: string): string | undefined {
  const index = letterCodes(QWERTY_TOP).indexOf(code)
  return index < 0 ? undefined : String((index + 1) % 10)
}
