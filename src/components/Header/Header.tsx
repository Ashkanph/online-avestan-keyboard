import type { Theme } from '../../hooks/useTheme'
import { AboutButton } from '../AboutButton/AboutButton'
import { InstallButton } from '../InstallButton/InstallButton'
import { GitHubIcon, MoonIcon, SunIcon } from '../icons/icons'
import './Header.css'

const REPOSITORY_URL = 'https://github.com/Ashkanph/online-avestan-keyboard'
/** The logo is the favicon in `public`, so there is a single copy of it. */
const LOGO_URL = `${import.meta.env.BASE_URL}favicon.svg`

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme, compact }: HeaderProps) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <header className="header">
      <div className="header__brand">
        <img className="header__logo" src={LOGO_URL} alt="" width={32} height={32} />
        <h1 className="header__title">
          {compact ? 'Avestan keyboard' : 'Avestan online keyboard'}
        </h1>
      </div>
      <div className="header__actions">
        <AboutButton />
        <InstallButton />
        <a
          className="icon-button"
          href={REPOSITORY_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub repository"
          title="GitHub repository"
        >
          <GitHubIcon />
        </a>
        <button
          type="button"
          className="icon-button"
          onClick={onToggleTheme}
          aria-label={`Switch to ${nextTheme} theme`}
          title={`Switch to ${nextTheme} theme`}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>
    </header>
  )
}
