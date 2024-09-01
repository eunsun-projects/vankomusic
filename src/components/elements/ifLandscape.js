"use client"
import { useState, useEffect } from "react"
import styles from "@/app/page.module.css"

export default function Landscape(){

    const [land, setland] = useState(false);

    useEffect(()=>{

        const handleResize = () => {
            const isMobile = () => {

                const agent = /Android|iPhone|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                const width = window.innerWidth > 1024 && window.innerWidth < 1138

                if(agent && width){
                    return true
                } else {
                    return false
                }
            }; // =========> mobile device check function
    
            if(!isMobile() && window.matchMedia('(orientation: portrait)').matches){
                setland(false);
            }else if(isMobile() && window.matchMedia('(orientation: landscape)').matches){
                setland(true);
            }
        }
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize)
        }
        
    },[])

    return(
        <>        
            {land && (
                <div className={styles.vankolandscape}>
                    <p>◐◐</p>
                    <p>looks good in portrait mode</p>
                    <p>세로모드에서 잘 보여요</p>
                </div> 
            )}
        </>
    )
}