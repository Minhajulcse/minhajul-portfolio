import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'

function ThemeIcon({ dark }: { dark: boolean }) {
  return dark ? (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="3.5" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  ) : (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20.5 15.5A8 8 0 0 1 8.5 3.5a8.4 8.4 0 1 0 12 12Z" />
    </svg>
  )
}

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')

  useEffect(() => {
    const saved = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const nextTheme = saved === 'dark' || (!saved && prefersDark) ? 'dark' : 'light'
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    setTheme(nextTheme)
  }, [])

  const toggle = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', nextTheme === 'dark')
    localStorage.setItem('theme', nextTheme)
    setTheme(nextTheme)
  }

  return (
    <div data-theme={theme}>
      <button
        onClick={toggle}
        aria-label="Toggle color theme"
        className="theme-toggle"
      >
        <ThemeIcon dark={theme === 'dark'} />
      </button>
      <Component {...pageProps} />
      <style jsx global>{`
        .theme-toggle {
          position: fixed;
          right: 16px;
          bottom: 16px;
          z-index: 60;
          width: 42px;
          height: 42px;
          border-radius: 14px;
          border: 1px solid var(--line);
          background: var(--surface-strong);
          color: var(--text);
          box-shadow: var(--shadow);
          cursor: pointer;
          font-size: 17px;
          transition: transform .18s ease, background .18s ease;
        }
        .theme-toggle:hover { transform: translateY(-2px); }
      `}</style>
    </div>
  )
}
