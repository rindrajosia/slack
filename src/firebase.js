import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCxlgzLWrWkMJjkJG9SmoDMDX3dVVlA5K4",
  authDomain: "slack-josia.firebaseapp.com",
  projectId: "slack-josia",
  databaseURL: "https://slack-josia-default-rtdb.firebaseio.com/",
  storageBucket: "slack-josia.appspot.com",
  messagingSenderId: "374284225307",
  appId: "1:374284225307:web:9c212f169984b476b321be"
};


firebase.initializeApp(firebaseConfig);

export default firebase;
