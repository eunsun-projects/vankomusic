import styles from './page.module.css'
import Link from 'next/link'

export default function Navbar(){
    return(
        <div className={styles.temp} style={{fontFamily:'DungGeunMo', fontSize:'2rem', display: 'flex', flexDirection: 'column', gap: '2rem', padding: '1rem'}}>
            <Link href="/" style={{width:'fit-content', border: '2px dotted'}}>temp</Link>
            <Link href="/home">home</Link>
            <Link href="/seonang">서낭축원</Link>
            <Link href="/ffd">FFD</Link>
            <Link href="/modernmove">modernmove</Link>
            <Link href="/circles">circles</Link>
        </div>
    )
}