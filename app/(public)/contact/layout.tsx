import { SetScreenSize } from '@/components/common';
import { knewave } from '@/fonts';
import '../../globals.css';

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SetScreenSize />
      <div
        className={knewave.className}
        style={{
          minHeight: 'calc(var(--vh, 1vh) * 100)',
          overflowY: 'auto',
          backgroundImage: 'url(/assets/img/starpixel.webp)',
          backgroundSize: '25rem',
          backgroundRepeat: 'repeat',
        }}
      >
        {children}
      </div>
    </>
  );
}
