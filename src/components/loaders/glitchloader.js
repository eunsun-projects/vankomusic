import styles from '@/app/loaders/page.module.css'

export default function GlitchLoader(){

    return (
        <div style={{
            position : 'relative', 
            width: "100%", 
            height: "100%", 
            display: "flex", 
            justifyContent: "center", 
            alignItems : "center",
            // backgroundColor: "grey"
        }}>
            <div 
                className={styles.glitch} 
                style={{ 
                    position : 'absolute', 
                    backgroundImage: "url(/assets/img/Logo_VankoWorks_thumb.png)",
                    backgroundPosition: "center",
                    backgroundSize: "250px",
                    backgroundRepeat: "no-repeat",
                    height: "100%",
                    width: "100%",
                    filter: "blur(0.8px)",
                    backgroundColor: "#71717a"
                }}
            >   
                <div style={{position: "absolute", width: "100%", height: "100%", boxShadow: "inset 0px 0px 100px 40px black", zIndex: "10"}}></div>
                <div className={`${styles.channel} ${styles.r}`}></div>
                <div className={`${styles.channel} ${styles.g}`}></div>
                <div className={`${styles.channel} ${styles.b}`}></div>
            </div>
        </div>
    )
}