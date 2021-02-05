import { useRouter } from 'next/dist/client/router'
import dynamic from 'next/dynamic'
import React from 'react'
import { CollectionProps } from '../components/Collection'

const CollectionWithNoSSR = dynamic<CollectionProps>(
	() => import('../components/Collection').then((mod) => mod.Collection),
	{ ssr: false },
)

export default function Collection() {
	const router = useRouter()
	const { i } = router.query
	const id = typeof i === 'string' ? i : ''

	return <CollectionWithNoSSR id={id} />
}
