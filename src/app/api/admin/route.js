import adminReady from "../../../firebase/admin";

export async function GET(req){

    try{

        // if(session.user.email === process.env.NEXT_PUBLIC_SCREEN_MAIL){
            const firestore = adminReady.firestore();

            // get videos all data
            const videoCollection = await firestore.collection('videoall').get();
            const videosData = videoCollection.docs.map((doc) => {
                return doc.data();
            });

            const responseObject = {
                videos : videosData,
            }

            return Response.json(responseObject, {status :200});

        // }
        // else{
        //     throw new Error("wrongEmail");
        // }

    } catch (error) {

        console.log(error)
        return Response.json({ message: "An error occurred"}, {status: 400});

    }
}