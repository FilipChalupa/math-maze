import { useRouter } from 'next/dist/client/router'
import dynamic from 'next/dynamic'
import React from 'react'
import { MapProps } from '../components/Map'

const MapComponentWithNoSSR = dynamic<MapProps>(
	() => import('../components/Map').then((mod) => mod.Map),
	{ ssr: false },
)

export default function Map() {
	const router = useRouter()
	const { i } = router.query
	const id = typeof i === 'string' ? i : ''

	return <MapComponentWithNoSSR seedId={id} />
}
