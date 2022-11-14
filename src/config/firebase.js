import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage"; 

const firebaseConfig = {
  apiKey: "AIzaSyAjgv7ElE6pNyj-IWcuhFu7R6LA8Zhbuow",
  authDomain: "mycool-net-app.firebaseapp.com",
  databaseURL: "https://mycool-net-app.firebaseio.com",
  projectId: "mycool-net-app",
  storageBucket: "gs://mycool-net-app.appspot.com",
  messagingSenderId: "139027047038",
  appId: "1:139027047038:web:17a8142159e30c486dee2f",
  measurementId: "G-DD36HCYMCS",
};

// Initialize Firebase instance
firebase.initializeApp(firebaseConfig);
// Initialize other services on firebase instance
firebase.firestore(); 
export default firebase;