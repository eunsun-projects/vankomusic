import adminReady from "../../../firebase/admin";
import { headers } from "next/headers";

export const dynamic = 'force-dynamic';

export async function GET(){
    try{
        // 헤더에서 인증 토큰 추출
        const headersList = headers();
        const referer = headersList.get("authorization");
        const token = referer ? referer.split(' ')[1] : null;

        // 토큰 검증 로직 (예: 환경 변수에 저장된 토큰과 비교)
        if (!token || token !== process.env.POST_TOKEN) {
            return Response.json({message: '요청 헤더 토큰 확인하세요'} , {status: 401})
        }

        const firestore = adminReady.firestore(); // 파이어베이스 초기화

        const visitCountRef = firestore.collection('visitcounts').doc('visitscounts'); // 문서에서 방문자 항목 ref 획득
        const visitDoc = await visitCountRef.get(); // ref 를 기준으로 get
        const visitors = visitDoc.data().counts; // 가져온 데이터의 count 만 변수에 담기

        return Response.json({visits: visitors}, {status :200});

    }catch(error){
        console.log('흠...무서워서 원', error.message);

        return Response.json({ message: error.message}, {status: 400});
    }
}

export async function POST(request){
    try{
        // 요청 본문 파싱
        const req = await request.json();
        console.log(req.action); // req 메시지

        // 헤더에서 인증 토큰 추출
        const headersList = headers();
        const referer = headersList.get("authorization");
        const token = referer ? referer.split(' ')[1] : null;

        // 토큰 검증 로직 (예: 환경 변수에 저장된 토큰과 비교)
        if (!token || token !== process.env.POST_TOKEN) {
            return Response.json({message: '요청 헤더 토큰 확인하세요'} , {status: 401})
        }

        const firestore = adminReady.firestore();

        const visitCountRef = firestore.collection('visitcounts').doc('visitscounts');

        // ssr 이든 csr 이든 post 요청하면 1증가시킴
        const update = await visitCountRef.update({
            counts: adminReady.firestore.FieldValue.increment(1),
            timestamp: new Date()
        });

        if(update){ // 업데이트 성공시
            const visitDoc = await visitCountRef.get();
            const visitors = visitDoc.data().counts;

            return Response.json({visits: visitors}, {status :200});
        }else{ // 업데이트 실패시 - 그냥 업데이트 만약 실패하더라도 증가되기 전 값이라도 응답해라
            const visitDoc = await visitCountRef.get();
            const visitors = visitDoc.data().counts;

            return Response.json({visits: visitors}, {status :200});
        };

    }catch(error){
        console.log('흠...무서워서 원', error.message)

        return Response.json({message: error.message} , {status: 401})
    }
}