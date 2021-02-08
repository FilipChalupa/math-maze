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
import TimerIcon from '@material-ui/icons/Timer'
import Link from 'next/link'
import React from 'react'
import s from './LevelStatistics.module.css'

function noMorethanOneDecimalPlace(input: number) {
	return Math.round(input * 10) / 10
}

function toMaybeRoundedSeconds(input: number) {
	const exactSeconds = input / 1000
	if (exactSeconds > 3) {
		return Math.round(exactSeconds)
	}
	return noMorethanOneDecimalPlace(exactSeconds)
}

export interface LevelStatisticsData {
	moves: number
	width: number
	height: number
	finishIndex: number
	time: number
}
export interface LevelStatisticsProps {
	statistics: LevelStatisticsData
	restart?: () => void
	onContinue?: (finishIndex: number) => void
}

export const LevelStatistics: React.FunctionComponent<LevelStatisticsProps> = ({
	statistics: { moves, width, height, finishIndex, time },
	restart,
	onContinue,
}) => {
	const timeText = React.useMemo(() => {
		const relativeTimeFormat = new Intl.RelativeTimeFormat('cs')
		return relativeTimeFormat.format(toMaybeRoundedSeconds(time), 'seconds')
	}, [time])

	const timePerMoveText = React.useMemo(() => {
		const relativeTimeFormat = new Intl.RelativeTimeFormat('cs')
		return relativeTimeFormat.format(
			toMaybeRoundedSeconds(time / (moves - 1)),
			'seconds',
		)
	}, [time])

	return (
		<Container maxWidth="xs">
			<br />
			<br />
			<br />
			<div className={s.levelStatistics}>
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
									<TimelapseIcon />
								</Avatar>
							</ListItemAvatar>
							<ListItemText
								primary="Čas celkem"
								secondary={
									<>
										od prvního kroku v cíli <b>{timeText}</b>
									</>
								}
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
						{moves > 2 && (
							<ListItem>
								<ListItemAvatar>
									<Avatar variant="square">
										<TimerIcon />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary="Čas na krok"
									secondary={
										<>
											průměrně jeden pohyb <b>{timePerMoveText}</b>
										</>
									}
								/>
							</ListItem>
						)}
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
