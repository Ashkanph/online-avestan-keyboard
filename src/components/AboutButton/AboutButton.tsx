import { useCallback, useState } from 'react'
import { ABOUT_TEXTS } from '../../data/about'
import { Dialog } from '../Dialog/Dialog'
import { CloseIcon, HelpIcon } from '../icons/icons'
import './AboutButton.css'

const LABEL = 'About the Avestan language'
/** The same text as a static page, built from about/index.html. */
const ABOUT_PAGE_URL = `${import.meta.env.BASE_URL}about/`

export function AboutButton() {
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <>
      <button
        type="button"
        className="icon-button about-button"
        onClick={() => setOpen(true)}
        aria-label={LABEL}
        title={LABEL}
      >
        <HelpIcon />
      </button>
      <Dialog open={open} onClose={close} labelledBy="about-dialog-title" className="about-dialog">
        <div className="about-dialog__header">
          <h2 id="about-dialog-title" className="dialog__title">
            Avestan · اوستایی
          </h2>
          <button type="button" className="icon-button" onClick={close} aria-label="Close">
            <CloseIcon />
          </button>
        </div>
        {ABOUT_TEXTS.map((text) => (
          <article key={text.lang} className="about-dialog__text" lang={text.lang} dir={text.dir}>
            {text.sections.map((section) => (
              <section key={section.heading}>
                <h3 className="about-dialog__heading">{section.heading}</h3>
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph} className="about-dialog__paragraph">
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </article>
        ))}
        {/* A new tab, because leaving this page would lose the typed text. */}
        <a className="about-dialog__page-link" href={ABOUT_PAGE_URL} target="_blank" rel="noopener">
          Open as a page · نمایش در صفحهٔ جدا
        </a>
      </Dialog>
    </>
  )
}
