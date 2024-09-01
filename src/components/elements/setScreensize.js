'use client'
import { useEffect } from "react";

export default function SetScreenSize() {

    useEffect(()=>{

        /** ============ set screensize =============== */
        function setScreenSize() {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        /** ====== Generate a resize event if the device doesn't do it ====== */  
        window.addEventListener("orientationchange", () => window.dispatchEvent(new Event("resize")), false);
        window.addEventListener('resize', setScreenSize);
        window.dispatchEvent(new Event("resize"))

        return () => {
            window.removeEventListener("orientationchange", () => window.dispatchEvent(new Event("resize")), false);
            window.removeEventListener('resize', setScreenSize);
        };

    },[])

    return(
        <>
        </>
    )
}