"use client"
import { useState } from "react"
import SinopVideoComp from "./sinopvideocomp";
// import SelectComp from "./selectcomp"

export default function EclipseMainComp(){

    const [start, setStart] = useState(false);

    const handleStart = () => {
        setStart(true);
    }

    return(
        <>
            {start ? 
                <SinopVideoComp /> 
                : 
                <div onClick={handleStart}>노래 시작 할것임?</div>
            }
        </>
    )
}