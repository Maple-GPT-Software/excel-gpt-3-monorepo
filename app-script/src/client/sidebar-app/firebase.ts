// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import {getAuth, GoogleAuthProvider, signInWithPopup, } from 'firebase/auth'
// import {addDoc, collection, getDocs, getFirestore, query, where} from 'firebase/firestore'
// // import { getAnalytics } from "firebase/analytics";
// import { USER_ALREADY_EXISTS, USER_DOES_NOT_EXIST } from "./constants";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyD-HGaNIlqTjZiRQAA6wvKOBjQVUyFwBQQ",
//   authDomain: "excel-simplify.firebaseapp.com",
//   projectId: "excel-simplify",
//   storageBucket: "excel-simplify.appspot.com",
//   messagingSenderId: "357936409669",
//   appId: "1:357936409669:web:c0b89f9d8f1b13fdf9072c",
//   measurementId: "G-NDF54XDW0L"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const auth = getAuth(app);
// // const analytics = getAnalytics(app);
// const googleProvider = new GoogleAuthProvider();
// const db = getFirestore(app);

// /**
//  * Renders a popup where the user can signin/signup with their Google account
//  * If the user has no account with our firebase project, a user account is created in "/authentication/users"
//  * however a user profile is not created.
//  */
// export async function signInWithGoogle() {
//     try {
//         const res = await signInWithPopup(auth, googleProvider);
//         const user = res.user;

//         const q = query(collection(db, "users"), where("uuid", "==", user.uid))
//         const userDoc = await getDocs(q);

//         if (userDoc.docs.length === 0) {
//             throw new Error(USER_DOES_NOT_EXIST)
//         }
//     } catch (error) {
//         console.error(error);
//     }
// }

// export async function signUpWithGoogle() {
//     try {
//         const res = await signInWithPopup(auth, googleProvider);
//         const user = res.user;

//         const q = query(collection(db, "users"), where("uuid", "==", user.uid))
//         const userDoc = await getDocs(q);

//         if (userDoc.docs.length === 1) {
//             throw new Error(USER_ALREADY_EXISTS)
//         }

//         await addDoc(collection(db, "users"), {
//             uid: user.uid,
//             name: user.displayName,
//             authProvider: "google",
//             email: user.email,
//             createdAt: user.metadata.creationTime,
//         })
//     } catch (error) {
        
//     }
// }

// export function getIdToken() {
//     const token = auth.currentUser?.getIdToken();
//     token?.then(token => {
//         console.log('token is: ', token)
//     })
// }
