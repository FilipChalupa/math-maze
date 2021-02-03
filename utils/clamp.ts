export function clamp(lowerBound: number, value: number, upperBound: number) {
	return Math.max(lowerBound, Math.min(value, upperBound))
}
