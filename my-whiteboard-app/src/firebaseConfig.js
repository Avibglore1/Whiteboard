import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBt1zc-iAig-G6TwGSbWCg7aS4_TT_0zAs",
  authDomain: "whiteboard-app-cfde3.firebaseapp.com",
  projectId: "whiteboard-app-cfde3",
  storageBucket: "whiteboard-app-cfde3.firebasestorage.app",
  messagingSenderId: "855273090992",
  appId: "1:855273090992:web:73dfd7df5185977536b075"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // ✅ Correct way to initialize Firestore

export { db };