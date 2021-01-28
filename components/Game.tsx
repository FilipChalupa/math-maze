import React from 'react'
import { Seed } from '../pages/map'
import s from './Game.module.css'
import { Level } from './Level'

interface GameProps {
	seed: Seed
}

export const Game: React.FunctionComponent<GameProps> = ({ seed }) => {
	const boardParameters = React.useMemo(() => {
		return {
			width: 16,
			height: 9,
		}
	}, [seed])

	return (
		<div className={s.game}>
			game WSAD
			<div className={s.level}>
				<Level {...boardParameters} />
			</div>
		</div>
	)
}
