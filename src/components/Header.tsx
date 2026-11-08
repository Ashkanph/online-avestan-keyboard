import type { Theme } from '../hooks/useTheme'
import { GitHubIcon, MoonIcon, SunIcon } from './icons'

const REPOSITORY_URL = 'https://github.com/Ashkanph/online-avestan-keyboard'

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'

  return (
    <header className="header">
      <h1 className="header__title">Avestan online keyboard</h1>
      <div className="header__actions">
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
