import styles from '@/app/modernmove/page.module.css'
import { useProgress, Html } from "@react-three/drei"

export default function MoonLoaderDrei() {

    return (
        <Html center>
            <span className={styles.moonloader}></span>
        </Html>
    ) 
}
