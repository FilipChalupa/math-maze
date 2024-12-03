export const randomIntegerInRange = (
	min: number,
	max: number,
	random: () => number,
) => {
	const range = max - min
	return min + Math.floor(random() * (range + 1))
}
