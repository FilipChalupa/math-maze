import React from 'react'
import { Game, seedIdToSeed } from './Game'

export interface MapProps {
	seedId: string
}

export const Map: React.FunctionComponent<MapProps> = ({ seedId }) => {
	const seed = React.useMemo(() => seedIdToSeed(seedId), [seedId])

	return <Game seed={seed} />
}
