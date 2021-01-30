import React from 'react'
import { Position } from '../components/Level'

export function useMove() {
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
							x: event.clientX - pixelStartPosition.x,
							y: event.clientY - pixelStartPosition.y,
						})
				  }
				: undefined,
		[pixelStartPosition],
	)

	const resetOffset = React.useCallback(() => {
		setOffset({ x: 0, y: 0 })
	}, [])

	return {
		offset,
		resetOffset,
		isMoving: pixelStartPosition !== null,
		listeners: { onPointerDown, onPointerUp, onPointerMove },
	}
}
