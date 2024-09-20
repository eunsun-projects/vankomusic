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

        const videoCollection = await firestore.collection('videoall').where("isPublic", "==", true).orderBy("publicNum", 'desc').get();
        const videosData = videoCollection.docs.map((doc) => {
            return {...doc.data(), id: doc.id};
        });

        const responseObject = {
            message : "success",
            videos : videosData,
        }

        return Response.json(responseObject, {status :200});

    } catch (error) {
        console.log('흠...무서워서 원', error.message);

        return Response.json({ message: "An error occurred"}, {status: 400});
    }
}