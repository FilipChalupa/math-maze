import React from 'react'
import s from './OtherPlayer.module.css'

interface OtherPlayerProps {}

export const OtherPlayer: React.FunctionComponent<OtherPlayerProps> = ({}) => {
	return <div className={s.otherPlayer}>🐸</div>
}
