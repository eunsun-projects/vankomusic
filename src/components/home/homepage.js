'use client'
import Link from 'next/link'
import { fetchVisits } from '@/utils/fetchVisits';
import dynamic from 'next/dynamic'
import styles from '@/app/home/page.module.css'
import React, { useState, useEffect, useRef } from 'react';
import VankoLogo from '@/class/vankoLogoClass';
import { vastshadow, lobster, righteous, silkscreen } from '@/app/layout.js';
// import VankoProfile from '@/components/elements/vankoprofile.js';
import VanPlayer from '../vanplayer/vanplayer.js';
import Modal from '../elements/modal.js';

// const Modal = dynamic(() => import('../elements/modal.js'), {ssr: false})
// const VanPlayer = dynamic(() => import('../vanplayer/vanplayer.js'), {ssr: false});
const VankoProfile = dynamic(() => import('@/components/elements/vankoprofile.js'), {ssr: false});
const Timer = dynamic(() => import('../elements/timer.js'), {ssr: false});
const Floating = dynamic(() => import("../elements/floating.js"), { ssr: false });

const linkBtnUrl = [
    {
        url: "https://www.instagram.com/vanko.live",
        target: "_blank"
    },
    {
        url: "https://www.youtube.com/@vankolive",
        target: "_blank"
    },
    {
        url: "/contact",
        target: "_self"
    }
];

const linkBtnText = ['instagram','youtube','contact']

const tableImgUrl = [
    {
        url: 'url(/assets/img/ffd/10.webp)',
        tablelink: '',
        tabletext: `Upcoming>>>\n`,
        tabletext2: `FFD`,
        color: '#ffff0091',
        per: '50%'
    }
    // {
    //     url: 'url(/assets/img/next.webp)',
    //     tablelink: '',
    //     tabletext: `The FFD is coming`,
    //     color: '#ffff0091',
    //     per: '100%'
    // }
];

