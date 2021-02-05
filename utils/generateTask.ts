export function generateTask(random: () => number) {
	const a = Math.floor(random() * 15)
	const b = Math.floor(random() * 15)

	if (a >= b && random() > 0.5) {
		return {
			label: `${a} - ${b}`,
			solution: `${a - b}`,
		}
	}

	if (a <= 10 && b <= 10 && a !== 0 && random() < 0.9) {
		if (b == 0 || random() > 0.5) {
			return {
				label: `${a} * ${b}`,
				solution: `${a * b}`,
			}
		}

		return {
			label: `${a * b} / ${b}`,
			solution: `${a}`,
		}
	}

	return {
		label: `${a} + ${b}`,
		solution: `${a + b}`,
	}
}
