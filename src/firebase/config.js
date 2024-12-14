import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBCY9aoLNm2xmJPRgBEoV7y2XFkYdZJa2k",
  authDomain: "social-media-app-d1026.firebaseapp.com",
  projectId: "social-media-app-d1026",
  storageBucket: "social-media-app-d1026.appspot.com",
  messagingSenderId: "924925800740",
  appId: "1:924925800740:web:a92814fa8c0496c43983b1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
