import React from 'react'
import { Position } from '../components/Level'
import { clamp } from './clamp'

export function useMove(
	xLowerLimit: number,
	xUpperLimit: number,
	yLowerLimit: number,
	yUpperLimit: number,
) {
	const [offset, setOffset] = React.useState<Position>({ x: 0, y: 0 })
	const [
		pixelStartPosition,
		setPixelStartPosition,
	] = React.useState<null | Position>(null)

	const onPointerDown = React.useCallback(
		(event: React.PointerEvent<HTMLElement>) => {
			if (event.target instanceof HTMLElement) {
				event.target.setPointerCapture(event.pointerId)
			}
			setPixelStartPosition({
				x: event.clientX - offset.x,
				y: event.clientY - offset.y,
			})
		},
		[offset],
	)

	const onPointerUp = React.useCallback(
		(event: React.PointerEvent<HTMLElement>) => {
			if (event.target instanceof HTMLElement) {
				event.target.releasePointerCapture(event.pointerId)
			}
			setPixelStartPosition(null)
		},
		[],
	)

	const onPointerMove = React.useMemo(
		() =>
			pixelStartPosition
				? (event: React.PointerEvent<HTMLElement>) => {
						setOffset({
							x: clamp(
								xLowerLimit,
								event.clientX - pixelStartPosition.x,
								xUpperLimit,
							),
							y: clamp(
								yLowerLimit,
								event.clientY - pixelStartPosition.y,
								yUpperLimit,
							),
						})
				  }
				: undefined,
		[pixelStartPosition],
	)

	const resetOffset = React.useCallback(() => {
		setOffset({ x: 0, y: 0 })
	}, [])

	React.useEffect(() => {
		resetOffset()
	}, [xLowerLimit, xUpperLimit, yLowerLimit, yUpperLimit])

	return {
		offset,
		resetOffset,
		isMoving: pixelStartPosition !== null,
		listeners: { onPointerDown, onPointerUp, onPointerMove },
	}
}
