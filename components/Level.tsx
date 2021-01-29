import React from 'react'
import { Board, Fields } from './Board'

export interface LevelProps {
	width: number
	height: number
}

export type Position = {
	x: number
	y: number
}

const dummyWalls = [
	{ x: 3, y: 1 },
	{ x: 3, y: 2 },
	{ x: 3, y: 3 },
	{ x: 5, y: 3 },
	{ x: 6, y: 3 },
	{ x: 7, y: 3 },
	{ x: 7, y: 4 },
	{ x: 7, y: 5 },
]

export const Level: React.FunctionComponent<LevelProps> = ({
	width,
	height,
}) => {
	const [playerPosition, setPlayerPosition] = React.useState({ x: 1, y: 5 })

	const positionToIndex = React.useCallback(
		(position: Position) => position.x - 1 + (position.y - 1) * width,
		[width],
	)

	const fields = React.useMemo(() => {
		const fields: Fields = Array(width * height).fill(null)
		dummyWalls.forEach((position) => {
			fields[positionToIndex(position)] = {
				isWall: true,
			}
		})
		return fields
	}, [width, height, dummyWalls])

	const fieldAtPosition = React.useCallback(
		(position: Position) => fields[positionToIndex(position)],
		[fields, positionToIndex],
	)

	const isValidPlayerPosition = React.useCallback(
		(position: Position) => {
			return (
				position.x >= 1 &&
				position.x <= width &&
				position.y >= 1 &&
				position.y <= height &&
				!fieldAtPosition(position)?.isWall
			)
		},
		[width, height, fields],
	)

	React.useEffect(() => {
		const move = (event: KeyboardEvent) => {
			const offset = (() => {
				switch (event.key) {
					case 'w':
					case 'ArrowUp':
						return {
							x: 0,
							y: -1,
						}

					case 's':
					case 'ArrowDown':
						return {
							x: 0,
							y: 1,
						}

					case 'a':
					case 'ArrowLeft':
						return {
							x: -1,
							y: 0,
						}

					case 'd':
					case 'ArrowRight':
						return {
							x: 1,
							y: 0,
						}
				}
				return {
					x: 0,
					y: 0,
				}
			})()
			const newPosition = {
				x: playerPosition.x + offset.x,
				y: playerPosition.y + offset.y,
			}
			if (isValidPlayerPosition(newPosition)) {
				setPlayerPosition(newPosition)
			}
		}
		document.addEventListener('keydown', move)
		return () => document.removeEventListener('keydown', move)
	}, [playerPosition])

	return (
		<Board
			width={width}
			height={height}
			player={{ position: playerPosition }}
			fields={fields}
		/>
	)
}
