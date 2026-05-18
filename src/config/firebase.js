import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAyO6e9nmCHQafXPZ6HuOSoK8ZafBrV_z8",
  authDomain: "web-dev-course-cat.firebaseapp.com",
  projectId: "web-dev-course-cat",
  storageBucket: "web-dev-course-cat.firebasestorage.app",
  messagingSenderId: "350289631158",
  appId: "1:350289631158:web:faae6c78567d42d7841317",
  measurementId: "G-NN5R6NMVGY"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Provider with Hosted Domain restriction
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  hd: 'academiatarapaca.com',
  prompt: 'select_account'
});
