import { useStorageBackedState } from 'use-storage-backed-state'

export function useIsLevelFinished(id: string) {
	return useStorageBackedState(false, `level-finished-${id}`)
}
