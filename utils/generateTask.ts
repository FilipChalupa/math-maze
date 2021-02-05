import { assertNever } from './assertNever'
function createTask(a: number, b: number, operator: '+' | '-' | '*' | '/') {
	const solution = (() => {
		switch (operator) {
			case '+':
				return a + b
			case '-':
				return a - b
			case '*':
				return a * b
			case '/':
				return a / b
			default:
				return assertNever(operator)
		}
	})().toString()
	return {
		label: `${a} ${operator} ${b}`,
		solution,
	}
}

export function generateTask(
	random: () => number,
): ReturnType<typeof createTask> {
	const a = Math.floor(random() * 15)
	const b = Math.floor(random() * 15)

	if (a >= b && random() > 0.5) {
		return createTask(a, b, '-')
	}

	if (a <= 10 && b <= 10 && a !== 0 && random() < 0.9) {
		if (b === 0 || random() > 0.5) {
			return createTask(a, b, '*')
		}

		return createTask(a * b, b, '/')
	}

	return createTask(a, b, '+')
}
