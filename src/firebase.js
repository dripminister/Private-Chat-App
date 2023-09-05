import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"

const firebaseConfig = {
	apiKey: "AIzaSyAE-f22C8Izg23irEPoYZ6knAaUM7-tAWU",
	authDomain: "zoom-356f1.firebaseapp.com",
	projectId: "zoom-356f1",
	storageBucket: "zoom-356f1.appspot.com",
	messagingSenderId: "347369471836",
	appId: "1:347369471836:web:27873acc1f1ffacecccb99",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)