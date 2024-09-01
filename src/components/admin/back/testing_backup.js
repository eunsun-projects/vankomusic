import { db } from '@/app/firebaseConfig'
import { collection, query, where, getDocs } from "firebase/firestore";
import { ref, getDownloadURL, listAll } from "firebase/storage";

export default async function Testing({data}){

    if(data){
        // console.log(data)

        // storage 의 item URL (아래의 방법 사용) 과 합쳐서 새 객체, 배열 생성하면 됨
        // const videosRef = ref(storage, 'assets');
        // const videoRef = ref(videosRef, `/mp4/${models[0].mp4file}`);
        // const videoUrl = await getDownloadURL(videoRef);


        //{data.videos[0].keyword}
    }

        return(
            <>
            {data ? (
                        <div>
                            <h1>DB 입출력 테스트 입니다!</h1>
                            <h2>테스트로 가져온 DB 데이터 : {data.videos[0].description}</h2>
                        </div>
                    ) : (
                        <div>
                            <h2>로그아웃 상태입니다.</h2>
                        </div>
                    )
                }
            </>
        )
}