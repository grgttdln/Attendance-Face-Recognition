import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB9VquWx1IFE3Vs2111T0YFghC6zgrqbg8",
  authDomain: "attendance-bf03b.firebaseapp.com",
  projectId: "attendance-bf03b",
  storageBucket: "attendance-bf03b.appspot.com",
  messagingSenderId: "958303850999",
  appId: "1:958303850999:web:4470f31022bbcd5d9c1ef2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
