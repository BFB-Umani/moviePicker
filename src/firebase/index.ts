import firebase from "firebase/app";

import "firebase/firestore";
import "firebase/storage";
import "firebase/auth";
import { FirebaseCollections } from "./api.types";

// TODO: This should not be visible in code, but be set using environment variables
const firebaseConfig = {
  apiKey: "AIzaSyBWDl2MtPlIfcgq8O1BziUViOMRZ7CUTqo",
  authDomain: "b3runtimedev-cc9d4.firebaseapp.com",
  databaseURL: "https://b3runtimedev-cc9d4.firebaseio.com",
  projectId: "b3runtimedev-cc9d4",
  storageBucket: "b3runtimedev-cc9d4.appspot.com",
  messagingSenderId: "792814669342",
  appId: "1:792814669342:web:e814f000fcc1bd9faba80f",
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
  attendees: "attendees",
  categories: "categories",
  competitions: "competitions",
  questions: "questions",
  results: "results",
  tracks: "tracks",
  user_accounts: "user_accounts",
  checkpoints: "checkpoints",
};
