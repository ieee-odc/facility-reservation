import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyAR_CLzhaKvBc_T9zB39mJteTXvWY7iqec",
  authDomain: "easy-a7462.firebaseapp.com",
  projectId: "easy-a7462",
  storageBucket: "easy-a7462.appspot.com",
  messagingSenderId: "165690934319",
  appId: "1:165690934319:web:62520a60fdeade6e6372da",
  measurementId: "G-33HP0H6T84"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth}