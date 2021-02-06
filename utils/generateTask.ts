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

	// @TODO: respect difficulty - add more difficulty levels
	switch (type) {
		case '+': {
			if (difficulty <= 1) {
				// All single digit
				const a = Math.round(random() * 9)
				const b = Math.floor(random() * (10 - a))
				return createTask(a, b, type)
			}
			const a = Math.round(random() * 99)
			const b = Math.floor(random() * (100 - a))
			return createTask(a, b, type)
		}
		case '-': {
			if (difficulty <= 1) {
				// All single digit
				const a = Math.round(1 + random() * 8)
				const b = Math.round(random() * (9 - a))
				return createTask(a + b, b, type)
			}
			const a = Math.round(1 + random() * 98)
			const b = Math.round(random() * (99 - a))
			return createTask(a + b, b, type)
		}
		case '*': {
			if (difficulty <= 1) {
				// 10 * 10
				const a = Math.round(random() * 10)
				const b = Math.round(random() * 10)
				return createTask(a, b, type)
			}
			// 10 * 20
			const a = Math.round(random() * 10)
			const b = Math.round(random() * 20)
			return createTask(a, b, type)
		}
		case '/': {
			if (difficulty <= 1) {
				// 100 / 10
				const a = Math.round(random() * 10)
				const b = Math.round(1 + random() * 9)
				return createTask(a * b, b, type)
			}
			// 200 / 10
			const a = Math.round(random() * 10)
			const b = Math.round(1 + random() * 19)
			return createTask(a * b, b, type)
		}
		default:
			return assertNever(type)
	}
}
