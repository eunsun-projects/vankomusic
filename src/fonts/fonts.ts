import { Knewave, Lobster, Orbitron, Righteous, Silkscreen, Vast_Shadow } from 'next/font/google';
import localFont from 'next/font/local';

export const knewave = Knewave({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export const lobster = Lobster({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export const orbitron = Orbitron({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
});

export const righteous = Righteous({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-righteous',
});

export const silkscreen = Silkscreen({
  weight: ['400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const vastshadow = Vast_Shadow({
  weight: ['400'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-vast',
});

export const dunggeunmo = localFont({
  src: './static/DungGeunMo.woff2',
  variable: '--font-dunggeunmo',
});
