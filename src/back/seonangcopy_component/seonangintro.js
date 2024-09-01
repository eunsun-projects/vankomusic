'use client'
import Seonang from '@/components/seonangcopy/seonang'
import styles from '@/app/seonangcopy/page.module.css'
import React, { useState, useEffect, useRef } from 'react';
import SeoLandscape from './seolandscape';

export default function SeonangIntro(){
    const [bingle, setBingle] = useState(false);
    const [mana, setMana] = useState(null);
    const [page, setPage] = useState(false);
    const [mobile, setMobile] = useState(null);

    const bingleContainerRef = useRef(null);
    const audioRef = useRef();
    const lastAngleRef = useRef(0); // 마지막으로 감지된 각도
    const totalRotationsRef = useRef(0); // 총 회전 수

    const enter = ()=> {
        setPage(true);
        audioRef.current.volume = 0.5;
        audioRef.current.play();
    }

    useEffect(() => {
        const nipplejs = require('nipplejs');
        const mobilewid = window.innerWidth;

        if( mobilewid < 712 ){
            setMobile(true)
        }else{
            setMobile(false)
        }

        const options = {
            zone : bingleContainerRef.current,
            mode : 'static',
            position : { right : '50%', bottom : '50%'},
            size: 200,
            color: 'blue',
            restOpacity: 1
        }
        const manager = nipplejs.create(options);
        setMana(manager);

        manager.on('move', (event, data) => {

            console.log('수신중..')
            const currentAngle = data.angle.degree;
            // 각도가 0에서 360으로 넘어갔는지, 또는 360에서 0으로 넘어갔는지 확인
            if (lastAngleRef.current > 270 && currentAngle < 90) {
                totalRotationsRef.current += 1;
            } else if (lastAngleRef.current < 90 && currentAngle > 270) {
                totalRotationsRef.current -= 1;
            }

            lastAngleRef.current = currentAngle;

            // 두 바퀴 돌았는지 확인
            if (Math.abs(totalRotationsRef.current) >= 2 && !bingle) {
                setBingle(true);
                totalRotationsRef.current = 0;
            }
        })

        return () =>{ 
            manager.destroy(); //빙글 리소스 해제
        }
    },[bingle])

    useEffect(()=>{
        if(mana){
            // console.log(mana)
            mana[0].el.style.opacity = '0'
            mana[0].ui.front.style.opacity = '0'
            mana[0].ui.front.style.backgroundColor = 'yellow'
            mana[0].ui.back.style.opacity = '0'
        }
    },[mana])

    return(
        <>
        <SeoLandscape/>
        <audio ref={audioRef} src='/assets/audio/seonang.mp3' preload='metadata' /> 
        { !page ?
                (<div style={{width:'100%', height:'100vh', overflow:'hidden', backgroundColor:'white'}}>
                    <div className={styles.introwater}>
                        <div className={styles.introdes}>
                            <p>기도해야 입장이 가능합니다.</p>
                            <p>물그릇을 클릭 혹은 터치한 상태로</p>
                            <p>움직이는 손을 따라 원을 2번 그려주세요.</p>
                        </div>
                        <div className={styles.handparents}>
                            <div className={styles.handdiv}><img className={styles.hand} src='/assets/img/prayhand.png'></img></div>
                            <img src='/assets/img/cleanwater.png' style={{width:'10rem', height:'auto'}}></img>
                        </div>
                        <div className={styles.bingle}>
                            <div ref={bingleContainerRef}></div>
                        </div>
                        {bingle && (<p onClick={enter} className={styles.enter}>입장하기</p>)}
                    </div>
                </div>) : (
                    <Seonang mobile = {mobile} seonangAudio = {audioRef.current} play = {page}/>
                )
            }
        </>
    )
}