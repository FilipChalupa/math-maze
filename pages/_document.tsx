// Fixes FOUC: https://github.com/mui-org/material-ui/blob/master/examples/nextjs/pages/_document.js

import { ServerStyleSheets } from '@material-ui/core/styles'
import Document, { Head, Html, Main, NextScript } from 'next/document'
import React from 'react'
import { themeColor } from '../components/ThemeProvider'

export default class MyDocument extends Document {
	render() {
		return (
			<Html lang="cs">
				<Head>
					<meta name="theme-color" content={themeColor} />
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/icon?family=Material+Icons"
					/>
					<link
						rel="stylesheet"
						href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap"
					/>
					<link
						rel="apple-touch-icon"
						sizes="180x180"
						href="/icon/apple-touch-icon.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="32x32"
						href="/icon/favicon-32x32.png"
					/>
					<link
						rel="icon"
						type="image/png"
						sizes="16x16"
						href="/icon/favicon-16x16.png"
					/>
					<link rel="manifest" href="/icon/site.webmanifest" />
					<link
						rel="mask-icon"
						href="/icon/safari-pinned-tab.svg"
						color="#5bbad5"
					/>
					<link rel="shortcut icon" href="/favicon.ico" />
					<meta name="msapplication-TileColor" content="#da532c" />
					<meta name="msapplication-config" content="/icon/browserconfig.xml" />
					<link rel="icon" type="image/svg+xml" href="/icon.svg" />
					<meta name="theme-color" content="#ffffff" />
				</Head>
				<body>
					<Main />
					<NextScript />
				</body>
			</Html>
		)
	}
}

MyDocument.getInitialProps = async (ctx) => {
	const sheets = new ServerStyleSheets()
	const originalRenderPage = ctx.renderPage

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App) => (props) => sheets.collect(<App {...props} />),
		})

	const initialProps = await Document.getInitialProps(ctx)

	return {
		...initialProps,
		styles: [
			...React.Children.toArray(initialProps.styles),
			sheets.getStyleElement(),
		],
	}
}
