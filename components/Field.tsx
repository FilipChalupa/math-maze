import clsx from 'clsx'
import React from 'react'
import s from './Field.module.css'

interface FieldProps {
	isVisited?: boolean
	isWall?: boolean
	isTask?: boolean
}

export const Field: React.FunctionComponent<FieldProps> = ({
	isVisited,
	isWall,
	isTask,
	children,
}) => {
	return (
		<div
			className={clsx(
				s.field,
				isVisited && s.isVisited,
				isWall && s.isWall,
				isTask && s.isTask,
			)}
		>
			{children}
		</div>
	)
}
