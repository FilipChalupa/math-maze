import { useStorageBackedState } from 'use-storage-backed-state'

export function useIsCollectionFinished(id: string) {
	return useStorageBackedState(false, `collection-finished-${id}`)
}
