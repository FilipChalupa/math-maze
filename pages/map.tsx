import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { Game } from '../components/Game'
import styles from '../styles/Home.module.css'

const parseSeedFromQueryParameter = (raw: string) => {
	const data = {
		x: 'yyy',
	}
	return {
		...data,
		hash: '@TODO hash(data)',
	}
}

export type Seed = ReturnType<typeof parseSeedFromQueryParameter>

export default function Map() {
	const router = useRouter()
	const { s } = router.query
	const mapSeed = React.useMemo(() => {
		return parseSeedFromQueryParameter(
			(() => {
				if (typeof s === 'string') {
					return s
				}
				return ''
			})(),
		)
	}, [s])

	return (
		<div className={styles.container}>
			Název
			<Game seed={mapSeed} />
		</div>
	)
}
