import React from 'react'
import useWebSocket from 'react-use-websocket'
import { Position } from '../components/Level'

export function usePlayerPositions(
	levelId: string,
	localPlayerPosition: Position,
) {
	const { sendJsonMessage, lastJsonMessage } = useWebSocket(
		`wss://math-maze-positions.herokuapp.com/level/${encodeURIComponent(
			levelId,
		)}.ws`,
	)

	const [otherPlayers, setOtherPlayers] = React.useState<{
		[id: string]: Position
	}>({})

	React.useEffect(() => {
		sendJsonMessage({
			position: localPlayerPosition,
		})
	}, [localPlayerPosition])

	React.useEffect(() => {
		if (!lastJsonMessage) {
			return
		}
		const {
			id,
			position,
			left,
		}: {
			id: string
			position?: Position
			left?: true
		} = lastJsonMessage

		const newOtherPlayers = { ...otherPlayers }

		if (position) {
			newOtherPlayers[id] = position
		}
		if (left) {
			delete newOtherPlayers[id]
		}

		setOtherPlayers(newOtherPlayers)
	}, [lastJsonMessage])

	return otherPlayers
}
