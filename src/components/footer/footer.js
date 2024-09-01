import styles from '@/app/page.module.css'
import Link from 'next/link'
import { orbitron } from '@/app/layout'

export default function Footer({color}){
    return(
        <div className={`${styles.footer} ${orbitron.className}`} style={{borderTop:`1px solid ${color}`}}>
                <Link href='/' style={{textDecoration:'none'}}>
                    <div className={styles.footerimg}>
                        <img style={{width:'1.2rem', height:'1.2rem'}} src='/assets/img/footer_vanko.webp'></img>
                        <p>home</p>
                    </div>
                </Link>
                <p>ⓒ2024.vankomusic.</p>
        </div>
    )
}