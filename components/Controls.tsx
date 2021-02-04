import { Button } from '@material-ui/core'
import React from 'react'
import { FieldTask } from './Board'
import s from './Controls.module.css'
import { FINISH_SOLUTION_SYMBOL } from './Level'

interface ControlsProps {
	solutions: FieldTask['solution'][]
	onSolution: (solution: FieldTask['solution']) => void
}

const Action: React.FunctionComponent<{
	onClick?: () => void
}> = ({ children, onClick }) => (
	<div className={s.action}>
		<Button
			variant="contained"
			color="primary"
			onClick={onClick}
			size="large"
			fullWidth
		>
			{children}
		</Button>
	</div>
)

export const Controls: React.FunctionComponent<ControlsProps> = ({
	solutions,
	onSolution,
}) => {
	return (
		<div className={s.controls}>
			{solutions.map((solution, i) => (
				<Action key={i} onClick={() => onSolution(solution)}>
					{solution === FINISH_SOLUTION_SYMBOL ? '🏁' : solution}
				</Action>
			))}
		</div>
	)
}
