import styles from '@/app/page.module.css'

export default function Loading(){
    return(
        <div className={styles.loader}>
            <img className={styles.loaderimg} src="/assets/img/192vanko.png"></img>
        </div>
        
    )
}

//loading='lazy'