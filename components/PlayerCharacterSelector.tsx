import { Container, Tab, Tabs } from '@material-ui/core'
import React from 'react'
import { useStorageBackedState } from 'use-storage-backed-state'

interface PlayerCharacterSelectorProps {}

const playerCharacters = [
	'😀',
	'🐞',
	'🐸',
	'🐷',
	'🐌',
	'🦋',
	'🐇',
	'🐛',
	'🐵',
	'🛒',
	'🚗',
	'👾',
	'🤖',
	'👶',
	'🌞',
	'🎃',
	'👻',
	'👽',
	'🦄',
	'💩',
]

export function characterIndexToCharacter(index: number) {
	return playerCharacters[index % playerCharacters.length]
}

export const useStoredPlayerCharacterIndex = () =>
	useStorageBackedState(0, 'player-character')

export const usePlayerCharacter = () => {
	const [index] = useStoredPlayerCharacterIndex()
	return playerCharacters[index]
}

export const PlayerCharacterSelector: React.FunctionComponent<PlayerCharacterSelectorProps> = ({}) => {
	const [
		storedPlayerCharacterIndex,
		setStoredPlayerCharacterIndex,
	] = useStoredPlayerCharacterIndex()

	const handleChange = React.useCallback(
		(event: React.ChangeEvent<{}>, newValue: number) => {
			setStoredPlayerCharacterIndex(newValue)
		},
		[],
	)

	return (
		<Container disableGutters>
			<br />
			<Tabs
				value={storedPlayerCharacterIndex}
				onChange={handleChange}
				variant="scrollable"
				scrollButtons="on"
				indicatorColor="primary"
				textColor="primary"
			>
				{playerCharacters.map((character, i) => (
					<Tab
						key={i}
						label={
							<span
								style={{
									fontSize: '1.5em',
									filter:
										i === storedPlayerCharacterIndex
											? undefined
											: 'grayscale(100%)',
									opacity: i === storedPlayerCharacterIndex ? undefined : 0.8,
								}}
							>
								{character}
							</span>
						}
					/>
				))}
			</Tabs>
		</Container>
	)
}
