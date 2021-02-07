import React from 'react'
import { Map as MapInner } from '../components/Map'
import { useQueryParameter } from '../utils/useQueryParameter'

export default function Map() {
	const id = useQueryParameter('i')

	return id.isLoading ? null : <MapInner seedId={id.value} />
}
