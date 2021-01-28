import React from 'react'
import s from './Field.module.css'

interface FieldProps {}

export const Field: React.FunctionComponent<FieldProps> = ({}) => {
	return <div className={s.field}></div>
}
