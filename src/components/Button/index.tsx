import { ButtonHTMLAttributes } from "react";

import './styles.scss'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ ...rest }: ButtonProps) {

	return (
		<button
			className="button"
			{...rest}
		/>
	)
}