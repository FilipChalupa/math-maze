import {
	Avatar,
	Container,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	NoSsr,
	Paper,
	Tab,
	Tabs,
	Typography,
} from '@material-ui/core'
import AccountTreeIcon from '@material-ui/icons/AccountTree'
import CheckIcon from '@material-ui/icons/Check'
import FitnessCenterIcon from '@material-ui/icons/FitnessCenter'
import SportsEsportsIcon from '@material-ui/icons/SportsEsports'
import Link from 'next/link'
import React, { FunctionComponent } from 'react'
import { useStorageBackedState } from 'use-storage-backed-state'
import { seedIdToSeed } from '../components/Game'
import { PlayerCharacterSelector } from '../components/PlayerCharacterSelector'
import { themeColor } from '../components/ThemeProvider'
import { useDailyChallengeLevels } from '../utils/useDailyChallengeLevels'
import { useIsCollectionFinished } from '../utils/useIsCollectionFinished'
import { useIsLevelFinished } from '../utils/useIsLevelFinished'

export default function Home() {
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
		<NoSsr>
			<Paper square>
				<Tabs
					indicatorColor="primary"
					textColor="inherit"
					centered
					value={tabIndex}
					onChange={handleTabIndexChange}
				>
					<Tab label="Série" icon={<AccountTreeIcon />} />
					<Tab label="Denní výzva" icon={<FitnessCenterIcon />} />
					<Tab label="Mapy" icon={<SportsEsportsIcon />} />
				</Tabs>
			</Paper>
			<PlayerCharacterSelector />
			<br />
			<br />
			<Container maxWidth="xs">
				{tabIndex === 0 ? (
					<Collections />
				) : tabIndex === 1 ? (
					<DailyChallenge />
				) : tabIndex === 2 ? (
					<Levels />
				) : (
					<></>
				)}
			</Container>
		</NoSsr>
	)
}

const Collections: FunctionComponent = () => (
	<>
		<Typography variant="body1" align="center" gutterBottom>
			Vyber si sérii a ověř síly několika mapách.
		</Typography>
		<List>
			<Collection title="Tutoriál" subheader="první krůčky" id="tutorial" />
			<Collection
				title="Na zahřátí"
				subheader="základní sčítání, odčítání, násobení, dělení"
				id="warmup"
			/>
			<Collection title="Sčítání" subheader="sčítej jako blesk" id="addition" />
			<Collection title="Odčítání" subheader="ber, dokud je" id="subtraction" />
			<Collection
				title="Násobení"
				subheader="množ, co to jde"
				id="multiplication"
			/>
			<Collection title="Dělení" subheader="každému něco" id="division" />
		</List>
	</>
)

const Levels: FunctionComponent = () => (
	<>
		<Typography variant="body1" align="center" gutterBottom>
			Máš radši rychlou akci? Vyber si samostatný level.
		</Typography>
		<List>
			<Level
				seedId="a;8;5;0;1;1;;;0"
				title="Na co prsty stačí"
				subheader="sčítání a odčítání do desíti"
			/>
			<Level
				seedId="b;16;9;5;;;1;;0"
				title="Malá násobilka"
				subheader="10 * 10 brnkačka"
			/>
			<Level
				seedId="c;30;5;7;;;2;;0"
				title="Velká násobilka"
				subheader="10 * 20 se neleknu"
			/>
			<Level
				seedId="d;40;6;9;2;2;2;2;0"
				title="Mix"
				subheader="ukaž, co umíš"
			/>
			<Level
				seedId="d;10;10;9;1;1;1;1;1"
				title="Krátký zrak"
				subheader="přihořívá, přihořívá, hoří"
			/>
		</List>
	</>
)

const DailyChallenge: FunctionComponent = () => {
	const levels = useDailyChallengeLevels()

	return (
		<>
			<Typography variant="body1" align="center" gutterBottom>
				Vyzkoušej každý den něco nového. Splň vybrané levely pro dnešní výzvu.
			</Typography>
			<br />
			{levels.map((group, i) => (
				<React.Fragment key={i}>
					<Typography variant="h6">{group.label}</Typography>
					<List>
						{group.levels.map((level, i) => (
							<Level key={i} {...level} />
						))}
					</List>
				</React.Fragment>
			))}
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
	seedId: string
}> = ({ title, subheader, seedId }) => {
	const id = React.useMemo(() => seedIdToSeed(seedId).id, [seedId])
	const [isLevelFinished] = useIsLevelFinished(id)

	return (
		<Item
			title={title}
			subheader={subheader}
			href={`/map?i=${seedId}`}
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
