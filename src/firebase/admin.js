
import admin from 'firebase-admin';
import * as token from "../../vanko-firebase-key.json";

let adminInstance;

async function initFirebase() {
    if (!adminInstance) {
        if (admin.apps.length === 0) {
            admin.initializeApp({
                credential: admin.credential.cert(token, 'vanko-firebase'),
                storageBucket: 'gs://vanko-firebase.appspot.com'
            });
            console.log('Vanko Initialized new');
        } else {
            console.log('Firebase already initialized');
        }
        adminInstance = admin;
    }
    return adminInstance;
}

const adminReady = await initFirebase();

export default adminReady;

// import admin from 'firebase-admin'
// import * as token from "../../vanko-firebase-key.json"

// async function init(){
    
//     try {

//         // 1. ↓ 로그인 된 앱이 없다면
//         if(admin.apps.length === 0){
//             // 반코파이어베이스로 새로 로그인
//             admin.initializeApp({
//                 credential: admin.credential.cert(token, 'vanko-firebase'),
//                 storageBucket: 'gs://vanko-firebase.appspot.com'
//             });
//             console.log('Vanko Initialized new');

//             return admin;

//         // 2. ↓ 로그인이 되어 있고(0보다 크다면) 이미 반코파이어베이스 아니라면
//         }else if (admin.apps.length > 0 && admin.app().options.credential.projectId !== 'vanko-firebase') {
//             // 모든 앱 로그아웃하고 반코파이어베이스로 로그인
//             await Promise.all(admin.apps.map(app => app.delete()));
//             admin.initializeApp({
//                 credential: admin.credential.cert(token, 'vanko-firebase'),
//                 storageBucket: 'vanko-firebase.appspot.com'
//             });
//             console.log('Vanko Initialized updated');

//             return admin
//         }
//         // 3. ↓ 로그인이 되어 있고 그것이 반코파이어베이스 라면
//         else if(admin.apps.length > 0 && admin.app().options.credential.projectId === 'vanko-firebase'){
//             return admin;
//         }

//     } catch (error) {
//         /*
//         * We skip the "already exists" message which is
//         * not an actual error when we're hot-reloading.
//         */
//         if (!/already exists/u.test(error.message)) {
//             console.error('Firebase admin initialization error', error.stack)
//         }

//         return error;
//     }
// }

// const adminReady = await init();

// export default adminReady

// const alreadyCreatedAps = getApps();

// let app;
// 
// if(alreadyCreatedAps.length === 0){
//     console.log('없다면?')

//     app = initializeApp(token, "vanko-firebase");
//     return app;
// }else{ // 초기화 된 앱이 있다면 모든 앱 로그아웃
//     await Promise.all(alreadyCreatedAps.map(e => e.delete())); // promise.all 로 모두 로그아웃 될때까지 기다릴 것

//     console.log('있다면?')
//     app = initializeApp(token, "vanko-firebase"); // 반코 앱 로그인
//     return app;
// }

// const App = alreadyCreatedAps.length === 0
//     ? initializeApp(token, "vanko-firebase")
//     : alreadyCreatedAps[0];