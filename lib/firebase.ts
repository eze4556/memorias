import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyCpGByP4yV91k0hm3TZX8P3NHQUuckNumw",
  authDomain: "app-servicios-e99de.firebaseapp.com",
  projectId: "app-servicios-e99de",
  storageBucket: "app-servicios-e99de.appspot.com",
  messagingSenderId: "281743607632",
  appId: "1:281743607632:web:11509479f18726330e0e55",
  measurementId: "G-0CTZQ2JPY2",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const storage = getStorage(app)
export const auth = getAuth(app)

export default app
