'use client'
import React, { useState, useEffect, useRef } from 'react';
import styles from '@/app/page.module.css'

export default function Floating({zindex, scalex, src}) {
    const boundaryRef = useRef({
        width: window.innerWidth,
        height: window.innerHeight * 0.6,
        left: 0,
        top: window.innerHeight * 0.2,
    });

    const [position, setPosition] = useState({
        top : document.documentElement.clientHeight * Math.random(),
        left : document.documentElement.clientWidth * Math.random()
    });

    const randomPosition = (boundary, position) => {
        const maxDistance = 200; 
        const dx = (Math.random() - 0.5) * maxDistance;
        const dy = (Math.random() - 0.5) * maxDistance;

        return {
            top: Math.min(Math.max(boundary.top, position.top + dy), boundary.top + boundary.height),
            left: Math.min(Math.max(boundary.left, position.left + dx), boundary.left + boundary.width)
        };
    };

    const moveFish = () => {
        const newPosition = randomPosition(boundaryRef.current, position);
        setPosition(newPosition);

        setTimeout(() => {
            requestAnimationFrame(moveFish);
        }, 1500);
    };

    useEffect(() => {
        // 애니메이션 시작
        requestAnimationFrame(moveFish);

        return () => cancelAnimationFrame(moveFish);
    }, []);

    return (
        <img
            src={src}
            alt="Floating Fish"
            className={styles.floating}
            style={{ top: position.top, left: position.left, zIndex:zindex, transform:scalex }}
        />
    );
}

//inversion === 'left'? "scaleX(-1)" : "scaleX(1)"
// const [inversion, setInversion] = useState('left'); 
// 아래는 movefish 함수 안에
// if(position.left < newPosition.left){
//     setInversion('right');
// }else{
//     setInversion('left')
// }