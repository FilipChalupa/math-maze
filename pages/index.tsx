import {
	Avatar,
	Container,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@material-ui/core'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
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
				<Link href="/map?i=a" passHref>
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
				<Link href="/map?i=b" passHref>
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
				<Link href="/map?i=c" passHref>
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
				<Link href="/map?i=d" passHref>
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
			<br />
			<br />
			<Typography variant="h4" gutterBottom>
				Vyber kolekci
			</Typography>
			<List>
				<Link href="/set?i=a" passHref>
					<ListItem button component="a">
						<ListItemAvatar>
							<Avatar>
								<AccountTreeIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Ukázková kolekce 1"
							secondary="sčítání, odčítání, násobení, dělení"
						/>
					</ListItem>
				</Link>
				<Link href="/set?i=b" passHref>
					<ListItem button component="a">
						<ListItemAvatar>
							<Avatar>
								<AccountTreeIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Ukázková kolekce 2"
							secondary="sčítání, odčítání, násobení, dělení"
						/>
					</ListItem>
				</Link>
				<Link href="/set?i=c" passHref>
					<ListItem button component="a">
						<ListItemAvatar>
							<Avatar>
								<AccountTreeIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Ukázková kolekce 3"
							secondary="sčítání, odčítání, násobení, dělení"
						/>
					</ListItem>
				</Link>
				<Link href="/set?i=d" passHref>
					<ListItem button component="a">
						<ListItemAvatar>
							<Avatar>
								<AccountTreeIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Ukázková kolekce 4"
							secondary="sčítání, odčítání, násobení, dělení"
						/>
					</ListItem>
				</Link>
			</List>
		</Container>
	)
}
