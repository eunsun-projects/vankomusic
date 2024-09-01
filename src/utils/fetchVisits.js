// 방문자 수를 갱신하는 함수
export const fetchVisits = async () => {
    const visits = sessionStorage.getItem("vankovisits");
    console.log(visits)

    if(visits !== "new") {
        sessionStorage.setItem("vankovisits", 'new');

        try{
            const visitReq = {
                method: 'POST',
                cache : 'no-store',
                headers: {
                    'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
                },
                body: JSON.stringify({ action: "visitupdate" })
            };
    
            const response = await fetch('/api/visitors', visitReq); // 방문자 수를 가져오는 API

            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(`Failed to fetch data from /api/selected: Status ${response.status} - ${errorResponse}`);
            }

            const result = await response.json();
            const visitcounts = result.visits;

            return visitcounts;

        }catch(error){
            console.error('Error during fetch: ', error.message);   
        }

    }else if(visits === "new"){

        console.log('중복방문', visits);
        try{
            const visitReq = {
                method: 'GET',
                // cache : 'no-store',
                headers: {
                    // 'Content-Type' : 'application/json',
                    'Authorization' : `Bearer ${process.env.NEXT_PUBLIC_POST_TOKEN}`
                }
            };
    
            const response = await fetch('/api/visitors', visitReq); // 방문자 수를 가져오는 API

            if (!response.ok) {
                const errorResponse = await response.text();
                throw new Error(`Failed to fetch data from /api/selected: Status ${response.status} - ${errorResponse}`);
            }

            const result = await response.json();
            const visitcounts = result.visits;

            return visitcounts;

        }catch(error){
            console.error('Error during fetch: ', error.message);   
        }
    }
};
