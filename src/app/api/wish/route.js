import { headers } from "next/headers";
import adminReady from "../../../firebase/admin";
// import { storage, auth } from '@/app/firebaseConfig';
// import { ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
// import { signInWithEmailAndPassword } from "firebase/auth";

export async function POST(request){

    try{
        // 요청 본문 파싱
        const req = await request.json();
        //헤더에서 인증 토큰 추출
        const headersList = headers();
        const referer = headersList.get("authorization");
        const token = referer ? referer.split(' ')[1] : null;

        // 토큰 검증 로직 (예: 환경 변수에 저장된 토큰과 비교)
        if (!token || token !== process.env.POST_TOKEN) {
            return Response.json({message: '요청 헤더 토큰 확인하세요'} , {status: 401})
        }
        const firestore = adminReady.firestore();

        const sowonText = await firestore.collection('sowon').orderBy("time", "desc").get();
        const sowonData = sowonText.docs.map((doc) => {
            return doc.data();
        });

        if(req.action === 'sowonget'){
            const responseObject = {
                sowons : sowonData
            }

            return Response.json(responseObject, {status :200});

        }else if(req.action === 'sowonsubmit'){

            const sanitizeInput = (input) => {
                return input.replace(/[{}()<>`~!@#$%^&*|\[\]\\\'\";:\/?|]/gim, '');
            };

            const write = {
                contents : sanitizeInput(req.sowon.contents),
                time: req.sowon.time
            }

            // const sowonDoc = await firestore.collection('sowon').add(write);

            // 240106 중복 방지를 위해 트랜젝션으로 변경 
            await firestore.runTransaction(async (transaction) => {
                const sowonRef = firestore.collection('sowon').doc(); // 새 문서 참조 생성
                transaction.set(sowonRef, write); // 새 문서에 데이터 쓰기

                console.log(sowonRef.id)
            });

            return Response.json({message:'소원성공'}, {status :200});
        }else{
            throw new Error('하지 마세요.')
        }
        
    }catch(error){

        console.log('흠...무서워서 원', error.message)

        return Response.json({message: error.message} , {status: 401})
    }
}