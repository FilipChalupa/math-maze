import { Button, Container, Typography } from '@material-ui/core'
import Link from 'next/link'
import React from 'react'
import { Game, Seed } from './Game'

export interface CollectionProps {
	id: string
}

type CollectionLevel =
	| {
			levelSeed: Seed
			nextLevels: CollectionLevel[]
	  }
	| {
			levelSeed: Seed
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
			levelSeed: {
				code: 'tutorial-1',
				width: 4,
				height: 3,
			},
			nextLevels: [
				{
					levelSeed: {
						code: 'tutorial-2',
						width: 4,
						height: 4,
					},
					nextLevels: [
						{
							levelSeed: {
								code: 'tutorial-3',
								width: 5,
								height: 5,
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
			levelSeed: {
				code: 'a',
				width: 4,
				height: 4,
			},
			nextLevels: [
				{
					levelSeed: {
						code: 'b',
						width: 6,
						height: 6,
					},
					nextLevels: [
						{
							levelSeed: {
								code: 'c',
								width: 7,
								height: 7,
							},
							congratulationMessage: 'Dosáhli jste alternativního konce 1.',
						},
						{
							levelSeed: {
								code: 'd',
								width: 8,
								height: 8,
							},
							congratulationMessage: 'Dosáhli jste alternativního konce 2.',
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
		return <CollectionInner key={id} collection={collections[id]} />
	}
	return <>Kolekce nenalezena</>
}

const CollectionInner: React.FunctionComponent<{ collection: Collection }> = ({
	collection,
}) => {
	const [currentLevel, setCurrentLevel] = React.useState(collection.startLevel)
	const [isFinished, setIsFinished] = React.useState(false)

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
					<Button variant="outlined" color="default" component="a">
						Domů
					</Button>
				</Link>{' '}
				<Button variant="contained" onClick={restart}>
					Zkusit znovu
				</Button>
			</Container>
		)
	}

	return <Game seed={currentLevel.levelSeed} onContinue={continueToNextLevel} />
}