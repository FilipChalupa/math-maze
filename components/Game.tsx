import { Container } from '@material-ui/core'
import React from 'react'
import { FieldTask } from './Board'
import { Controls } from './Controls'
import s from './Game.module.css'
import { Level, LevelProps } from './Level'
import { LevelStats, LevelStatsData } from './LevelStats'

export const seedIdToSeed = (seedId: string) => {
	const [code, width, height] = seedId.split(';')

	return {
		code: code || '',
		width: parseInt(width, 10) || 1,
		height: parseInt(height, 10) || 1,
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
	const boardParameters = React.useMemo(() => {
		return {
			code: seed.code,
			width: seed.width,
			height: seed.height,
		}
	}, [seed])

	const [tasksAroundPlayer, setTasksAroundPlayer] = React.useState<FieldTask[]>(
		[],
	)

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
						setTasksAroundPlayer={setTasksAroundPlayer}
						solutionFromPlayer={solutionFromPlayer}
						clearSolutionFromPlayer={() => setSolutionFromPlayer(undefined)}
						id={seedToSeedId(seed)}
						setStats={(stats) => setStats(stats)}
					/>
					{tasksAroundPlayer.length > 0 && (
						<div className={s.controls}>
							<Container>
								<Controls
									tasks={tasksAroundPlayer}
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
