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
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import React, { FunctionComponent } from 'react'
import seedrandom from 'seedrandom'
import { useStorageBackedState } from 'use-storage-backed-state'
import { themeColor } from '../components/ThemeProvider'
import { useIsCollectionFinished } from '../utils/useIsCollectionFinished'
import { useIsLevelFinished } from '../utils/useIsLevelFinished'

export default function Home() {
	return <HomeInnerWithNoSSR />
}

const HomeInner: FunctionComponent = () => {
	const [storedTabIndex, setStoredTabIndex] = useStorageBackedState(
		0,
		'home-last-tab',
	)
	const [tabIndex, setTabIndex] = React.useState(storedTabIndex)

	const handleTabIndexChange = React.useCallback(
		(event: React.ChangeEvent<{}>, newValue: number) => {
			setTabIndex(newValue)
			setStoredTabIndex(newValue)
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
					<Tab label="Série" icon={<AccountTreeIcon />} />
					<Tab label="Levely" icon={<SportsEsportsIcon />} />
					<Tab label="Denní výzva" icon={<FitnessCenterIcon />} />
				</Tabs>
			</Paper>
			<br />
			<br />
			<Container maxWidth="xs">
				{tabIndex === 0 ? (
					<Collections />
				) : tabIndex === 1 ? (
					<Levels />
				) : tabIndex === 2 ? (
					<DailyChallenge />
				) : (
					<></>
				)}
			</Container>
		</>
	)
}
const HomeInnerWithNoSSR = dynamic(() => Promise.resolve(HomeInner), {
	ssr: false,
})

const Collections: FunctionComponent = () => (
	<>
		<Typography variant="body1" gutterBottom>
			Vyber si kolekci a ověř síly na sérii několika levelů.
		</Typography>
		<List>
			<Collection title="Tutoriál" subheader="první krůčky" id="tutorial" />
			<Collection
				title="Ukázková série"
				subheader="sčítání, odčítání, násobení, dělení"
				id="example"
			/>
		</List>
	</>
)

const Levels: FunctionComponent = () => (
	<>
		<Typography variant="body1" gutterBottom>
			Máš radši rychlou akci? Vyber si samostatný level.
		</Typography>
		<List>
			<Level
				id="a;8;5;0"
				title="Ukázkový level 1"
				subheader="sčítání, odčítání, násobení, dělení"
			/>
			<Level
				id="b;16;9;5"
				title="Ukázkový level 2"
				subheader="sčítání, odčítání, násobení, dělení"
			/>
			<Level
				id="c;30;5;7"
				title="Ukázkový level 3"
				subheader="sčítání, odčítání, násobení, dělení"
			/>
			<Level
				id="d;40;6;9"
				title="Ukázkový level 4"
				subheader="sčítání, odčítání, násobení, dělení"
			/>
		</List>
	</>
)

const DailyChallenge: FunctionComponent = () => {
	const levels = React.useMemo(() => {
		const today = new Date()
		const random = seedrandom(
			`${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`,
		)

		return new Array(5).fill(null).map((_, i) => {
			const extraSize = ((i * i) / 4) * 3
			const width = Math.ceil(2 + random() * 4 + extraSize)
			const height = Math.ceil(2 + random() * 4 + extraSize)
			const preferWalls = Math.floor(random() * 10)
			const code = random().toString(36).substring(7)

			return {
				id: `${code};${width};${height};${preferWalls}`,
				title: `Level ${i + 1}`,
				subheader: `rozměry ${width} x ${height}`,
			}
		})
	}, [])

	return (
		<>
			<Typography variant="body1" gutterBottom>
				Vyzkoušej každý den něco nového. Splň vybrané levely pro dnešní výzvu.
			</Typography>
			<List>
				{levels.map((level, i) => (
					<Level key={i} {...level} />
				))}
			</List>
		</>
	)
}

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
