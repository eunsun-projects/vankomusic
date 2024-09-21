'use client';
import VankoLogo from '@/class/vankoLogoClass';
import { useEffect, useRef } from 'react';
import styles from '../page.module.css';

export default function VankoMainLogo() {
  const vankologoRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (vankologoRef.current) {
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
      };
    }
  }, [vankologoRef]);

  return <div ref={vankologoRef} className={styles.vankologo}></div>;
}
