import React, { createContext, useContext, useState, useEffect } from "react"
import { auth, db } from "../firebase"
import { query, collection, getDocs, where } from "firebase/firestore"

const AuthContext = createContext()

export function useAuth() {
	return useContext(AuthContext)
}

export function AuthProvider({ children }) {
	const [currentUser, setCurrentUser] = useState(null)
	const [userDocument, setUserDocument] = useState(null)

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(async (user) => {
			setCurrentUser(user)

			if (user) {
				const q = query(
					collection(db, "users"),
					where("userId", "==", user.uid)
				)
				const querySnapshot = await getDocs(q)

				const userDoc = querySnapshot.docs[0]
				if (userDoc) {
					setUserDocument({...userDoc.data(), username: userDoc.id})
				} else {
					setUserDocument(null)
				}
			} else {
				setUserDocument(null)
			}
		})

		return unsubscribe
	}, [])

	const value = {
		currentUser,
		userDocument,
	}

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
