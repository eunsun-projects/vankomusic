import FfdPage from "@/components/ffd/ffdpage";
import { basicMeta, basicViewport } from "../basicmeta";
import { Suspense } from "react";
import Loading from '@/app/loading';
import SetScreenSize from "@/components/elements/setScreensize";

export const metadata = basicMeta;
export const viewport = basicViewport;

function makeImgArr(){
    let imgarr = [];
    for(let i = 0; i < 54; i++){
        let imgstring = `/assets/img/ffd/${i}.webp`;
        imgarr[i] = imgstring
    }

    return imgarr;
}

export default function Ffd(){

    const imgarr = makeImgArr();

    return(
        <>
            <SetScreenSize />
            <Suspense fallback={<Loading />}>
                <FfdPage imgarr={imgarr} />
            </Suspense>
        </>
    )
}