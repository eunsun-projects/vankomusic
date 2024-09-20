'use client'
import styles from '@/app/vankoxyztest/carousel/page.module.css'
import { useState } from 'react'
import Modal from './modal';

export default function Carousel(){
    const [ showModal, setShowModal ] = useState(false);

    const handleIcon = () => {
        setShowModal(true)
    }

    return(
        <>
        {showModal && <Modal setShowModal={setShowModal}/>}
        <div className={styles.background}>
            <div onClick={handleIcon}>
                <img  className={styles.boxicon} src='/assets/img/photo.webp'></img>
            </div>
        </div>
        </>
    )
}