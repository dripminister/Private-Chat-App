import React, { useState } from "react"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { db, auth } from "../firebase"
import { doc, setDoc, getDoc } from "firebase/firestore"
import { Link, useNavigate } from "react-router-dom"

function SignUp() {
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [username, setUsername] = useState("")
	const [error, setError] = useState(null)
	const navigate = useNavigate()

	const handleSubmit = async (e) => {
		e.preventDefault()
		const usernameDocRef = doc(db, "users", username)
		const docSnap = await getDoc(usernameDocRef)

		if (docSnap.exists()) {
			setError("User already exists!")
			return
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			)
			const user = userCredential.user

			const userDocRef = doc(db, "users", username)
			await setDoc(userDocRef, {
				userId: user.uid,
			})
			navigate("/")
		} catch (firebaseError) {
			setError(firebaseError.message)
		}
	}

	return (
		<div className="signup-container">
			<h2>Sign Up</h2>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button type="submit">Register</button>
			</form>
			{error && <p>{error}</p>}
			<Link to="/login">Login</Link>
		</div>
	)
}

export default SignUp
