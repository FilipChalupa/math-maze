import React from 'react'
import s from './MetaObject.module.css'

interface MetaObjectProps {
	x: number
	y: number
}

export const MetaObject: React.FunctionComponent<MetaObjectProps> = ({
	x,
	y,
	children,
}) => {
	return (
		<div
			style={{
				['--x' as any]: x,
				['--y' as any]: y,
			}}
			className={s.metaObject}
		>
			{children}
		</div>
	)
}
