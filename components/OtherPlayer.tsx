import React from 'react'
import s from './OtherPlayer.module.css'
import { playerCharacters } from './PlayerCharacterSelector'

interface OtherPlayerProps {
	characterIndex: number
}

export const OtherPlayer: React.FunctionComponent<OtherPlayerProps> = ({
	characterIndex,
}) => {
	return <div className={s.otherPlayer}>{playerCharacters[characterIndex]}</div>
}
