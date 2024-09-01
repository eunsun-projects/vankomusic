'use client'
import styles from '../page.module.css'

export default function Loader(){
    return(
        <div className={styles.loader}>
            <img className={styles.loaderimg} src="/assets/gifs/stone.gif"></img>
        </div>
        
    )
}