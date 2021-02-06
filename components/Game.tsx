import { Container } from '@material-ui/core'
import md5 from 'md5'
import React from 'react'
import seedrandom from 'seedrandom'
import useResizeObserver from 'use-resize-observer'
import { useIsLevelFinished } from '../utils/useIsLevelFinished'
import { FieldTask } from './Board'
import { Controls } from './Controls'
import s from './Game.module.css'
import { Level, LevelProps, Position } from './Level'
import { LevelStats, LevelStatsData } from './LevelStats'

export interface LevelOptions {
	seed?: string
	width?: number
	height?: number
	preferWalls?: number
	playerStartPosition?: Position
	finishCount?: number
	collectionId?: string
}

export const createLevelSeed = (options: LevelOptions) => {
	const random = seedrandom(JSON.stringify(options))

	const preferWalls = Math.max(
		0,
		Math.min(
			options.preferWalls === undefined ? random() : options.preferWalls,
			1,
		),
	)
	const height = options.height || 1
	const width = Math.max(height <= 2 ? 3 : 1, options.width || 1)
	const finishCount = options.finishCount || 1
	const collectionId = options.collectionId || null

	const playerStartPosition: Position =
		options.playerStartPosition ||
		(() => {
			const options = [
				{
					x: 1,
					y: 1,
				},
				{
					x: 1,
					y: height,
				},
				{
					x: width,
					y: 1,
				},
				{
					x: width,
					y: height,
				},
			]
			if (width % 2 === 1 && width <= height) {
				options.push({
					x: Math.ceil(width / 2),
					y: 1,
				})
				options.push({
					x: Math.ceil(width / 2),
					y: height,
				})
			}
			if (height % 2 === 1 && height <= width) {
				options.push({
					x: 1,
					y: Math.ceil(height / 2),
				})
				options.push({
					x: width,
					y: Math.ceil(height / 2),
				})
			}
			return options[Math.floor(random() * options.length)]
		})()

	const idDependencies = {
		width,
		height,
		preferWalls,
		playerStartPosition,
		finishCount,
		collectionId,
	}

	const id = md5(JSON.stringify(idDependencies))

	return {
		id,
		...idDependencies,
	}
}

export const seedIdToSeed = (seedId: string) => {
	const [rawCodeBase, rawWidth, rawHeight, rawPreferWalls] = seedId.split(';')

	return createLevelSeed({
		seed: rawCodeBase,
		width: parseInt(rawWidth, 10) || 1,
		height: parseInt(rawHeight, 10) || 1,
		preferWalls: (parseInt(rawPreferWalls, 10) || 5) / 9,
	})
}

export type Seed = ReturnType<typeof createLevelSeed>

export interface GameProps {
	seed: Seed
	onContinue?: (finishIndex: number) => void
}

export const Game: React.FunctionComponent<GameProps> = ({
	seed,
	...props
}) => {
	const hasPlayer = true // @TODO

	const boardParameters = React.useMemo(() => {
		return {
			id: seed.id,
			width: seed.width,
			height: seed.height,
			playerStartPosition: seed.playerStartPosition,
			finishCount: seed.finishCount,
			preferWalls: seed.preferWalls,
		}
	}, [seed])

	const [solutionsAroundPlayer, setSolutionsAroundPlayer] = React.useState<
		FieldTask['solution'][]
	>([])

	const [solutionFromPlayer, setSolutionFromPlayer] = React.useState<
		LevelProps['solutionFromPlayer']
	>(undefined)

	const [stats, setStats] = React.useState<null | LevelStatsData>(null)
	const restart = React.useCallback(() => [setStats(null)], [])

	const onContinue = React.useMemo(() => {
		const next = props.onContinue || undefined // Typescript woodoo
		if (next !== undefined) {
			return (finishIndex: number) => {
				next(finishIndex)
				restart()
			}
		}
	}, [props.onContinue])

	const [isLevelFinished, setIsLevelFinished] = useIsLevelFinished(seed.id)
	React.useEffect(() => {
		if (stats) {
			setIsLevelFinished(true)
		}
	}, [stats])

	const {
		ref: controlsRef,
		height: controlsHeight = 0,
	} = useResizeObserver<HTMLDivElement>()

	return (
		<div className={s.game}>
			{stats ? (
				<div className={s.stats}>
					<LevelStats stats={stats} restart={restart} onContinue={onContinue} />
				</div>
			) : (
				<div className={s.level}>
					<Level
						{...boardParameters}
						setSolutionsAroundPlayer={setSolutionsAroundPlayer}
						hasPlayer={hasPlayer}
						solutionFromPlayer={solutionFromPlayer}
						clearSolutionFromPlayer={() => setSolutionFromPlayer(undefined)}
						setStats={(stats) => setStats(stats)}
						controlsHeight={controlsHeight}
					/>
					{hasPlayer && solutionsAroundPlayer.length > 0 && (
						<div className={s.controls} ref={controlsRef}>
							<Container>
								<Controls
									solutions={solutionsAroundPlayer}
									onSolution={(solution) => setSolutionFromPlayer(solution)}
								/>
							</Container>
						</div>
					)}
				</div>
			)}
		</div>
	)
}
