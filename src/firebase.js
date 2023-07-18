// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import {getAuth} from 'firebase/auth';
//import {getDatabase} from 'firebase/database';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// 사용할 파이어베이스 서비스 주석을 해제합니다

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCpgtDp811HHBnElTiiF8WVanRON4d0QWU",
  authDomain: "whereguide.firebaseapp.com",
  databaseURL: "https://whereguide-default-rtdb.firebaseio.com",
  projectId: "whereguide",
  storageBucket: "whereguide.appspot.com",
  messagingSenderId: "460023421411",
  appId: "1:460023421411:web:817830a134917159bbe8d6",
  measurementId: "G-27DXRHFQ29"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const firebase_db = getDatabase(app);
//const analytics = getAnalytics(app);
