'use client';

import useAuth from '@/hooks/auth/auth.hook';
import { useAudiosQuery, useCurationsQuery, useVideosQuery } from '@/hooks/queries';
import styles from '@/styles/admin.module.css';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useState } from 'react';
import ArchiveAdmin from './archiveadmin';
import CurationAdmin from './curationadmin';
import MainAdmin from './mainadmin';

export default function AdminTemplate() {
  const { data: videos } = useVideosQuery();
  const { data: curations } = useCurationsQuery();
  const { data: audios } = useAudiosQuery();
  const { logOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams(); // useSearchParams 메서드로 클라이언트 사이드에서 쿼리파라미터 값 가져오기
  const id = searchParams.get('id'); // useSearchParams 메서드로 클라이언트 사이드에서 쿼리파라미터 값 가져오기

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      return params.toString();
    },
    [searchParams],
  );

  const [view, setView] = useState(id ? Number(id) : 0);

  const handleMain = () => {
    router.push(pathname + '?' + createQueryString('id', '0'));
    setView(0);
  };
  const handleArchive = () => {
    router.push(pathname + '?' + createQueryString('id', '1'));
    setView(1);
  };
  const handleCuration = () => {
    router.push(pathname + '?' + createQueryString('id', '2'));
    setView(2);
  };

  return (
    <>
      <div className={styles.adminpage}>
        <div style={{ display: 'flex', width: '100%', backgroundColor: 'blue' }}>
          <div className={styles.logoutbtn} onClick={logOut}>
            Logout
          </div>
        </div>
        <span className={styles.admintitle}>Vanko Admin</span>

        <div className={styles.adminnav}>
          <div className={styles.navflex} onClick={handleMain}>
            <div className={styles.iconbox}>
              <Image
                src="/assets/img/adminicon0.webp"
                style={{ width: '3rem', height: 'auto' }}
                alt="adminicon0"
                unoptimized
              />
            </div>
            <p className={styles.navbtn}>admin 메인</p>
          </div>

          <div className={styles.navflex} onClick={handleArchive}>
            <div className={styles.iconbox}>
              <Image
                src="/assets/img/adminicon4.webp"
                style={{ width: '3.5rem', height: 'auto' }}
                alt="adminicon4"
                unoptimized
              />
            </div>
            <p className={styles.navbtn}>아카이브 관리</p>
          </div>

          <div className={styles.navflex} onClick={handleCuration}>
            <div className={styles.iconbox}>
              <Image
                src="/assets/img/adminicon2.webp"
                style={{ width: '3.5rem', height: 'auto' }}
                alt="adminicon2"
                unoptimized
              />
            </div>
            <p className={styles.navbtn}>큐레이션 관리</p>
          </div>
        </div>
      </div>
      {/** 메인 */}
      <div className="main" style={{ display: view === 0 ? 'block' : 'none', height: '100%' }}>
        {audios && <MainAdmin audios={audios} />}
      </div>
      {/** 아카이브관리 */}
      <div className="archive" style={{ display: view === 1 ? 'block' : 'none', height: '100%' }}>
        {videos && <ArchiveAdmin videos={videos} />}
      </div>
      {/** 큐레이션관리 */}
      <div className="curation" style={{ display: view === 2 ? 'block' : 'none', height: '100%' }}>
        {curations && videos && <CurationAdmin videos={videos} curations={curations} />}
      </div>
    </>
  );
}
