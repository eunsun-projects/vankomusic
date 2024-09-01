import '../globals.css'
import styles from '@/app/seonang/page.module.css'
import SetScreenSize from '@/components/elements/setScreensize'
import '@/app/react-carousel.es.css'

export default function SeonangLayout({ children }) {
    return (
        <>
        <SetScreenSize/>
        <div className={styles.layoutpage} style={{height : '100%', minHeight:'calc(var(--vh, 1vh) * 100)', overflowY:"auto", backgroundImage: 'url(/assets/img/cave.webp)', backgroundSize: 'cover', touchAction: "none", cursor:'auto'}}>
            {children}
        </div>
        </>
    )
}