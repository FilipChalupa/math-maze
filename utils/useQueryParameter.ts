import { useRouter } from 'next/router'
import React from 'react'

export function useQueryParameter(name: string) {
	const [value, setValue] = React.useState<{
		isLoading: boolean
		value: string
	}>({
		isLoading: true,
		value: '',
	})
	const router = useRouter()
	const rawValue = router.query[name]

	React.useEffect(() => {
		if (router.isReady) {
			setValue({
				value: typeof rawValue === 'string' ? rawValue : '',
				isLoading: false,
			})
		}
	}, [rawValue, router])

	return value
}
