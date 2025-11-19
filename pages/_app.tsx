import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const [theme, setTheme] = useState<'light'|'dark'>('light')
  useEffect(() => {
    const saved = localStorage.getItem('theme')
    if (saved === 'dark') {
      document.documentElement.classList.add('dark')
      setTheme('dark')
    }
  }, [])
  const toggle = () => {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
      setTheme('light')
    } else {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
      setTheme('dark')
    }
  }
  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div style={{minHeight: '100vh'}}>
        <button onClick={toggle} style={{position:'fixed', right:12, bottom:12, zIndex:9999}} className="bg-indigo-600 text-white px-3 py-2 rounded-full shadow-lg">Toggle Theme</button>
        <Component {...pageProps} />
      </div>
    </div>
  )
}
