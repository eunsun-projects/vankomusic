'use client'
import { fetchVisits } from '@/utils/fetchVisits';
import dynamic from 'next/dynamic'
import styles from '@/app/home/page.module.css'
import React, { useState, useEffect } from 'react';

const VankoProfile = dynamic(() => import('@/components/elements/vankoprofile.js'), {ssr: false});
const Timer = dynamic(() => import('@/components/elements/timer.js'), {ssr: false});

export default function Hadan() {
    const [currentVisits, setCurrentVisits] = useState('000000');

    useEffect(() => {
        // 방문자 수를 갱신하는 함수
        fetchVisits()
            .then((visitcounts)=>{
                // if(!visitcounts){
                //     setCurrentVisits(visits)
                // }else{
                    console.log(visitcounts)
                    setCurrentVisits(visitcounts.toString())
                // }
            })
            .catch((err)=>console.log(err))
    }, []); // 페이지에 접속할 때마다 실행됩니다.
    
    return (      
        <>
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
        </>
    )
}