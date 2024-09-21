'use client'
import styles from '@/app/home/page.module.css'
import React, { useEffect, useState } from 'react';
import { righteous } from '@/app/layout.js';
import Modal from '@/components/elements/modal';

export default function MainGallery() {
    const [showModal, setShowModal] = useState(false);
    const [modalPack, setModalPack] = useState({});
    const [selected, setSelected] = useState(null);

    const openModal = (item) => () => {
        // console.log(item)
        setModalPack(item);
        setShowModal(true);
    };

    // 클라이언트 사이드에서 데이터를 가져오는 fetch 를 수행하는 함수
    const galleryFetch = async () => {
        // api/selected 로 fetch 요청 날릴때 header에 토큰(비번) 포함하기 위한 req 
        const req = {
            method: 'GET',
            // cache : 'no-store',
            headers: {
                'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
            },
        };
        try{
            const response = await fetch(`/api/selected`, req); // fetch 날리는 부분

            // response 가 not ok 면 === fetch 실패했을 경우, 에러 처리
            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(`Failed to fetch data from /api/selected: Status ${response.status} - ${errorResponse}`);
            }

            // fetch 성공했을 경우 response 객체 json 직렬화
            const result = await response.json();

            return result; // 결과 리턴

        }catch(error){
            console.error('Error during fetch: ', error.message);        
        }
    }
    
    useEffect(()=>{
        // fetch 하는 함수 실행, promise 인데 useEffect 구문 안으므로 then 사용
        galleryFetch()
            .then((result) => { // 여기에 galleryFetch 함수의 리턴값이 담김
                // console.log(result); 
                setSelected(result.videos); // 결과 데이터 사용해서 setState
            })
            .catch((err)=>console.log(err))
    },[])

    return (      
        <>

            {/** 클라이언트 */}
            { Object.values(modalPack).length > 0 && showModal && <Modal setShowModal = {setShowModal} modalPack = {modalPack}></Modal>}

            <div className={styles.maingallery}>
                {selected &&
                    selected.map((e,i)=>{
                        return(
                            <div className={styles.gallerybox} key={i}>
                                <div className={styles.imgbox}>
                                    <img className={styles.galleryimg} onClick={ openModal(e)} src={e.thumb}></img>
                                </div>
                                <p className={`${styles.gallerytext} ${righteous.className}`}>{e.title}</p>
                            </div>
                        )
                        
                    })
                    }
            </div>
            
        </>
    )
}
