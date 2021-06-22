import { useEffect } from "react";
import { useState, createContext, ReactNode } from "react";

import { firebase, auth } from '../services/firebase'

interface User {
	id: string
	name: string
	avatar: string
}

interface AuthContextData {
	user: User | undefined
	signInWithGoogle: () => Promise<void>
}

interface AuthProviderProps {
	children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User>()

	async function signInWithGoogle() {
		const provider = new firebase.auth.GoogleAuthProvider()

		const result = await auth.signInWithPopup(provider)

		if (result.user) {
			const {
				displayName,
				photoURL,
				uid
			} = result.user

			if (!displayName || !photoURL) {
				throw new Error('Missing information from Google Account.')
			}

			setUser({
				id: uid,
				name: displayName,
				avatar: photoURL
			})
		}
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(user => {
			if (user) {
				const { displayName, photoURL, uid } = user

				if (!displayName || !photoURL) {
					throw new Error('Missing information from Google Account.')
				}

				setUser({
					id: uid,
					name: displayName,
					avatar: photoURL
				})
			}
		})

		return () => {
			unsubscribe()
		}
	}, [])

	return (
		<AuthContext.Provider value={{ user, signInWithGoogle }}>
			{children}
		</AuthContext.Provider>
	)
}