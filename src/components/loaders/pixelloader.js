import styles from '@/app/loaders/page.module.css'

export default function PixelLoader(){

    return (
        <div style={{ position : 'relative', width: "100%", height: "100%"}}> 
            <div style={{ 
                position : 'absolute', 
                width: "100%", 
                height: "100%", 
                display: "flex", 
                justifyContent: "center", 
                alignItems : "center"
            }}>
                <span className={styles.loadersq}></span>
            </div>
        </div>
    )
}