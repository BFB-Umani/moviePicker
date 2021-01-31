import firebase from "firebase/app";

import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { FirebaseCollections } from "./api.types";

// TODO: This should not be visible in code, but be set using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyDvzscSkLM8OzCTH-vJA1k42rKsbjvp2CQ",
  authDomain: "moviepicker-42d4d.firebaseapp.com",
  databaseURL: "https://moviepicker-42d4d-default-rtdb.firebaseio.com/",
  projectId: "moviepicker-42d4d",
  storageBucket: "moviepicker-42d4d.appspot.com",
  messagingSenderId: "898136067668",
  appId: "1:898136067668:android:c7e79264c621db029de7c1",
};

// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  // firebase.analytics();
}

export default firebase;
export const firestore = firebase.firestore();
export const firebaseAuth = firebase.auth();
export const firebaseStorage = firebase.storage();
export const firebaseCollections: { [key in FirebaseCollections]: string } = {
  movie_lists: "movie_lists",
  user_accounts: "user_accounts",
  creators: "creators",
  contributers: "contributers",
};
