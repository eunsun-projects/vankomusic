'use client'

import { React, useEffect, useRef, useState } from 'react'
import styles from '@/app/seonangcopy/page.module.css'
import LotteryClass from '@/class/lotteryClass';

const ERASE_RADIUS = 30;

export default function LotteryTicket({setShowFortune}){
    const canvasRef = useRef();
    const [drawing, setDrawing] = useState(false);
    const [rect, setRect] = useState({top:0, left:0});
    const [context, setContext] = useState(null);

    const closeFortune = (e) => {
        if(e.target !== canvasRef.current){
            setShowFortune(false);
        }
    }

    const handleDrawingStart = () => {
        if (!drawing) {
            setDrawing(true);
        }
    };

    const handleDrawing = (event) => {
        if (drawing && context) {
            const { offsetX, offsetY } = event.nativeEvent;
            context.save();
            context.globalCompositeOperation = "destination-out";
            context.beginPath();
            context.arc(offsetX, offsetY, ERASE_RADIUS, 0, 2 * Math.PI, false);
            context.fill();
            context.closePath();
            context.restore();
        }
    };

    const handleDrawingEnd = () => {
        if (drawing) {
            setDrawing(false);
        }
    };

    useEffect(()=>{
        const windowWidth = window.innerWidth;
        let width;
        if( windowWidth < 376){
            width = 205
        }else if ( windowWidth < 712 ){
            width = 231
        }else{
            width = 300
        }
        const lottery = new LotteryClass(canvasRef.current,width);
        setContext(lottery.context);
    },[])

    return(
        <div className={styles.lotterycontainer} onClick={closeFortune}>
            <div className={styles.fortunewrapper} >
                <div className={styles.fortuneresult} style={{display: context ? 'flex' : 'none'}}><p>{"다음생은 없습니다."}</p></div>
                <canvas className={styles.fortunecanvas} 
                    ref={canvasRef} 
                    onMouseDown={handleDrawingStart} 
                    // onMouseMove={handleDrawing} 
                    onMouseUp={handleDrawingEnd} 
                    onTouchStart={handleDrawingStart}
                    // onTouchMove={handleDrawing}
                    onPointerMove={handleDrawing}
                    onTouchEnd={handleDrawingEnd}
                />
            </div>
        </div>
    )
}