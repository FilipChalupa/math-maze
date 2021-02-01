import React from 'react'
import { Game, seedIdToSeed } from './Game'

export interface MapProps {
	seedId: string
}

export const Map: React.FunctionComponent<MapProps> = ({ seedId }) => {
	return <Game seed={seedIdToSeed(seedId)} />
}
