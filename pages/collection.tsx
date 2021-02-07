import React from 'react'
import { Collection as CollectionInner } from '../components/Collection'
import { useQueryParameter } from '../utils/useQueryParameter'

export default function Collection() {
	const id = useQueryParameter('i')

	return id.isLoading ? null : <CollectionInner id={id.value} />
}
