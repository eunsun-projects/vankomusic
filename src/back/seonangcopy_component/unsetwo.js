import styles from '@/app/seonangcopy/page.module.css'
import { use, useState } from 'react';

const taropicture = [
    '/assets/img/picture1.png',
    '/assets/img/picture2.png',
    '/assets/img/picture3.png'
]


export default function UnseTwo({setUnseTwo}){
    const [openPicture, setOpenPicture] = useState(false);
    const [select, setSelect] = useState(false);

    const openTaro = (i) => (e) => {
        setSelect(true);
        setOpenPicture(!openPicture);
        const target = e.currentTarget;
        target.src = taropicture[i]
    }

    const closeUnseTwo = () => {
        setUnseTwo(false);
    }
    return(
        <>
        <div className={styles.unseone}>
            <div className={styles.unsebackground}>
                <p onClick={closeUnseTwo} className={styles.x}>X</p>
                <div className={styles.unseimgdiv}>
                    <p className={styles.unsetwop}>아래의 카드 중 1가지를 선택하세요.</p>
                    <div className={styles.taro}>
                        {
                            taropicture.map((e, i)=>{
                                return(
                                    <img key={i} onClick={openTaro(i)} src='/assets/img/backtaro.png' className={styles.tarocard} style={{pointerEvents : select ? 'none' : 'all'}}></img>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}