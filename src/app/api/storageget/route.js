import adminReady from "../../../firebase/admin";
import { headers } from "next/headers";

export async function POST(request){
    try{

        // 요청 본문 파싱
        const req = await request.json();

        // 헤더에서 인증 토큰 추출
        const headersList = headers();
        const referer = headersList.get("authorization");
        const token = referer ? referer.split(' ')[1] : null;

        // 토큰 검증 로직 (예: 환경 변수에 저장된 토큰과 비교)
        if (!token || token !== process.env.POST_TOKEN) {
            return Response.json({message: '요청 헤더 토큰 확인하세요'} , {status: 401})
        }

        // 겟 일때만
        if(req.action === "geturl"){

            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() + 3); // 현재 날짜에 3일을 더함

            const expiresDate = currentDate.toISOString(); // ISO 형식의 문자열로 변환

            const file = await adminReady.storage().bucket('vanko-firebase.appspot.com').file("assets/contact/pdf/testpdf.pdf");

            // 서명된 URL을 생성합니다.
            const [url] = await file.getSignedUrl({
                action: 'read',
                expires: expiresDate // 만료 날짜를 적절히 설정하세요.
            });

            try{
                // const url = await getUrl;
                // console.log(url); // 이제 URL이 제대로 출력됩니다.
                const resonseObject = {
                    message : '파일 링크 획득 성공',
                    url : url
                }

                return Response.json(resonseObject, {status: 200});
            }catch (error) {
                throw new Error('실패');
            }

        // test
        } else{
            return Response.json({message :'테스트'}, {status: 200});
        }

    }catch(error){

        console.log('흠...무서워서 원', error.message)

        return Response.json({message: error.message} , {status: 401})
    }
}

 // const storage = await adminReady.storage().bucket('vanko-firebase.appspot.com');
            
// // Promise를 생성하여 스트림이 완료될 때까지 기다립니다.
// const getUrl = new Promise((resolve, reject) => {
//     const storageRef = storage.getFilesStream({ prefix: "assets/contact/pdf/testpdf.pdf" });
//     let url;

//     storageRef.on('data', (file) => {
//         url = file.metadata.mediaLink;
//     });

//     storageRef.on('end', () => {
//         if(url) {
//             resolve(url);
//         } else {
//             reject(new Error('파일을 찾을 수 없습니다.'));
//         }
//     });

//     storageRef.on('error', (error) => {
//         reject(error);
//     });
// });