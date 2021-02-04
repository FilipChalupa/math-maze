import { Container } from '@material-ui/core'
import React from 'react'
import seedrandom from 'seedrandom'
import useResizeObserver from 'use-resize-observer'
import { FieldTask } from './Board'
import { Controls } from './Controls'
import s from './Game.module.css'
import { Level, LevelProps, Position } from './Level'
import { LevelStats, LevelStatsData } from './LevelStats'

export const seedIdToSeed = (seedId: string) => {
	const [rawCodeBase, rawWidth, rawHeight] = seedId.split(';')

	const height = parseInt(rawHeight, 10) || 1
	const width = Math.max(height <= 2 ? 3 : 1, parseInt(rawWidth, 10) || 1)
	const code = `${rawCodeBase || ''}-${width}-${height}`

	const random = seedrandom(`seedIdToSeed-${code}`)

	const playerStartPosition = (() => {
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

	const finishPosition = (() => {
		const options: Position[] = []
		const minimumDistance =
			Math.max(width, height) - 1 + (Math.min(width, height) - 1) / 3
		for (let x = 1; x <= width; x++) {
			for (let y = 1; y <= height; y++) {
				if (
					Math.abs(playerStartPosition.x - x) +
						Math.abs(playerStartPosition.y - y) >=
					minimumDistance
				) {
					options.push({ x, y })
				}
			}
		}
		return options.length > 0
			? options[Math.floor(random() * options.length)]
			: { x: 1, y: 1 }
	})()
	const finishPositions = [finishPosition]

	return {
		code,
		width,
		height,
		playerStartPosition,
		finishPositions,
	}
}

export const seedToSeedId = (seed: Seed) => {
	const u = (t: string | number) => t || ''

	return `${u(seed.code)};${u(seed.width)};${u(seed.height)}`
}

export type Seed = ReturnType<typeof seedIdToSeed>

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
			code: seed.code,
			width: seed.width,
			height: seed.height,
			playerStartPosition: seed.playerStartPosition,
			finishPositions: seed.finishPositions,
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
