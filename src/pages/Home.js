import { signOut } from "firebase/auth"
import React, { useState } from "react"
import { auth } from "../firebase"
import { useAuth } from "../context/AuthContext"
import ChatList from "../components/ChatList"
import ChatRoom from "../components/ChatRoom"

const Home = () => {
	const { userDocument } = useAuth()

	const [selectedChatId, setSelectedChatId] = useState(null)
	const [isSidebarOpen, setIsSidebarOpen] = useState(true)

	const toggleSidebar = () => {
		setIsSidebarOpen((prevState) => !prevState)
	}

	const handleClick = async (e) => {
		e.preventDefault()
		try {
			await signOut(auth)
		} catch (error) {
			console.error(error)
		}
	}

	return (
		<div className="home-container">
			<header className="topbar">
				<button
					onClick={toggleSidebar}
					className="toggle-btn"
				>
					{isSidebarOpen ? (
						<i className="fas fa-times"></i>
					) : (
						<i className="fas fa-bars"></i>
					)}
				</button>
				<span className="username">{userDocument?.username}</span>
				<button
					onClick={handleClick}
					className="logout-btn"
				>
					Log out
				</button>
			</header>
			<div className="chat-container">
				<aside className={`chat-list ${!isSidebarOpen ? "collapsed" : ""}`}>
					<ChatList setSelectedChatId={setSelectedChatId} />
				</aside>
				<main className="chatroom-main">
					{selectedChatId && <ChatRoom chatId={selectedChatId} />}
				</main>
			</div>
		</div>
	)
}

export default Home
