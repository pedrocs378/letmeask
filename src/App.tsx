import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { Toaster } from 'react-hot-toast'
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './contexts/AuthContext'

import { Routes } from './routes'

export function App() {

	return (
		<BrowserRouter>
			<AuthProvider>
				<Routes />

				<ToastContainer />
				<Toaster />
			</AuthProvider>
		</BrowserRouter>
	);
}