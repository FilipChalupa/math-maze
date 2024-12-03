export const randomItem = <T>(items: T[], random: () => number): T =>
	items[Math.floor(random() * items.length)]
