import styles from '@/app/seonangcopy/page.module.css'

export default function UnseOne({setUnse}){
    const CloseUnse = () => {
        setUnse(false);
    }
    return(
        <div className={styles.unseone}>
            <div className={styles.unsebackground}>
                <p onClick={CloseUnse} className={styles.x}>X</p>
                <div className={styles.unseimgdiv}>
                    <img src='/assets/img/buzeok.jpg' className={styles.buzeok}></img>
                    <p className={styles.unseonep}>download</p>
                </div>
            </div>
            
        </div>
    )
}