import { FormEvent, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import Loading from 'react-loading'

import { Button } from '../../components/Button'

import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'

import './styles.scss'

export function NewRoom() {
	const [isLoading, setIsLoading] = useState(false)
	const [newRoom, setNewRoom] = useState('')

	const { user } = useAuth()
	const history = useHistory()

	async function handleCreateRoom(event: FormEvent) {
		event.preventDefault()

		if (!newRoom.trim()) {
			toast.error('Você deve dar uma nome para sua sala.')

			return
		}
		setIsLoading(true)

		const roomRef = database.ref('rooms')

		const firebaseRoom = await roomRef.push({
			title: newRoom,
			authorId: user?.id,
		})

		history.push(`/rooms/${firebaseRoom.key}`)

		setIsLoading(false)
	}

	return (
		<div id="page-auth">
			<aside>
				<img src={illustrationImg} alt="Ilustração simbolizando perguntas e respostas" />
				<strong>Crie salas de Q&amp;A ao-vivo</strong>
				<p>Tire as dúvidas da sua audiência em tempo-real</p>
			</aside>
			<main>
				<div className="main-content">
					<img src={logoImg} alt="Letmeask" />
					<h2>Crie uma nova sala</h2>
					<form onSubmit={handleCreateRoom}>
						<input
							type="text"
							placeholder="Nome da sala"
							value={newRoom}
							onChange={event => setNewRoom(event.target.value)}
						/>
						<Button
							type="submit"
							disabled={isLoading}
						>
							{isLoading ? (
								<Loading
									type="bubbles"
									color="#fff"
									height={24}
									width={24}
								/>
							) : "Criar sala"}
						</Button>
					</form>
					<p>
						Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
					</p>
				</div>
			</main>
		</div>
	)
}