import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD2I2fGi7pTwogPHyZ8Zo8gUB8C1wjNgjs",
  authDomain: "social-media-92292.firebaseapp.com",
  projectId: "social-media-92292",
  storageBucket: "social-media-92292.appspot.com",
  messagingSenderId: "511768515080",
  appId: "1:511768515080:web:df62d5023ff9695219b7bd",
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
