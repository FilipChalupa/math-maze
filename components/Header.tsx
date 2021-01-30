import { AppBar, Container, Toolbar, Typography } from '@material-ui/core'
import Link from 'next/link'
import React from 'react'
import s from './Header.module.css'

export const Header: React.FunctionComponent = () => {
	return (
		<AppBar position="static">
			<Container disableGutters>
				<Toolbar>
					<div className={s.main}>
						<Link href="/">
							<a>
								<Typography variant="h5">Matematické bludiště</Typography>
							</a>
						</Link>
					</div>
				</Toolbar>
			</Container>
		</AppBar>
	)
}
