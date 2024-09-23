import SetScreenSize from '@/components/common/setScreensize';
import '../globals.css';

export default function SeonangLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SetScreenSize />
      <div
        style={{
          height: '100%',
          color: 'white',
          minHeight: 'calc(var(--vh, 1vh) * 100)',
          overflowY: 'auto',
          touchAction: 'none',
          cursor: 'auto',
        }}
      >
        {children}
      </div>
    </>
  );
}
