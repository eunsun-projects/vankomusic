import Config from "../config/config.export";
import { basicMeta, basicViewport } from "./basicmeta";
import styles from '@/app/home/page.module.css'
import Floatings from "./home/_components/floatings";
import VankoMainLogo from "./home/_components/vankomainlogo";
import BorderLine from "./home/_components/borderline";
import VanPlayer from "@/components/vanplayer/vanplayer";
import Link from "next/link";
import MainGallery from "./home/_components/maingallery";
import Hadan from "./home/_components/hadan";
import { vastshadow, lobster, silkscreen } from '@/app/layout.js';
import { Suspense } from "react";
import Loading from "./loading";
// import {headers} from 'next/headers'
// import VankoHome from "@/components/home/homepage";

export const metadata = basicMeta;
export const viewport = basicViewport;

export const dynamic = 'force-dynamic'; // 240105 이걸로 해결했었는데, POST요청을 모두 GET요청으로 바꿔서 일단 주석처리, 그랬다가 다시 안되서 켬,,

const tableImgUrl = [
    {
        url: 'url(/assets/img/seonangthumb.webp)',
        tablelink: '/seonang',
        tabletext: `Past>>>\n`,
        tabletext2: `서낭축원`,
        color: '#ffff0091',
        per: '50%'
    },
    {
        url: 'url(/assets/img/eclipsethumb.webp)',
        tablelink: '',
        tabletext: `Upcoming>>>\n`,
        tabletext2: `Eclipse`,
        color: '#ffff0091',
        per: '50%'
    }
];

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

const linkBtnText = ['instagram','youtube','contact'];

export async function getData(){

    const req = {
        method: 'GET',
        // cache : 'no-store',
        headers: {
            'Authorization' : `Bearer ${process.env.POST_TOKEN}`
        },
    };

    try{
        // const response = await fetch(`${Config().baseUrl}/api/selected`, req);
        const mp3Response = await fetch(`${Config().baseUrl}/api/audioget`, req);
        // const visitResponse = await fetch(`${Config().baseUrl}/api/visitors`, req);

        // if (!response.ok) {
        //     const errorResponse = await response.text();
        //     throw new Error(`Failed to fetch data from /api/selected: Status ${response.status} - ${errorResponse}`);
        // }
    
        if (!mp3Response.ok) {
            const errorResponse = await mp3Response.text();
            throw new Error(`Failed to fetch data from /api/audioget: Status ${mp3Response.status} - ${errorResponse}`);
        }
    
        // if (!visitResponse.ok) {
        //     const errorResponse = await visitResponse.text();
        //     throw new Error(`Failed to fetch data from /api/visitors: Status ${visitResponse.status} - ${errorResponse}`);
        // }

        // const result = await response.json();
        const mp3Result = await mp3Response.json();
        // const visitResult = await visitResponse.json();

        // const selectVideo = result.videos;
        const selectedAudio = mp3Result.audios;
        // const visits = visitResult.visits;

        // console.log('data 성공');

        return {
            // selectVideo : selectVideo,
            selectedAudio : selectedAudio,
            // visits : visits
        }
        
    }catch(error){
        console.error('Error during fetch: ', error.message);        
        // return []
    }
};

export default async function Home() {
    // const headersList = headers(); // 스택오버플로우에서 찾은 어이없는 해결방법... 해결이 되긴 함
    const selectedData = await getData();

    return (
        <Suspense fallback={<Loading/>}>
            <div style={{minHeight : '100vh', overflowY: "auto"}}>

                <div className={styles.back}>

                    <Floatings />

                    <div className={styles.title0}>
                        <div className={styles.marqueecontent}>
                            <img src='/assets/gifs/dragon.gif' style={{width:'2.5rem', height:'2.5rem'}}></img>
                            <p>{"Welcome to Vanko's Home! Relax with computer music, art and etc..."}</p>
                            <img src='/assets/gifs/dragon.gif' style={{width:'2.5rem', height:'2.5rem'}}></img>
                        </div>
                    </div>

                    <VankoMainLogo />

                    <BorderLine />

                    <div className={styles.title3} style={{fontFamily:'auto'}}><p>★Now Showing★</p></div>

                    <VanPlayer bgmsList={selectedData.selectedAudio}/>

                    <table className={`${styles.vantable} ${vastshadow.variable}`}>
                        <thead></thead>
                        <tbody>
                            <tr>
                                <td className={styles.project} colSpan="2">
                                    <div style={{display:'flex', justifyContent:'center', alignItems:'center', touchAction:'none'}}>
                                        <Link href={'/ffd'} prefetch={false} scroll={false}>
                                            <div className={styles.glitchmain} style={{backgroundImage: 'url(/assets/img/ffdthumb.webp)'}}>
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
                                                    <Link href={e.tablelink} target='_blank' prefetch={false}>
                                                        <div className={styles.glitch} style={{backgroundImage: e.url, width: e.per, margin:'0 auto', filter:'brightness(0.6)'}}>
                                                            <div className={`${styles.channel} ${styles.r}`}></div>
                                                            <div className={`${styles.channel} ${styles.g}`}></div>
                                                            <div className={`${styles.channel} ${styles.b}`}></div>
                                                        </div>
                                                    </Link>
                                                    : <div className={styles.glitch} style={{backgroundImage: e.url, width: e.per, margin:'0 auto', filter:'brightness(0.8)'}}>
                                                        <div className={`${styles.channel} ${styles.r}`}></div>
                                                        <div className={`${styles.channel} ${styles.g}`}></div>
                                                        <div className={`${styles.channel} ${styles.b}`}></div>
                                                    </div>
                                                }
                                            </td >
                                            <td className={`${styles.bordertd} ${styles.bordertdright}`} style={{color: e.color}}>{e.tabletext}<span className={`${styles.tabletitle} ${styles.vantableko} ${vastshadow.variable}`}>{e.tabletext2}</span></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                    <BorderLine />

                    <MainGallery />

                    <div className={styles.arcbtnbox}>
                        <Link href='/archive' prefetch={false}><p className={`${styles.arcbtn} ${silkscreen.className}`}>archive</p></Link>
                    </div>

                    <div className={`${styles.link} ${lobster.className}`}>
                        {
                            linkBtnUrl.map((e, i)=>{
                                return(
                                        <div className={styles.link2} key={i}>
                                            <Link prefetch={false} href={e.url} target={e.target}>{linkBtnText[i]}</Link>
                                        </div>
                                )
                            })
                        }
                    </div>

                    <Hadan/>

                </div>
            </div>
        </Suspense>
    )
}

