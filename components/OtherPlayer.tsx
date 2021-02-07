import React from 'react'
import s from './OtherPlayer.module.css'
import { characterIndexToCharacter } from './PlayerCharacterSelector'

interface OtherPlayerProps {
	characterIndex: number
}

export const OtherPlayer: React.FunctionComponent<OtherPlayerProps> = ({
	characterIndex,
}) => {
	const character = React.useMemo(
		() => characterIndexToCharacter(characterIndex),
		[characterIndex],
	)

	return <div className={s.otherPlayer}>{character}</div>
}
