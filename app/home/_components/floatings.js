'use client'
import dynamic from 'next/dynamic'
const Floating = dynamic(() => import("@/components/elements/floating"), { ssr: false });

export default function Floatings(){

    return(
        <>
            <Floating src='/assets/gifs/fire.gif'/>
            <Floating src='/assets/gifs/fire.gif' zindex={5} scalex={'scaleX(-1)'}/>
        </>
    )
}