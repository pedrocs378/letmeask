import { useState, FormEvent } from 'react'
import { useParams } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { GoSignOut } from 'react-icons/go'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'
import { Question } from '../../components/Question'

import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'

import logoImg from '../../assets/images/logo.svg'

import './styles.scss'
import { useRoom } from '../../hooks/useRoom'

interface RoomParams {
	id: string
}

export function Room() {
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
					<RoomCode code={roomId} />
				</div>
			</header>

			<main>
				<div className="room-title">
					<h1>Sala {title}</h1>
					{questions.length > 0 && (
						<span>{questions.length} pergunta(s)</span>
					)}
				</div>

				<form onSubmit={handleSendQuestion}>
					<textarea
						placeholder="O que você quer perguntar?"
						value={newQuestion}
						onChange={event => setNewQuestion(event.target.value)}
					/>

					<div className="form-footer">
						{user ? (
							<div className="user-info">
								<img src={user.avatar} alt={user.name} />
								<span>{user.name}</span>

								<button type="button" onClick={signOut}>
									<GoSignOut />
								</button>
							</div>
						) : (
							<span>Para enviar uma pergunta, <button
								type="button"
								onClick={signInWithGoogle}
							>
								faça seu login
							</button>.</span>
						)}
						<Button
							type="submit"
							disabled={!user}
						>
							Enviar pergunta
						</Button>
					</div>
				</form>

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