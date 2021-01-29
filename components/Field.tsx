import clsx from 'clsx'
import React from 'react'
import s from './Field.module.css'

interface FieldProps {
	isVisited?: boolean
	isWall?: boolean
	isTask?: boolean
	isFinish?: boolean
}

export const Field: React.FunctionComponent<FieldProps> = ({
	isVisited,
	isWall,
	isTask,
	isFinish,
	children,
}) => {
	return (
		<div
			className={clsx(
				s.field,
				isVisited && s.isVisited,
				isWall && s.isWall,
				isTask && s.isTask,
				isFinish && s.isFinish,
			)}
		>
			{children}
		</div>
	)
}
