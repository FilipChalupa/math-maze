import md5 from 'md5'
import React from 'react'
import seedrandom from 'seedrandom'

export const useDailyChallengeLevels = () => {
	return React.useMemo(() => {
		const today = new Date()
		const random = seedrandom(
			`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
		)

		const levelsCount = 10
		const lightsOutLevelIndex = Math.floor(random() * levelsCount)

		const allLevels = new Array(levelsCount).fill(null).map((_, i) => {
			const extraSize = Math.floor(Math.sqrt((i * i) / 2) * 2)
			const width = Math.ceil(2 + random() * 4 + extraSize)
			const height = Math.ceil(2 + random() * 4 + extraSize)
			const preferWalls = Math.floor(random() * 10)
			const code = md5(`${random()}`).substr(0, 8)
			const difficulty = (() => {
				return [
					0, // addition offset
					2, // subtraction offset
					5, // multiplication offset
					8, // division offset
				]
					.map((offset) =>
						i - offset >= 0
							? Math.ceil(1 + random() * ((i - offset) / 10) * 4)
							: 0,
					)
					.map((d) => d.toString())
					.join(';')
			})()
			const lightsOut = i === lightsOutLevelIndex

			return {
				seedId: `${code};${width};${height};${preferWalls};${difficulty};${
					lightsOut ? 1 : 0
				}`,
				title: `${i + 1}. mapa`,
				subheader: `rozměry ${width} x ${height}`,
			}
		})

		let movingOffset = 0
		const groups = [
			{
				label: 'Základní',
				levels: 4,
			},
			{
				label: 'Pokročilé',
				levels: 3,
			},
			{
				label: 'Těžké',
				levels: Number.MAX_SAFE_INTEGER,
			},
		].map((group) => {
			const result = {
				...group,
				levels: allLevels.slice(movingOffset, movingOffset + group.levels),
			}
			movingOffset += group.levels
			return result
		})

		return groups
	}, [])
}
