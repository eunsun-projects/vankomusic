import AuthContext from "@/context/AuthContext";
import { orbitron } from "@/fonts";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

import GoogleAnalytics from "./googleAnalytics";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="kr" className={`${orbitron.className}`}>
      <body>
        <AuthContext>{children}</AuthContext>
        <Analytics />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
