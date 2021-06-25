import { useCallback, useEffect } from 'react'
import { useParams, Link, useHistory } from 'react-router-dom'
import { toast } from 'react-hot-toast'

import { Button } from '../../components/Button'
import { RoomCode } from '../../components/RoomCode'
import { Question } from '../../components/Question'
import { EmptyQuestions } from '../../components/EmptyQuestions'

import { useRoom } from '../../hooks/useRoom'
import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'

import logoImg from '../../assets/images/logo.svg'
import deleteImg from '../../assets/images/delete.svg'
import checkImg from '../../assets/images/check.svg'
import answerImg from '../../assets/images/answer.svg'

import './styles.scss'

interface RoomParams {
	id: string
}

export function AdminRoom() {
	const history = useHistory()
	const params = useParams<RoomParams>()
	const roomId = params.id

	const { user } = useAuth()
	const { title, questions, authorId, isLoading: roomLoading } = useRoom(roomId)

	async function handleEndRoom() {
		await database.ref(`rooms/${roomId}`).update({
			endedAt: new Date()
		})

		history.push('/')
	}

	const handleCheckQuestionAsAnswered = useCallback(async (questionId: string) => {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isAnswered: true
		})
	}, [roomId])

	const handleHighlightQuestion = useCallback(async (questionId: string) => {
		await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
			isHighlighted: true
		})
	}, [roomId])

	const handleDeleteQuestion = useCallback(async (questionId: string) => {
		if (window.confirm('Tem certeza que você deseja excluir esta pergunta?')) {
			await database.ref(`rooms/${roomId}/questions/${questionId}`).remove()
		}
	}, [roomId])

	useEffect(() => {
		if (!roomLoading && (user?.id !== authorId)) {
			toast.error('Você não tem permissão para acessar essa página', {
				duration: 5000
			})

			history.push(`/rooms/${roomId}`)
		}
	}, [roomLoading, roomId, user?.id, authorId, history])

	if (roomLoading) {
		return null
	}

	return (
		<div id="page-admin-room">
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
							onClick={handleEndRoom}
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
					{questions.length === 0 && <EmptyQuestions />}

					{questions.map(question => {
						return (
							<Question
								key={question.id}
								content={question.content}
								author={question.author}
								isAnswered={question.isAnswered}
								isHighlighted={question.isHighlighted}
							>
								{!question.isAnswered && (
									<>
										<button
											type="button"
											onClick={() => handleCheckQuestionAsAnswered(question.id)}
											title="Marcar pergunta como respondida"
										>
											<img
												src={checkImg}
												alt="Marcar pergunta como respondida"
											/>
										</button>
										<button
											type="button"
											onClick={() => handleHighlightQuestion(question.id)}
											title="Dar destaque à pergunta"
										>
											<img
												src={answerImg}
												alt="Dar destaque à pergunta"
											/>
										</button>
									</>
								)}
								<button
									type="button"
									onClick={() => handleDeleteQuestion(question.id)}
									title="Remover pergunta"
								>
									<img
										src={deleteImg}
										alt="Remover pergunta"
									/>
								</button>
							</Question>
						)
					})}
				</div>
			</main>
		</div>
	)
}