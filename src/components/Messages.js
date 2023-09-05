function Message({ message, currentUser }) {
	const isOwnMessage = message.from === currentUser
	const isVideo = message.mediaUrl?.endsWith(".mp4")

	const date = message.timestamp?.toDate()
	const formattedDate = date
		? `${date.getHours()}:${
				date.getMinutes() < 10 ? "0" : ""
		  }${date.getMinutes()}`
		: ""

	return (
		<div
			className={`message ${isOwnMessage ? "own-message" : "other-message"}`}
		>
			<span className="message-sender">{message.from}: </span>

			{message.text && <span>{message.text}</span>}

			{message.mediaUrl && !isVideo && (
				<img
					src={message.mediaUrl}
					alt="Sent content"
					className="message-image"
				/>
			)}

			{message.mediaUrl && isVideo && (
				<video
					controls
					className="message-video"
				>
					<source
						src={message.mediaUrl}
						type="video/mp4"
					/>
					Your browser does not support videos!
				</video>
			)}

			<span className="message-timestamp">{formattedDate}</span>
		</div>
	)
}

export default Message
