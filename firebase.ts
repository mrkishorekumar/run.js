import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB93PzAw3PD5S1ViY_cChof3nQjaqt17fE",
  authDomain: "runjs-749bf.firebaseapp.com",
  projectId: "runjs-749bf",
  storageBucket: "runjs-749bf.appspot.com",
  messagingSenderId: "290083921034",
  appId: "1:290083921034:web:05ccdc192c1721aa062173",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();
const provider = new GoogleAuthProvider();

const signInWithGooglePopup = () => signInWithPopup(auth, provider);

export { auth, signInWithGooglePopup };
