import { Container } from '@material-ui/core'
import React from 'react'
import { Seed } from '../pages/map'
import { FieldTask } from './Board'
import { Controls } from './Controls'
import s from './Game.module.css'
import { Level } from './Level'

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

	return (
		<div className={s.game}>
			game WSAD
			<div className={s.level}>
				<Level
					{...boardParameters}
					setTasksAroundPlayer={setTasksAroundPlayer}
				/>
				{tasksAroundPlayer.length > 0 && (
					<Container>
						<Controls
							tasks={tasksAroundPlayer}
							onSolution={(solution) => console.log('send solution', solution)}
						/>
					</Container>
				)}
			</div>
		</div>
	)
}
