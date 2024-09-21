import styles from '@/styles/home.module.css';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';

export default function Timer() {
  const [nowtime, setNowtime] = useState(dayjs().format('HH:mm:ss MM/DD'));

  useEffect(() => {
    //날짜시간//
    const intervalId = setInterval(() => {
      const daytime = dayjs().format('HH:mm:ss MM/DD');
      setNowtime(daytime);
    }, 1000); // 1초마다 업데이트

    return () => {
      clearInterval(intervalId); // 컴포넌트 unmount 시 clearInterval 호출
    };
  }, []);

  return <p className={styles.time}>{nowtime}</p>;
}
