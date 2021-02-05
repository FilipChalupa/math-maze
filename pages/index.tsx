import {
	Avatar,
	Container,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Paper,
	Tab,
	Tabs,
	Typography,
} from '@material-ui/core'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import CheckIcon from '@material-ui/icons/Check'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { FunctionComponent } from 'react'
import { themeColor } from '../components/ThemeProvider'
import { useIsCollectionFinished } from '../utils/useIsCollectionFinished'
import { useIsLevelFinished } from '../utils/useIsLevelFinished'

export default function Home() {
	const [tabIndex, setTabIndex] = React.useState(0)
	const handleTabIndexChange = React.useCallback(
		(event: React.ChangeEvent<{}>, newValue: number) => {
			setTabIndex(newValue)
		},
		[],
	)

	return (
		<>
			<Paper square>
				<Tabs
					indicatorColor="primary"
					textColor="inherit"
					centered
					value={tabIndex}
					onChange={handleTabIndexChange}
				>
					<Tab label="Kolekce" icon={<AccountTreeIcon />} />
					<Tab label="Levely" icon={<SportsEsportsIcon />} />
				</Tabs>
			</Paper>
			<br />
			<br />
			<Container maxWidth="xs">
				{tabIndex === 0 ? (
					<CollectionsWithNoSSR />
				) : tabIndex === 1 ? (
					<LevelsWithNoSSR />
				) : (
					<></>
				)}
			</Container>
		</>
	)
}

const Collections: FunctionComponent = () => (
	<>
		<Typography variant="h4" gutterBottom>
			Vyber kolekci
		</Typography>
		<List>
			<Collection title="Tutoriál" subheader="první krůčky" id="tutorial" />
			<Collection
				title="Ukázková kolekce"
				subheader="sčítání, odčítání, násobení, dělení"
				id="example"
			/>
		</List>
	</>
)
const CollectionsWithNoSSR = dynamic(() => Promise.resolve(Collections), {
	ssr: false,
})

const Levels: FunctionComponent = () => (
	<>
		<Typography variant="h4" gutterBottom>
			Vyber level
		</Typography>
		<List>
			<Level
				id="a;8;5"
				title="Ukázkový level 1"
				subheader="sčítání, odčítání, násobení, dělení"
			/>
			<Level
				id="b;16;9"
				title="Ukázkový level 2"
				subheader="sčítání, odčítání, násobení, dělení"
			/>
			<Level
				id="c;30;5"
				title="Ukázkový level 3"
				subheader="sčítání, odčítání, násobení, dělení"
			/>
			<Level
				id="d;40;6"
				title="Ukázkový level 4"
				subheader="sčítání, odčítání, násobení, dělení"
			/>
		</List>
	</>
)
const LevelsWithNoSSR = dynamic(() => Promise.resolve(Levels), {
	ssr: false,
})

const Item: React.FunctionComponent<{
	title: string
	subheader: string
	href: string
	icon: React.ReactNode
	isFinished: boolean
}> = ({ title, subheader, href, icon, isFinished }) => (
	<Link href={href} passHref>
		<ListItem button component="a">
			<ListItemAvatar>
				<Avatar
					style={{ backgroundColor: isFinished ? themeColor : undefined }}
				>
					{isFinished ? <CheckIcon /> : icon}
				</Avatar>
			</ListItemAvatar>
			<ListItemText primary={title} secondary={subheader} />
		</ListItem>
	</Link>
)

const Level: React.FunctionComponent<{
	title: string
	subheader: string
	id: string
}> = ({ title, subheader, id }) => {
	const [isLevelFinished] = useIsLevelFinished(id)

	return (
		<Item
			title={title}
			subheader={subheader}
			href={`/map?i=${id}`}
			icon={<SportsEsportsIcon />}
			isFinished={isLevelFinished}
		/>
	)
}

const Collection: React.FunctionComponent<{
	title: string
	subheader: string
	id: string
}> = ({ title, subheader, id }) => {
	const [isCollectionFinished] = useIsCollectionFinished(id)

	return (
		<Item
			title={title}
			subheader={subheader}
			href={`/collection?i=${id}`}
			icon={<AccountTreeIcon />}
			isFinished={isCollectionFinished}
		/>
	)
}
