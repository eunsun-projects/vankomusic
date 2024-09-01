'use client'
import styles from '@/app/page.module.css';
import { useEffect, useRef, useState } from 'react';

function Modal({setShowModal, modalPack}) {
    const [id, setId] = useState(null);

    const youtubeRef = useRef();

    useEffect(()=>{
        const url = modalPack.embed;
        const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
        const match = url.match(regex);
        const videoId = match ? match[1] : null;

        setId(videoId);
        console.log(videoId)
    },[modalPack])

    // 모달 끄기 
    const closeModal = (e) => {
        if(e.target !== youtubeRef.current){
            setShowModal(false);
        }
    };

    return (
        <div onClick={closeModal} className={styles.modalcontainer}>
            <span className={styles.modalclose} onClick={closeModal}>X</span>
            <div ref={youtubeRef} style={{position:'fixed', top:'50%', left:'50%', transform: 'translate(-50%, -50%)'}}>
                {id && 
                    <iframe 
                        className={styles.iframe} 
                        width="1120" height="630" 
                        src={`https://www.youtube.com/embed/${id}`} 
                        title="YouTube video player" 
                        frameBorder='0' 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen=''></iframe>}
            </div>
        </div>
    );
}

export default Modal;