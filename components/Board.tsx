import React from 'react'
import s from './Board.module.css'
import { Field } from './Field'
import { LevelProps } from './Level'
import { MetaObject } from './MetaObject'
import { Player } from './Player'

interface BoardProps extends Pick<LevelProps, 'width' | 'height'> {
	player?: {
		x: number
		y: number
	}
}

export const Board: React.FunctionComponent<BoardProps> = ({
	width,
	height,
	player,
}) => {
	const fields = React.useMemo(() => {
		return Array(width * height).fill(null)
	}, [width, height])

	return (
		<div
			style={{
				['--width' as any]: width,
				['--height' as any]: height,
			}}
			className={s.board}
		>
			<div className={s.fields}>
				{fields.map((field, i) => (
					<Field key={i} />
				))}
			</div>
			<div className={s.meta}>
				{player && (
					<MetaObject x={player.x} y={player.y}>
						<Player />
					</MetaObject>
				)}
			</div>
		</div>
	)
}
