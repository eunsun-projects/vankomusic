import { Knewave, Lobster, Orbitron, Righteous, Silkscreen, Vast_Shadow } from 'next/font/google'
import './globals.css'
import AuthContext from '@/context/AuthContext'
import { Analytics } from '@vercel/analytics/react'
import GoogleAnalytics from './googleAnalytics'

export const knewave = Knewave({ weight:['400'], subsets: ['latin'], display:'swap' });
export const lobster = Lobster({ weight:['400'], subsets: ['latin'], display:'swap' });
export const orbitron = Orbitron({ weight:['400'], subsets: ['latin'], display:'swap' });
export const righteous = Righteous({ weight:['400'], subsets: ['latin'], display:'swap' });
export const silkscreen = Silkscreen({ weight:['400', '700'], subsets: ['latin'], display:'swap' });
export const vastshadow = Vast_Shadow({ weight:['400'], subsets: ['latin'], display:'swap', variable: '--font-vast' });

export default function RootLayout({ children }) {
  return (
    <html lang="kr" className={`${orbitron.className}`}>
      <body>
        <AuthContext>
          {children}
        </AuthContext>
        <Analytics/>
        <GoogleAnalytics/>
      </body>
    </html>
  )
}
