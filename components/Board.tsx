import React from 'react'
import useResizeObserver from 'use-resize-observer'
import { useMove } from '../utils/useMove'
import { usePlayerPositions } from '../utils/usePlayerPositions'
import s from './Board.module.css'
import { Field } from './Field'
import { LevelProps, Position } from './Level'
import { MetaObject } from './MetaObject'
import { OtherPlayer } from './OtherPlayer'
import { Player } from './Player'

export type FieldEmpty = { isEmpty: true }

export type FieldWall = { isWall: true }

export type FieldTask = { isTask: true; label: string; solution: string }

export type FieldFinish = { isFinish: true; index: number }

export type Fields = Array<FieldEmpty | FieldWall | FieldTask | FieldFinish>

export interface BoardProps
	extends Pick<LevelProps, 'width' | 'height' | 'controlsHeight'> {
	startPosition: Position
	player?: {
		position: Position
	}
	otherPlayers?: ReturnType<typeof usePlayerPositions>
	fields: Fields
}

const calculatePlayerOffset = (
	innerPixelSize: number,
	fieldCount: number,
	player: number,
) => (innerPixelSize / fieldCount) * (fieldCount / 2 - player + 0.5)

const limitOffset = (
	offset: number,
	boardPixelSize: number,
	innerPixelSize: number,
) => {
	const limit = (innerPixelSize - Math.min(innerPixelSize, boardPixelSize)) / 2
	return Math.max(-limit, Math.min(limit, offset))
}

const calculateOffsetLimit = (
	direction: -1 | 1,
	initialOffset: number,
	boardPixelSize: number,
	innerPixelSize: number,
) => {
	const limit = (innerPixelSize - Math.min(innerPixelSize, boardPixelSize)) / 2
	return direction * limit - initialOffset
}

export const Board: React.FunctionComponent<BoardProps> = ({
	width,
	height,
	startPosition,
	player,
	controlsHeight = 0,
	otherPlayers = {},
	fields,
}) => {
	const {
		ref: outerRef,
		width: outerWidth = 1,
		height: rawOuterHeight = 1,
	} = useResizeObserver<HTMLDivElement>()
	const outerHeight = rawOuterHeight - controlsHeight
	const {
		ref: innerRef,
		width: innerWidth = 1,
		height: innerHeight = 1,
	} = useResizeObserver<HTMLDivElement>()

	const [scale, setScale] = React.useState(1)
	const [offset, setOffset] = React.useState({ x: 0, y: 0 })

	const [allowTransitions, setAllowTransitions] = React.useState(false)
	const [forceShowAll, setForceShowAll] = React.useState(true)

	const indexToPosition = React.useCallback(
		(index: number) => ({
			x: 1 + (index % width),
			y: 1 + Math.floor(index / width),
		}),
		[width],
	)

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
						x: calculatePlayerOffset(innerWidth, width, player.position.x),
						y: calculatePlayerOffset(innerHeight, height, player.position.y),
				  }
				: { x: 0, y: 0 },
		)
	}, [forceShowAll, outerWidth, outerHeight, innerWidth, innerHeight, player])

	const limitedInitialOffset = {
		x: limitOffset(offset.x, outerWidth, innerWidth),
		y: limitOffset(offset.y, outerHeight, innerHeight),
	}
	const { offset: moveOffset, listeners, isMoving, resetOffset } = useMove(
		calculateOffsetLimit(-1, limitedInitialOffset.x, outerWidth, innerWidth),
		calculateOffsetLimit(1, limitedInitialOffset.x, outerWidth, innerWidth),
		calculateOffsetLimit(-1, limitedInitialOffset.y, outerHeight, innerHeight),
		calculateOffsetLimit(1, limitedInitialOffset.y, outerHeight, innerHeight),
	)

	React.useEffect(() => {
		resetOffset()
	}, [player && player.position])

	const fieldsDistanceToStart = React.useMemo(
		() =>
			fields.map((_, i) => {
				const position = indexToPosition(i)
				return (
					Math.abs(startPosition.x - position.x) +
					Math.abs(startPosition.y - position.y)
				)
			}),
		[fields, startPosition, indexToPosition],
	)

	return (
		<div
			{...listeners}
			style={{
				['--width' as any]: width,
				['--height' as any]: height,
				['--scale' as any]: scale,
				['--offset-x' as any]: Math.round(
					limitedInitialOffset.x + moveOffset.x,
				),
				['--offset-y' as any]: Math.round(
					limitedInitialOffset.y + moveOffset.y - controlsHeight / 2,
				),
				['--allowTransitions' as any]: allowTransitions && !isMoving ? 1 : 0,
			}}
			className={s.board}
		>
			<div className={s.outer} ref={outerRef}>
				<div className={s.inner} ref={innerRef}>
					<div className={s.fields}>
						{fields.map((field, i) => {
							const position = indexToPosition(i)

							return (
								<Field
									key={i}
									isVisited={
										player &&
										player.position.x === position.x &&
										player.position.y === position.y
									}
									isWall={'isWall' in field}
									isTask={'isTask' in field}
									isFinish={'isFinish' in field}
									isEmpty={'isEmpty' in field}
									distanceToStart={fieldsDistanceToStart[i]}
								>
									{'isTask' in field && field['label']}
								</Field>
							)
						})}
					</div>
					<div className={s.meta}>
						{Object.entries(otherPlayers).map(([id, position]) => (
							<MetaObject key={id} position={position}>
								<OtherPlayer />
							</MetaObject>
						))}
						{player && (
							<MetaObject position={player.position}>
								<Player />
							</MetaObject>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
