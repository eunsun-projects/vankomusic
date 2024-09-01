"use client"
import { useRef, useState, useEffect } from "react"
import styles from '@/components/admin/page.module.css'
// import { ref, uploadBytes } from "firebase/storage";
// import { storage, auth } from '@/app/firebaseConfig';

export default function MainAdmin () {
    // const [pdfName, setPdfName] = useState("첨부파일");
    const [audioAll, setAudioAll] = useState(null);
    const [selectedAudio, setSelectedAudio] = useState(null); // 인덱스저장용
    const [mp3files, setMp3Files] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [urls, setUrls] = useState(null);
    const [ upLoad, setUpLoad ] = useState(false);

    const mp3sRef = useRef();

    const handleClickSonglist = (i) => () =>{
        setSelectedAudio(i)
    };

    const moveUp = () => {
        const index = selectedAudio;

        if (index <= 0 || index === null) return; // 첫 번째 항목은 더 이상 위로 올라갈 수 없음

        setSelectedAudio(index - 1);
    
        const newList = [...audioAll];
        [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]]; // 현재 항목과 위 항목을 서로 바꿈

        newList.forEach((e,i)=>{
            e.publicNum = i;
        }); // 퍼블릭넘 순서 재정의

        console.log(newList)
        setAudioAll(newList);
    };

    const moveDown = () => {
        const index = selectedAudio;

        if (index === audioAll.length-1 || index === null) return;

        setSelectedAudio(index + 1);

        const newList = [...audioAll];
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]; // 현재 항목과 위 항목을 서로 바꿈

        newList.forEach((e,i)=>{
            e.publicNum = i;
        }); // 퍼블릭넘 순서 재정의

        console.log(newList)
        setAudioAll(newList);
    };

    const handleMp3Change = (e) => {
        const files = e.currentTarget.files;
        if (files) {
            const fileArray = Array.from(files).map(file => file.name);
            setMp3Files(fileArray);
        }
    };

    const audioFetch = async () => {

        const req = {
            method: 'GET',
            cache : 'no-store',
            headers: {
                'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
            },
        };

        const response = await fetch('api/audioget', req);

            if(response.ok){
                const result = await response.json();
                // console.log('성공적', result.audios);

                setAudioAll(result.audios);
            }else{
                console.log('리스폰스 실패')
            }
    };

    const clickGetAudio = async (e) => {
        e.preventDefault();
        try{
            audioFetch();
        } catch (error) {
            console.error('오디오 가져오는 중 에러 발생', error);
        }
    };

    const audioSetFetch = async (list) => {
        try{
            const pack = {
                action : "audioset",
                audios : list
            };

            const req = {
                method: 'POST',
                cache : 'no-store',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
                },
                body: JSON.stringify(pack)
            };
            const response = await fetch('/api/archiveset', req);

            if(response.ok){
                const result = await response.json();
                return result;
            }else{
                console.log('vanaudio set 서버에서 실패', await response.json());
                alert('실패하였습니다');
            }
        }catch(error){
            console.error('곡 업로드 후 db 셋팅 중 에러 발생', error);
        }
    }

    const mp3Submit = async (e) => {
        e.preventDefault();
        setIsLoading(true); // 로딩 시작
        try{
            // FormData 인스턴스를 생성합니다.
            const formData = new FormData();

            // input 타입 file의 파일들을 가져옵니다.
            const files = mp3sRef.current.files;

            if(files.length === 0) {
                alert('업로드할 파일을 선택해주세요.')
            }else{
                setUpLoad(true);
                // 각 파일을 FormData에 추가합니다.
                for (let i = 0; i < files.length; i++) {
                    formData.append('file', files[i]);
                }
                // FormData를 사용하여 서버에 POST 요청을 보냅니다.
                try {
                    // 파일이 있는지 확인하고 FormData에 추가합니다.
                    const response = await fetch('/api/storageset', {
                        method: 'POST',
                        cache : 'no-store',
                        // 'Content-Type' 헤더를 설정하지 않음으로써 브라우저가 자동으로 필요한 헤더를 설정하도록 합니다.
                        headers: {
                            'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
                        },
                        body: formData, 
                    });

                    if (response.ok) {
                        const result = await response.json();
                        setUrls(result.list);
                        setUpLoad(false);
                        console.log('파일 업로드 성공', result);
                    } else {
                        console.error('파일 업로드 실패');
                    }
                } catch (error) {
                    console.error('파일 업로드 중 에러 발생', error);
                }
            }
        }catch (error) {
            console.error('업로드 중 에러 발생', error);
        }
        setIsLoading(false); // 로딩 종료
    };

    const audioNumSubmit = async () => {
        if(confirm('순서를 확인하셨습니까?')){
            try{
                const pack = {
                    action : "audionum",
                    audioall : audioAll
                };

                const req = {
                    method: 'POST',
                    cache : 'no-store',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
                    },
                    body: JSON.stringify(pack)
                };
                const response = await fetch('/api/archiveset', req);

                if(response.ok){
                    console.log('오디오 순서 업데이트 성공');
                    alert('곡 순서 업데이트 성공했습니다');
                    window.location.href = '/vankoadmin?id=0';
                }else{
                    console.log('오디오 순서 업데이트 서버에서 실패', await response.json());
                    alert('곡 순서 업데이트에 실패하였습니다');
                }
            }catch(error){
                console.log(error);
                alert('알수없는 에러가 발생했습니다. 다시 시도해 주세요.');
            }
        }else{
            alert('다시 검토해 주세요.');
        }
    };

    const clickTrash = async () => {
        const newList = [...audioAll];
        const selectedItem = newList[selectedAudio];
        
        if(!selectedItem){
            alert('먼저 지울 아이템을 선택해 주세요!')
        }else if(confirm('해당 아이템을 삭제하시겠습니까?')){

            const pack = {
                action: 'audiodel',
                item : selectedItem
            };

            const req = {
                method: 'POST',
                cache : 'no-store',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
                },
                body: JSON.stringify(pack)
            };
    
            const response = await fetch('/api/archiveset', req);

            if(response.ok){
                console.log('삭제 성공');
                alert('아이템 삭제에 성공했습니다.');
                window.location.href = '/vankoadmin?id=0';
            }else{
                console.log('삭제 서버에서 실패');
                alert('아이템 삭제에 실패하였습니다');
                window.location.href = '/vankoadmin?id=0';
            }
        }else{
            alert('다시 진행해 주세요.')
        }
    };

    useEffect(()=>{
        audioFetch();
    },[])

    useEffect(()=>{
        if(urls !== null){
            audioSetFetch(urls)
                .then((result) => {
                    console.log(result);
                    setUrls(null);
                    alert('모든 입력 과정이 성공했습니다');
                    window.location.href = '/vankoadmin?id=0';
                });
        }
    },[urls])

    return(
        <div style={{display: 'flex', paddingTop: '3rem', paddingBottom: '3rem', boxSizing: 'border-box', gap:'3rem', justifyContent:'center', height: "100%", flexDirection: "column"}}>

        <div style={{position:"fixed", top:"23%", zIndex:'5', display: upLoad ? 'flex':'none', flexDirection:"column", gap: "1rem", justifyContent: "center", alignItems: "center", height: "80vh", width: "100vw", backgroundColor: "#3b6ea5"}}>
            {/* <img src="/assets/img/construc.png" alt="contruction" /> */}
            <p style={{color: "white", fontSize:'2rem'}}>{`...업로드중입니다...`}</p>
        </div>

            {/* {isLoading && (            
                <div style={{position:"fixed", top:"10%", display:"flex", justifyContent: "center", alignItems: "center", height: "100vh", width: "100vw", backgroundColor: "gray"}}>전송중...</div>
            )} */}
        
            <div className={styles.mainadminleftbox}>
                <div className={styles.audiobox}>
                    <div style={{display:'flex'}}>
                        <div className={styles.vancircle}></div>
                        <p className={styles.vanampp}>VanAmp</p>
                        <div className={styles.vancircle}></div>
                    </div>
                    
                    <p className={styles.musicmoklok}>{'===== 현재 곡 목록 ====='}</p>
                    <div className={styles.audiocontents}>
                    
                    {audioAll && audioAll.map((e,i)=>(
                        <p key={i} style={{color: selectedAudio === i && 'white', backgroundColor: selectedAudio === i && 'blue'}} onClick={handleClickSonglist(i)}>{e.name}</p>
                    ))}
                    <br />
                    </div>
                    {/* <div className={styles.logoutbtn} onClick={clickGetAudio}>곡목록새로고침</div> */}
                    <div className={styles.mainfooter}>
                        <div style={{display: 'flex', flexDirection:'column'}}>
                            <div style={{width:'5rem', color:'white'}} className={styles.movebtn} onClick={moveUp}>{'↑'}</div>
                            <div style={{width:'5rem', color:'white'}} className={styles.movebtn} onClick={moveDown}>{'↓'}</div>
                        </div>
                        
                        <div className={styles.logoutbtn} onClick={audioNumSubmit} style={{color:'white'}}>순서변경적용</div>
                        <div><img src="/assets/img/trashicon.webp" onClick={clickTrash}></img></div>
                    </div>
                    
                </div>

                <div style={{display: "flex", flexDirection: "column", gap:"1.5rem"}}>   

                    <form onSubmit={mp3Submit} encType="multipart/form-data" style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                        <div className={styles.mpthreebox}>
                        <label className={styles.mpthreetitle} htmlFor="mp3">MP3를 선택하세요</label>
                        <input ref={mp3sRef} type="file" id="mp3" name="mp3" accept="mp3" multiple onChange={handleMp3Change} style={{width:'96%', fontSize:'1rem'}}/>
                        <div className={styles.mpthreeselect}>
                            <p style={{textAlign:'center', borderBottom:'2px solid grey'}}>선택된 파일들</p>
                            {mp3files && mp3files.map((e,i)=>(
                                <p key={i} style={{fontFamily:'auto', paddingLeft:'0.2rem', boxSizing:'border-box'}}>{e}</p>
                            ))}
                        </div>
                        <button className={styles.logoutbtn} style={{marginBottom:'0.8rem', color:'black', backgroundColor:'lightgrey', border:'2px outset'}}>mp3업로드</button>
                        </div>
                        
                    </form>
                        

                </div>
                
            </div>
            {/* <div style={{display: "flex", flexDirection: "column", gap: "0.5rem"}}>
                <div onClick={clickDownload} className={styles.logoutbtn}>현재pdf다운로드</div>

                <form onSubmit={clickUpload} encType="multipart/form-data" style={{display: "flex", flexDirection: "row", gap: "1rem", width: "50%"}} className={styles.pdffilebox}> 
                    
                    <div style={{display: "flex", flexDirection: "row"}}>
                        <input className={styles.uploadname} value={pdfName} placeholder="첨부파일" readOnly></input>
                        <label htmlFor="file">PDF파일 선택</label>
                        <input type="file" id="file" name="file" accept="pdf" onChange={handlePdfChange} />
                    </div>

                    <button className={styles.logoutbtn}>pdf교체업로드</button>
                </form>
            </div> */}
        </div>
        
    )
}

