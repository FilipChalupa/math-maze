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
	disabled?: boolean
}> = ({ children, onClick, shortcutKey, disabled }) => {
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
				disabled={disabled}
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
	const actions = React.useMemo(
		() =>
			Array(4)
				.fill(null)
				.map((_, i) => solutions[i] || null),
		[solutions],
	)

	return (
		<div className={s.controls}>
			{actions.map((solution, i) => (
				<Action
					key={i}
					onClick={solution === null ? undefined : () => onSolution(solution)}
					shortcutKey={orderedShortcutKeys[i]}
					disabled={solution === null}
				>
					{solution === FINISH_SOLUTION_SYMBOL
						? '🏁'
						: solution === null
						? ' '
						: solution}
				</Action>
			))}
		</div>
	)
}
