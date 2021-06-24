import { useState, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { GoSignOut } from 'react-icons/go'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'
import { Question } from '../../components/Question'

import { useAuth } from '../../hooks/useAuth'
import { useRoom } from '../../hooks/useRoom'
import { database } from '../../services/firebase'

import logoImg from '../../assets/images/logo.svg'

import './styles.scss'

interface RoomParams {
	id: string
}

export function AdminRoom() {
	const params = useParams<RoomParams>()
	const roomId = params.id

	const [newQuestion, setNewQuestion] = useState('')

	const { user, signInWithGoogle, signOut } = useAuth()
	const { title, questions } = useRoom(roomId)

	async function handleSendQuestion(event: FormEvent) {
		event.preventDefault()

		async function sendQuestion() {
			if (!newQuestion.trim()) {
				return
			}

			if (!user) {
				toast.error('Você precisa estar logado para enviar uma pergunta!')

				return
			}

			const question = {
				content: newQuestion,
				author: {
					name: user.name,
					avatar: user.avatar
				},
				isHighlighted: false,
				isAnswered: false
			}

			await database.ref(`rooms/${roomId}/questions`).push(question)

			setNewQuestion('')
		}

		return toast.promise(sendQuestion(), {
			loading: 'Enviando...',
			success: 'Pergunta enviada!',
			error: 'Algo deu errado! Tente novamente mais tarde'
		})
	}

	return (
		<div id="page-room">
			<header>
				<div className="content">
					<Link to="/">
						<img src={logoImg} alt="Letmeask" />
					</Link>

					<div>
						<RoomCode code={roomId} />
						<Button
							type="button"
							isOutlined
						>
							Encerrar sala
						</Button>
					</div>
				</div>
			</header>

			<main>
				<div className="room-title">
					<h1>Sala {title}</h1>
					{questions.length > 0 && (
						<span>{questions.length} pergunta(s)</span>
					)}
				</div>

				<div className="question-list">
					{questions.map(question => {
						return (
							<Question
								key={question.id}
								content={question.content}
								author={question.author}
							/>
						)
					})}
				</div>
			</main>
		</div>
	)
}