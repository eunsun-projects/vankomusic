"use client"
import { useRef, useState } from "react"
import styles from '@/components/admin/page.module.css'

export default function ArchiveAdmin ({videoall}) {
    // console.log(videoall)
    const [ copyVideo, setCopyVideo ] = useState(videoall);
    const [ itemClick, setItemClick ] = useState(null);
    const [ selectedItem, setSelectedItem ] = useState(null);
    const [ videoId, setVideoId ] = useState(null);
    const [ oldTitle, setOldTitle ] = useState(null);

    const updateRef = useRef();
    const createRef = useRef();

    const allFetch = async (to) => {

        const req = {
            method: 'GET',
            cache : 'no-store',
            headers: {
                'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
            },
        };

        const response = await fetch(`/api/${to}`, req);

            if(response.ok){
                const result = await response.json();
                console.log('성공적');
                if(to === 'videoall'){
                    setCopyVideo(result.videoall);
                }else if(to === 'selected'){
                    setSelectedItem(result.curation);
                }
            }else{
                console.log('리스폰스 실패')
            }
    };

    const clickTitle = (i) => () => {
        setItemClick(i);
        setSelectedItem(copyVideo[i]);
        setOldTitle(videoall[i].id) //if 타이틀을 변경할 수도 있으므로, 변경 전 타이틀을 저장.
        // console.log(videoall[i].title)
    };

    const youtubeUrlParser = (e) => {
        const input = e.currentTarget.value;

        if(input.includes('youtube.com')){
            const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
            const match = input.match(regex);
            const id = match ? match[1] : null;
            setVideoId(id);
        }else if(input.length < 1){
            setVideoId(null);
        }
    };

    const updateCreateFetch = async (action, ref) => {
        try {
            const title = ref.title.value;
            const url = ref.url.value;
            
            const keyword_1 = ref.keyword1.value.length > 0 ? ref.keyword1.value : selectedItem.keyword[0];
            const keyword_2 = ref.keyword2.value.length > 0 ? ref.keyword2.value : selectedItem.keyword[1];
            const keyword_3 = ref.keyword3.value.length > 0 ? ref.keyword3.value : selectedItem.keyword[2];
            
            const keyword = [keyword_1, keyword_2, keyword_3];

            const desc = ref.desc.value;
            
            const updatePack = {
                action: "updateone",
                oldTitle: oldTitle && oldTitle,
                updateTitle: title.length > 0 ? title : selectedItem.title,
                updateUrl: url.length > 0 ? url : selectedItem.embed,
                updateKeyword : keyword,
                updateDesc : desc.length > 0 ? desc : selectedItem.description,
                updatePublicNum : selectedItem ? selectedItem.publicNum : null
            };

            // 기존 배열 (videoall) 에서 새로 입력된 타이틀과 일치하는 아이템 있는지 검색
            const existPublicNum = videoall.find((e)=>{
                if (e.title.toLowerCase().replaceAll(' ', '') === title.toLowerCase().replaceAll(' ', '')) return e.publicNum;
            })

            const createPack = {
                action: "createone",
                createTitle: title.length > 0 && title, 
                createUrl: url.length > 0 && url, 
                createKeyword : keyword,
                createDesc : desc.length > 0 && desc,
                createPublicNum : existPublicNum !== undefined ? existPublicNum.publicNum : copyVideo.length, // 만약 기존재하는 아이템이면(비공개상태) 기존재하는 번호로 아니면 마지막
                createThumb : `https://img.youtube.com/vi/${videoId}/0.jpg`
            }

            let req;
            if(action === 'update'){
                req = {
                    method: 'POST',
                    cache : 'no-store',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
                    },
                    body: JSON.stringify(updatePack)
                };
            }else if(action === 'create'){
                req = {
                    method: 'POST',
                    cache : 'no-store',
                    headers: {
                        'Content-Type' : 'application/json',
                        'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
                    },
                    body: JSON.stringify(createPack)
                };
            }

            const response = await fetch('/api/archiveset', req);

            if(response.ok){
                console.log('입력 성공');
                alert('아이템 입력에 성공했습니다');
            }else{
                console.log('입력 서버에서 실패');
                alert('아이템 입력에 실패하였습니다');
                window.location.href = '/vankoadmin?id=1';
            }
        }catch(error){
            console.log(error);
            alert('알수없는 에러가 발생했습니다. 다시 시도해 주세요.');
        }
    }

    const createSubmit = async (e) => {
        e.preventDefault();
        if(confirm('이 정보로 새로운 아이템을 추가하시겠습니까?')){
            await updateCreateFetch('create', createRef.current);
            await allFetch('videoall');
            await allFetch('selected');
            window.location.href = '/vankoadmin?id=1';
        }else{
            alert('다시 진행해 주세요.');
            createRef.current.reset();
        }
    }

    const updateSubmit = async (e) => {
        e.preventDefault();
        if(confirm('이 정보로 아이템을 수정하시겠습니까?')){
            await updateCreateFetch('update', updateRef.current);
            await allFetch('videoall');
            await allFetch('selected');
            window.location.href = '/vankoadmin?id=1';
        }else{
            alert('다시 진행해 주세요.');
        }
    };

    const moveUp = () => {
        const index = itemClick;

        if (index <= 0 || index === null) return; // 첫 번째 항목은 더 이상 위로 올라갈 수 없음

        setItemClick(index - 1);
    
        const newList = [...copyVideo];
        [newList[index], newList[index - 1]] = [newList[index - 1], newList[index]]; // 현재 항목과 위 항목을 서로 바꿈

        newList.forEach((e,i)=>{
            e.publicNum = newList.length - 1 - i; // 리스트 길이에서 현재 인덱스를 뺀 값을 할당
        }); // 퍼블릭넘 순서 재정의

        setCopyVideo(newList);
    };

    const moveDown = () => {
        const index = itemClick;

        if (index === copyVideo.length - 1 || index === null) return;

        setItemClick(index + 1);

        const newList = [...copyVideo];
        [newList[index], newList[index + 1]] = [newList[index + 1], newList[index]]; // 현재 항목과 위 항목을 서로 바꿈

        newList.forEach((e,i)=>{
            e.publicNum = newList.length - 1 - i; // 리스트 길이에서 현재 인덱스를 뺀 값을 할당
        }); // 퍼블릭넘 순서 재정의

        setCopyVideo(newList);
    }

    const itemFix = async () => {
        console.log(copyVideo)

        if(videoall === copyVideo){
            alert('변경점이 없습니다!');
        }else if(confirm('이대로 순서를 수정하시겠습니까?')){
            try{
                const pack = {
                    action: 'updateall',
                    list: copyVideo
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
                    const count = await response.json();
                    console.log('픽스 성공');
                    alert(`순서 수정에 성공했습니다. ${count.message}`);
                    window.location.href = '/vankoadmin?id=1';
                }else{
                    console.log('픽스 서버에서 실패');
                    alert('순서 수정에 실패하였습니다');
                    window.location.href = '/vankoadmin?id=1';
                }
            } catch (error){
                console.log(error);
                alert('알수없는 에러가 발생했습니다. 다시 시도해 주세요.');
            }
        }else{
            alert('다시 진행해 주세요.');
        }
    };

    const clickTrash = async () => {
        if(!selectedItem){
            alert('먼저 지울 아이템을 선택해 주세요!')
        }else if(confirm('해당 아이템을 삭제하시겠습니까?')){

            const pack = {
                action: 'deleteone',
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
                window.location.href = '/vankoadmin?id=1';
            }else{
                console.log('삭제 서버에서 실패');
                alert('아이템 삭제에 실패하였습니다');
                window.location.href = '/vankoadmin?id=1';
            }
        }else{
            alert('다시 진행해 주세요.')
        }
    }

    return(
        <div style={{display: 'flex', paddingTop: '2rem', paddingBottom: '2rem', boxSizing: 'border-box', gap:'3rem', alignItems:'center', justifyContent:'center'}}>
            {/* 왼쪽박스 두개 */}
            <div style={{display:'flex', flexDirection:'column', gap:'3rem'}}>
                {/* 업데이트 박스 */}
                <div className={styles.leftboxs}>
                    <div className={styles.leftboxstitle}><span style={{backgroundColor:'orange'}}>선택된</span> 아이템 수정하기</div>
                    <div style={{position: "relative"}}>
                        <div style={{position: "relative", width:'100%', display:'flex', gap:'1rem'}}>
                            <div className={styles.thumbimgbox} style={{backgroundImage: selectedItem && `url(${selectedItem.thumb})`}}></div>
                            {/* 업데이트 폼 */}
                            <form className={styles.formbox} ref={updateRef} onSubmit={updateSubmit}>
                                <label>타이틀</label>
                                <input type="text" name="title" placeholder={selectedItem ? selectedItem.title : "선택요망"}></input>

                                <label>주소</label>
                                <input type="text" name="url" placeholder={selectedItem ? selectedItem.embed : "선택요망"}></input>

                                <label>간단설명</label>
                                <input type="text" name="desc" placeholder={selectedItem ? selectedItem.description : "선택요망"}></input>

                                <label>키워드</label>
                                <div style={{display: "flex", flexDirection: "row", gap: "0.4rem"}}>
                                    <input type="text" name="keyword1" style={{ width: "33%"}} placeholder={selectedItem ? selectedItem.keyword[0] : "선택요망"}></input>
                                    <input type="text" name="keyword2" style={{ width: "33%"}} placeholder={selectedItem ? selectedItem.keyword[1] : "선택요망"}></input>
                                    <input type="text" name="keyword3" style={{ width: "33%"}} placeholder={selectedItem ? selectedItem.keyword[2] : "선택요망"}></input>
                                </div>

                                <input type="submit" value="update" className={styles.okbtn}></input>
                            </form>
                        </div>
                    </div>
                </div>
                {/* 신규추가 박스 */}
                <div className={styles.leftboxs} style={{backgroundColor:'powderblue'}}>
                    <div className={styles.leftboxstitle}><span style={{color:'white', backgroundColor:'blue'}}>신규</span> 아이템 추가하기</div>
                    <div style={{position: "relative", display: "flex", flexDirection: "row", gap: '2rem'}}>
                        <div style={{position: "relative", width:'100%', display:'flex', gap:'1rem'}}>
                        <div className={styles.thumbimgbox} style={{backgroundImage: videoId && `url(https://img.youtube.com/vi/${videoId}/0.jpg)`, backgroundColor:'aliceblue'}}></div>

                            {/* 신규 추가 폼 */}
                            <form className={styles.formbox} ref={createRef} onSubmit={createSubmit}>
                                <label>타이틀</label>
                                <input type="text" name="title" required placeholder={"타이틀을 입력하세요"}></input>

                                <label>주소</label>
                                <input type="text" name="url" required placeholder={"유튜브 주소를 붙여넣으세요"} onInput={youtubeUrlParser}></input>

                                <label>간단설명</label>
                                <input type="text" name="desc" required placeholder={"간단한 설명을 작성해주세요"}></input>

                                <label>키워드</label>
                                <div style={{display: "flex", flexDirection: "row", gap: "0.4rem"}}>
                                    <input type="text" name="keyword1" style={{ width: "33%"}} required placeholder={ "키워드1" }></input>
                                    <input type="text" name="keyword2" style={{ width: "33%"}} required placeholder={ "키워드2" }></input>
                                    <input type="text" name="keyword3" style={{ width: "33%"}} required placeholder={ "키워드3" }></input>
                                </div>

                                <input type="submit" value="create" className={styles.okbtn}></input>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 오른쪽 리스트 박스 */}
            <div className={styles.listbox}>
                <div className={styles.listtile}>
                    <img style={{width:'1rem', height:'1rem', marginRight:'0.5rem'}}src="/assets/img/cd.webp"></img>
                    <p >Archive All List</p>
                    <img style={{width:'1rem', height:'1rem', marginLeft:'0.5rem'}}src="/assets/img/cd.webp"></img>
                </div>

                <div style={{height: '28rem', width:'90%', margin:'0 auto'}}>
                    <div className={styles.titleconbox}>
                        <div className={styles.allbox} style={{height:'26rem', overflowY:'scroll'}}>   
                            {copyVideo &&
                                copyVideo.map((e, i)=>{
                                    return(
                                        <div onClick={clickTitle(i)} className={styles.titlebox} style={{color: itemClick === i && 'white', backgroundColor: itemClick === i && 'blue'}} key={i}><p>{e.title}</p></div>
                                    )
                                })
                            }
                        </div>
                    
                    </div>
                </div>
                
                {/** 위 아래 전송 휴지통 박스 */}
                <div className={styles.footer}>
                    <div style={{width:'80%', display:'flex', flexDirection: "row", gap: "1rem", boxSizing: "border-box"}}>
                        <div style={{width: '30%', display:'flex', flexDirection:'column', justifyContent:'center'}}>
                            <div className={styles.movebtn} onClick={moveUp}>{'↑'}</div>
                            <div className={styles.movebtn} onClick={moveDown}>{'↓'}</div>
                        </div>

                        <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', width:'50%', boxSizing: "border-box"}}>
                            <div className={styles.fixbtn} onClick={itemFix}>순서변경적용</div>
                        </div>

                        <div><img src="/assets/img/trashicon.webp" onClick={clickTrash}></img></div>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    )
}