// const handlePdfChange = (e) => {
//     const name = e.currentTarget.value;
//     setPdfName(name);
// };

// const clickDownload = async () => {
//     try{
//         const pack = {
//             action : "geturl",
//         };

//         const req = {
//             method: 'POST',
//             headers: {
//                 'Content-Type' : 'application/json',
//                 'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
//             },
//             body: JSON.stringify(pack)
//         };
//         const response = await fetch('/api/storageget', req);

//         if(response.ok){
//             const result = await response.json()
//             downloadFile(result.url)
//             alert('파일 겟 성공했습니다');
//         }else{
//             console.log('큐레이션 업데이트 서버에서 실패', await response.json());
//             alert('파일 겟 실패하였습니다');
//         }
//     }catch(error){
//         console.log(error);
//         alert('알수없는 에러가 발생했습니다. 다시 시도해 주세요.');
//     }
// };

// const clickUpload = async (e) => {
//     e.preventDefault();
//      // FormData 인스턴스를 생성합니다.
//     const formData = new FormData();
//     // input 타입 file의 파일들을 가져옵니다.
//     const files = e.target.file.files;

//     try{

//         if(files.length === 0){
//             alert('업로드할 파일을 선택해주세요.')
//         }else if(!pdfName.includes('.pdf')){
//             alert('pdf만 업로드 할 수 있습니다!')
//         }else{
//             // 파일이 있는지 확인하고 FormData에 추가합니다.
//             formData.append('file', files[0], files[0].name);

