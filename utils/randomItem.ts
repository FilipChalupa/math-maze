export const randomItem = (items: Array<number>, random: () => number) =>
	items[Math.floor(random() * items.length)]
