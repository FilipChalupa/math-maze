import {
	Avatar,
	Button,
	Container,
	List,
	ListItem,
	ListItemAvatar,
	ListItemText,
	Typography,
} from '@material-ui/core'
import AspectRatioIcon from '@material-ui/icons/AspectRatio'
import GamesIcon from '@material-ui/icons/Games'
import Link from 'next/link'
import React from 'react'
import s from './LevelStats.module.css'

export interface LevelStatsData {
	moves: number
	width: number
	height: number
	finishIndex: number
}
export interface LevelStatsProps {
	stats: LevelStatsData
	restart?: () => void
	onContinue?: (finishIndex: number) => void
}

export const LevelStats: React.FunctionComponent<LevelStatsProps> = ({
	stats: { moves, width, height, finishIndex },
	restart,
	onContinue,
}) => {
	return (
		<Container maxWidth="xs">
			<br />
			<br />
			<br />
			<div className={s.levelStats}>
				<Typography variant="h4" gutterBottom>
					Statistika
				</Typography>
				<List>
					<ListItem>
						<ListItemAvatar>
							<Avatar variant="square">
								<AspectRatioIcon />
							</Avatar>
						</ListItemAvatar>
						<ListItemText
							primary="Velikost levelu"
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
				</List>
				<Link href="/" passHref>
					<Button variant="outlined" color="default" component="a">
						Domů
					</Button>
				</Link>{' '}
				{onContinue ? (
					<Button
						variant="contained"
						color="default"
						onClick={() => onContinue(finishIndex)}
					>
						Pokračovat
					</Button>
				) : (
					restart && (
						<Button
							variant={onContinue ? 'outlined' : 'contained'}
							color="default"
							onClick={restart}
						>
							Zkusit znovu
						</Button>
					)
				)}
			</div>
		</Container>
	)
}
