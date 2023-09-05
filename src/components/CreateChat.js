import { useState } from "react"
import { useAuth } from "../context/AuthContext"
import { getDoc, doc, collection, addDoc, Timestamp } from "firebase/firestore"
import { db } from "../firebase"

function CreateChat() {
	const { userDocument } = useAuth()

	const [chatName, setChatName] = useState("")
	const [newMember, setNewMember] = useState("")
	const [members, setMembers] = useState([userDocument?.username])
	const [isVisible, setIsVisible] = useState(true)

	const handleSubmit = async (e) => {
		e.preventDefault()

		if (chatName.trim() === "" || members.length === 0) {
			alert("No chat name or members!")
			return
		}

		const newChat = {
			chatName: chatName,
			members: members,
			createdAt: Timestamp.now(),
		}

		try {
			await addDoc(collection(db, "chats"), newChat)

			setChatName("")
			setMembers([userDocument?.username])
		} catch (error) {
			alert("Error creating the chat:", error)
		}
	}


	const doesUsernameExist = async (username) => {
		const userDoc = doc(db, "users", username)
		const userDocSnapshot = await getDoc(userDoc)
		return userDocSnapshot.exists()
	}

	const addMember = async () => {
		if (!newMember) return

		const memberExists = await doesUsernameExist(newMember)
		const isAlreadyAdded = members.includes(newMember)

		if (!memberExists) {
			alert("User doesn't exist!")
			return
		}

		if (isAlreadyAdded) {
			alert("User was already added!")
			return
		}

		setMembers([...members, newMember])
		setNewMember("")
	}

	return (
		<div className="create-chat-wrapper">
			<button
				onClick={() => setIsVisible(!isVisible)}
				className="toggle-chat-button"
			>
				{isVisible ? (
					<i className="fas fa-arrow-up"></i>
				) : (
					<i className="fas fa-arrow-down"></i>
				)}
			</button>

			<form
				onSubmit={handleSubmit}
				className={`create-chat-container ${isVisible ? "visible" : ""}`}
			>
				<input
					type="text"
					placeholder="Chat Name"
					value={chatName}
					onChange={(e) => setChatName(e.target.value)}
					className="create-chat-input"
				/>
				<input
					placeholder="Add Member"
					value={newMember}
					onChange={(e) => setNewMember(e.target.value)}
					className="create-chat-input"
				/>
				<button
					onClick={addMember}
					type="button"
					className="create-chat-button"
				>
					Add Member
				</button>
				<div className="create-chat-members-list">
					<p>Chat members</p>
					{members.map((member) => (
						<p
							key={member}
							className="create-chat-member"
						>
							{member}
						</p>
					))}
				</div>
				<button
					type="submit"
					className="create-chat-button"
				>
					Create Group
				</button>
			</form>
		</div>
	)

}

export default CreateChat
