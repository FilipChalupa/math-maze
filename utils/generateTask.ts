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

function shuffle(random: () => number, a: number, b: number): [number, number] {
	return random() < 0.5 ? [a, b] : [b, a]
}

function generateTaskComponents(
	random: () => number,
	type: TaskType,
	difficulty: number,
): [number, number] {
	switch (type) {
		case '+': {
			if (difficulty <= 1) {
				const a = Math.floor(0.8 + random() * 9.2)
				const b = Math.floor(1 + random() * (9 - a))
				return shuffle(random, a, b)
			} else if (difficulty <= 2) {
				const a = Math.floor(0.7 + random() * 19.3)
				const b = Math.floor(1 + random() * (19 - a))
				return shuffle(random, a, b)
			} else if (difficulty <= 3) {
				const a = Math.floor(random() * 10)
				const b = Math.floor(0.8 + random() * 9.2)
				const c = Math.floor(1 + random() * (9 - b))
				return shuffle(random, a * 10 + b, c)
			}
			const a = Math.floor(0.8 + random() * 9.2)
			const b = Math.floor(0.8 + random() * 9.2)
			const c =
				Math.floor(1 + random() * (9 - a)) +
				10 * Math.floor(1 + random() * (9 - b))
			return shuffle(random, a + 10 * b, c)
		}
		case '-': {
			const [a, b] = generateTaskComponents(random, '+', difficulty)
			const [x, y] = b > 10 && a < 10 ? [b, a] : [a, b]
			return [x + y, y]
		}
		case '*': {
			const [a, b] = (() => {
				if (difficulty <= 1) {
					const a = Math.floor(2 + random() * 3)
					const b = Math.floor(0.8 + random() * Math.floor(10 / a))
					return [a, b]
				} else if (difficulty <= 8) {
					// @TODO
					return [Math.round(random() * 10), Math.round(random() * 10)]
				} else if (difficulty <= 9) {
					// @TODO
					return [Math.round(random() * 10), Math.round(random() * 20)]
				} else if (difficulty <= 10) {
					// @TODO
					const a = Math.floor(2 + random() * 3)
					const b = Math.floor(0.8 + random() * Math.floor(10 / a))
					const c = Math.floor(0.8 + random() * Math.floor(9 / a))
					return [a, b * 10 + c]
				}
				return [Math.round(random() * 20), Math.round(random() * 20)]
			})()
			return shuffle(random, a, b)
		}
		case '/': {
			const [a, b] = generateTaskComponents(random, '*', difficulty)
			const [x, y] = b > 10 && a < 10 ? [b, a] : [a, b]
			return [x * y, y || 1]
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
