import styles from '../page.module.css'

export default function BorderLine(){
    
    return(
        <div className={styles.borderbox}>
                <div className={styles.borderimgdiv} style={{justifyContent:'flex-end'}}><img src='/assets/img/pizza.webp' className={styles.borderimg} style={{transform: 'scaleX(-1)'}}></img></div>
                <div className={`${styles.line} ${styles.linetrans}`}></div>
                <div className={styles.borderimgdiv}><img src='/assets/img/pizza.webp' className={styles.borderimg}></img></div>
        </div>
    )
}