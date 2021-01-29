import { Container } from '@material-ui/core'
import React from 'react'
import { Seed } from '../pages/map'
import { FieldTask } from './Board'
import { Controls } from './Controls'
import s from './Game.module.css'
import { Level, LevelProps } from './Level'

export interface GameProps {
	seed: Seed
}

export const Game: React.FunctionComponent<GameProps> = ({ seed }) => {
	const boardParameters = React.useMemo(() => {
		return {
			width: 16,
			height: 9,
		}
	}, [seed])

	const [tasksAroundPlayer, setTasksAroundPlayer] = React.useState<FieldTask[]>(
		[],
	)

	const [solutionFromPlayer, setSolutionFromPlayer] = React.useState<
		LevelProps['solutionFromPlayer']
	>(undefined)

	return (
		<div className={s.game}>
			{/*game WSAD*/}
			<div className={s.level}>
				<Level
					{...boardParameters}
					setTasksAroundPlayer={setTasksAroundPlayer}
					solutionFromPlayer={solutionFromPlayer}
					clearSolutionFromPlayer={() => setSolutionFromPlayer(undefined)}
					id={seed.id}
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
		</div>
	)
}
