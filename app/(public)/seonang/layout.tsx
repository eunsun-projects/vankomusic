import SetScreenSize from '@/components/common/setScreensize';
import '@/styles/react-carousel.es.css';
import styles from '@/styles/seonang.module.css';

export default function SeonangLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SetScreenSize />
      <div
        className={styles.layoutpage}
        style={{
          height: '100%',
          minHeight: 'calc(var(--vh, 1vh) * 100)',
          overflowY: 'auto',
          backgroundImage: 'url(/assets/img/cave.webp)',
          backgroundSize: 'cover',
          touchAction: 'none',
          cursor: 'auto',
        }}
      >
        {children}
      </div>
    </>
  );
}