//             // FormData를 사용하여 서버에 POST 요청을 보냅니다.
//             try {
//                 const response = await fetch('/api/storageset', {
//                     method: 'POST',
//                     // 'Content-Type' 헤더를 설정하지 않음으로써 브라우저가 자동으로 필요한 헤더를 설정하도록 합니다.
//                     headers: {
//                         'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
//                     },
//                     body: formData, 
//                 });

//                 if (response.ok) {
//                     alert('pdf 업로드에 성공했습니다!');
//                     console.log('파일 업로드 성공');
//                     window.location.href = '/vankoadmin?id=0';
//                 } else {
//                     console.error('파일 업로드 실패');
//                 }
//             } catch (error) {
//                 console.error('파일 업로드 중 에러 발생', error);
//             }
//         }
        
//     }catch(error){
//         console.log(error);
//         alert('알수없는 에러가 발생했습니다. 다시 시도해 주세요.');
//     }
// };

// const downloadFile = (url) => {
//     // This can be downloaded directly:
//     const xhr = new XMLHttpRequest();
//     xhr.responseType = 'blob';
//     xhr.onload = (event) => {
//         const blob = xhr.response;
//         const a = document.createElement('a'); // <a> 태그를 생성합니다.
//         a.style.display = 'none'; // 화면에 보이지 않게 설정합니다.
//         document.body.appendChild(a); // <a> 태그를 body에 추가합니다.

//         const urlBlob = window.URL.createObjectURL(blob);
//         a.href = urlBlob;
//         a.download = '작업의뢰서.pdf'; // 다운로드 될 파일의 이름을 설정합니다.

//         a.click(); // <a> 태그를 클릭하여 다운로드를 시작합니다.

//         window.URL.revokeObjectURL(urlBlob); // URL을 해제합니다.
//         document.body.removeChild(a); // <a> 태그를 body에서 제거합니다.
//     };
//     xhr.open('GET', url);
//     xhr.send();
// };