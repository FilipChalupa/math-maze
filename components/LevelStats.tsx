import {
	Avatar,
	Button,
	Container,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	ListSubheader,
	Paper,
} from '@material-ui/core'
import AspectRatioIcon from '@material-ui/icons/AspectRatio'
import GamesIcon from '@material-ui/icons/Games'
import TimelapseIcon from '@material-ui/icons/Timelapse'
import Link from 'next/link'
import React from 'react'
import s from './LevelStats.module.css'

export interface LevelStatsData {
	moves: number
	width: number
	height: number
	finishIndex: number
	timeInSeconds: number
}
export interface LevelStatsProps {
	stats: LevelStatsData
	restart?: () => void
	onContinue?: (finishIndex: number) => void
}

export const LevelStats: React.FunctionComponent<LevelStatsProps> = ({
	stats: { moves, width, height, finishIndex, timeInSeconds },
	restart,
	onContinue,
}) => {
	const time = React.useMemo(() => {
		const relativeTimeFormat = new Intl.RelativeTimeFormat('cs')
		return relativeTimeFormat.format(timeInSeconds, 'seconds')
	}, [timeInSeconds])

	return (
		<Container maxWidth="xs">
			<br />
			<br />
			<br />
			<div className={s.levelStats}>
				<Paper>
					<List subheader={<ListSubheader>Statistika</ListSubheader>}>
						<ListItem>
							<ListItemAvatar>
								<Avatar variant="square">
									<AspectRatioIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary="Velikost mapy"
								secondary={`${width} x ${height}`}
							/>
						</ListItem>
						<ListItem>
							<ListItemAvatar>
								<Avatar variant="square">
									<GamesIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Počet kroků" secondary={moves} />
						</ListItem>
						<ListItem>
							<ListItemAvatar>
								<Avatar variant="square">
									<TimelapseIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText primary="Čas" secondary={`V cíli ${time}`} />
						</ListItem>
					</List>
				</Paper>
				<br />
				<Link href="/" passHref>
					<Button
						variant={onContinue ? 'outlined' : 'contained'}
						color={onContinue ? 'default' : 'primary'}
						component="a"
					>
						Domů
					</Button>
				</Link>{' '}
				{onContinue ? (
					<Button
						variant="contained"
						color="primary"
						onClick={() => onContinue(finishIndex)}
						autoFocus
					>
						Pokračovat
					</Button>
				) : (
					restart && (
						<Button variant="outlined" color="default" onClick={restart}>
							Zkusit znovu
						</Button>
					)
				)}
			</div>
		</Container>
	)
}
