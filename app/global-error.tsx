"use client";
import styles from "@/app/page.module.css";
// import Link from 'next/link'
import { useEffect } from "react";

export const metadata = {
  title: "error :(",
  description: "some error occured!",
  generator: "Next.js",
  applicationName: "Vanko.Live",
  referrer: "origin-when-cross-origin",
  keywords: ["Vanko.Live", "music", "vanko"],
  authors: [{ name: "Vanko" }, { name: "Vanko", url: "https://vanko.live" }],
  creator: "Vanko.Live",
  publisher: "Vanko.Live",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://vanko.live"),
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/",
    },
  },
  openGraph: {
    title: "error :(",
    description: "some error occured!",
    url: "https://vanko.live",
    siteName: "Vanko.Live",
    images: [
      {
        url: "/192vanko.png",
        width: 800,
        height: 600,
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
    },
  },
  icons: {
    icon: "/192vanko.png",
    shortcut: "/192vanko.png",
    apple: "/192vanko.png",
    other: {
      rel: "apple-touch-icon-precomposed",
      url: "/192vanko.png",
    },
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
  viewportFit: "cover",
};

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  const handleError = () => {
    reset();
  };

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className={styles.notfoundbox}>
      <p className={styles.notp}>Error</p>
      <p className={styles.notcon}>알 수 없는 에러가 발생하였습니다.</p>
      {/* <Link href={'/'}><p className={styles.notcon}>← return Home</p></Link> */}
      <p onClick={handleError} className={styles.notcon}>
        ← try again
      </p>
    </div>
  );
}
