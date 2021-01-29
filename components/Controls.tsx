import { Button } from '@material-ui/core'
import React from 'react'
import { FieldTask } from './Board'
import s from './Controls.module.css'

interface ControlsProps {
	tasks: FieldTask[]
	onSolution: (solution: FieldTask['solution']) => void
}

const Action: React.FunctionComponent<{
	onClick?: () => void
}> = ({ children, onClick }) => (
	<Button variant="contained" color="primary" onClick={onClick} size="large">
		{children}
	</Button>
)

export const Controls: React.FunctionComponent<ControlsProps> = ({
	tasks,
	onSolution,
}) => {
	return (
		<div className={s.controls}>
			{tasks.map((task, i) => (
				<Action key={i} onClick={() => onSolution(task.solution)}>
					{task.solution}
				</Action>
			))}
		</div>
	)
}
