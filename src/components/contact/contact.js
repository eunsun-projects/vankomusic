import styles from '@/app/contact/page.module.css'
import { ref, getDownloadURL } from "firebase/storage";
import { storage } from '@/app/firebaseConfig';
import '@/app/globals.css'
import EmailForm from './emailform';
import Footer from '../footer/footer';

export default function Contact () {
    const pdfRef = ref(storage, 'assets/contact/pdf/vanko_request.pdf');

    const pdfDownLoad = () => {
        getDownloadURL(pdfRef)
            .then((url) => {
                // This can be downloaded directly:
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const blob = xhr.response;
                    const a = document.createElement('a'); // <a> 태그를 생성합니다.
                    a.style.display = 'none'; // 화면에 보이지 않게 설정합니다.
                    document.body.appendChild(a); // <a> 태그를 body에 추가합니다.
    
                    const urlBlob = window.URL.createObjectURL(blob);
                    a.href = urlBlob;
                    a.download = '작업의뢰서.pdf'; // 다운로드 될 파일의 이름을 설정합니다.
    
                    a.click(); // <a> 태그를 클릭하여 다운로드를 시작합니다.
    
                    window.URL.revokeObjectURL(urlBlob); // URL을 해제합니다.
                    document.body.removeChild(a); // <a> 태그를 body에서 제거합니다.
                };
                xhr.open('GET', url);
                xhr.send();
            })

            .catch((error) => {
            // Handle any errors
                console.log(error)
            }); 
    }

    return(
        <>
        <div className={styles.contactpage}>
            <div className={styles.contacttitle}>
                <img className={`${styles.contitleimg} ${styles.contitleimgl}`} src='/assets/img/email.webp'></img>
                <p>CONTACT</p>
                <img className={`${styles.contitleimg} ${styles.contitleimgr}`} src='/assets/img/email.webp'></img>
                {/* <img src='/assets/img/phone.png' style={{width:'2rem', height:'100%', marginLeft:'1rem'}}></img> */}
            </div>
            <div className={styles.contacttextbox}>
                {/* <div className={styles.contacttext}>
                    <p>e-mail | vankohelp@gmail.com</p>
                </div> */}

                <div className={styles.contactpdf}>
                    <p>ミ✩ 작업의뢰 환영 ミ✩</p>
                    {/* <img onClick={pdfDownLoad} src='/assets/img/download.webp' style={{width:'2rem', height:'100%', marginLeft:'1rem', cursor: "pointer"}}></img> */}
                </div>
                <div style={{display:'flex', justifyContent:'center'}}>
                    <img src='/assets/gifs/contact_vanko.gif' className={styles.convanko}></img>
                </div>
                <EmailForm/>
            </div>
        </div>
        <Footer color={'purple'}/>
        </>
    )
}