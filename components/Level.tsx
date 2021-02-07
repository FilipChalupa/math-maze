import React from 'react'
import { TaskGroup } from '../utils/generateTask'
import { shuffle } from '../utils/shuffle'
import { useGenerateFields } from '../utils/useGenerateFields'
import { usePlayerPositions } from '../utils/usePlayerPositions'
import { Board, FieldFinish, FieldTask } from './Board'
import { LevelStatsData } from './LevelStats'

export interface LevelProps {
	id: string
	width: number
	height: number
	hasPlayer?: boolean
	playerStartPosition: Position
	preferWalls: number
	controlsHeight?: number
	finishCount: number
	taskGroups: TaskGroup[]
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

export const Level: React.FunctionComponent<LevelProps> = ({
	id,
	width,
	height,
	playerStartPosition,
	hasPlayer = false,
	controlsHeight = 0,
	preferWalls,
	finishCount,
	setSolutionsAroundPlayer,
	clearSolutionFromPlayer,
	solutionFromPlayer,
	setStats,
	taskGroups,
}) => {
	const [playerPosition, setPlayerPosition] = React.useState(
		playerStartPosition,
	)
	const [startTime, setStartTime] = React.useState(new Date())
	const [playerMovesCount, setPlayerMovesCount] = React.useState(0)
	React.useEffect(() => {
		setStartTime(new Date())
		setPlayerMovesCount(0)
	}, [id])

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

	const fields = useGenerateFields(
		id,
		width,
		height,
		playerStartPosition,
		finishCount,
		preferWalls,
		taskGroups,
	)

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
			})()

			if (offset) {
				const newPosition = {
					x: playerPosition.x + offset.x,
					y: playerPosition.y + offset.y,
				}
				if (isValidPlayerPosition(newPosition)) {
					movePlayer(newPosition)
				}
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
	}, [playerPosition, fields])

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
			startPosition={playerStartPosition}
			player={hasPlayer ? { position: playerPosition } : undefined}
			otherPlayers={otherPlayers}
			fields={fields}
			controlsHeight={controlsHeight}
		/>
	)
}
