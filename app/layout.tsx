import { orbitron } from '@/fonts';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

import QueryProvider from '@/providers/query.provider';
import GoogleAnalytics from './googleAnalytics';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="kr" className={`${orbitron.className}`}>
      <body>
        <QueryProvider>{children}</QueryProvider>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
