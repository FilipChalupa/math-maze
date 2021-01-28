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
) => {
	const limit = (innerPixelSize - Math.min(innerPixelSize, boardPixelSize)) / 2
	const offset = (innerPixelSize / fieldCount) * (fieldCount / 2 - player + 0.5)
	return Math.max(-limit, Math.min(limit, offset))
}

export const Board: React.FunctionComponent<BoardProps> = ({
	width,
	height,
	player,
}) => {
	const {
		ref: outerRef,
		width: outerWidth = 1,
		height: outerHeight = 1,
	} = useResizeObserver<HTMLDivElement>()
	const {
		ref: innerRef,
		width: innerWidth = 1,
		height: innerHeight = 1,
	} = useResizeObserver<HTMLDivElement>()

	const [scale, setScale] = React.useState(1)
	const [offset, setOffset] = React.useState({ x: 0, y: 0 })

	const [allowTransitions, setAllowTransitions] = React.useState(false)
	const [forceShowAll, setForceShowAll] = React.useState(true)

	React.useEffect(() => {
		const timer = window.setTimeout(() => {
			setAllowTransitions(true)
			requestAnimationFrame(() => {
				setForceShowAll(false)
			})
		}, 1000)
		return () => window.clearTimeout(timer)
	}, [])

	React.useEffect(() => {
		setScale(
			player && !forceShowAll
				? 1
				: Math.min(
						outerWidth / innerWidth,
						outerHeight / innerHeight,
						player ? 1 : Number.MAX_SAFE_INTEGER,
				  ),
		)
		setOffset(
			player && !forceShowAll
				? {
						x: calculateOffset(outerWidth, innerWidth, width, player.x),
						y: calculateOffset(outerHeight, innerHeight, height, player.y),
				  }
				: { x: 0, y: 0 },
		)
	}, [forceShowAll, outerWidth, outerHeight, innerWidth, innerHeight, player])

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
				['--allowTransitions' as any]: allowTransitions ? 1 : 0,
			}}
			className={s.board}
		>
			<div className={s.outer} ref={outerRef}>
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
		</div>
	)
}
