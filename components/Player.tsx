import React from 'react'
import s from './Player.module.css'

interface PlayerProps {}

export const Player: React.FunctionComponent<PlayerProps> = ({}) => {
	return <div className={s.player}>Player</div>
}
