import React from 'react'
import { Seed } from '../pages/map'
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
		<div>
			game
			<Level {...boardParameters} />
		</div>
	)
}
