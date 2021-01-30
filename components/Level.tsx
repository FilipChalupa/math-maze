import React from 'react'
import seedrandom from 'seedrandom'
import { shuffle } from '../utils/shuffle'
import { usePlayerPositions } from '../utils/usePlayerPositions'
import { Board, Fields, FieldTask } from './Board'
import { LevelStatsData } from './LevelStats'

export interface LevelProps {
	width: number
	height: number
	setTasksAroundPlayer: (tasks: FieldTask[]) => void
	clearSolutionFromPlayer: () => void
	solutionFromPlayer?: FieldTask['solution']
	id: string
	setStats: (stats: LevelStatsData) => void
}

export type Position = {
	x: number
	y: number
}

const dummyWalls = [
	{ x: 1, y: 3 },
	{ x: 3, y: 1 },
	{ x: 3, y: 2 },
	{ x: 3, y: 3 },
	{ x: 5, y: 3 },
	{ x: 6, y: 3 },
	{ x: 7, y: 3 },
	{ x: 7, y: 4 },
	{ x: 7, y: 5 },
	{ x: 8, y: 5 },
	{ x: 7, y: 6 },
	{ x: 11, y: 1 },
	{ x: 11, y: 2 },
	{ x: 11, y: 3 },
	{ x: 12, y: 3 },
	{ x: 12, y: 4 },
	{ x: 3, y: 9 },
	{ x: 4, y: 9 },
	{ x: 4, y: 8 },
	{ x: 10, y: 8 },
	{ x: 11, y: 8 },
	{ x: 12, y: 8 },
	{ x: 12, y: 7 },
	{ x: 14, y: 2 },
	{ x: 15, y: 2 },
	{ x: 15, y: 3 },
	{ x: 15, y: 4 },
	{ x: 15, y: 5 },
	{ x: 15, y: 6 },
	{ x: 15, y: 7 },
]

const dummyFinishes = [
	{ x: 16, y: 5 },
	{ x: 2, y: 3 },
]

export const Level: React.FunctionComponent<LevelProps> = ({
	width,
	height,
	setTasksAroundPlayer,
	clearSolutionFromPlayer,
	solutionFromPlayer,
	id,
	setStats,
}) => {
	const hasPlayer = true // @TODO
	const [playerPosition, setPlayerPosition] = React.useState({ x: 1, y: 1 })
	const [playerMovesCount, setPlayerMovesCount] = React.useState(0)
	const otherPlayers = usePlayerPositions(id, playerPosition)

	const movePlayer = React.useCallback(
		(newPosition: Position) => {
			setPlayerPosition(newPosition)
			// @TODO: ověřit, že počítá správně, nevynechává
			setPlayerMovesCount(playerMovesCount + 1)
		},
		[playerMovesCount],
	)

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
		const random = seedrandom(id)
		const fields: Fields = Array(width * height)
			.fill(null)
			.map((_, i) => {
				const a = Math.floor(random() * 15)
				const b = Math.floor(random() * 15)

				if (a >= b && random() > 0.5) {
					return {
						isTask: true,
						label: `${a} - ${b}`,
						solution: `${a - b}`,
					}
				}

				if (a <= 10 && b <= 10 && a !== 0 && random() < 0.9) {
					if (b == 0 || random() > 0.5) {
						return {
							isTask: true,
							label: `${a} * ${b}`,
							solution: `${a * b}`,
						}
					}

					return {
						isTask: true,
						label: `${a * b} / ${b}`,
						solution: `${a}`,
					}
				}

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
		dummyFinishes.forEach((position) => {
			fields[positionToIndex(position)] = {
				isFinish: true,
			}
		})
		return fields
	}, [width, height, dummyWalls, id])

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
				movePlayer(newPosition)
			}
		}
		document.addEventListener('keydown', move)
		return () => document.removeEventListener('keydown', move)
	}, [playerPosition])

	React.useEffect(() => {
		if ('isFinish' in fieldAtPosition(playerPosition)) {
			setTasksAroundPlayer([])
			return
		}
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

	React.useEffect(() => {
		const offset = [
			[0, 1],
			[1, 0],
			[0, -1],
			[-1, 0],
		]
		for (const [x, y] of offset) {
			const position = { x: playerPosition.x + x, y: playerPosition.y + y }
			if ('isFinish' in fieldAtPosition(position)) {
				movePlayer(position)

				return
			}
		}
	}, [playerPosition])

	React.useEffect(() => {
		if ('isFinish' in fieldAtPosition(playerPosition)) {
			window.setTimeout(() => {
				setStats({
					moves: playerMovesCount,
					width,
					height,
				})
			}, 2500)
		}
	}, [playerPosition])

	React.useEffect(() => {
		if (solutionFromPlayer === undefined) {
			return
		}
		const tasks = [
			[0, 1],
			[1, 0],
			[0, -1],
			[-1, 0],
		]
		for (const [x, y] of tasks) {
			const field = fieldAtPosition({
				x: playerPosition.x + x,
				y: playerPosition.y + y,
			})
			if ('isTask' in field && field.solution === solutionFromPlayer) {
				clearSolutionFromPlayer()
				movePlayer({
					x: playerPosition.x + x,
					y: playerPosition.y + y,
				})
				return
			}
		}
		// @TODO: handle no match
	}, [solutionFromPlayer, playerPosition])

	return (
		<Board
			width={width}
			height={height}
			player={hasPlayer ? { position: playerPosition } : undefined}
			otherPlayers={otherPlayers}
			fields={fields}
		/>
	)
}
