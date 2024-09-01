'use client'

import { useEffect, useRef } from "react";

export default function FfdSong(){
    const audioRef = useRef();

    useEffect(()=>{
        const songStart = () => {
            console.log('asdf')
            audioRef.current.volume = 0.5;
            audioRef.current.play();
        }
        document.body.addEventListener('click', songStart)
        return ()=>{
            document.body.removeEventListener('click', songStart)
        }
    },[])
    return(
        <audio ref={audioRef} src='/assets/audio/ffd.mp3' preload='metadata'/>
    )
}