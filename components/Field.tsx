import clsx from 'clsx'
import React from 'react'
import s from './Field.module.css'

interface FieldProps {
	isVisited?: boolean
}

export const Field: React.FunctionComponent<FieldProps> = ({
	isVisited,
	children,
}) => {
	return (
		<div className={clsx(s.field, isVisited && s.isVisited)}>{children}</div>
	)
}
