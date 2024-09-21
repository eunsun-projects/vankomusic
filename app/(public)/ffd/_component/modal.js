'use client'
import styles from '@/app/page.module.css';
import { useEffect, useRef, useState } from 'react';

function FfdModal({setShowModal, currTime, setRelayPlay}) {

    const frameRef = useRef();
    const [time, setTime] = useState(Math.floor(currTime));

    // 모달 끄기 
    const closeModal = (e) => {
        if(e.target !== frameRef.current){
            setShowModal(false);
            setRelayPlay(false);
        }
    };

    // useEffect(()=>{
    //     console.log(currTime)
    // },[currTime])

    useEffect(()=>{
        console.log(time)
    },[time])

    return (
        <div className={styles.modalcontainer} onClick={closeModal}>
            {/* <span className={styles.modalclose} onClick={closeModal}>X</span> */}
            <div ref={frameRef} style={{position:'fixed', top:'50%', left:'50%', transform: 'translate(-50%, -50%)'}}>
                <iframe 
                    className={styles.iframe} 
                    width="1120" 
                    height="630" 
                    src={`https://www.youtube.com/embed/HV1Bg7adKto?start=${time}&autoplay=1&mute=0`} 
                    title="YouTube video player" 
                    frameBorder='0'
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
}

export default FfdModal;