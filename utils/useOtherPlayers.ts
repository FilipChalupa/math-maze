import React from 'react'
import useWebSocket from 'react-use-websocket'
import { Position } from '../components/Level'
import { useStoredPlayerCharacterIndex } from '../components/PlayerCharacterSelector'

const positionsServer = process.env.NEXT_PUBLIC_POSITIONS_SERVER!

export function useOtherPlayers(
	levelId: string,
	localPlayerPosition: Position,
) {
	const [localPlayerCharacterIndex] = useStoredPlayerCharacterIndex()
	const { sendJsonMessage, lastJsonMessage } = useWebSocket(
		`${positionsServer}/level/${encodeURIComponent(levelId)}.ws`,
	)

	const [otherPlayers, setOtherPlayers] = React.useState<{
		[id: string]: { position: Position; characterIndex: number }
	}>({})

	React.useEffect(() => {
		sendJsonMessage({
			position: localPlayerPosition,
			characterIndex: localPlayerCharacterIndex,
		})
	}, [localPlayerPosition])

	React.useEffect(() => {
		if (!lastJsonMessage) {
			return
		}
		const {
			id,
			position,
			characterIndex,
			left,
		}: {
			id: unknown
			position?: Position
			characterIndex?: unknown
			left?: unknown
		} = lastJsonMessage

		if (typeof id !== 'string') {
			return
		}

		const newOtherPlayers = { ...otherPlayers }

		if (position && typeof characterIndex === 'number') {
			newOtherPlayers[id] = {
				position,
				characterIndex,
			}
		}
		if (typeof left === 'boolean' && left) {
			delete newOtherPlayers[id]
		}

		setOtherPlayers(newOtherPlayers)
	}, [lastJsonMessage])

	return otherPlayers
}
