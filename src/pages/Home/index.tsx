import { FormEvent, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

import { Button } from '../../components/Button'

import { useAuth } from '../../hooks/useAuth'
import { database } from '../../services/firebase'

import illustrationImg from '../../assets/images/illustration.svg'
import logoImg from '../../assets/images/logo.svg'
import googleIconImg from '../../assets/images/google-icon.svg'

import './styles.scss'

export function Home() {
	const [roomCode, setRoomCode] = useState('')

	const { user, signInWithGoogle } = useAuth()

	const history = useHistory()

	async function handleCreateRoom() {
		if (!user) {
			await signInWithGoogle()
		}

		history.push('/rooms/new')
	}

	async function handleJoinRoom(event: FormEvent) {
		event.preventDefault()

		if (!roomCode.trim()) {
			return
		}

		const roomRef = await database.ref(`rooms/${roomCode}`).get()

		if (!roomRef.exists()) {
			toast.error('Room does not exists')
			return
		}

		history.push(`/rooms/${roomCode}`)
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
					<button
						className="create-room"
						onClick={handleCreateRoom}
					>
						<img src={googleIconImg} alt="Logo do google" />
						Crie sua sala com o goole
					</button>
					<div className="separator">ou entre em uma sala</div>
					<form onSubmit={handleJoinRoom}>
						<input
							type="text"
							placeholder="Digite o código da sala"
							value={roomCode}
							onChange={event => setRoomCode(event.target.value)}
						/>
						<Button type="submit">
							Entrar na sala
						</Button>
					</form>
				</div>
			</main>
		</div>
	)
}