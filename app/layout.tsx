import { orbitron } from '@/fonts';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';

import GoogleAnalytics from '@/analytics/googleAnalytics';
import QueryProvider from '@/providers/query.provider';

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
