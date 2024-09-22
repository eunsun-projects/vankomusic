"use client"
import React, { useRef, useState, useEffect, useContext } from "react";
import dayjs from 'dayjs'
import styles from '@/app/modernmove/page.module.css'

export default function CustomAudio({audio}){
    const progressRef = useRef(null);

    const mouseDownedRef = useRef(false);
    const mouseMovedRef = useRef(false);

    const [maxM, setMaxM] = useState(null);
    const [nowM, setNowM] = useState("00:00");

    // const handlePlay = () => {
    //     if(audio !== undefined && audio !== null){
    //         if(pClick){
    //             audio.play();
    //             setPlay(true);
    //         }else{
    //             audio.play();
    //             setPlay(true);
    //         }
    //     }
    // }

    // const handlePause = () => {
    //     audio.pause();
    //     setPlay(false);
    // }

    const timeHandler = (e) => {
        if (progressRef.current && audio.duration && e.nativeEvent.offsetX) {
            // const value = e.nativeEvent.offsetX / progressRef.current.parentElement.clientWidth * 100  
            const fullWidth = progressRef.current.parentElement.clientWidth;
            const ratio = e.nativeEvent.offsetX / fullWidth;
            audio.currentTime = ratio * audio.duration;
        }
    };

    const mouseMoveHandler = (e) => {
        if (mouseDownedRef.current && mouseMovedRef.current) {
        timeHandler(e);
        }
    };

    const mouseDownHandler = () => {
        mouseDownedRef.current = true;
        mouseMovedRef.current = true;
    };

    const mouseLeaveHandler = () => {
        if (mouseDownedRef.current) {
            mouseDownedRef.current = false;
        }
        mouseMovedRef.current = false;
    };

    const mouseUpHandler = (e) => {
        mouseDownedRef.current = false;
        mouseMovedRef.current = false;
        timeHandler(e);
    };

    useEffect(()=>{
        if(audio !== undefined){
            // audio.ondurationchange = function() {
                const max = dayjs(audio.duration * 1000).format("mm:ss");
                setMaxM(max);
            // };
        }
    },[audio])

    useEffect(() => {
        progressRef.current.style.width = '0%';

        const drawProgress = (currTime, totalTime) => {
            if(progressRef.current) {
                progressRef.current.style.width = `${(currTime / totalTime) * 100}%`;
            }
        };
    
        const timeupdateHandler = () => {
            const { currentTime, duration } = audio;
            drawProgress(currentTime, duration);
            const now = dayjs(currentTime * 1000).format("mm:ss");
            setNowM(now);
        };

        if(audio !== undefined && audio.src){
            audio.addEventListener('timeupdate', timeupdateHandler)
        }

        return () => {
            if(audio !== undefined){
                audio.removeEventListener('timeUpdate', timeupdateHandler)
            }
        }

    },[audio])
    
    return (
        <div style={{ height : '50px', color: 'white', zIndex: '1000', position: 'relative'}}>
            <div 
                className={styles.progress_container}
                style={{ height : '0.3rem', width: '99%'}}
                // onMouseMove={mouseMoveHandler} 
                // onMouseDown={mouseDownHandler} 
                // onMouseLeave={mouseLeaveHandler} 
                // onMouseUp={mouseUpHandler}
            >
                <span id="progress"
                    ref={progressRef}
                    style={{ display: 'block', position: 'relative', height: '100%', backgroundColor: 'aqua' }}
                />
            </div>
            {/* <div>
                {audio !== undefined && play ?
                    <span className={styles.material_icons_outlined} onClick={handlePause}>pause</span> :
                    <span className={styles.material_icons_outlined} onClick={handlePlay}>play_arrow</span>
                }
            </div>
            <div className={styles.audiominmax}>
                <span>{nowM}</span>
                <span>{maxM}</span>
            </div> */}
        </div>
    )
}