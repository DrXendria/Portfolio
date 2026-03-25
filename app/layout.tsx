import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import CustomCursor from '@/components/ui/CustomCursor'
import { LocaleProvider } from './providers'
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
export const metadata: Metadata = {
  title: {
    default: 'Emir Cica',
    template: '%s | Emir Cica',
  },
  description: 'Emir Cica Portfolio — Cybersecurity Enthusiast and Web Developer',
  keywords: ['developer', 'portfolio', 'fullstack', 'web', 'cybersecurity'],
  icons: {
    icon: [{ url: "/icon.png", sizes: "48x48" }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body>
        <LocaleProvider>
          <CustomCursor />
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#030e1a',
                color: '#e8f4f8',
                border: '1px solid rgba(0,212,255,0.3)',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '12px',
              },
            }}
          />
          <Analytics />
          <SpeedInsights />
        </LocaleProvider>
      </body>
    </html>
  )
}