import { AppProps } from 'next/app'
import { Layout } from '../components/Layout'
import { ThemeProvider } from '../components/ThemeProvider'
import '../styles/globals.css'
import '../styles/hidingHeader.css'

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider>
			<Layout>
				<Component {...pageProps} />
			</Layout>
		</ThemeProvider>
	)
}

export default MyApp
