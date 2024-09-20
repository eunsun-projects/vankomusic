// import adminReady from "../../../firebase/admin";
import { headers } from "next/headers";
import { storage, auth } from '@/app/firebaseConfig';
import { ref, uploadBytes, deleteObject, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword } from "firebase/auth";

export async function POST(request){

    try{
        // 요청 본문 파싱
        const req = await request.formData();

        const files = [];
        // Display the values
        for (const value of req.values()) {
            files.push(value);
        }
        // const files = req.get('file');

        //헤더에서 인증 토큰 추출
        const headersList = headers();
        const referer = headersList.get("authorization");
        const token = referer ? referer.split(' ')[1] : null;

        // 토큰 검증 로직 (예: 환경 변수에 저장된 토큰과 비교)
        if (!token || token !== process.env.POST_TOKEN) {
            return Response.json({message: '요청 헤더 토큰 확인하세요'} , {status: 401})
        }

        const userCredential = await signInWithEmailAndPassword(auth, process.env.NEXT_PUBLIC_SCREEN_MAIL, process.env.NEXTAUTH_SECRET);

        // console.log(files)
        // 파일이 한개일 때, 즉 pdf 업로드 일때
        if(files[0].type === 'application/pdf'){

            if(!userCredential.user.uid){
                return Response.json({message: '파이어베이스 로그인 안되서 실패'} , {status: 401});
            };

            const pdfRef = ref(storage, 'assets/contact/pdf/vanko_request.pdf');

            const bytes = await files[0].arrayBuffer();
            const buffer = Buffer.from(bytes);
            const metadata = {
                contentType: 'application/pdf',
            }

            await deleteObject(pdfRef);
            const result = await uploadBytes(pdfRef, buffer, metadata);

            if(result) {
                return Response.json({message: "성공"}, {status: 200});
            }else{
                return Response.json({message: '파이어베이스 업로드에서 실패'} , {status: 401})
            }

        // 파일이 여러개일 때, 즉 mp3 업로드일 때
        }else{

            if(!userCredential.user.uid){
                return Response.json({message: '파이어베이스 로그인 안되서 실패'} , {status: 401});
            };

            // let snapshotsArray = [];
            
            async function putStorageItem(item, index){

                const bytes = await item.arrayBuffer();
                const buffer = Buffer.from(bytes);

                const mp3ref = ref(storage, `assets/mp3/${item.name}`);
                const metadata = {
                    contentType: 'audio/mpeg',
                    customMetadata: {
                        'num': index,
                        'name': item.name.replace('.mp3', '')
                    }
                };

                const snapshot = uploadBytes(mp3ref, buffer, metadata);
                return snapshot;
            };

            const snapshots = await Promise.all(files.map((item, index) => putStorageItem(item, index))); // pusStorageItem 이 promise 를 리턴해야함

            const urls = await Promise.all(snapshots.map((e) => getDownloadURL(e.ref)));

            const finalArray = urls.map((e,i)=>{
                return {
                    url : e,
                    name : files[i].name
                }
            })

            const responseObject = {
                message: "업로드 성공",
                list : finalArray
            }

            if(responseObject.list.length > 0){
                return Response.json(responseObject, {status: 200});
            }else{
                return Response.json({message: '파이어베이스 업로드에서 실패'} , {status: 401})
            }
        }

    }catch(error){

        console.log('흠...무서워서 원', error.message)

        return Response.json({message: error.message} , {status: 401})
    }
}