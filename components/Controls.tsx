import { Button } from '@material-ui/core'
import React from 'react'
import s from './Controls.module.css'

interface ControlsProps {}

const Action: React.FunctionComponent = ({ children }) => (
	<Button variant="contained" color="primary">
		{children}
	</Button>
)

export const Controls: React.FunctionComponent<ControlsProps> = ({}) => {
	return (
		<div className={s.controls}>
			<Action>15</Action>
			<Action>17</Action>
			<Action>19</Action>
			<Action>5</Action>
		</div>
	)
}
