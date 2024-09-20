"use client"
import styles from '../page.module.css'

export default function Loading(){
    return(
        <div className={styles.loader}>
            <img className={styles.loaderimg} src="/assets/img/ffd_vanko.webp"></img>
        </div>
        
    )
}