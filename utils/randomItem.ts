export const randomItem = (
	items: ReadonlyArray<number>,
	random: () => number,
) => items[Math.floor(random() * items.length)]
