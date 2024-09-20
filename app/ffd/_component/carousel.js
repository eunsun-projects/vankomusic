'use client'
import styles from '@/app/ffd/page.module.css'
import { CarouselProvider, Slider, Slide, Image, ButtonFirst, ButtonLast, ButtonPlay} from 'pure-react-carousel'
import Loader from './loader';
import Link from 'next/link';
import { useRef } from 'react';

function makeImgArr(){
    let imgarr = [];
    for(let i = 0; i < 54; i++ ){
        let imgstring = `/assets/img/ffd/${i}.webp`
        imgarr[i] = imgstring
    }
    return imgarr;
}

export default function FfdCarousel({setShowCarousel, mobile}){
    const carouselRef = useRef();
    const xRef = useRef();

    const slideimgarr = makeImgArr();

    const handleX = (e) => {
        if(e.target === carouselRef.current || e.target === xRef.current){
            setShowCarousel(false);
        }
    };

    return(
        <div ref={carouselRef} onClick={handleX} className={styles.modalcontain} style={{zIndex: '555', backgroundColor: "#000000ba"}}> 
            <div style={{width:'100%', display:'flex', justifyContent:'flex-end', color:'white', fontSize:'1.5rem', fontFamily:'DosGothic', cursor: "pointer"}}><span ref={xRef}>X</span></div>
            <div className={styles.centerbox}>
                <div className={styles.centerdiv}>
                    <div className={styles.modalp}>{`드래그 혹은 터치로 넘겨보실 수 있습니다.`}</div>
                    <p style={{textAlign:'center', lineHeight:'2.5rem'}}><Link href={'https://youtu.be/HV1Bg7adKto?si=0bGhQELJaAeF7HVE'} target='_blank' className={styles.modalp}>MV 보러가기</Link></p>

                    <div className={styles.carouselcontain} style={{width: mobile ? '90%' : '80%'}}>
                        <CarouselProvider
                            naturalSlideHeight={8}
                            naturalSlideWidth={8}
                            totalSlides={slideimgarr.length}
                            hasMasterSpinner
                            interval={1500}
                        >
                            <Slider spinner={()=><Loader/>}>
                                {
                                    slideimgarr.map((e, i)=>{
                                        return(
                                            <Slide key={i} index={i}>
                                                <Image src={e}></Image>
                                            </Slide>
                                        )
                                    })
                                }
                            </Slider>
                            <div className={styles.btns}>
                                <ButtonFirst className={styles.btn}>First</ButtonFirst>
                                <ButtonPlay className={styles.btn} childrenPaused={'Play'} childrenPlaying={'Pause'}></ButtonPlay>
                                <ButtonLast className={styles.btn}>Last</ButtonLast>
                            </div>
                        </CarouselProvider>
                    </div>
                </div>
            </div>
        </div>
    )
}