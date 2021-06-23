import { toast } from 'react-hot-toast'

import copyImg from '../../assets/images/copy.svg'

import './styles.scss'

interface RoomCodeProps {
	code: string
}

export function RoomCode({ code }: RoomCodeProps) {
	function copyRoomCodeToClipboard() {
		navigator.clipboard.writeText(code)
		toast.success('Copiado!')
	}

	return (
		<button
			className="room-code"
			onClick={copyRoomCodeToClipboard}
			title="Copiar código"
		>
			<div>
				<img src={copyImg} alt="Copy room code" />
			</div>
			<span>Sala #{code}</span>
		</button>
	)
}