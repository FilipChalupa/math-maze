import { useRouter } from 'next/dist/client/router'
import dynamic from 'next/dynamic'
import Head from 'next/head'
import React from 'react'
import { GameProps } from '../components/Game'
import styles from '../styles/Home.module.css'

const parseSeedFromQueryParameter = (raw: string) => {
	const data = {
		x: 'yyy',
		raw,
	}

	return {
		...data,
		id: JSON.stringify(data),
	}
}

export type Seed = ReturnType<typeof parseSeedFromQueryParameter>

const GameComponentWithNoSSR = dynamic<GameProps>(
	() => import('../components/Game').then((mod) => mod.Game),
	{ ssr: false },
)

export default function Set() {
	const router = useRouter()
	const { i } = router.query
	const mapSeed = React.useMemo(() => {
		return parseSeedFromQueryParameter(
			(() => {
				if (typeof i === 'string') {
					return i
				}
				return ''
			})(),
		)
	}, [i])

	return (
		<div className={styles.container}>
			<Head>
				<title>Matematické bludiště</title>
			</Head>
			{/*Název*/}
			<GameComponentWithNoSSR seed={mapSeed} />
		</div>
	)
}
