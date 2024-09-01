'use client'
import { signIn, signOut } from "next-auth/react"
import { useState, useCallback } from "react"
import ArchiveAdmin from "./archiveadmin";
import CurationAdmin from "./curationadmin";
import MainAdmin from "./mainadmin";
import styles from '@/components/admin/page.module.css'
import { usePathname, useSearchParams, useRouter } from 'next/navigation'; // app 라우터 사용시 무조건 next/navigation 임!!!

export default function AdminPage({session, videoall, curation}) {
    // console.log(videoall)
    // console.log(curation)
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();// useSearchParams 메서드로 클라이언트 사이드에서 쿼리파라미터 값 가져오기
    const id = searchParams.get('id'); // useSearchParams 메서드로 클라이언트 사이드에서 쿼리파라미터 값 가져오기

    const createQueryString = useCallback((name, value) => {
            const params = new URLSearchParams(searchParams);
            params.set(name, value);
        
            return params.toString();
    },[id])

    const [view, setView] = useState(id ? Number(id) : 0);

    const handleMain = () => {
        router.push(pathname + '?' + createQueryString('id', '0'))
        setView(0);
        // window.location.href = '/vankoadmin?id=0';
    }
    const handleArchive = () => {
        router.push(pathname + '?' + createQueryString('id', '1'))
        setView(1);
        // window.location.href = '/vankoadmin?id=1';
    }
    const handleCuration = () => {
        router.push(pathname + '?' + createQueryString('id', '2'))
        setView(2);
        // window.location.href = '/vankoadmin?id=2';
    }

    return(
        <>
            { session && (session.user.email === process.env.NEXT_PUBLIC_SCREEN_MAIL || session.user.email === process.env.NEXT_PUBLIC_VANKO_MAIL) ? 
                (
                    <>
                        <div className={styles.adminpage}>
                            <div style={{ display: 'flex', width: '100%', backgroundColor:'blue'}}>
                                <div className={styles.logoutbtn} onClick={() => signOut() }>Logout</div>
                            </div>
                            <span className={styles.admintitle}>Vanko Admin</span>
                            
                            <div className={styles.adminnav}>
                                <div className={styles.navflex} onClick={handleMain}>
                                    <div className={styles.iconbox}>
                                        <img src="/assets/img/adminicon0.webp" style={{width:'3rem', height:'auto'}}></img>
                                    </div>
                                    <p className={styles.navbtn}>admin 메인</p>
                                </div>

                                <div className={styles.navflex} onClick={handleArchive}>
                                    <div className={styles.iconbox}>
                                        <img src="/assets/img/adminicon4.webp" style={{width:'3.5rem', height:'auto'}}></img>
                                    </div>
                                    <p className={styles.navbtn}>아카이브 관리</p>
                                </div>

                                <div className={styles.navflex} onClick={handleCuration}>
                                    <div className={styles.iconbox}>
                                        <img src="/assets/img/adminicon2.webp" style={{width:'3.5rem', height:'auto'}}></img>
                                    </div>
                                    <p className={styles.navbtn}>큐레이션 관리</p>
                                </div>
                            </div>
                            
                        </div>
                        {/** 메인 */}
                        <div className="main" style={{display: view === 0 ? 'block' : 'none', height:"100%"}}>
                            <MainAdmin />
                        </div>
                        {/** 아카이브관리 */}
                        <div className="archive" style={{display: view === 1 ? 'block' : 'none', height:"100%"}}>
                            <ArchiveAdmin videoall={videoall.videos}/>
                        </div>
                        {/** 큐레이션관리 */}
                        <div className='curation' style={{display: view === 2 ? 'block' : 'none', height:"100%"}}>
                            <CurationAdmin videoall={videoall.videos} curation={curation.videos}/>
                        </div>
                        
                    </>
                )
                : 
                <div className={styles.loginpage}> 
                    <span >구글로 로그인 해 주세요.</span><div className={styles.loginbtn} onClick={() => signIn()}>로그인</div>
                </div>
            }
        </>
    )
}