"use client"
import { useState, useEffect } from "react"
import styles from '@/app/seonangcopy/page.module.css'

export default function SeoLandscape(){

    const [land, setland] = useState(false);

    useEffect(()=>{

        const handleResize = () => {
            const isMobile = () => {
                return /Android|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
            }; // =========> mobile device check function
    
            if(isMobile() && window.matchMedia('(orientation: portrait)').matches){
                setland(false);
            }else if(isMobile() && window.matchMedia('(orientation: landscape)').matches){
                setland(true);
            }
        }
        // window.addEventListener('resize', handleResize);

        window.addEventListener("orientationchange", () => window.dispatchEvent(new Event("resize")), false);
        window.addEventListener('resize', handleResize);
        window.dispatchEvent(new Event("resize"))

        return () => {
            window.removeEventListener("orientationchange", () => window.dispatchEvent(new Event("resize")), false);
            window.removeEventListener('resize', handleResize)
        }
        
    },[])

    return(
        <>        
            {land && (
                <div className={styles.landscape}>
                    <p>※경고※</p>
                    <p>가로로는 기도를 못 드립니다.</p>
                    <p>세로로 보세요.</p>
                </div> 
            )}
        </>
    )
}