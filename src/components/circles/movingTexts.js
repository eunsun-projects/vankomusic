"use client"
import React, {useState, useRef, useEffect} from 'react'
import styles from '@/app/circles/page.module.css'
import Circles from './circles';
import CustomAudio from "./customAudio";

const texts = [
    "..Fear Not..",
    "..Circle..",
    "..Is..",
    "..Here..",
    "Ready",
];

const morphTime = 1.5;
const cooldownTime = 0.5;

export default function MovingTexts() {

    const text1 = useRef();
    const text2 = useRef();
    const circle = useRef();
    const audioRef = useRef();
    const [circleVisible, setCircleVisible] = useState(false);
    const [ready, setReady] = useState(false);

    function handleCircleClick() {
        // 원형 div를 클릭했을 때 원하는 로직을 여기에 추가
        console.log("Circle clicked!");
        audioRef.current.play();
        audioRef.current.volume = 0.7;
        setReady(true);
    }

    useEffect(()=>{

        let animationFrameId; // 애니메이션 프레임 ID를 추적하기 위한 변수
        let textIndex = texts.length - 1;
        let time = new Date();
        let morph = 0;
        let cooldown = cooldownTime;

        const elts = {
            text1 : text1.current,
            text2 : text2.current,
        };        

        elts.text1.innerText = texts[textIndex % texts.length];
        elts.text2.innerText = texts[(textIndex + 1) % texts.length];

        function doMorph() {
            morph -= cooldown;
            cooldown = 0;
        
            let fraction = morph / morphTime;
        
            if (fraction > 1) {
                cooldown = cooldownTime;
                fraction = 1;
            }
        
            setMorph(fraction);
        }
        function setMorph(fraction) {
            if (elts.text1 && elts.text2) {
                elts.text2.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
                elts.text2.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
                
                fraction = 1 - fraction;
                elts.text1.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
                elts.text1.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;
        
                elts.text1.textContent = texts[textIndex % texts.length];
                elts.text2.textContent = texts[(textIndex + 1) % texts.length];
            }
            
            if (circle.current) { // 이 부분을 추가
                circle.current.style.width = `${Math.min(38 / fraction, 90)}px`;
                circle.current.style.height = `${Math.min(38 / fraction, 90)}px`;
            }
        }
        
        function doCooldown() {
            morph = 0;
        
            elts.text2.style.filter = "";
            elts.text2.style.opacity = "100%";
        
            elts.text1.style.filter = "";
            elts.text1.style.opacity = "0%";
        }
        
        function animate() {
            animationFrameId = requestAnimationFrame(animate);
        
            let newTime = new Date();
            let shouldIncrementIndex = cooldown > 0;
            let dt = (newTime - time) / 1000;
            time = newTime;
        
            cooldown -= dt;
        
            if (cooldown <= 0) {
                if (shouldIncrementIndex) {
                    textIndex++;
                }
                doMorph();
                // "Ready"가 출력되면 원형 div를 보이게 함
                if (texts[textIndex % texts.length] === "Ready") {
                    setCircleVisible(true);
                }
            } else {
                doCooldown();
            }
        }
        
        if(!ready) {
            animate();
        } else {
            cancelAnimationFrame(animationFrameId);
        };
        
        // 클린업 함수를 반환합니다.
        return () => {
            // 애니메이션 프레임을 취소합니다.
            cancelAnimationFrame(animationFrameId);
        };

    },[]);

    return (
        <>
            <audio ref={audioRef} src='/assets/audio/circles.mp3' preload='metadata' /> 
            {!ready && (
                <div style={{position: "absolute", width: "100vw", height: "calc(var(--vh, 1vh) * 100)"}}>
                    <div ref={circle} className={styles.circle} onClick={handleCircleClick} style={{ opacity : circleVisible ? "1" : "0", pointerEvents : circleVisible ? "all" : "none"}}></div>
                    <div className={styles.container} style={{ display : circleVisible ? "none" : "flex"}}>
                        <span ref={text1} className={styles.text1}></span>
                        <span ref={text2} className={styles.text2}></span>
                    </div>

                    <svg id="filters">
                        <defs>
                            <filter id="threshold">
                                <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0
                                    0 1 0 0 0
                                    0 0 1 0 0
                                    0 0 0 255 -140" />
                            </filter>
                        </defs>
                    </svg>
                </div>
            )}
            {ready && ( 
                <>
                    <div style={{position: "absolute"}}>
                        <CustomAudio audio={audioRef.current} /> 
                    </div>
                </>
            )}
            <Circles ready={ready} audio={audioRef.current}/>
        </>
    )
}