import React from 'react'
import { Board } from './Board'

export interface LevelProps {
	width: number
	height: number
}

export const Level: React.FunctionComponent<LevelProps> = ({
	width,
	height,
}) => {
	const [playerPosition, setPlayerPosition] = React.useState({ x: 1, y: 1 })

	React.useEffect(() => {
		let t: number
		const loop = () => {
			setPlayerPosition({
				x: 1 + Math.floor(Math.random() * width),
				y: 1 + Math.floor(Math.random() * height),
			})
			t = window.setTimeout(loop, 1000)
		}
		loop()
		return () => window.clearTimeout(t)
	}, [])

	return (
		<div>
			Level
			<Board width={width} height={height} player={playerPosition} />
		</div>
	)
}
