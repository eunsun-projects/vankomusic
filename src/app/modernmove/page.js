import CanvasMonitor from '@/components/modernmove/canvasmonitor'
import { basicMeta, basicViewport } from '../basicmeta';
import { Suspense } from "react";
import Loading from "@/app/loading";

export const metadata = basicMeta;
export const viewport = basicViewport;

export default function ModernMove() {

    return(
        <Suspense fallback={ <Loading /> } >
            <CanvasMonitor />
        </Suspense>
    )
}