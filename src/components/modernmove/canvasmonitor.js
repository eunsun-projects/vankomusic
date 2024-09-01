"use client"
import '@/app/globals.css'
import React, { useEffect, useState, useRef, Suspense, useCallback } from 'react';
import VaporwaveScene from './vaporScene';
import MoonLoaderBlack from './loaders/moonloaderblack';
import MmLoader from '../loaders/mmloader';
import styles from '@/app/modernmove/page.module.css'
import Image from 'next/image';
// import gamegi from './img/gamegi_pixel.png';
import gamegi from './img/newgamegibody.webp';
import Landscape from '../elements/ifLandscape';

const events = ['click','touchstart'];

export default function CanvasMonitor(){
    const [embed, setEmbed] = useState(false);
    const [innerW, setInnerW] = useState(null);
    const [load, setLoad] = useState(false);
    const [play, setPlay] = useState(false); // 오디오 플레이어의 재생 여부를 나타내는 상태 값이다.
    const [threeD, setThreeD] = useState(true);
    const [awaiting, setAwaiting] = useState(true);
    const [ending, setEnding] = useState(false);
    const [meteor, setMeteor] = useState(false);
    const [objet, setObjet] = useState(false);
    // const [selectedValue, setSelectedValue] = useState('');

    const audioRef = useRef();
    const monitorRef = useRef();

    // const handleLoad = () => {
    //     console.log('audio loaded~')
    //     setLoad(true);
    // };

    const handlePlayClick = () => {
        audioRef.current.volume = 0.5;
        audioRef.current.muted = false;
        audioRef.current.play()
        .then(()=>{
            setPlay(true);
        })
        .catch((err)=>{
            console.log(err)
        })
    };

    const handleMeteorClick = () => {
        setMeteor(true);
        const timer = setTimeout(() => {
            setMeteor(false);
            clearTimeout(timer);
        }, 2000);
    };

    const handleObjetClick = () => {
        if(play){
            setObjet(true);
            const timer = setTimeout(() => {
                setObjet(false);
                clearTimeout(timer);
            }, 2500);
        }
    };

    const handlePauseClick = () => {
        audioRef.current.pause();
        setPlay(false);
    };

    const handleStopClick = () => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        setPlay(false);
    };

    const handleThreeDClick = () => {
        audioRef.current.volume = 0.5;
        audioRef.current.muted = false;
        audioRef.current.play()
        .then(()=>{
            setPlay(true);
        })
        .catch((err)=>{
            console.log(err)
        })
        setThreeD(!threeD)
    };

    const handleHomeClick = useCallback(() => {
        window.location.href = '/'
    });

    const handleEnding = () => {
        console.log('ended!')
        const timer = setTimeout(() => {
            setEnding(true);
            clearTimeout(timer)
        }, 3000);
    }

    useEffect(()=>{
        /** ============ set screensize =============== */
        function setScreenSize() {
            let vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        // 뒤로가기 버튼을 감지하기 위한 핸들러 함수
        const handlePopState = (event) => {
            console.log(event)
            window.location.reload(); // 현재 페이지 새로고침
        };

        if(typeof window === 'object' && typeof document !== undefined){
            setInnerW(window.innerWidth);
            if(monitorRef.clientHeight < 400 && window.parent){
                setEmbed(true);
            }

            const timeout = setTimeout(() => {
                setAwaiting(false);
                clearTimeout(timeout);
            }, 1000);
    
            /** ====== Generate a resize event if the device doesn't do it ====== */  
            window.addEventListener("orientationchange", () => window.dispatchEvent(new Event("resize")), false);
            window.addEventListener('resize', setScreenSize);
            window.dispatchEvent(new Event("resize"));
            // popstate 이벤트 리스너 추가
            window.addEventListener('popstate', handlePopState);
        }
        return () => {
            window.removeEventListener("orientationchange", () => window.dispatchEvent(new Event("resize")), false);
            window.removeEventListener('resize', setScreenSize);
            window.removeEventListener('popstate', handlePopState);
        };
    },[]);

    return(
        <>
            <audio ref={audioRef} src='/assets/audio/modernmove.mp3' preload='metadata' muted onEnded={handleEnding} /> 
            <Suspense fallback={ <MoonLoaderBlack /> } >
                <div ref={monitorRef} className={styles.monitortop}>

                    <Landscape />
                    
                    <div className={styles.monitorbox}>
                        
                        <div className={styles.monitortopvoid}></div>

                        <div className={styles.monitorcanvasbox}>
                            {innerW && !ending ? 
                                (<VaporwaveScene audio={audioRef.current} play={play} threeD={threeD} innerW={innerW} meteor={meteor} objet={objet}/>) : 
                                (<div className={styles.mmloader}><MmLoader /></div>)
                            } 
                            {/* <div className={styles.mmloader}><MmLoader /></div> */}
                        </div>

                        <div className={styles.monitorbottombox}>

                            <div className={styles.monitorhomebox}>
                                <div id='voidhomebtn' className={styles.monitorhomeboxinner} >
                                    {!objet ? 
                                        <img className={styles.homebtnvankoimg} src='/assets/img/gamegi_vanko.webp' alt='vanko01' onClick={handleObjetClick}/>
                                        :
                                        <img className={styles.homebtnvankoimg} src='/assets/img/gamegi_vankowow.webp' alt='vanko02'/>
                                    }
                                    <img className={styles.homebtnbackimg} src='/assets/img/gamegibtn-big.webp' alt='gamegi_home_box'/>
                                </div>
                            </div>

                            <div className={styles.monitorbottombtngrid}>
                                <div style={{display: "grid"}}>
                                    {!play ? ( 
                                        <img id="play" className={styles.gamegibtn} style={{position:"relative", height: "auto", zIndex: "6", boxSizing: "border-box", cursor: "pointer", pointerEvents: awaiting ? "none" : "all" }} src='/assets/img/gamegi-playbtn.webp' alt='gamegi_play' onClick={handlePlayClick}/> 
                                        ) : (
                                        <img id="pause" className={styles.gamegibtn} style={{position:"relative", height: "auto", zIndex: "6", boxSizing: "border-box", cursor: "pointer"}} src='/assets/img/gamegi-pausebtn.webp' alt='gamegi_pause' onClick={handlePauseClick}/>
                                        )
                                    } 
                                </div>
                                <div style={{display: "grid"}}>
                                    {!meteor ? ( 
                                        <img id='star' className={styles.gamegibtntop} style={{position:"relative", height: "auto", zIndex: "6", boxSizing: "border-box", pointerEvents: awaiting ? "none" : "all"}} src='/assets/img/gamegi-starbtn.webp' alt='gamegi_star' onClick={handleMeteorClick}/> 
                                        ) : (   
                                        <img className={styles.gamegibtntop} style={{position:"relative", height: "auto", zIndex: "6", boxSizing: "border-box", }} src='/assets/img/gamegi-transstarbtn.webp' alt='gamegi_star'/> 
                                        )
                                    }
                                </div>
                                <div style={{display: "grid"}}>
                                        <img id='threed' className={styles.gamegibtn} style={{position:"relative", height: "auto", zIndex: "6", boxSizing: "border-box", pointerEvents: awaiting ? "none" : "all"}} src='/assets/img/gamegi-homebtn.webp' alt='gamegi_home' onClick={handleHomeClick}/> 
                                </div>
                                <div style={{display: "grid"}}>
                                    {threeD ? ( 
                                        <img id='threed' className={styles.gamegibtntop} style={{position:"relative", height: "auto", zIndex: "6", boxSizing: "border-box", pointerEvents: awaiting ? "none" : "all"}} src='/assets/img/gamegi-3dbtn.webp' alt='gamegi_3d' onClick={handleThreeDClick}/> 
                                        ) : (   
                                        <img className={styles.gamegibtntop} style={{position:"relative", height: "auto", zIndex: "6", boxSizing: "border-box", }} src='/assets/img/gamegi-2dbtn.webp' alt='gamegi_2d' onClick={handleThreeDClick}/> 
                                        )
                                    }
                                </div>

                                <div></div>
                                <div></div>
                            </div>
                        </div>

                        <Image 
                            style={{pointerEvents: 'none'}}
                            src={gamegi}
                            alt='gamegi' 
                            fill
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, (max-width: 1600px) 36rem, (max-width: 1920px) 36rem, 36rem"
                        />
                    </div>

                    <div style={{ display:'block', width : '100%', height : '100%', position : "relative", zIndex: "0"}}> 
                        <div style={{ width: "100%", height: "100%", backgroundSize: "20rem", backgroundRepeat: "repeat", backgroundImage: "url(/assets/img/modernback.png)"}}></div>
                    </div>
                </div>
            </Suspense>
        </>
    )
}

