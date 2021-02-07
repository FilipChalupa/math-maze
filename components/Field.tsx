import clsx from 'clsx'
import React from 'react'
import Reward, { RewardElement } from 'react-rewards'
import s from './Field.module.css'

interface FieldProps {
	isVisited?: boolean
	isWall?: boolean
	isTask?: boolean
	isFinish?: boolean
	isEmpty?: boolean
	distanceToStart: number
}

export const Field: React.FunctionComponent<FieldProps> = ({
	isVisited,
	isWall,
	isTask,
	isFinish,
	isEmpty,
	distanceToStart,
	children,
}) => {
	return (
		<div
			className={clsx(
				s.field,
				isVisited && s.isVisited,
				isWall && s.isWall,
				isTask && s.isTask,
				isFinish && s.isFinish,
				isEmpty && s.isEmpty,
			)}
			style={{
				['--distance-to-start' as any]: distanceToStart,
			}}
		>
			{isFinish ? (
				<InnerFinishField isVisited={isVisited}>{children}</InnerFinishField>
			) : (
				<div className={s.content}>{children}</div>
			)}
		</div>
	)
}

const InnerFinishField: React.FunctionComponent<{ isVisited?: boolean }> = ({
	isVisited = false,
}) => {
	const ref = React.useRef<RewardElement>(null)

	React.useEffect(() => {
		if (isVisited) {
			window.setTimeout(() => {
				if (
					ref.current &&
					!window.matchMedia('(prefers-reduced-motion: reduce)').matches
				) {
					ref.current.rewardMe()
				}
			}, 300)
		}
	}, [isVisited])

	return (
		<>
			<div className={s.content}>🏁</div>
			<div className={s.finishConfetti}>
				<Reward ref={ref} type="confetti" config={{ springAnimation: false }}>
					<span />
				</Reward>
			</div>
		</>
	)
}
