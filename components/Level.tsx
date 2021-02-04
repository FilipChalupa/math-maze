import React from 'react'
import seedrandom from 'seedrandom'
import { shuffle } from '../utils/shuffle'
import { usePlayerPositions } from '../utils/usePlayerPositions'
import { Board, FieldFinish, Fields, FieldTask } from './Board'
import { LevelStatsData } from './LevelStats'

export interface LevelProps {
	code: string
	width: number
	height: number
	hasPlayer?: boolean
	playerStartPosition: Position
	controlsHeight?: number
	finishPositions: Position[]
	setSolutionsAroundPlayer: (solution: FieldTask['solution'][]) => void
	clearSolutionFromPlayer: () => void
	solutionFromPlayer?: FieldTask['solution']
	setStats: (stats: LevelStatsData) => void
}

export const FINISH_SOLUTION_SYMBOL = 'finish'

export type Position = {
	x: number
	y: number
}

const dummyWalls = [
	{ x: 1, y: 3 },
	{ x: 3, y: 2 },
	{ x: 3, y: 3 },
	{ x: 4, y: 3 },
	{ x: 5, y: 3 },
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

export const Level: React.FunctionComponent<LevelProps> = ({
	code,
	width,
	height,
	playerStartPosition,
	hasPlayer = false,
	controlsHeight = 0,
	finishPositions,
	setSolutionsAroundPlayer,
	clearSolutionFromPlayer,
	solutionFromPlayer,
	setStats,
}) => {
	const [playerPosition, setPlayerPosition] = React.useState(
		playerStartPosition,
	)
	const [startTime, setStartTime] = React.useState(new Date())
	const [playerMovesCount, setPlayerMovesCount] = React.useState(0)
	React.useEffect(() => {
		setStartTime(new Date())
		setPlayerMovesCount(0)
	}, [code])

	const otherPlayers = usePlayerPositions(code, playerPosition)

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
		const random = seedrandom(`fields-${code}`)
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

		const placeIfPossible = (position: Position, field: Fields[number]) => {
			const index = positionToIndex(position)
			if (index !== -1 && !('isFinish' in fields[index])) {
				fields[index] = field
			}
		}

		finishPositions.forEach((position, index) => {
			placeIfPossible(position, {
				isFinish: true,
				index,
			})
		})

		dummyWalls.forEach((position) => {
			placeIfPossible(position, {
				isWall: true,
			})
		})
		return fields
	}, [width, height, dummyWalls, code])

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
			setSolutionsAroundPlayer([])
			return
		}
		const solutions = [
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
			.filter(
				(field): field is FieldTask | FieldFinish =>
					'isTask' in field || 'isFinish' in field,
			)
			.map((field) =>
				'isTask' in field ? field.solution : FINISH_SOLUTION_SYMBOL,
			)
		setSolutionsAroundPlayer(shuffle(solutions))
	}, [playerPosition])

	React.useEffect(() => {
		const field = fieldAtPosition(playerPosition)
		if ('isFinish' in field) {
			window.setTimeout(() => {
				setStats({
					moves: playerMovesCount,
					width,
					height,
					finishIndex: field.index,
					timeInSeconds: Math.round(
						(new Date().getTime() - startTime.getTime()) / 1000,
					),
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
			if (
				('isTask' in field && solutionFromPlayer === field.solution) ||
				('isFinish' in field && solutionFromPlayer === FINISH_SOLUTION_SYMBOL)
			) {
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
			controlsHeight={controlsHeight}
		/>
	)
}
