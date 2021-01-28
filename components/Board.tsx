import React from 'react'
import useResizeObserver from 'use-resize-observer'
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

const calculateOffset = (
	boardPixelSize: number,
	innerPixelSize: number,
	fieldCount: number,
	player: number,
) => (innerPixelSize / fieldCount) * (fieldCount / 2 - player + 0.5)

export const Board: React.FunctionComponent<BoardProps> = ({
	width,
	height,
	player,
}) => {
	const {
		ref: boardRef,
		width: boardWidth = 1,
		height: boardHeight = 1,
	} = useResizeObserver<HTMLDivElement>()
	const {
		ref: innerRef,
		width: innerWidth = 1,
		height: innerHeight = 1,
	} = useResizeObserver<HTMLDivElement>()

	const [scale, setScale] = React.useState(1)
	const [offset, setOffset] = React.useState({ x: 0, y: 0 })

	React.useEffect(() => {
		setScale(
			player ? 1 : Math.min(boardWidth / innerWidth, boardHeight / innerHeight),
		)
		setOffset(
			player
				? {
						x: calculateOffset(boardWidth, innerWidth, width, player.x),
						y: calculateOffset(boardHeight, innerHeight, height, player.y),
				  }
				: { x: 0, y: 0 },
		)
	}, [boardWidth, boardHeight, innerWidth, innerHeight, player])

	const fields = React.useMemo(() => {
		return Array(width * height).fill(null)
	}, [width, height])

	return (
		<div
			style={{
				['--width' as any]: width,
				['--height' as any]: height,
				['--scale' as any]: scale,
				['--offset-x' as any]: offset.x,
				['--offset-y' as any]: offset.y,
			}}
			className={s.board}
			ref={boardRef}
		>
			<div className={s.inner} ref={innerRef}>
				<div className={s.fields}>
					{fields.map((field, i) => {
						const x = 1 + (i % width)
						const y = 1 + Math.floor(i / width)

						return (
							<Field
								key={i}
								isVisited={player && player.x === x && player.y === y}
							>
								{x}:{y}
							</Field>
						)
					})}
				</div>
				<div className={s.meta}>
					{player && (
						<MetaObject position={player}>
							<Player />
						</MetaObject>
					)}
				</div>
			</div>
		</div>
	)
}
