import { NoSsr } from '@material-ui/core'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { Map as MapInner } from '../components/Map'

export default function Map() {
	const router = useRouter()
	const { i } = router.query
	const id = typeof i === 'string' ? i : ''

	return (
		<NoSsr>
			<MapInner seedId={id} />
		</NoSsr>
	)
}
