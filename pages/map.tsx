import { useRouter } from 'next/dist/client/router'
import dynamic from 'next/dynamic'
import React from 'react'
import { GameProps } from '../components/Game'
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

const GameComponentWithNoSSR = dynamic<GameProps>(
	() => import('../components/Game').then((mod) => mod.Game),
	{ ssr: false },
)

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
			<GameComponentWithNoSSR seed={mapSeed} />
		</div>
	)
}
