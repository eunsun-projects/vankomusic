import styles from '@/styles/modern-move.module.css';
import { Html } from '@react-three/drei';

export default function MoonLoaderDrei() {
  return (
    <Html center>
      <span className={styles.moonloader}></span>
    </Html>
  );
}
