import React from 'react'
import s from './Player.module.css'

interface PlayerProps {}

export const Player: React.FunctionComponent<PlayerProps> = ({}) => {
	const icon = React.useMemo(() => {
		const icons = ['🐇', '🛒', '😀', '🐞', '🚗', '🐷', '🐸', '🦋', '🐛', '🦄']
		return icons[Math.floor(Math.random() * icons.length)]
	}, [])
	return <div className={s.player}>{icon}</div>
}
