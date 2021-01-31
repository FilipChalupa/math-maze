import {
	Avatar,
	Container,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@material-ui/core'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import Head from 'next/head'
import Link from 'next/link'
import React from 'react'

export default function Home() {
	return (
		<Container maxWidth="xs">
			<Head>
				<title>Matematické bludiště</title>
			</Head>
			<br />
			<br />
			<br />
			<Typography variant="h4" gutterBottom>
				Vyber level
			</Typography>
			<List>
				<Link href="/map?s=a" passHref>
					<ListItem button component="a">
						<ListItemAvatar>
							<Avatar>
								<SportsEsportsIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Ukázkový level 1"
							secondary="sčítání, odčítání, násobení, dělení"
						/>
					</ListItem>
				</Link>
				<Link href="/map?s=b" passHref>
					<ListItem button component="a">
						<ListItemAvatar>
							<Avatar>
								<SportsEsportsIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Ukázkový level 2"
							secondary="sčítání, odčítání, násobení, dělení"
						/>
					</ListItem>
				</Link>
				<Link href="/map?s=c" passHref>
					<ListItem button component="a">
						<ListItemAvatar>
							<Avatar>
								<SportsEsportsIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Ukázkový level 3"
							secondary="sčítání, odčítání, násobení, dělení"
						/>
					</ListItem>
				</Link>
				<Link href="/map?s=d" passHref>
					<ListItem button component="a">
						<ListItemAvatar>
							<Avatar>
								<SportsEsportsIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Ukázkový level 4"
							secondary="sčítání, odčítání, násobení, dělení"
						/>
					</ListItem>
				</Link>
			</List>
			test 1
		</Container>
	)
}
