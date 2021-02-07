import { NoSsr } from '@material-ui/core'
import { useRouter } from 'next/dist/client/router'
import React from 'react'
import { Collection as CollectionInner } from '../components/Collection'

export default function Collection() {
	const router = useRouter()
	const { i } = router.query
	const id = typeof i === 'string' ? i : ''

	return (
		<NoSsr>
			<CollectionInner id={id} />
		</NoSsr>
	)
}
