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
	const [playerPosition, setPlayerPosition] = React.useState({ x: 1, y: 5 })

	React.useEffect(() => {
		const move = (event: KeyboardEvent) => {
			switch (event.key) {
				case 'w':
				case 'ArrowUp':
					setPlayerPosition({
						x: playerPosition.x,
						y: Math.max(1, playerPosition.y - 1),
					})
					break
				case 's':
				case 'ArrowDown':
					setPlayerPosition({
						x: playerPosition.x,
						y: Math.min(height, playerPosition.y + 1),
					})
					break
				case 'a':
				case 'ArrowLeft':
					setPlayerPosition({
						x: Math.max(1, playerPosition.x - 1),
						y: playerPosition.y,
					})
					break
				case 'd':
				case 'ArrowRight':
					setPlayerPosition({
						x: Math.min(width, playerPosition.x + 1),
						y: playerPosition.y,
					})
					break
			}
		}
		document.addEventListener('keydown', move)
		return () => document.removeEventListener('keydown', move)
	}, [playerPosition])

	return <Board width={width} height={height} player={playerPosition} />
}
