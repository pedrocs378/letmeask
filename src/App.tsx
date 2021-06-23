import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext'

import { Routes } from './routes'

export function App() {

	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes />

				<ToastContainer />
			</AuthProvider>
		</BrowserRouter>
	);
}