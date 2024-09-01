import Archive from '@/components/archive/archive'
import Config from "../../config/config.export";
import { basicMeta, basicViewport } from '../basicmeta';

export const metadata = basicMeta;
export const viewport = basicViewport;

export async function getData(){

    const req = {
        method: 'GET',
        cache : 'no-store',
        headers: {
            'Authorization' : `Bearer ${process.env.POST_TOKEN}`
        },
    };

    const response = await fetch(`${Config().baseUrl}/api/videoall`, req);

    try{
        if (response.ok) {
            const result = await response.json();
    
            const selectVideo = result.videos;
    
            // console.log('data 성공');
            return selectVideo
    
        }
    }catch(error){
        console.log('data 실패', error.message)
        return []
    }
}

export default async function ArchivePage() {
    const videoall = await getData();
    
    return (
        <Archive videoall={videoall}/>
    )
}