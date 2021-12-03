import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCxlgzLWrWkMJjkJG9SmoDMDX3dVVlA5K4",
  authDomain: "slack-josia.firebaseapp.com",
  projectId: "slack-josia",
  storageBucket: "slack-josia.appspot.com",
  messagingSenderId: "374284225307",
  appId: "1:374284225307:web:9c212f169984b476b321be"
};


const app = initializeApp(firebaseConfig);

export default app;
