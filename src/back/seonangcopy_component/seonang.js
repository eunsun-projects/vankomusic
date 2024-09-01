'use client'
import Link from 'next/link'
import GasaModal from './gasamodal';
import styles from '@/app/seonangcopy/page.module.css'
import React, { useState, useEffect, useRef } from 'react';
import LotteryTicket from './lotteryticket';
import UnseOne from './unseone';
import UnseTwo from './unsetwo';
import { lyrics } from './lyrics';

const mungu = 
    `정한수에 손을 대고 소월을 빌면서 그릇을 따라 세 번 돌리면
    당신의 염원이 서낭신께 전달됩니다...`;

export default function Seonang({seonangAudio, play, mobile}){
    const [bingle, setBingle] = useState(false);
    const [mana, setMana] = useState(null);
    const [currentLyricsIndex, setCurrentLyricsIndex] = useState(0);
    const [modal, setModal] = useState(false);
    const [magic, setMagic] = useState(false);
    const [high, setHigh] = useState(0);

    const bingleContainerRef = useRef(null);
    const lastAngleRef = useRef(0); // 마지막으로 감지된 각도
    const totalRotationsRef = useRef(0); // 총 회전 수

    const openModal = () => {
        setModal(true);
    };

    // console.log(mobile)

    useEffect(() => {
        const nipplejs = require('nipplejs');

        const options = {
            zone : bingleContainerRef.current,
            mode : 'static',
            position : { right : '50%', bottom : '50%'},
            size: 400,
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
                // console.log('+1')
                totalRotationsRef.current += 1;
            } else if (lastAngleRef.current < 90 && currentAngle > 270) {
                // console.log('-1')
                totalRotationsRef.current -= 1;
            }

            lastAngleRef.current = currentAngle;

            // console.log(Math.abs(totalRotationsRef.current))
            // 두 바퀴 돌았는지 확인
            if (Math.abs(totalRotationsRef.current) >= 2 && !bingle) {
                // console.log('세바퀴돌았냐')
                setBingle(true);
                const timer = setTimeout(() => {
                    setBingle(false);
                    setMagic(true);
                    clearTimeout(timer);
                }, 2000);
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

    useEffect(()=>{
        const audio = seonangAudio;

        function receive() {
            const currentTime = audio.currentTime;
            // 현재 시간보다 작거나 같은 마지막 타임스탬프를 가진 가사 찾기
            const newLyricsIndex = lyrics.findIndex((lyric, index) => {
                // 다음 가사의 시간을 확인하거나 마지막 가사인 경우 현재 시간과 비교
                const nextLyricTime = lyrics[index + 1]?.time || Infinity;
                return currentTime >= lyric.time && currentTime < nextLyricTime;
            });
    
            if (newLyricsIndex !== -1 && newLyricsIndex !== currentLyricsIndex) {
                setCurrentLyricsIndex(newLyricsIndex);
            }
            if (currentTime > 36){ // 0:36
                setHigh(1);
            }
            if (currentTime > 88){ // 1:28
                setHigh(2);
            }
            if(currentTime > 131){ // 2:11 
                setHigh(1);
            }
            if(currentTime > 152){ // 2:32
                setHigh(2);
            }
            if(currentTime > 187){ // 3:07
                setHigh(1);
            }
            if(currentTime > 203){ // 3:23
                setHigh(0)
            }
            if(currentTime > 254){ // 4:14 
                setHigh(1)
            }
            if(currentTime > 281){ // 4:41
                setHigh(2)
            }
            if(currentTime > 332){ // 5:32
                setHigh(0)
            }
            if(currentTime > 366){ // 6:06
                setHigh(3)
            } 
            if(currentTime > 401){ // 6:06
                setHigh(4)
            } 
            if(currentTime > 418){ // 6:58
                setHigh(3)
            }
            if(currentTime > 423){ // 7:03
                setHigh(2)
            }
            if(currentTime > 428){ // 7:08
                setHigh(1)
            }
            if(currentTime > 436){ // 7:16
                setHigh(0)
            }
        }

        if(audio){
            audio.addEventListener('timeupdate', receive);
        }
        return()=>{
            audio?.removeEventListener('timeupdate', receive);
        }
    },[seonangAudio, currentLyricsIndex])

    if ( mobile === false ) {
        return(
        <>
        {modal && <GasaModal setModal = {setModal}></GasaModal>}

        <div className={styles.seonangpage}>
            <div className={styles.seonangbox}>
                {magic && <Magic setMagic = {setMagic} />}

                <div className={styles.centerimg}>
                    <div className={styles.leftdiv}>
                        <Link className={styles.homebox} style={{textDecoration:'none'}}href={'/home'}><p className={styles.home}>홈으로</p></Link>
                        <img src='/assets/img/gasa.png' className={styles.paper} onClick={ openModal }></img>
                        <img src='/assets/gifs/torch3_tran2.gif' className={styles.torchleft}></img>
                    </div>
                    
                    <div className={styles.treebox}>
                        <img className={styles.tree} style={{opacity: high === 0 ? '1' : '0'}} src='/assets/gifs/tree.gif' alt='seonangtree'></img>
                        <img className={styles.tree} style={{opacity: high === 1 ? '1' : '0'}} src='/assets/gifs/tree2.gif' alt='seonangtree'></img>
                        <img className={styles.tree} style={{opacity: high === 2 ? '1' : '0'}} src='/assets/gifs/tree3.gif' alt='seonangtree'></img>
                        <img className={styles.tree} style={{opacity: high === 3 ? '1' : '0'}} src='/assets/gifs/tree4.gif' alt='seonangtree'></img>
                        <img className={styles.tree} style={{opacity: high === 4 ? '1' : '0'}} src='/assets/gifs/tree5.gif' alt='seonangtree'></img>
                        <div className={styles.garaoke}>
                            <p>{lyrics[currentLyricsIndex].text}</p>
                        </div>
                    </div>
                    <img src='/assets/gifs/torch3_tran2.gif' className={styles.torchright}></img>
                </div>

            </div>
            <div className={styles.mungubox}>
                <p className={styles.mungu}>{mungu}</p>
            </div>
            <div className={styles.waterbox}>
                {bingle && (<img className={styles.magiceffect} src='/assets/gifs/bunsin.gif'></img>)}
                <img src='/assets/img/cleanwater.png' className={styles.water}></img>
                <div className={styles.bingle}>
                    <div ref={bingleContainerRef}></div>
                </div>
            </div>
        </div>
        </>
    )} else if( mobile === true ){
        return(
            <>
            {modal && <GasaModal setModal = {setModal}></GasaModal>}

            <div className={styles.mseonangpage}>
                <div className={styles.mobileseonangbox}>
                    {magic && <Magic setMagic = {setMagic} />}

                    <div className={styles.mobilecenter}>
                        <div className={styles.torchborder}>
                            <img src='/assets/gifs/torch3_tran2.gif' className={styles.torch}></img>
                            <img src='/assets/gifs/torch3_tran2.gif' className={styles.torch}></img>
                            <img src='/assets/gifs/torch3_tran2.gif' className={styles.torch}></img>
                            <img src='/assets/gifs/torch3_tran2.gif' className={styles.torch}></img>
                            <img src='/assets/gifs/torch3_tran2.gif' className={styles.torch}></img>
                        </div>
                        
                        <div className={styles.mtreebox}>
                            <img className={styles.mtree} style={{opacity: high === 0 ? '1' : '0'}} src='/assets/gifs/tree.gif' alt='seonangtree'></img>
                            <img className={styles.mtree} style={{opacity: high === 1 ? '1' : '0'}} src='/assets/gifs/tree2.gif' alt='seonangtree'></img>
                            <img className={styles.mtree} style={{opacity: high === 2 ? '1' : '0'}} src='/assets/gifs/tree3.gif' alt='seonangtree'></img>
                            <img className={styles.mtree} style={{opacity: high === 3 ? '1' : '0'}} src='/assets/gifs/tree4.gif' alt='seonangtree'></img>
                            <img className={styles.mtree} style={{opacity: high === 4 ? '1' : '0'}} src='/assets/gifs/tree5.gif' alt='seonangtree'></img>
                            <div className={styles.mgaraoke}>
                                <p>{lyrics[currentLyricsIndex].text}</p>
                            </div>
                        </div>
                    </div>

                </div>
                <div className={styles.mungubox}>
                    <p className={styles.mungu}>{mungu}</p>
                </div>
                <div className={styles.waterbox}>
                    {bingle && (<img className={styles.magiceffect} src='/assets/gifs/bunsin.gif'></img>)}
                    <img src='/assets/img/cleanwater.png' className={styles.water}></img>
                    <div className={styles.bingle}>
                        <div ref={bingleContainerRef}></div>
                    </div>
                </div>
            </div>
            <div className={styles.hadan}>
                    <img src='/assets/img/gasa.png' style={{position:'relative', zIndex:'10000'}}className={styles.mpaper} onClick={ openModal }></img>
                    <Link className={styles.homebox} style={{textDecoration:'none', position:'relative', zIndex:'10000'}}href={'/home'}><p className={styles.mhome}>홈으로</p></Link>
            </div>
            </>
        )
    }
}

function Magic ({setMagic}){
    const [showFortune, setShowFortune] = useState(false);
    const [unse, setUnse] = useState(false);
    const [unseTwo, setUnseTwo] = useState(false);

    const openFortune = () => {
        setShowFortune(true);
    }

    const openUnse = () => {
        setUnse(true);
    }

    const openUnseTwo = () => {
        setUnseTwo(true)
    }
    const closeMagic = () => {
        setMagic(false)
    }
    return(
        <>
        {unse && <UnseOne setUnse = {setUnse}/>}
        {unseTwo && <UnseTwo setUnseTwo = {setUnseTwo}/>}
        {showFortune && <LotteryTicket setShowFortune = {setShowFortune}></LotteryTicket>}
        
        <div className={styles.sampleversion}>
            <p onClick={closeMagic} className={styles.x}>X</p>
            <div className={styles.unseboxs}>
                <div className={styles.unsedivs}>
                    <img onClick={openUnse} className={styles.unseicon} src='/assets/img/cristal.png'></img>
                    <p>unse v0</p>
                </div>
                <div className={styles.unsedivs}>
                    <img onClick={openUnseTwo} className={styles.unseicon} src='/assets/img/cristal.png'></img>
                    <p>unse v1</p>
                </div>
                <div className={styles.unsedivs}>
                    <img onClick={openFortune} className={styles.unseicon} src='/assets/img/fortune.png'></img>
                    <p>unse v2</p>
                </div>
            </div>
        </div>
        </>
    )
}