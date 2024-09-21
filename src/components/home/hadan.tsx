'use client';
import styles from '@/styles/home.module.css';
import { fetchVisits } from '@/utils/fetchVisits';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const VankoProfile = dynamic(() => import('@/components/common/vankoprofile'), { ssr: false });
const Timer = dynamic(() => import('@/components/common/timer'), { ssr: false });

export default function Hadan() {
  const [currentVisits, setCurrentVisits] = useState('000000');

  useEffect(() => {
    // 방문자 수를 갱신하는 함수 수정 요망
    fetchVisits()
      .then((visitcounts) => {
        console.log(visitcounts);
        setCurrentVisits(visitcounts.toString());
      })
      .catch((err) => console.log(err));
  }, []); // 페이지에 접속할 때마다 실행됩니다.

  return (
    <>
      <div className={styles.visit}>
        <p style={{ fontFamily: 'auto' }}>visitor #</p>
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
  );
}
