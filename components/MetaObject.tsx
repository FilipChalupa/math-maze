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

	const getPixelPosition = React.useCallback(() => {
		const element = ref.current!
		const rect = element.getBoundingClientRect()
		return {
			x: rect.left,
			y: rect.top,
		}
	}, [ref])

	React.useLayoutEffect(() => {
		const element = ref.current!
		element.style.setProperty('--x', `${position.x}`)
		element.style.setProperty('--y', `${position.y}`)
	}, [])

	React.useLayoutEffect(() => {
		const element = ref.current!
		const previousPixelPosition = getPixelPosition()
		element.style.setProperty('--isAnimating', '0')
		element.style.setProperty('--pixelOffset-x', '0')
		element.style.setProperty('--pixelOffset-y', '0')
		element.style.setProperty('--x', `${position.x}`)
		element.style.setProperty('--y', `${position.y}`)
		const targetPixelPosition = getPixelPosition()
		const offset = {
			x: previousPixelPosition.x - targetPixelPosition.x,
			y: previousPixelPosition.y - targetPixelPosition.y,
		}
		element.style.setProperty('--pixelOffset-x', `${offset.x}`)
		element.style.setProperty('--pixelOffset-y', `${offset.y}`)
		requestAnimationFrame(() => {
			element.style.setProperty('--isAnimating', '1')
			element.style.setProperty('--pixelOffset-x', '0')
			element.style.setProperty('--pixelOffset-y', '0')
		})
	}, [position.x, position.y, getPixelPosition])

	return (
		<div ref={ref} className={s.metaObject}>
			{children}
		</div>
	)
}
