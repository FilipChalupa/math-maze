import { HidingHeader } from 'hiding-header-react'
import React from 'react'
import { Header } from './Header'
import s from './Layout.module.css'

export const Layout: React.FunctionComponent = (props) => {
	return (
		<div className={s.container}>
			<HidingHeader>
				<Header />
			</HidingHeader>
			<div className={s.main}>{props.children}</div>
		</div>
	)
}
