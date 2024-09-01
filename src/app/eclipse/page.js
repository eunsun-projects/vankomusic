import { basicMeta, basicViewport } from '../basicmeta';
import EclipseMainComp from './_component/maincomp';

export const metadata = basicMeta;
export const viewport = basicViewport;

export default function EclipsePage(){

    return(
        <EclipseMainComp />
    )
}