import { useEffect, useState } from "react"

import { useAuth } from "./useAuth"

import { database } from "../services/firebase"

interface QuestionType {
	id: string
	author: {
		name: string
		avatar: string
	}
	content: string
	isAnswered: boolean
	isHighlighted: boolean
	likeCount: number
	likeId: string | undefined
}

type FirebaseQuestions = Record<string, {
	author: {
		name: string
		avatar: string
	}
	content: string
	isAnswered: boolean
	isHighlighted: boolean
	likes: Record<string, {
		authorId: string
	}>
}>

export function useRoom(roomId: string) {
	const { user } = useAuth()
	const [questions, setQuestions] = useState<QuestionType[]>([])
	const [authorId, setAuthorId] = useState('')
	const [title, setTitle] = useState('')
	const [isEnded, setIsEnded] = useState(false)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const roomRef = database.ref(`rooms/${roomId}`)

		roomRef.on('value', room => {

			const databaseRoom = room.val()
			const firebaseQuestions: FirebaseQuestions = databaseRoom?.questions ?? {}

			const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
				return {
					...value,
					id: key,
					likeCount: Object.values(value.likes ?? {}).length,
					likeId: Object.entries(value.likes ?? {}).find(([_, like]) => like.authorId === user?.id)?.[0]
				}
			})

			setTitle(databaseRoom?.title)
			setAuthorId(databaseRoom?.authorId)
			setQuestions(parsedQuestions)
			setIsEnded(!!databaseRoom?.endedAt)

			setIsLoading(false)
		})

		return () => {
			roomRef.off('value')
		}
	}, [roomId, user?.id])

	return { questions, title, authorId, isEnded, isLoading }
}