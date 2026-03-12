'use client'
import { createContext, useContext, useState, useEffect } from 'react'

type Locale = 'tr' | 'en'
type LocaleContextType = { locale: Locale; setLocale: (l: Locale) => void }

const LocaleContext = createContext<LocaleContextType>({ locale: 'tr', setLocale: () => {} })

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>('tr')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const value = { locale: mounted ? locale : 'tr', setLocale }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export const useLocale = () => useContext(LocaleContext)