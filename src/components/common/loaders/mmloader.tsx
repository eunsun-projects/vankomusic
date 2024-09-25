import styles from '@/styles/modern-move.module.css';

export default function MmLoader() {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: "grey"
      }}
    >
      <div
        className={styles.glitch}
        style={{
          position: 'absolute',
          backgroundImage: 'url(/assets/img/title_modernmove.webp)',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          height: '100%',
          width: '100%',
          filter: 'blur(0.8px)',
          // backgroundColor: "#eb34e5"
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            boxShadow: 'inset 0px 0px 100px 40px #000000a6',
            zIndex: '10',
          }}
        ></div>
        <div className={`${styles.channel} ${styles.r}`}></div>
        <div className={`${styles.channel} ${styles.g}`}></div>
        <div className={`${styles.channel} ${styles.b}`}></div>
      </div>
    </div>
  );
}
