import { Button, Container, Typography } from '@material-ui/core'
import Link from 'next/link'
import React from 'react'
import { useIsCollectionFinished } from '../utils/useIsCollectionFinished'
import { createLevelSeed, Game, LevelOptions } from './Game'

export interface CollectionProps {
	id: string
}

interface CollectionLevelOptions
	extends Omit<LevelOptions, 'finishCount' | 'collectionId'> {}

type CollectionLevel =
	| {
			levelOptions: CollectionLevelOptions
			nextLevels: CollectionLevel[]
	  }
	| {
			levelOptions: CollectionLevelOptions
			congratulationMessage: string
	  }

export interface Collection {
	startLevel: CollectionLevel
}

const collections: {
	[id: string]: Collection
} = {
	tutorial: {
		startLevel: {
			levelOptions: {
				seed: 'tutorial-0',
				width: 1,
				height: 3,
				playerStartPosition: {
					x: 1,
					y: 1,
				},
				preferWalls: 0,
			},
			nextLevels: [
				{
					levelOptions: {
						seed: 'tutorial-1',
						width: 4,
						height: 3,
						playerStartPosition: {
							x: 1,
							y: 1,
						},
						preferWalls: 0.5,
					},
					nextLevels: [
						{
							levelOptions: {
								seed: 'tutorial-2',
								width: 4,
								height: 4,
								playerStartPosition: {
									x: 1,
									y: 1,
								},
								preferWalls: 1,
							},
							congratulationMessage: 'To je z tutoriálu vše.',
						},
					],
				},
			],
		},
	},
	example: {
		startLevel: {
			levelOptions: {
				seed: 'a',
				width: 4,
				height: 4,
				preferWalls: 0.5,
			},
			nextLevels: [
				{
					levelOptions: {
						seed: 'b',
						width: 6,
						height: 6,
						preferWalls: 1,
					},
					nextLevels: [
						{
							levelOptions: {
								seed: 'c',
								width: 7,
								height: 7,
							},
							congratulationMessage:
								'Dosáhli jste těžšího alternativního konce.',
						},
						{
							levelOptions: {
								seed: 'd',
								width: 8,
								height: 8,
							},
							congratulationMessage:
								'Dosáhli jste lehčího alternativního konce.',
						},
					],
				},
			],
		},
	},
}

export const Collection: React.FunctionComponent<CollectionProps> = ({
	id,
}) => {
	if (id in collections) {
		return <CollectionInner key={id} id={id} collection={collections[id]} />
	}
	return <>Kolekce nenalezena</>
}

const CollectionInner: React.FunctionComponent<{
	id: string
	collection: Collection
}> = ({ id, collection }) => {
	const [currentLevel, setCurrentLevel] = React.useState(collection.startLevel)
	const [isFinished, setIsFinished] = React.useState(false)
	const [isEverFinished, setIsEverFinished] = useIsCollectionFinished(id)

	React.useEffect(() => {
		if (isFinished) {
			setIsEverFinished(true)
		}
	}, [isFinished])

	const restart = React.useCallback(() => {
		setCurrentLevel(collection.startLevel)
		setIsFinished(false)
	}, [])

	const continueToNextLevel = React.useCallback(
		(finishIndex: number) => {
			if ('nextLevels' in currentLevel && currentLevel.nextLevels.length > 0) {
				setCurrentLevel(
					currentLevel.nextLevels[finishIndex % currentLevel.nextLevels.length],
				)
			} else {
				setIsFinished(true)
			}
		},
		[currentLevel],
	)

	const levelSeed = React.useMemo(() => {
		return createLevelSeed({
			...currentLevel.levelOptions,
			finishCount:
				'nextLevels' in currentLevel ? currentLevel.nextLevels.length : 1,
			collectionId: id,
		})
	}, [currentLevel])

	if (isFinished) {
		return (
			<Container maxWidth="xs">
				<br />
				<br />
				<br />
				<Typography variant="h4" gutterBottom>
					Kolekce zakončena 🎉
				</Typography>
				{'congratulationMessage' in currentLevel && (
					<Typography variant="body1" gutterBottom>
						{currentLevel.congratulationMessage}
					</Typography>
				)}
				<Link href="/" passHref>
					<Button variant="contained" color="primary" component="a">
						Domů
					</Button>
				</Link>{' '}
				<Button variant="outlined" onClick={restart}>
					Zkusit znovu
				</Button>
			</Container>
		)
	}

	return <Game seed={levelSeed} onContinue={continueToNextLevel} />
}
