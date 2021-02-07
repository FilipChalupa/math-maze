import React from 'react'
import s from './Player.module.css'
import { usePlayerCharacter } from './PlayerCharacterSelector'

interface PlayerProps {}

export const Player: React.FunctionComponent<PlayerProps> = ({}) => {
	const character = usePlayerCharacter()
	return <div className={s.player}>{character}</div>
}
