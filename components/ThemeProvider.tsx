import { createMuiTheme, useMediaQuery } from '@material-ui/core'
import deepPurple from '@material-ui/core/colors/deepPurple'
import lime from '@material-ui/core/colors/lime'
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles'
import * as React from 'react'

export const primaryColor = deepPurple
export const secondaryColor = lime
export const themeColor = primaryColor[500]

export const ThemeProvider: React.FunctionComponent = ({ children }) => {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
	const theme = React.useMemo(
		() =>
			createMuiTheme({
				palette: {
					type: prefersDarkMode ? 'dark' : 'light',
					primary: primaryColor,
					secondary: secondaryColor,
				},
			}),
		[prefersDarkMode],
	)

	return (
		<MuiThemeProvider theme={theme}>
			<style>{`
				:root {
					--global-themeColor: ${themeColor};
				}
			`}</style>
			{children}
		</MuiThemeProvider>
	)
}
