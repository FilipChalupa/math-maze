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
import Link from 'next/link'
import React from 'react'

export default function Home() {
	return (
		<Container maxWidth="xs">
			<br />
			<br />
			<Typography variant="h4" gutterBottom>
				Vyber kolekci
			</Typography>
			<List>
				<Link href="/collection?i=tutorial" passHref>
					<ListItem button component="a">
						<ListItemAvatar>
							<Avatar>
								<AccountTreeIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText primary="Tutoriál" secondary="první krůčky" />
					</ListItem>
				</Link>
				<Link href="/collection?i=example" passHref>
					<ListItem button component="a">
						<ListItemAvatar>
							<Avatar>
								<AccountTreeIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Ukázková kolekce"
							secondary="sčítání, odčítání, násobení, dělení"
						/>
					</ListItem>
				</Link>
			</List>
			<br />
			<br />
			<Typography variant="h4" gutterBottom>
				Vyber level
			</Typography>
			<List>
				<Link href="/map?i=a;8;5" passHref>
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
				<Link href="/map?i=b;16;9" passHref>
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
				<Link href="/map?i=c;30;20" passHref>
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
				<Link href="/map?i=d;40;6" passHref>
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
		</Container>
	)
}
