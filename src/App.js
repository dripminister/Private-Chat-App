import React, { useContext } from "react"
import {
	BrowserRouter as Router,
	Route,
	Routes,
	Outlet,
	Navigate
} from "react-router-dom"
import { AuthProvider, AuthContext, useAuth } from "./context/AuthContext"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Home from "./pages/Home"

const ProtectedRoute = () => {
	const { currentUser } = useAuth()

	return currentUser ? <Outlet /> : <Navigate to="/login" />
}

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route
						path="/login"
						element={<Login />}
					/>
					<Route
						path="/signup"
						element={<Signup />}
					/>
					<Route
						path="/"
						element={<ProtectedRoute />}
					>
						<Route
							index
							element={<Home />}
						/>
					</Route>
					<Route
						path="/"
						element={<ProtectedRoute />}
					>
						<Route
							index
							element={<Home />}
						/>
					</Route>
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App
