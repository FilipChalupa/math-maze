import React from 'react'
import s from './MetaObject.module.css'

interface MetaObjectProps {
	position: { x: number; y: number }
}

export const MetaObject: React.FunctionComponent<MetaObjectProps> = ({
	position,
	children,
}) => {
	const ref = React.useRef<HTMLDivElement>(null)

	const [targetPosition, setTargetPosition] = React.useState({ ...position })
	const [previousPixelPosition, setPreviousPixelPosition] = React.useState({
		x: 0,
		y: 0,
	})
	const [pixelOffset, setPixelOffset] = React.useState({ x: 0, y: 0 })
	const [isAnimating, setIsAnimating] = React.useState(false)

	const getPixelPosition = React.useCallback(() => {
		if (ref.current) {
			return {
				x: ref.current.offsetLeft,
				y: ref.current.offsetTop,
			}
		}
		return { x: 0, y: 0 }
	}, [ref])

	React.useEffect(() => {
		const previousPixelPosition = getPixelPosition()
		setPreviousPixelPosition(previousPixelPosition)
		setTargetPosition({ ...position })
	}, [position])

	React.useEffect(() => {
		const newPixelPosition = getPixelPosition()
		setIsAnimating(false)
		setPixelOffset({
			x: previousPixelPosition.x - newPixelPosition.x,
			y: previousPixelPosition.y - newPixelPosition.y,
		})
		requestAnimationFrame(() => {
			setIsAnimating(true)
			setPixelOffset({
				x: 0,
				y: 0,
			})
		})
	}, [targetPosition])

	return (
		<div
			ref={ref}
			style={{
				['--x' as any]: targetPosition.x,
				['--y' as any]: targetPosition.y,
				['--pixelOffset-x' as any]: pixelOffset.x,
				['--pixelOffset-y' as any]: pixelOffset.y,
				['--isAnimating' as any]: isAnimating ? 1 : 0,
			}}
			className={s.metaObject}
		>
			{children}
		</div>
	)
}
