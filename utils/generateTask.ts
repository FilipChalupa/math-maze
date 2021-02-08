import { assertNever } from './assertNever'

export type TaskType = '+' | '-' | '*' | '/'
export interface TaskGroup {
	type: TaskType
	difficulty: number
	weight?: number
}

function createTask(a: number, b: number, type: TaskType) {
	const solution = (() => {
		switch (type) {
			case '+':
				return a + b
			case '-':
				return a - b
			case '*':
				return a * b
			case '/':
				return a / b
			default:
				return assertNever(type)
		}
	})().toString()
	return {
		label: `${a} ${type} ${b}`,
		solution,
	}
}

function generateTaskComponents(
	random: () => number,
	type: TaskType,
	difficulty: number,
): [number, number] {
	switch (type) {
		case '+': {
			if (difficulty <= 1) {
				const a = Math.round(random() * 9)
				const b = Math.floor(random() * (10 - a))
				return [a, b]
			} else if (difficulty <= 2) {
				const a = Math.round(random() * 19)
				const b = Math.floor(random() * (20 - a))
				return [a, b]
			} else if (difficulty <= 3) {
				const a = Math.round(random() * 99)
				const b = Math.floor(random() * (10 - (a % 10)))
				return [a, b]
			}
			const a = Math.round(random() * 99)
			const b = Math.floor(random() * (100 - a))
			return [a, b]
		}
		case '-': {
			const [a, b] = generateTaskComponents(random, '+', difficulty)
			return [a + b, b]
		}
		case '*': {
			const [a, b] = (() => {
				if (difficulty <= 1) {
					return [Math.round(random() * 10), Math.round(random() * 10)]
				} else if (difficulty <= 2) {
					return [Math.round(random() * 10), Math.round(random() * 20)]
				}
				return [Math.round(random() * 20), Math.round(random() * 20)]
			})()
			// Shuffle
			if (random() < 0.5) {
				return [a, b]
			}
			return [b, a]
		}
		case '/': {
			const [a, b] = generateTaskComponents(random, '*', difficulty)
			const [x, y] = b > 10 && a < 10 ? [b, a] : [a, b]
			return [x * y, y]
		}
		default:
			return assertNever(type)
	}
}

export function generateTask(
	random: () => number,
	groups: TaskGroup[],
): ReturnType<typeof createTask> {
	const { type, difficulty } = (() => {
		const randomWeight = random()
		const allWeight = groups.reduce(
			(sum, group) => sum + (group.weight || 1),
			0,
		)
		let lastWeight = 0
		for (const group of groups) {
			lastWeight += (group.weight || 1) / allWeight
			if (lastWeight >= randomWeight) {
				return group
			}
		}
		return groups[0]
	})()

	const [x, y] = generateTaskComponents(random, type, difficulty)
	return createTask(x, y, type)
}
