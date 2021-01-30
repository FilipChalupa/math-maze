import React from 'react'
import s from './LevelStats.module.css'

export interface LevelStatsProps {}

export const LevelStats: React.FunctionComponent<LevelStatsProps> = ({}) => {
	return <div className={s.levelStats}>stats</div>
}
