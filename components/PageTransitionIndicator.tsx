import { LinearProgress } from '@material-ui/core'
import cn from 'clsx'
import { useRouter } from 'next/router'
import React from 'react'
import s from './PageTransitionIndicator.module.css'

export interface PageTransitionIndicatorProps {}

export const PageTransitionIndicator: React.FunctionComponent<PageTransitionIndicatorProps> = ({}) => {
	const router = useRouter()

	const [loading, setLoading] = React.useState(false)

	React.useEffect(() => {
		const handleStart = (url: string) => {
			if (url !== router.pathname) {
				setLoading(true)
			}
		}
		const handleComplete = () => {
			setLoading(false)
		}

		router.events.on('routeChangeStart', handleStart)
		router.events.on('routeChangeComplete', handleComplete)
		router.events.on('routeChangeError', handleComplete)

		return () => {
			router.events.off('routeChangeStart', handleStart)
			router.events.off('routeChangeComplete', handleComplete)
			router.events.off('routeChangeError', handleComplete)
		}
	}, [router])

	return (
		<div className={cn(s.pageTransitionIndicator, loading && s.isLoading)}>
			<LinearProgress color="primary" />
		</div>
	)
}
