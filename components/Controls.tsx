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
	shortcutKey?: string
}> = ({ children, onClick, shortcutKey }) => {
	React.useEffect(() => {
		if (shortcutKey && onClick) {
			const handleKey = (event: KeyboardEvent) => {
				if (event.key === shortcutKey) {
					onClick()
				}
			}
			document.addEventListener('keydown', handleKey)
			return () => document.removeEventListener('keydown', handleKey)
		}
	}, [shortcutKey, onClick])

	return (
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
}

const orderedShortcutKeys = ['v', 'b', 'n', 'm']

export const Controls: React.FunctionComponent<ControlsProps> = ({
	solutions,
	onSolution,
}) => {
	return (
		<div className={s.controls}>
			{solutions.map((solution, i) => (
				<Action
					key={i}
					onClick={() => onSolution(solution)}
					shortcutKey={orderedShortcutKeys[i]}
				>
					{solution === FINISH_SOLUTION_SYMBOL ? '🏁' : solution}
				</Action>
			))}
		</div>
	)
}
