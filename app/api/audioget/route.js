import adminReady from "../../../firebase/admin";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET(){
    try{
        // // 요청 본문 파싱
        // const req = await request.json();
        // console.log(req.action); // req 메시지

        const headersList = headers();
        const referer = headersList.get("authorization");
        const token = referer ? referer.split(' ')[1] : null;

        // 토큰 검증 로직 (예: 환경 변수에 저장된 토큰과 비교)
        if (!token || token !== process.env.POST_TOKEN) {
            return Response.json({message: '요청 헤더 토큰 확인하세요'} , {status: 401})
        }

        const firestore = adminReady.firestore(); // 파이어베이스 초기화

        const audioCollection = await firestore.collection('vanaudio').orderBy("publicNum").get();
        const audiosData = audioCollection.docs.map((doc) => {
            return {...doc.data(), id: doc.id};
        });

        const responseObject = {
            message : "success",
            audios : audiosData
        };

        return Response.json(responseObject, {status: 200});

    }catch(error){

        console.log('흠...무서워서 원', error.message)

        return Response.json({message: error.message} , {status: 401})
    }
}

/*********** 지우지 말것 ************/ 
        // const currentDate = new Date();
        // currentDate.setDate(currentDate.getDate() + 3); // 현재 날짜에 3일을 더함

        // const expiresDate = currentDate.toISOString(); // ISO 형식의 문자열로 변환

        // const options = {
        //     // delimiter: '/', // 이 옵션은 하위 디렉토리를 나열하지 않도록 합니다.
        //     prefix: 'assets/mp3/', // 경로의 마지막에 슬래시(/)를 포함하지 않습니다.
        // };

        // const [files] = await adminReady.storage().bucket('vanko-firebase.appspot.com').getFiles(options);

        // const urlPromises = files.map(async (e)=>{
        //     const [url] = await e.getSignedUrl({
        //         action: 'read',
        //         expires: expiresDate
        //     });

        //     return url;
        // });

        // const names = files.map((e)=>{
        //     return e.name;
        // });
        // names.shift();

        // const urls = await Promise.all(urlPromises);
        // urls.shift();

        // const result = urls.map((e,i)=>{
        //     return {
        //         name : names[i],
        //         url : e
        //     }
        // });

        // const resonseObject = {
        //     message : "success",
        //     urls : result
        // };

        // return Response.json(resonseObject, {status: 200});