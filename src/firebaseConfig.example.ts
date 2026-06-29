import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

// COPY THIS FILE TO firebaseConfig.ts AND FILL IN YOUR REAL CREDENTIALS
// DO NOT COMMIT YOUR REAL firebaseConfig.ts TO GITHUB!

const firebaseConfig = {
  apiKey: "YOUR_API_KEY_HERE",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.firebasestorage.app",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com" 
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