export default function VankoHome({selectedData, audios, visits}) {
    const [showModal, setShowModal] = useState(false);
    const [currentVisits, setCurrentVisits] = useState(visits);
    const [modalPack, setModalPack] = useState({});

    const vankologoRef = useRef(); 
    const rafRef = useRef();

    const openModal = (item) => () => {
        // console.log(item)
        setModalPack(item);
        setShowModal(true);
    };

    useEffect(() => {
        // 방문자 수를 갱신하는 함수
        fetchVisits();
    }, []); // 페이지에 접속할 때마다 실행됩니다.

    useEffect(()=>{
        if(vankologoRef.current) {
            //돌아가는로고//
            const vankologo = new VankoLogo(vankologoRef.current);

            window.onresize = vankologo.resize.bind(vankologo);
            vankologo.resize();

            // 렌더링 루프 시작
            function animate() {
                vankologo.render(); // 실제 렌더링 함수
                rafRef.current = requestAnimationFrame(animate);
            }
            animate();

            return () => {
                if (rafRef.current) {
                    cancelAnimationFrame(rafRef.current);
                }
                window.onresize = null;
                vankologo._destroy(); //반코로고클래스 리소스해제
            }
        }   
    },[vankologoRef]);
    
    return (      
        <>
        
        <div className={styles.back}>

            <Floating src='/assets/gifs/fire.gif'/>
            <Floating src='/assets/gifs/fire.gif' zindex={5} scalex={'scaleX(-1)'}/>

            <div className={styles.title0}>
                <div className={styles.marqueecontent}>
                    <img src='/assets/gifs/dragon.gif' style={{width:'2.5rem', height:'2.5rem'}}></img>
                    <p>{"Welcome to Vanko's Home! Relax with computer music, art and etc..."}</p>
                    <img src='/assets/gifs/dragon.gif' style={{width:'2.5rem', height:'2.5rem'}}></img>
                </div>
            </div>

            <div ref={vankologoRef} className={styles.vankologo}></div>

            <Borderline></Borderline>

            <div className={styles.title3} style={{fontFamily:'auto'}}><p>★Now Showing★</p></div>

            <VanPlayer bgmsList={audios}/>

            <table className={`${styles.vantable} ${vastshadow.className}`}>
                <thead></thead>
                <tbody>
                    <tr>
                        <td className={styles.project} colSpan="2">
                            <div style={{display:'flex', justifyContent:'center', alignItems:'center', touchAction:'none'}}>
                                <Link href={'/seonang'}>
                                    <div className={styles.glitchmain} style={{backgroundImage: 'url(/assets/img/seonangthumb.webp)'}}>
                                        <div className={`${styles.channel} ${styles.r}`}></div>
                                        <div className={`${styles.channel} ${styles.g}`}></div>
                                        <div className={`${styles.channel} ${styles.b}`}></div>
                                    </div>
                                </Link>
                            </div>
                            {/* <p style={{textAlign:'center', whiteSpace:'pre-line'}}>{`[서낭축원 seonang]\nGojobul released Seonanggo too...`}</p> */}
                        </td>
                    </tr>
                    {
                        tableImgUrl.map((e, i)=>{
                            return(
                                <tr key={i}> 
                                    <td className={styles.bordertd} style={{width:'40%'}}>
                                        { 
                                            e.tablelink ?
                                            <Link href={e.tablelink} target='_blank'>
                                                <div className={styles.glitch} style={{backgroundImage: e.url, width: e.per, margin:'0 auto'}}>
                                                    <div className={`${styles.channel} ${styles.r}`}></div>
                                                    <div className={`${styles.channel} ${styles.g}`}></div>
                                                    <div className={`${styles.channel} ${styles.b}`}></div>
                                                </div>
                                            </Link>
                                            : <div className={styles.glitch} style={{backgroundImage: e.url, width: e.per, margin:'0 auto', filter:'brightness(0.5)'}}>
                                                <div className={`${styles.channel} ${styles.r}`}></div>
                                                <div className={`${styles.channel} ${styles.g}`}></div>
                                                <div className={`${styles.channel} ${styles.b}`}></div>
                                            </div>
                                        }
                                    </td >
                                    <td className={`${styles.bordertd} ${styles.bordertdright}`} style={{color: e.color}}>{e.tabletext}<span className={styles.tabletitle}>{e.tabletext2}</span></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
            
            <Borderline></Borderline>
            

            {/** 클라이언트 */}
            { Object.values(modalPack).length > 0 && showModal && <Modal setShowModal = {setShowModal} modalPack = {modalPack}></Modal>}

            <div className={styles.maingallery}>
                {
                    selectedData.map((e,i)=>{
                        return(
                            <div className={styles.gallerybox} key={i}>
                                <div className={styles.imgbox}>
                                    <img className={styles.galleryimg} onClick={ openModal(e)} src={e.thumb}></img>
                                </div>
                                <p className={`${styles.gallerytext} ${righteous.className}`}>{e.title}</p>
                            </div>
                        )
                        
                    })
                    }
            </div>

            


            {/** 서버 */}

            <div className={styles.arcbtnbox}>
                <Link href='/archive'><p className={`${styles.arcbtn} ${silkscreen.className}`}>archive</p></Link>
            </div>

            <div className={`${styles.link} ${lobster.className}`}>
                {
                    linkBtnUrl.map((e, i)=>{
                        return(
                                <div className={styles.link2} key={i}>
                                    <Link href={e.url} target={e.target}>{linkBtnText[i]}</Link>
                                </div>
                        )
                    })
                }
            </div>

            {/** 클라이언트 */}

            <div className={styles.visit}>
                <p style={{fontFamily:'auto'}}>visitor #</p>
                <p className={styles.visitcount}> &nbsp;{currentVisits}</p>
            </div>

            <Timer />

            <div className={styles.profile}>
                <VankoProfile></VankoProfile>
            </div>

            <div className={styles.homefooter}>
                <p>ⓒ2024.vankomusic.</p>
            </div>



        </div>
        </>
    )
}

function Borderline(){
    return(
        <div className={styles.borderbox}>
                <div className={styles.borderimgdiv} style={{justifyContent:'flex-end'}}><img src='/assets/img/pizza.webp' className={styles.borderimg} style={{transform: 'scaleX(-1)'}}></img></div>
                <div className={`${styles.line} ${styles.linetrans}`}></div>
                <div className={styles.borderimgdiv}><img src='/assets/img/pizza.webp' className={styles.borderimg}></img></div>
        </div>
    )
}