import { useEffect, useState, createContext, ReactNode } from "react";

import { firebase, auth } from '../services/firebase'

interface User {
	id: string
	name: string
	avatar: string
}

interface AuthContextData {
	user: User | undefined
	signInWithGoogle: () => Promise<void>
	signOut: () => Promise<void>
}

interface AuthProviderProps {
	children: ReactNode
}

export const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<User>()
	const [isLoading, setIsLoading] = useState(true)

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

	async function signOut() {
		await auth.signOut()
	}

	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged(userState => {
			if (userState) {
				const { displayName, photoURL, uid } = userState

				if (!displayName || !photoURL) {
					throw new Error('Missing information from Google Account.')
				}

				setUser({
					id: uid,
					name: displayName,
					avatar: photoURL
				})
			} else {
				setUser(undefined)
			}

			setIsLoading(false)
		})

		return () => {
			unsubscribe()
		}
	}, [])

	if (isLoading) {
		return <p>Carregando...</p>
	}

	return (
		<AuthContext.Provider value={{ user, signInWithGoogle, signOut }}>
			{children}
		</AuthContext.Provider>
	)
}