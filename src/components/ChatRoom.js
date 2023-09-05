import {
	collection,
	onSnapshot,
	Timestamp,
	addDoc,
	query,
	orderBy,
} from "firebase/firestore"
import Message from "./Messages"
import { db, storage } from "../firebase"
import { useEffect, useState, useRef } from "react"
import { useAuth } from "../context/AuthContext"
import {
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage"

function ChatRoom({ chatId }) {
	const [messages, setMessages] = useState([])
	const [inputMessage, setInputMessage] = useState("")
	const { userDocument } = useAuth()
	const fileInput = useRef(null)
	const [previewImageUrl, setPreviewImageUrl] = useState("")
	const [previewVideoUrl, setPreviewVideoUrl] = useState("")
	const [selectedFile, setSelectedFile] = useState(null)


	const handleFileIconClick = () => {
		fileInput.current.click()
	}

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(
				collection(db, "chats", chatId, "messages"),
				orderBy("timestamp")
			),
			(snapshot) => {
				setMessages(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
			}
		)

		return () => unsubscribe()
	}, [chatId])

	const sendMessage = async () => {
		if (!inputMessage.trim() && !selectedFile) return

		let mediaUrl = null 

		if (selectedFile) {
			const storageRef = ref(storage, `media/${selectedFile.name}`)
			const uploadTask = uploadBytesResumable(storageRef, selectedFile)

			try {
				const snapshot = await uploadTask
				mediaUrl = await getDownloadURL(snapshot.ref)
			} catch (error) {
				alert("Error uploading the file: ", error)
				return
			}
		}

		const newMessage = {
			text: inputMessage,
			timestamp: Timestamp.now(),
			from: userDocument?.username,
			mediaUrl: mediaUrl ? mediaUrl : "",
		}

		try {
			await addDoc(collection(db, "chats", chatId, "messages"), newMessage)
			setInputMessage("")
			setPreviewImageUrl(null)
			setPreviewVideoUrl(null)
			setSelectedFile(null)
		} catch (error) {
			alert("Fehler beim Senden der Nachricht: ", error)
		}
	}

	const handleFileChange = (event) => {
		const file = event.target.files[0]

		if (file) {
			setSelectedFile(file)

			const objectURL = URL.createObjectURL(file)
			if (file.type.startsWith("image/")) {
				setPreviewImageUrl(objectURL)
			} else if (file.type.startsWith("video/")) {
				setPreviewVideoUrl(objectURL)
			}
		}
	}

	useEffect(() => {
		return () => {
			if (previewImageUrl) {
				URL.revokeObjectURL(previewImageUrl)
			}
			if (previewVideoUrl) {
				URL.revokeObjectURL(previewVideoUrl)
			}
		}
	}, [previewImageUrl, previewVideoUrl])

	return (
		<div className="chat-room">
			<div className="message-container">
				{messages.map((message) => (
					<Message
						key={message.id}
						message={message}
						currentUser={userDocument?.username}
					/>
				))}
			</div>
			<div className="message-input-container">
				{previewImageUrl && (
					<img
						src={previewImageUrl}
						alt="Preview"
						className="media-preview"
					/>
				)}

				{previewVideoUrl && (
					<video
						controls
						className="video-preview"
					>
						<source
							src={previewVideoUrl}
							type="video/mp4"
						/>
						Your browser doesn't support videos!
					</video>
				)}

				<input
					type="text"
					placeholder="Write something..."
					value={inputMessage}
					onChange={(e) => setInputMessage(e.target.value)}
					className="message-input"
				/>
				<input
					type="file"
					style={{ visibility: "hidden", width: 0 }}
					onChange={handleFileChange}
					ref={fileInput}
				/>
				<i
					className="fas fa-paperclip attachment-icon"
					onClick={handleFileIconClick}
				></i>
				<button
					onClick={sendMessage}
					className="send-button"
					disabled={!inputMessage && !previewImageUrl && !previewVideoUrl}
				>
					Send
				</button>
			</div>
		</div>
	)
}

export default ChatRoom
