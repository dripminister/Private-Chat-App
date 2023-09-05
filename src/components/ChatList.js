import { collection, onSnapshot, query, where } from "firebase/firestore"
import { useEffect, useState } from "react"
import { db } from "../firebase"
import CreateChat from "./CreateChat"
import { useAuth } from "../context/AuthContext"

function ChatList({ setSelectedChatId }) {
	const [chats, setChats] = useState([])
	const [selectedChat, setSelectedChat] = useState(null)
	const { userDocument } = useAuth()

	useEffect(() => {
		if (!userDocument?.username) return
		const q = query(
			collection(db, "chats"),
			where("members", "array-contains", userDocument.username)
		)

		const unsubscribe = onSnapshot(q, (snapshot) => {
			setChats(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })))
		})

		return () => unsubscribe()
	}, [userDocument])

	return (
		<div className="chat-list">
			<CreateChat />
			{chats.map((chat) => (
				<div
					key={chat.id}
					onClick={() => {
						setSelectedChat(chat.id)
						setSelectedChatId(chat.id)
					}}
					className={`chat-item ${selectedChat === chat.id ? "selected" : ""}`}
				>
					{chat.chatName}
				</div>
			))}
		</div>
	)
}

export default ChatList
