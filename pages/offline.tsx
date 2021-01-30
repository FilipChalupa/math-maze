import { Container, Typography } from '@material-ui/core'
import Head from 'next/head'
import React from 'react'

export default function Offline() {
	return (
		<Container maxWidth="xs">
			<Head>
				<title>Matematické bludiště</title>
				<meta name="robots" content="noindex" />
			</Head>
			<br />
			<br />
			<br />
			<Typography variant="h4" gutterBottom>
				Offline
			</Typography>
		</Container>
	)
}
