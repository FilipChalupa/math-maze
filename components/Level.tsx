import React from 'react'
import { shuffle } from '../utils/shuffle'
import { Board, Fields, FieldTask } from './Board'

export interface LevelProps {
	width: number
	height: number
	setTasksAroundPlayer: (tasks: FieldTask[]) => void
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
	setTasksAroundPlayer,
}) => {
	const hasPlayer = true // @TODO
	const [playerPosition, setPlayerPosition] = React.useState({ x: 1, y: 9 })

	const positionToIndex = React.useCallback(
		(position: Position) => {
			if (
				position.x < 1 ||
				position.x > width ||
				position.y < 1 ||
				position.y > height
			) {
				return -1
			}
			return position.x - 1 + (position.y - 1) * width
		},
		[width, height],
	)

	const fields = React.useMemo(() => {
		const fields: Fields = Array(width * height)
			.fill(null)
			.map((_, i) => {
				const a = Math.floor(Math.random() * 11)
				const b = Math.floor(Math.random() * 11)

				return {
					isTask: true,
					label: `${a} + ${b}`,
					solution: `${a + b}`,
				}
			})
		dummyWalls.forEach((position) => {
			fields[positionToIndex(position)] = {
				isWall: true,
			}
		})
		return fields
	}, [width, height, dummyWalls])

	const fieldAtPosition = React.useCallback(
		(position: Position) =>
			fields[positionToIndex(position)] || { isWall: true },
		[fields, positionToIndex],
	)

	const isValidPlayerPosition = React.useCallback(
		(position: Position) => {
			return (
				position.x >= 1 &&
				position.x <= width &&
				position.y >= 1 &&
				position.y <= height &&
				!('isWall' in fieldAtPosition(position))
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

	React.useEffect(() => {
		console.log('new player position', playerPosition)
		const tasks = [
			[0, 1],
			[1, 0],
			[0, -1],
			[-1, 0],
		]
			.map(([x, y]) =>
				fieldAtPosition({
					x: playerPosition.x + x,
					y: playerPosition.y + y,
				}),
			)
			.filter((field): field is FieldTask => 'isTask' in field)
		setTasksAroundPlayer(shuffle(tasks))
	}, [playerPosition])

	return (
		<Board
			width={width}
			height={height}
			player={hasPlayer ? { position: playerPosition } : undefined}
			fields={fields}
		/>
	)
}
