import AdminPage from '@/components/admin/adminpage';
import Config from "../../config/config.export";
import IfMobile from '@/components/admin/ifMobile';
import { getServerSession } from "next-auth"
import { authOptions } from '../api/auth/[...nextauth]/route'
import { basicMeta, basicViewport } from '../basicmeta';
// import { db } from '@/app/firebaseConfig'
// import { collection, query, where, getDocs } from "firebase/firestore";
// import { ref, getDownloadURL, listAll } from "firebase/storage";

export const metadata = basicMeta;
export const viewport = basicViewport;

export async function getData(session){

    if(session && (session.user.email === process.env.NEXT_PUBLIC_SCREEN_MAIL || session.user.email === process.env.NEXT_PUBLIC_VANKO_MAIL)){

        const req = {
            method: 'GET',
            cache : 'no-store',
            headers: {
                // 'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
            },
            // body: JSON.stringify({action: "data please"})
        };

        const response = await fetch(`${Config().baseUrl}/api/videoall`, req);
        const response2 = await fetch(`${Config().baseUrl}/api/selected`, req);

        if (response.ok && response2.ok) {
            const result = await response.json();
            const result2 = await response2.json();
            console.log('데이터 수신 성공');

            const data = {
                videoall : result,
                curation : result2,
            }
            return data
        }else{
            console.log('데이터 수신 실패', response.statusText)
            return []
        }

    }else{
        return null
    }
}

export default async function Vankoadmin(){

    const session = await getServerSession(authOptions);

    let result = null;
    if(session){
        result = await getData(session);
    }else{
        result = {}
    }

    return(
        <>
            <IfMobile />
            <AdminPage session={session} videoall={result.videoall} curation={result.curation} />
        </>
    )
}