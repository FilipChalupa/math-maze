import { Button, Container, Typography } from '@material-ui/core'
import Link from 'next/link'
import React from 'react'
import { TaskGroup, TaskType } from '../utils/generateTask'
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

const group = (
	type: TaskType,
	difficulty: number,
	weight?: number,
): TaskGroup => ({ type, difficulty, weight })

const createSingleTypeCollection = (type: TaskType): Collection => ({
	startLevel: {
		levelOptions: {
			width: 4,
			height: 4,
			taskGroups: [group(type, 1)],
		},
		nextLevels: [
			{
				levelOptions: {
					width: 4,
					height: 6,
					taskGroups: [group(type, 2)],
				},
				nextLevels: [
					{
						levelOptions: {
							width: 6,
							height: 6,
							taskGroups: [group(type, 3)],
						},
						nextLevels: [
							{
								levelOptions: {
									width: 8,
									height: 8,
									taskGroups: [group(type, 4)],
								},
								congratulationMessage: 'Splněno',
							},
						],
					},
				],
			},
		],
	},
})

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
				taskGroups: [group('+', 1)],
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
						taskGroups: [group('+', 1), group('-', 1)],
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
								taskGroups: [group('+', 1), group('-', 1)],
							},
							congratulationMessage:
								'To je z tutoriálu vše. Můžeš se vrhnout na další série.',
						},
					],
				},
			],
		},
	},
	warmup: {
		startLevel: {
			levelOptions: {
				seed: 'a',
				width: 4,
				height: 4,
				preferWalls: 0.5,
				taskGroups: [group('+', 1), group('-', 1)],
			},
			nextLevels: [
				{
					levelOptions: {
						seed: 'b',
						width: 6,
						height: 6,
						preferWalls: 1,
						taskGroups: [group('+', 1), group('-', 1), group('*', 1)],
					},
					nextLevels: [
						{
							levelOptions: {
								seed: 'c',
								width: 7,
								height: 7,
								taskGroups: [
									group('+', 1),
									group('-', 1),
									group('*', 1),
									group('/', 1),
								],
							},
							congratulationMessage: 'První alternativní konec.',
						},
						{
							levelOptions: {
								seed: 'd',
								width: 7,
								height: 7,
								taskGroups: [
									group('+', 1),
									group('-', 1),
									group('*', 1),
									group('/', 1),
								],
							},
							congratulationMessage: 'Druhý alternativní konec.',
						},
					],
				},
			],
		},
	},
	addition: createSingleTypeCollection('+'),
	substraction: createSingleTypeCollection('-'),
	multiplication: createSingleTypeCollection('*'),
	division: createSingleTypeCollection('/'),
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
