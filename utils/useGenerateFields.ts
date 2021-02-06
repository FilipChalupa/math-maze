import React from 'react'
import seedrandom from 'seedrandom'
import { Fields, FieldTask } from './../components/Board'
import { Position } from './../components/Level'
import { generateTask, TaskGroup } from './generateTask'

const directions = [
	{ x: 0, y: 1 },
	{ x: 1, y: 0 },
	{ x: 0, y: -1 },
	{ x: -1, y: 0 },
]

export function useGenerateFields(
	id: string,
	width: number,
	height: number,
	startPosition: Position,
	finishCount: number,
	preferWalls: number, // 0 - no walls, 1 - many
	taskGroups: TaskGroup[],
) {
	return React.useMemo(() => {
		const random = seedrandom(`ganerateMap-${id}`)

		preferWalls = Math.sqrt(preferWalls) // Increase granularity for higher numbers

		const exploredDirections = Array(width * height)
			.fill(null)
			.map(() => [...directions])
		let previousPositions: Array<null | Position> = Array(width * height).fill(
			null,
		)

		const fields: Fields = Array(width * height)
			.fill(null)
			.map(() => ({ isEmpty: true }))

		const positionToIndex = (position: Position) => {
			if (
				position.x < 1 ||
				position.x > width ||
				position.y < 1 ||
				position.y > height
			) {
				return -1
			}
			return position.x - 1 + (position.y - 1) * width
		}
		const getField = (position: Position) =>
			fields[positionToIndex(position)] || { isWall: true }
		const setField = (position: Position, field: Fields[number]) => {
			fields[positionToIndex(position)] = field
		}
		const setFieldTask = (position: Position) => {
			const surroundingSolutions: FieldTask['solution'][] = []
			for (let x = -2; x <= 2; x++) {
				for (let y = -2; y <= 2; y++) {
					if (Math.abs(x) + Math.abs(y) !== 2) {
						continue
					}
					const neighbourField = getField({
						x: position.x + x,
						y: position.y + y,
					})
					if (!('isTask' in neighbourField)) {
						continue
					}
					surroundingSolutions.push(neighbourField.solution)
				}
			}
			const task = (() => {
				const generate = () => generateTask(random, taskGroups)
				let task = generate()
				for (let tryTask = 1; tryTask <= 10; tryTask++) {
					if (!surroundingSolutions.includes(task.solution)) {
						break
					}
					task = generate()
				}
				return task
			})()
			setField(position, { isTask: true, ...task })
		}
		const getDirectionToExplore = (position: Position) => {
			const index = positionToIndex(position)
			if (exploredDirections[index].length === 0) {
				return null
			}
			const randomDirectionIndex = Math.floor(
				random() * exploredDirections[index].length,
			)
			return exploredDirections[index].splice(randomDirectionIndex, 1)[0]
		}
		const getPreviousPosition = (currentPosition: Position) =>
			previousPositions[positionToIndex(currentPosition)]
		const setPreviousPosition = (
			currentPosition: Position,
			previousPosition: Position,
		) => {
			previousPositions[positionToIndex(currentPosition)] = previousPosition
		}
		const isEmptyOrWall = (position: Position) => {
			const field = getField(position)
			return 'isWall' in field || 'isEmpty' in field
		}
		const isPositionEqual = (a: Position, b: Position) =>
			a.x === b.x && a.y === b.y
		const isPositionWorthExploring = (
			previousePosition: Position,
			position: Position,
		) => {
			const fieldAtPosition = getField(position)

			if (!('isEmpty' in fieldAtPosition)) {
				return false
			}
			for (const direction of directions) {
				const otherPosition = {
					x: position.x + direction.x,
					y: position.y + direction.y,
				}
				if (
					!isPositionEqual(previousePosition, otherPosition) &&
					!isEmptyOrWall(otherPosition) &&
					random() < preferWalls
				) {
					return false
				}
			}
			return true
		}

		// Generate walls and tasks
		let currentPosition = startPosition

		while (true) {
			const currentField = getField(currentPosition)
			if ('isEmpty' in currentField) {
				setFieldTask(currentPosition)
			}

			const directionToExplore = getDirectionToExplore(currentPosition)
			if (directionToExplore === null) {
				const previousPosition = getPreviousPosition(currentPosition)
				if (previousPosition === null) {
					break
				} else {
					currentPosition = previousPosition
					continue
				}
			}
			const newPosition = {
				x: currentPosition.x + directionToExplore.x,
				y: currentPosition.y + directionToExplore.y,
			}
			if (isPositionWorthExploring(currentPosition, newPosition)) {
				setPreviousPosition(newPosition, currentPosition)
				currentPosition = newPosition
			}
		}

		for (let i = 0; i < fields.length; i++) {
			if ('isEmpty' in fields[i]) {
				fields[i] = { isWall: true }
			}
		}

		// Generate finishes
		previousPositions = Array(width * height).fill(null)
		const distances: Array<null | number> = Array(width * height).fill(null)

		const getDistance = (position: Position) =>
			distances[positionToIndex(position)]
		const setDistance = (position: Position, distance: number) => {
			distances[positionToIndex(position)] = distance
		}

		const positionToVisit: Position[] = []
		const addPositionToVisit = (position: Position, distance: number) => {
			positionToVisit.push(position)
			setDistance(position, distance)
		}
		addPositionToVisit(startPosition, 0)
		const terminals: Position[] = [] // With index increases distance from start

		while (true) {
			const currentPosition = positionToVisit.shift()
			if (currentPosition === undefined) {
				break
			}
			const currentDistance = getDistance(currentPosition)!
			let isTerminal = true
			directions.forEach((direction) => {
				const nextPosition = {
					x: currentPosition.x + direction.x,
					y: currentPosition.y + direction.y,
				}
				const nextField = getField(nextPosition)
				if ('isTask' in nextField && getDistance(nextPosition) === null) {
					isTerminal = false
					addPositionToVisit(nextPosition, currentDistance + 1)
				}
			})

			const currentField = getField(currentPosition)
			if (isTerminal && 'isTask' in currentField) {
				terminals.push(currentPosition)
			}
		}

		for (let i = 0; terminals.length !== 0 && i < finishCount; i++) {
			// Always place one finish to the furthest position and others randomly but with slight distance preference
			const position = terminals.splice(
				terminals.length -
					1 -
					(i === 0 ? 0 : Math.ceil((random() * terminals.length) / 3)),
				1,
			)[0]
			setField(position, { isFinish: true, index: i })
		}

		return fields
	}, [id, width, height, startPosition, finishCount, preferWalls])
}
