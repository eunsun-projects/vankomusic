'use client'

import React, {useRef} from "react";
import '@/app/globals.css'

export default function Mouse() {
    const cursor = useRef();

    const animateCursor = (e) => {
        // console.log(e)

        if(e.clientX < 100){
            cursor.current.style.display = 'none';
        }else{
            cursor.current.style.left = `${e.clientX}px`;
            cursor.current.style.top = `${e.clientY}px`;
        }
    }

    return(
        <div style={{height:'100%'}} onMouseMove={animateCursor}>
            <div className="mtitle_cursor" ref={cursor}></div>
        </div>
    )
}