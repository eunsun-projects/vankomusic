import styles from '@/styles/modern-move.module.css';

export default function MoonLoaderBlack() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        top: '50%',
        left: '50%',
        position: 'absolute',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '1000',
        boxShadow: '0 0 1rem 1rem black',
        backgroundColor: 'darkgrey',
      }}
    >
      <span className={styles.moonloader}></span>
    </div>
  );
}
