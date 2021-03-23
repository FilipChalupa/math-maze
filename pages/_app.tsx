import { AppProps } from 'next/app'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import React from 'react'
import { Layout } from '../components/Layout'
import { ThemeProvider } from '../components/ThemeProvider'
import '../styles/globals.css'
import '../styles/hidingHeader.css'
import { trackPageview } from '../utils/googleAnalytics'

function MyApp({ Component, pageProps }: AppProps) {
	const router = useRouter()

	React.useEffect(() => {
		const handleRouteChange = (url: URL) => {
			trackPageview(url)
		}
		router.events.on('routeChangeComplete', handleRouteChange)
		return () => {
			router.events.off('routeChangeComplete', handleRouteChange)
		}
	}, [router.events])

	return (
		<ThemeProvider>
			<Layout>
				<Head>
					<title>Matematické bludiště</title>
					<meta
						name="description"
						content="Procvič si sčítání, odčítání, násobení a dělení v bludišti. Vyřeš příklad a posuň se na další políčko."
					/>
				</Head>
				<Component {...pageProps} />
			</Layout>
		</ThemeProvider>
	)
}

export default MyApp
