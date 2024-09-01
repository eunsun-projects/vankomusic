'use client'
import styles from '@/app/archive/page.module.css'
import React, { useState, useEffect, useRef } from 'react';
import Modal from '../elements/modal.js';
import '@/app/globals.css'
import Footer from '../footer/footer.js';
import { righteous } from '@/app/layout.js';

export default function Archive ({videoall}) {
    const [showModal, setShowModal] = useState(false);
    const [modalPack, setModalPack] = useState({});

    const openModal = (item) => () => {
        setModalPack(item);
        setShowModal(true);
    };

    return(
        <>
        { Object.values(modalPack).length > 0 && showModal && <Modal setShowModal = {setShowModal} modalPack={modalPack}></Modal>}
        <div className={styles.archivepage}>
            <div className={styles.archivetitle}>
                <img className={`${styles.titleimg} ${styles.titleimgleft}`} src='/assets/img/cd.webp'></img>
                <p>ARCHIVE</p>
                <img className={`${styles.titleimg} ${styles.titleimgright}`} src='/assets/img/cd.webp'></img>
            </div>

            <div className={styles.archivegrid}>
                {
                    videoall.map((e, i)=>{
                        return(
                            <div className={`${styles.archivebox} ${righteous.className}`} key={i}>
                                <div className={styles.archiveimg} onClick={ openModal(e)} style={{backgroundImage: `url(${e.thumb})`}}></div>
                                <p>{e.title}</p>
                            </div>
                        )
                    })
                }
            </div>
            
        </div>
        <Footer color={'blue'}/>
        </>
    )
}