// const body = document.body;
// // loop 함수 === 어딘가 클릭하면 unlock 함과 동시에 재생 시작하고, 이벤트리스너도 제거
// function unlock(e) {
//     console.log(e.target.className)
//     if(typeof window !== 'object') return;
//     // if(e.target.id === "voidhomebtn"){
//     //     clean();
//     // }else if(e.target.id === "play"){
//     //     clean();
//     // }else if(e.target.id === "pause"){
//     //     clean();
//     // }else if(e.target.id === "stop"){
//     //     clean();
//     // }else if(e.target.id === "threed"){
//     //     clean();
//     // }else 
//     if(e.target.className === styles.homebtnvankoimg || e.target.className === styles.homebtnbackimg){
//         clean();
//     }else if(e.target.className === styles.gamegibtn){
//         console.log('start')
//     }
//     else if(document.activeElement === body && audioRef.current !== null){
//         audioRef.current.volume = 0.5;
//         audioRef.current.muted = false;
//         audioRef.current.play()
//         .then(()=>{
//             setPlay(true);
//         })
//         .catch((err)=>{
//             console.log(err)
//         })
//     }
//     clean();
// };
// function clean() { 
//     events.forEach(e => body.removeEventListener(e, unlock)); 
// };
// events.forEach(e => body.addEventListener(e, unlock, { once : true }));