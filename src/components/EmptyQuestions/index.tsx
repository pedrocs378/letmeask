
import emptyQuestionsImg from '../../assets/images/empty-questions.svg'

import './styles.scss'

export function EmptyQuestions() {

	return (
		<div className="empty-list">
			<img src={emptyQuestionsImg} alt="Nenhuma questão" />
			<strong>Nenhuma pergunta por aqui...</strong>
			<p>
				Envie o código desta sala para seus amigos e comece a responder perguntas!
			</p>
		</div>
	)
}