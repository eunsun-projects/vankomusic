'use client'
import styles from "@/app/ffd/page.module.css"
import FfdDrag from "@/components/ffd/ffddrag";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import FfdModal from "@/app/ffd/_component/modal";
import FfdCarousel from "@/app/ffd/_component/carousel";

export default function FfdPage({imgarr}){
    const [redBtn, setRedBtn] = useState(true);
    const [imgs, setImgs] = useState(null); //초기화가 null 이니까
    const [mobile, setMobile] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showCarousel, setShowCarousel] = useState(false);
    const [relayPlay, setRelayPlay] = useState(null);
    const [currTime, setCurrTime] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const audioRef = useRef();
    const gridRef = useRef();

    useEffect(()=>{
        // null 일때만 setState 해!
        if(imgs === null){
            setImgs(imgarr);
        }
    },[imgarr]);

    useEffect(() => {
        if(window.innerWidth < 500){
            setMobile(true);
        }else{
            setMobile(false);
        }

        // 페이지 컴포넌트가 마운트될 때 body에 클래스 추가
        document.body.classList.add('ffdscroll');

        // 클린업 함수를 통해 페이지 컴포넌트가 언마운트될 때 클래스 제거
        return () => {
            document.body.classList.remove('ffdscroll');
        };
    },[]);

    useEffect(() => {
        if(!audioRef.current) return;
        const sum = audioRef.current.currentTime + seconds;
        if(sum <= audioRef.current.duration){
            audioRef.current.currentTime = sum;
        }
        if(relayPlay === false && audioRef.current.ended === false){
            audioRef.current.play();
            setRelayPlay(true);
        }
    },[relayPlay]);

    useEffect(() => {
        let interval;
        if (showModal) {
            interval = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
        } else {
            setSeconds(0); // 모달이 닫힐 때 시간을 리셋합니다.
        }
    
        return () => clearInterval(interval); // 컴포넌트 언마운트 또는 모달 닫힐 때 인터벌 정리
    }, [showModal]);

    const scrollBottom = (e) => {
        e.preventDefault();
    
        // 스크롤 가능한 최대 높이 계산
        const maxScrollTop = gridRef.current.scrollHeight - gridRef.current.clientHeight;
    
        if ('scrollBehavior' in document.documentElement.style) {
            if (mobile) {
                // 현재 스크롤 위치 + 이동하려는 거리가 최대 스크롤 위치를 넘지 않도록 조정
                const newScrollTop = Math.min(gridRef.current.scrollTop + 300, maxScrollTop);
    
                gridRef.current.scrollBy({
                    top: newScrollTop - gridRef.current.scrollTop, // 실제로 이동해야 하는 거리 계산
                    behavior: 'smooth'
                });
            } else {
                gridRef.current.scroll({
                    top: maxScrollTop, // 최대 스크롤 높이로 설정
                    behavior: 'smooth'
                });
            }
        } else {
            gridRef.current.scrollTo(0, maxScrollTop); // 부드러운 스크롤이 지원되지 않을 때
        }
    };
    

    const scrollTop = (e) => {
        e.preventDefault();
        if ('scrollBehavior' in document.documentElement.style) {

            // 부드러운 스크롤이 지원되면 사용
            gridRef.current.scroll({
                top: 0,
                behavior: 'smooth'
            });
            
        } else {
            // 부드러운 스크롤이 지원되지 않으면 기본 스크롤 사용
            gridRef.current.scrollTo(0, 0);
        }
    };

    const songStart = (e) => {
        e.preventDefault();
        document.body.style.overflowY = 'auto';
        document.body.style.height = 'calc(var(--vh, 1vh) * 100)';

        if(audioRef.current){
            audioRef.current.volume = 0.5;
            audioRef.current.play()
                .then(()=>{
                    console.log('막을 클릭?');
                    setRedBtn(false);
                })
                .catch(e => {
                    console.log('재생 실패:', e);
                });;
        }
    };
    const songStartTouch = () => {
        document.body.style.overflowY = 'auto';
        document.body.style.height = 'calc(var(--vh, 1vh) * 100)';

        if(audioRef.current){
            audioRef.current.volume = 0.5;
            audioRef.current.play()
                .then(()=>{
                    console.log('핵무기 버튼 클릭됨!')
                    setRedBtn(false);
                })
                .catch(e => {
                    console.log('재생 실패:', e);
                });;
        }
    };

    const handleTimeUpdate = (e) => {
        setCurrTime(e.target.currentTime);
    };

    const handleTvClick = () => {
        setShowModal(true);
        audioRef.current.pause();
    };

    const handleCarouselClick = () => {
        setShowCarousel(true);
    }

    return(
        <>
            <audio ref={audioRef} src='/assets/audio/ffd.mp3' preload='metadata' onTimeUpdate={handleTimeUpdate}/>

            {showModal && <FfdModal setShowModal={setShowModal} currTime={currTime} setRelayPlay={setRelayPlay}></FfdModal>}
            {showCarousel && <FfdCarousel setShowCarousel={setShowCarousel} mobile={mobile} />}

            <div style={{
                        height: "100vh", 
                        width: "100%", 
                        backgroundColor: "rgb(0 0 0 / 78%)", 
                        position: "fixed", 
                        zIndex: "10", 
                        display: redBtn ? "flex" : "none",
                        justifyContent: 'center',
                        alignItems: 'center'
                    }} 
                >
                <div className={styles.redbuttonbox}>
                    <div className={styles.redbuttoninner}>
                        <div className={styles.redbuttonglass}></div>
                        <div className={styles.redbuttonout}>
                            <div className={styles.redbutton} 
                                onClick={songStart}
                                // onTouchStart={songStart}
                                onTouchEnd={songStartTouch}></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className={styles.ffdpage} ref={gridRef}>

                <div className={styles.ffdbtnbottom}>
                    <div></div>
                    <img onClick={scrollBottom} className={styles.ffdbtnimg} src="/assets/img/ffd_bottom.webp" alt="imgtobottom"></img>
                    <div className={styles.ffdvankobox}>
                        <Link href={'/'} prefetch={false}>
                            <img className={styles.vankologo} src="/assets/img/ffd_vanko.webp"></img>
                        </Link>
                    </div>
                    {/* <div style={{display:'flex', alignItems:'center', justifyContent:'center'}} onClick={handleTvClick}><img className={styles.ffdtv} src="/assets/img/ffd_mv_icon.webp"></img></div> */}
                </div>

                <div className={styles.ffdgrid}>
                    {
                        imgs && imgs.map((e, i)=>{
                            return(
                                <FfdDrag imgarr={e} key={i}/>
                            )
                        })
                    }
                </div>

                <div className={styles.ffdbtntop}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'center'}} onClick={handleTvClick}><img className={styles.ffdtv} src="/assets/img/legotv2.webp"></img></div>
                    <img onClick={scrollTop} className={styles.ffdbtnimg} src="/assets/img/ffd_top.webp" alt="imgtotop"></img>
                    <div className={styles.ffdvankobox}>
                        <img className={styles.lock} src="/assets/img/lock.webp" onClick={handleCarouselClick}></img>
                    </div>
                </div>
                
                {/* <div>
                    <Link href={'/'} prefetch={false}>
                        <img className={styles.vankologo} src="/assets/img/ffd_vanko.webp"></img>
                    </Link>
                </div> */}
            </div>
        </>
    )
}

// useEffect(()=>{
    //     console.log(imgs)
    // },[imgs])

// const [bottomBtn, setBottomBtn] = useState(false);
// const [topBtn, setTopBtn] = useState(false);
// useEffect(() => {
//     const bottomBtnClick = () => {
//         setBottomBtn(true);
//     };

//     const topBtnClick = () => {
//         setTopBtn(true);
//     }

//     window.addEventListener('scroll', bottomBtnClick);
//     window.addEventListener('scroll', topBtnClick);
//     // 이벤트 리스너를 정리하는 함수를 올바르게 반환합니다.
//     return () => {
//         window.removeEventListener('scroll', bottomBtnClick);
//         window.removeEventListener('scroll', topBtnClick);
//     };
// },[])