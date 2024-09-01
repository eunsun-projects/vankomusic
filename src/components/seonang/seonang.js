'use client'
import Link from 'next/link'
import GasaModal from './gasamodal';
import styles from '@/app/seonang/page.module.css'
import { useState, useEffect, useRef } from 'react';
import Saju from './saju';
import { lyrics } from './lyrics';
import { useSpring, animated } from '@react-spring/web';
import { fetchVisits } from '@/utils/fetchVisits';
import Modal from '@/app/seonang/_component/modal';

const mobiletorch = [
    '/assets/img/torch_none.png',
    '/assets/gifs/torchstart.gif',
    '/assets/gifs/torchmove.gif',
    '',
    ''
];

export default function Seonang(){
    const [bingle, setBingle] = useState(false);
    const [mana, setMana] = useState(null);
    const [nipple, setNipple] = useState(null)
    const [currentLyricsIndex, setCurrentLyricsIndex] = useState(0);
    const [modal, setModal] = useState(false);
    const [magic, setMagic] = useState(false); // 사주모달
    const [high, setHigh] = useState(0);
    const [musicStart, setMusicStart] = useState(0);
    const [yes, setYes] = useState(true); // 돌리면서 그림이 안떠있을때(최초에) 실행되는 것
    const [crow, setCrow] = useState(false); // 까마귀나타나기용
    const [dog, setDog] = useState(false); // '/assets/img/dog_sit.webp'
    const [crowTwo, setCrowTwo] = useState(false);
    const [dogTwo, setDogTwo] = useState(false)
    const [sowonCount, setSowonCount] = useState(0);
    const [sowonContents, setSowonContents] = useState(null);
    const [lastLength, setLastLength] = useState(0);
    const [enterp, setEnterp] = useState(`이어폰이나 헤드폰을 사용하시면 기도의 효험이 증가합니다.`);
    const [mobile, setMobile] = useState(null);
    const [android, setAndroid] = useState(null);
    const [ showModal, setShowModal ] = useState(false);

    const {opacity} = useSpring({ opacity : musicStart > 0 ? 1 : 0, config: {duration: 2000}}); // 1번에서 그림 시작
    const crowOpacity = useSpring({ opacity : crow || crowTwo ? 1 : 0, config: {duration: 400}}).opacity; // 까마귀 오퍼시티

    const audioRef = useRef();
    const bingleContainerRef = useRef();
    const lastAngleRef = useRef(0); // 마지막으로 감지된 각도
    const totalRotationsRef = useRef(0); // 총 회전 수
    const treeRef = useRef();
    const marqueeTextRef = useRef();
    const marqueeRef = useRef([]);
    const cdRef = useRef(null);
    const mobileCdRef = useRef(null);

    const handleIcon = () => {
        setShowModal(true)
    }

    const marqueeSowon = async () => {
        // alert('소원이 제출되었습니다.')
        try{
            const pack = {
                action: 'sowonget',
            };
            const req = {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
                },
                body: JSON.stringify(pack)
            };
    
            const response = await fetch('/api/wish', req);

            if(response.ok){
                const result = await response.json();
                setSowonContents(result);
                marqueeTextRef.current.style.animation = 'none'; // 페치가 완료되면 애니메이션을 잠시 none 으로
                console.log('가져오기 성공');
                // alert(`성공했습니다.`);
            }else{
                console.log('서버에서 실패');
                alert('소원제출실패.. 새로고침 후 새로 시도해 주세요.');
            }
        }catch(error){
            console.log(error)
        }
    };

    function randomTrueFalse() {
        return Math.random() >= 0.5; //true나 false만을 반환하는 함수, 0.5 보다 크면 트루, 아니면 폴스
    }

    // 사주뽑기 클로즈
    const closeUnse = () => {
        mana.off('move').off('end'); // 뽑기 시퀀스 종료 될 때, 매니저.off 를 모두 실행해줘야 이벤트 중복체크가 되지 않음... 필수!
        setBingle(false);
        setMagic(false);
        setDog(randomTrueFalse);
        setCrow(randomTrueFalse);
        const timer = setTimeout(() => {
            setDog(false);
            clearTimeout(timer);
        }, 1800);
        const crowTimer = setTimeout(() => {
            setCrow(false);
            clearTimeout(crowTimer)
        }, 3000);
    };

    // 가사 오픈
    const openModal = () => {
        setModal(true);
    };

    const yesClick = () => {
        setYes(false)
        const treetimer = setTimeout(() => {
            setMusicStart(1);                
            audioRef.current.load();
            audioRef.current.muted = false;
            audioRef.current.volume = 0.5;
            audioRef.current.play()
                .then(()=>{
                    console.log('기도를 드릴 수 있습니다.')
                })
                .catch((error)=>{
                    console.log(error)
                    if(confirm('네트워크 환경이 좋지 않습니다. 새로고침 하시겠습니까?')){
                        window.location.reload(true);
                    }else{
                        alert('네트워크가 원활한 곳에서 다시 실행해주세요.')
                    }
                });
            clearTimeout(treetimer);
        }, 1000);
        const starttimer = setTimeout(() => { //토치 불이 켜짐 시작
            setMusicStart(2);
            clearTimeout(starttimer);
        }, 2000);
        const timer = setTimeout(() => { //토치 불이 계속 켜져있음
            setMusicStart(3);
            clearTimeout(timer);
        }, 3000);
    }

    useEffect(() => {
        marqueeSowon();
        if(window.innerWidth < 500){
            setEnterp(`이어폰이나 헤드폰을 사용하시면
            기도의 효험이 증가합니다.`)
            setMobile(true)
        }else{
            setMobile(false);
        };

        //userAgent : 접속자 기기 판단 toLowerCase:판단된 것을 소문자로 치환 indexOf:접속자 기기 목록에 있는지 없는지(기기가 안드로이드인지 아닌지)
        if(navigator.userAgent.toLowerCase().indexOf('android') > -1){
            setAndroid(true);
        }else{
            setAndroid(false)
        };

        // 리콰이어도 안되는 것 같고.. 다이나믹 임포트도 안되고 그래서 그냥 useEffect [] 안에서 임포트 하는데,, await 도 못써서 then 으로 그냥 대충 처리
        const nippleLocal = import('./nipplejs');
        nippleLocal.then((nipplejs)=> setNipple(nipplejs));

        let angle = 0;
        let raq;

        const rotateImage = () => {
            angle = (angle + 1) % 360;
            if(cdRef.current){
                cdRef.current.style.transform = `rotate(${angle}deg)`;
            }
            if(mobileCdRef.current){
                mobileCdRef.current.style.transform = `rotate(${angle}deg)`;
            }
            raq = requestAnimationFrame(rotateImage);
        };

        raq = requestAnimationFrame(rotateImage);

        // 방문자수 체크 함수
        fetchVisits();

        return () => {
            cancelAnimationFrame(raq);
        };
    },[])

    useEffect(()=>{
        let manager;
        // 니플은 콘솔 찍어보니까 한번만 바뀌는 것 확인함 === 즉 아래 코드는 시작시 한번만 실행됨
        if(nipple) {
            const options = {
                zone : bingleContainerRef.current,
                mode : 'static',
                position : { right : '50%', bottom : '50%'},
                size: 400,
                color: 'white',
                restOpacity: 1
            }
            manager = nipple.create(options);

            manager[0].el.style.opacity = '0'
            manager[0].ui.front.style.opacity = '0'
            manager[0].ui.front.style.backgroundColor = 'yellow'
            manager[0].ui.back.style.opacity = '0'

            setMana(manager);
        }
    },[nipple]);

    useEffect(()=>{
        // const nipplejs = require('nipplejs');        
        // console.log(mana)

        if(mana && !yes){
            let bing = false;
            mana.on('move', (event, data) => {
                // console.log('수신중', event)
                const currentAngle = data.angle.degree;
    
                // 각도가 0에서 360으로 넘어갔는지, 또는 360에서 0으로 넘어갔는지 확인
                if (lastAngleRef.current > 270 && currentAngle < 90) {
                    totalRotationsRef.current += 1;
                } else if (lastAngleRef.current < 90 && currentAngle > 270) {
                    totalRotationsRef.current -= 1;
                }
                lastAngleRef.current = currentAngle;

                // console.log(Math.abs(totalRotationsRef.current))
    
                // 두 바퀴 돌았는지 확인
                if (Math.abs(totalRotationsRef.current) >= 1 && !bingle && !bing) {
                    console.log('소원시퀀스 시작!');
                    setBingle(true);//bingle false는 모달이 꺼질때 실행됨, 모달이 켜져있는 동안은 물이 차있는 상태유지.
                    bing = true;
                    setTimeout(() => {
                        setMagic(true);
                    }, 1000);
                    totalRotationsRef.current = 0; // 여기서도 해야 하는듯...
                }
                totalRotationsRef.current = 0; // 여기서도 해야 하는듯...
            }).on('end', () => {
                bing = false;
                totalRotationsRef.current = 0;
                console.log('끝');
            });

        }
        // return () =>{ 
        //     if(mana) mana.destroy(); // 이거 하면 안되는 듯??? 이것 때문에 자꾸 manager 객체가 새로 생성되는 문제발견해서 리턴문을 주석하는 것으로 해결.. 인가??
        // }
    },[mana, yes, totalRotationsRef.current, bingle]);

    useEffect(()=>{
        if(sowonCount > 0){
            marqueeSowon();
            // console.log(sowonContents)
        }
    },[sowonCount]);

    useEffect(() => {
        if (sowonContents) {
            setLastLength(sowonContents.sowons.length);
    
            let sum = 0;
            if (marqueeRef.current && lastLength !== sowonContents.sowons.length) {
                // console.log('같지않냐?')
                sum = 0;
                marqueeRef.current.forEach((e) => {
                    sum += e.clientWidth;
                });
                const gap = (marqueeRef.current.length - 1) * 16
                const final = sum + gap;
                const animationDuration = final / 200;
    
                // console.log(sum)
                if (final > 0 && marqueeTextRef.current) {
                    marqueeTextRef.current.style.width = `${final}px`;
                    marqueeTextRef.current.style.animation = `${styles.marqueeslide} ${animationDuration}s linear infinite`;
                }
            }
        }
    }, [sowonContents]); // 의존성 배열에서 marqueeRef.current와 marqueeTextRef.current를 제거

    useEffect(()=>{
        const audio = audioRef.current;

        const crowSetTime = () => {
            setCrowTwo(true)
            const timer = setTimeout(() => {
                setCrowTwo(false);
                clearTimeout(timer)
            }, 5000);
        }
        const dogSetTime = () => {
            setDogTwo(true)
            const timer = setTimeout(() => {
                setDogTwo(false);
                clearTimeout(timer)
            }, 3500);
        }

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
            if (currentTime >= 36 && currentTime < 36.3){ // 0:36
                setHigh(2);
                crowSetTime()
            }
            if (currentTime >= 88 && currentTime < 88.3){ // 1:28
                setHigh(3);
                dogSetTime()
            }
            if(currentTime >= 131 && currentTime < 131.3){ // 2:11 
                setHigh(2);
                crowSetTime()
                dogSetTime()
            }
            if(currentTime >= 152 && currentTime < 152.3){ // 2:32
                setHigh(3);
                crowSetTime()
            }
            if(currentTime >= 187 && currentTime < 187.3){ // 3:07
                setHigh(2);
                dogSetTime()
            }
            if(currentTime >= 203 && currentTime < 203.3){ // 3:23
                setHigh(0)
                crowSetTime()
            }
            if(currentTime >= 254  && currentTime < 254.3){ // 4:14 
                setHigh(1)
                crowSetTime()
                dogSetTime()
            }
            if(currentTime >= 281  && currentTime < 281.3){ // 4:41
                setHigh(2)
                crowSetTime()
            }
            if(currentTime >= 332 && currentTime < 332.3){ // 5:32
                setHigh(0)
                dogSetTime()
            }
            if(currentTime >= 366 && currentTime < 366.3){ // 6:06
                setHigh(3)
                dogSetTime()
                crowSetTime()
            } 
            if(currentTime >= 401 && currentTime < 401.3){ // 6:06
                setHigh(4)
                crowSetTime()
            } 
            if(currentTime >= 418 && currentTime < 418.3){ // 6:58
                setHigh(3)
                dogSetTime()
            }
            if(currentTime >= 423 && currentTime < 423.3){ // 7:03
                setHigh(2)
                dogSetTime()
            }
            if(currentTime >= 428 && currentTime < 428.3){ // 7:08
                setHigh(1)
                dogSetTime()
            }
            if(currentTime >= 436 && currentTime < 436.3){ // 7:16
                setHigh(0)
                crowSetTime()
                dogSetTime()
            }
        }

        if(audio){
            audio.addEventListener('timeupdate', receive);
        }
        return()=>{
            audio?.removeEventListener('timeupdate', receive);
        }
    },[audioRef.current, currentLyricsIndex])

    return(
        <>
            <audio ref={audioRef} src='/assets/audio/seonang_final.mp3' preload='metadata' autoPlay muted/> 
            {modal && <GasaModal setModal = {setModal}></GasaModal>}
            {showModal && <Modal setShowModal={setShowModal}/>}
            {yes && (
                <div className={styles.yesbtn} style={{position:'absolute', opacity:musicStart === 0 ? '1' : '0'}}>
                    <div className={styles.yesbtnbox}>
                        <div className={styles.yesbtnin}>
                            <p className={styles.yesp}>기도를 시작 하시겠습니까?</p>
                            <p className={styles.yesy} onClick={yesClick}>Y</p>
                        </div>
                        <p className={styles.yesdes}>{enterp}</p>
                    </div>
                </div>
            )}

            <div className={styles.seonangpage}>
                <div className={styles.seonangbox}>
                {magic && mobile !== null && android !== null && <Saju setSowonCount={setSowonCount} closeUnse = {closeUnse} mobile = {mobile} android = {android}/>}

                    <div className={styles.torchborder}>
                        <div className={styles.torchbox} style={{opacity: musicStart === 0 || musicStart === 1 ? '1': '0' }}>
                            {mobiletorch.map((e, i)=>{
                                return(
                                    <img src={mobiletorch[0]} key={i} className={styles.torch} alt='torch'></img>
                                )
                            })}
                        </div>
                        <div className={styles.torchbox} style={{opacity: musicStart === 2 ? '1': '0' }}>
                            {mobiletorch.map((e, i)=>{
                                return(
                                    <img src={mobiletorch[1]} key={i} className={styles.torch} alt='torch'></img>
                                )
                            })}
                        </div>
                        <div className={styles.torchbox} style={{opacity: musicStart === 3 ? '1': '0' }}>
                            {mobiletorch.map((e, i)=>{
                                return(
                                    <img src={mobiletorch[2]} key={i} className={styles.torch} alt='torch'></img>
                                )
                            })}
                        </div>
                    </div>
                    <div className={styles.marquee}>
                        <div className={styles.marqueetext} ref={marqueeTextRef}>
                        {
                            sowonContents && sowonContents.sowons.map((e, i)=>{
                                return(
                                    <div ref={(element) => {
                                            if (element) {
                                                // 배열의 i번째 위치에 요소를 저장합니다.
                                                marqueeRef.current[i] = element;
                                            }
                                        }} className={styles.marqueebox} key={i}>
                                        <p style={{color:'white'}} >{e.contents}</p>
                                    </div>
                                )
                            })
                        }
                        </div>
                    </div>


                    {/* mix-blend-mode 사용?? */}
                    <div className={styles.centerimg}>
                        <div className={styles.pilar}>
                            <animated.div style={{ opacity: opacity , zIndex:'100'}}>
                                <Link className={styles.homebox} style={{textDecoration:'none'}}href={'/'}><p className={styles.home}>홈으로</p></Link>
                                <img src='/assets/img/gasa.png' className={styles.paper} onClick={ openModal } alt='paper' style={{cursor: "pointer"}}></img>
                            </animated.div>
                            <div style={{position:'relative', width:'5rem', height:'10.8rem'}}>
                                <img src='/assets/img/torch_none.webp' style={{ opacity: musicStart === 0 || musicStart === 1 ? '1' : '0' }} className={styles.torchimg} alt='torch'></img>
                                <img src='/assets/gifs/torchstart.gif' style={{ opacity: musicStart === 2 ? '1' : '0' }} className={styles.torchimg} alt='torch'></img>
                                <img src='/assets/gifs/torchmove.gif' style={{ opacity: musicStart === 3 ? '1' : '0' }} className={styles.torchimg} alt='torch'></img>
                            </div>
                        </div>

                        <animated.div className={styles.treebox} ref={treeRef} style={{opacity: opacity}}>
                            <animated.img className={styles.crowright} src='/assets/gifs/crow_right.gif' alt='rightcrow' style={{opacity: crowOpacity}}></animated.img>
                            <animated.img className={styles.crowleft} src='/assets/gifs/crow_left.gif' alt='leftcrow' style={{opacity: crowOpacity}}></animated.img>
                            <img className={styles.dogsit} src={dog || dogTwo ? '/assets/img/dog_standing.webp' : '/assets/img/dog_sit.webp'} alt='dotsit'></img>

                            <img className={styles.tree} style={{opacity: high === 0 ? '1' : '0'}} src='/assets/gifs/tree.gif' alt='seonangtree'></img>
                            <img className={styles.tree} style={{opacity: high === 1 ? '1' : '0'}} src='/assets/gifs/tree2.gif' alt='seonangtree'></img>
                            <img className={styles.tree} style={{opacity: high === 2 ? '1' : '0'}} src='/assets/gifs/tree3.gif' alt='seonangtree'></img>
                            <img className={styles.tree} style={{opacity: high === 3 ? '1' : '0'}} src='/assets/gifs/tree4.gif' alt='seonangtree'></img>
                            <img className={styles.tree} style={{opacity: high === 4 ? '1' : '0'}} src='/assets/gifs/tree5.gif' alt='seonangtree'></img>
                            <div className={styles.garaoke}>
                                <p>{lyrics[currentLyricsIndex].text}</p>
                            </div>
                        </animated.div>

                        <div className={styles.pilar}>
                            <div style={{paddingBottom:'1.5rem'}}>
                                <animated.img ref={cdRef} style={{opacity: opacity}} src='/assets/img/cd.webp' className={styles.cd} alt='cd'></animated.img>
                                <animated.div className={styles.homebox} onClick={handleIcon} style={{opacity: opacity, cursor: "pointer"}}><img className={styles.cd} src='/assets/img/photo.webp'></img></animated.div>
                            </div>
                            <div style={{position:'relative', width:'5rem', height:'10.8rem'}}>
                                <img src='/assets/img/torch_none.webp' style={{ opacity: musicStart === 0 || musicStart === 1 ? '1' : '0' }} className={styles.torchimg} alt='torch'></img>
                                <img src='/assets/gifs/torchstart.gif' style={{ opacity: musicStart === 2 ? '1' : '0' }} className={styles.torchimg} alt='torch'></img>
                                <img src='/assets/gifs/torchmove.gif' style={{ opacity: musicStart === 3 ? '1' : '0' }} className={styles.torchimg} alt='torch'></img>
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.waterdec}>
                    <animated.p style={{position: "absolute", width: "100%", opacity: opacity, fontFamily:'DOSGothic'}}>
                        {'정한수에 손가락을 대고 소원을 빌면서\n그릇을 따라 세 번 돌리면\n당신의 부름이 서낭신께 전달됩니다...'}
                    </animated.p>
                </div>

                <div className={styles.waterbox}>
                    {bingle && (<img className={styles.magiceffect} src='/assets/gifs/water.gif' alt='watermove'></img>)}
                    <animated.img src='/assets/img/water.webp' className={styles.water} style={{opacity : opacity}} alt='water'></animated.img>
                    <div className={styles.bingle}>
                        <div ref={bingleContainerRef}></div>
                    </div>
                </div>


                <animated.div className={styles.hadan} style={{opacity: opacity}}>
                    <div style={{display:'flex', flexDirection:'column', width:'100%', gap:'0.5rem'}}>
                        <div style={{display:'flex', justifyContent:'flex-start'}} onClick={handleIcon}><img className={styles.cd} src='/assets/img/photo.webp'></img></div>
                        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                            <img src='/assets/img/gasa.png' style={{position:'relative', zIndex:'10000'}} className={styles.paper} onClick={ openModal } alt='paper'></img>
                            <img ref={mobileCdRef} style={{opacity: opacity}} src='/assets/img/cd.webp' className={styles.cd} alt='cd'></img>
                            <Link className={styles.homebox} style={{textDecoration:'none', position:'relative', zIndex:'10000'}}href={'/'}><p className={styles.home}>홈으로</p></Link>
                        </div>
                    </div>
                </animated.div>
            </div>
        </>
    )
}

// 구버전
// useEffect(()=>{
//     if(marqueeRef.current && sowonContents){
//         setLastLength(sowonContents.sowons.length);

//         let sum = 0;
//         if(lastLength !== sowonContents.sowons.length){
//             // console.log('같지않냐?')
//             sum = 0;
//         }
//         marqueeRef.current.forEach((e)=>{
//             sum += e.clientWidth;
//         });
//         const gap = (marqueeRef.current.length - 1) * 16
//         const final = sum + gap;
//         const animationDuration = final / 230;

//         // console.log(sum)
//         if(final > 0) {
//             marqueeTextRef.current.style.width = `${final}px`;
//             marqueeTextRef.current.style.animation = `${styles.marqueeslide} ${animationDuration}s linear infinite`;
//         }
//     }
// },[marqueeRef.current, sowonContents, marqueeTextRef.current])