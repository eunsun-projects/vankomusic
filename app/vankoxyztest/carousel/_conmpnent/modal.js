'use client'
import styles from '@/app/vankoxyztest/carousel/page.module.css'
import { CarouselProvider, Slider, Slide, Image, ButtonFirst, ButtonLast, ButtonPlay} from 'pure-react-carousel'
import Loader from './loader';
import Link from 'next/link';

function makeImgArr(){
    let imgarr = [];
    for(let i = 0; i < 126; i++ ){
        let imgstring = `/assets/img/carousel/${i}.webp`
        imgarr[i] = imgstring
    }
    return imgarr;
}

export default function Modal({setShowModal}){
    const slideimgarr = makeImgArr();

    const handleX = () => {
        setShowModal(false)
    }

    return(
        <div className={styles.modalcontain}>
            <div style={{width:'100%', display:'flex', justifyContent:'flex-end', color:'white', fontSize:'1.5rem', fontFamily:'DosGothic'}}><span onClick={handleX}>X</span></div>
            <div className={styles.centerbox}>
                <div className={styles.modalp}>{`서낭축원: 뮤직비디오 이미지 스크린샷\n드래그 혹은 터치로 넘겨보실 수 있습니다.`}</div>
                <p style={{textAlign:'center', lineHeight:'2.5rem'}}><Link href={'https://youtu.be/L6Cqy26s9fI?si=o_tWF4Af0__wqfyh'} target='_blank' className={styles.modalp}>MV 보러가기</Link></p>

                <div className={styles.carouselcontain}>
                    <CarouselProvider
                        naturalSlideHeight={9}
                        naturalSlideWidth={16}
                        totalSlides={126}
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
    )
}