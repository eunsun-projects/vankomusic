'use client';

import styles from '@/styles/home.module.css';
import supabase from '@/utils/supabase/client';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const VankoProfile = dynamic(() => import('@/components/common/vankoprofile'), { ssr: false });
const Timer = dynamic(() => import('@/components/common/timer'), { ssr: false });

export default function Hadan() {
  const [currentVisits, setCurrentVisits] = useState('000000');

  useEffect(() => {
    const visits = localStorage.getItem('visits');
    if (!visits) {
      supabase
        .from('visits')
        .update(({ visits }: { visits: number }) => ({ visits: visits + 1 }))
        .select('visits')
        .single()
        .then(({ data, error }) => {
          if (error) {
            console.error('Error fetching visitors:', error);
          } else {
            setCurrentVisits(data.visits.toString());
          }
        });
      sessionStorage.setItem('visits', 'old');
    }
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
