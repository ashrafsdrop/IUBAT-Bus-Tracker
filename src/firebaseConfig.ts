import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDINOxRVBuLl3B7g1RwSAj35ySBBdrj0GU",
  authDomain: "iubat-bus.firebaseapp.com",
  projectId: "iubat-bus",
  storageBucket: "iubat-bus.firebasestorage.app",
  messagingSenderId: "236796974029",
  appId: "1:236796974029:web:f86102b65192ca339d2a84",
  measurementId: "G-E3H6R0CHRK",
  databaseURL: "https://iubat-bus-default-rtdb.firebaseio.com" 
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
