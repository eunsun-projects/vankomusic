import adminReady from "../../../firebase/admin";
import { headers } from "next/headers";

export async function POST (request){

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

        const firestore = adminReady.firestore();
        const batch = firestore.batch();

        // 순서변경적용일때만 실행해라.
        if(req.action === 'updateall'){

            const videoCollection = await firestore.collection('videoall');

            const result = await Promise.all(req.list.map((e)=>{
                const docRef = videoCollection.doc(e.title.toLowerCase().replaceAll(' ', ''));
                return docRef.update({ publicNum : e.publicNum })
            }))

            if(!result){
                throw new Error('순서변경 실패');
            }else{
                return Response.json({message : `성공 횟수 ${result.length} 회`}, {status: 200}); //
            }

        // 아카이브 업데이트일때만 실행해라.
        } else if(req.action === 'updateone'){

            const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/;
            const match = req.updateUrl.match(regex);
            const videoId = match ? match[1] : null;
            const videoDoc = await firestore.collection('videoall').doc(req.oldTitle.toLowerCase().replaceAll(' ', ''));

            const toSet = {
                description : req.updateDesc,
                title : req.updateTitle,
                embed : req.updateUrl,
                isYoutube : true,
                isPublic: true,
                keyword : req.updateKeyword,
                mp4file : '',
                publicNum : req.updatePublicNum, //snapshot.size
                thumb: `https://img.youtube.com/vi/${videoId}/0.jpg`,
            }

            // const result = await videoDoc.set(toSet, {merge : true});
            const result = await videoDoc.update(toSet);

            if(result.length < 1){
                throw new Error('업뎃 실패');
            }else{
                return Response.json({message : '업데이트 서버에서 성공'}, {status: 200});
            }

        // 아카이브 추가일때만 실행해라.
        } else if(req.action === 'createone'){

            const newDocRef = await firestore.collection('videoall').doc(req.createTitle.toLowerCase().replaceAll(' ', ''));

            // console.log(newDocRef)

            const toSet = {
                description : req.createDesc,
                title : req.createTitle,
                embed : req.createUrl,
                isYoutube : true,
                isPublic: true,
                keyword : req.createKeyword,
                mp4file : '',
                publicNum : req.createPublicNum,
                thumb: req.createThumb
            }

            const result = await newDocRef.set(toSet, {merge : true});

            if(result.length < 1){
                throw new Error('업뎃 실패');
            }else{
                return Response.json({message : '업데이트 서버에서 성공'}, {status: 200});
            }

        // 큐레이션 리스트 수정 일때만 실행해라.
        } else if(req.action === 'updatecuration'){

            const curatedCollection = await firestore.collection('selected');
            const snapshot = await curatedCollection.get();

            snapshot.docs.forEach((doc)=>{
                batch.delete(doc.ref);
            });

            req.curationList.map((e)=>{
                const ref = curatedCollection.doc(e.title.toLowerCase().replaceAll(' ', ''));
                batch.set(ref, e);
            })

            const result = await batch.commit();

            if(result.length < 1){
                throw new Error('큐레이션리스트 수정 실패');
            }else{
                return Response.json({message : '큐레이션리스트 수정 서버에서 성공'}, {status: 200});
            }

        // 아카이브 아이템 삭제일때만 실행해라
        } else if(req.action === 'deleteone'){

            const docRef = await firestore.collection('videoall').doc(req.item.title.toLowerCase().replaceAll(' ', ''));

            const result = await docRef.update({ isPublic : false }); // 삭제하는 대신 비공개 처리

            // console.log(result)
        
            if(result < 1){
                throw new Error('공개여부 수정 실패');
            }else{
                return Response.json({message : `공개여부 수정 성공`}, {status: 200});
            }

        // mp3 put 일때만 실행해라
        } else if(req.action === 'audioset'){

            const collectionRef = await firestore.collection('vanaudio');

            const setAll = req.audios.map((e, index)=>{
                const ref = collectionRef.doc(e.name.toLowerCase().replace('.mp3','').replaceAll(' ', ''));
                const toSet = {
                    firebaseUrl : e.url,
                    name: e.name.toLowerCase().replace('.mp3','').replaceAll(' ', ''),
                    tempNum : index,
                    publicNum : 999,
                    timestamp : new Date()
                };
                return ref.set(toSet, {merge : true});
            });

            const result = await Promise.all(setAll.map((e) => e));

            if(result.length > 0){
                return Response.json({message : 'vanaudio db 입력 성공'}, {status: 200});
            }else{
                throw new Error('vanaudio db 입력 실패');
            }
        
        // mp3 순서 변경 일때만 실행해라
        } else if(req.action === 'audionum'){
            const audioCollection = await firestore.collection('vanaudio');

            const result = await Promise.all(req.audioall.map((e)=>{
                const ref = audioCollection.doc(e.id.toLowerCase().replaceAll(' ', ''));
                return ref.update({publicNum : e.publicNum});
            }));

            if(result.length > 0){
                return Response.json({message : 'vanaudio 순서 업데이트 성공'}, {status: 200});
            }else{
                throw new Error('vanaudio 순서 업데이트 실패');
            }

        // mp3 삭제일때만 실행
        }else if(req.action === 'audiodel'){
            const audioDoc = await firestore.collection('vanaudio').doc(req.item.id);

            const result = await audioDoc.delete();
            if(result){
                return Response.json({message : 'vanaudio 삭제 성공'}, {status: 200});
            }else{
                throw new Error('vanaudio 삭제 실패');
            }
        }
    } catch(error){
        console.log('흠...무서워서 원', error.message)

        return Response.json({message: error.message} , {status: 401})
    }
}