import {
	AppBar,
	Button,
	Container,
	Link,
	Toolbar,
	Typography,
} from '@material-ui/core'
import NextLink from 'next/link'
import React from 'react'
import { usePWAInstall } from 'react-use-pwa-install'
import { Workbox } from 'workbox-window'
import s from './Header.module.css'

export const Header: React.FunctionComponent = () => {
	const install = usePWAInstall()

	const wb = React.useMemo(
		() =>
			'navigator' in globalThis ? new Workbox('/service-worker.js') : null,
		[],
	)
	const [updateAvailable, setUpdateAvailable] = React.useState(false)
	const updateToNewVersion = React.useCallback(() => {
		if (wb) {
			wb.addEventListener('controlling', () => {
				window.location.reload()
			})
			wb.messageSkipWaiting()
		}
	}, [])

	React.useEffect(() => {
		if (wb) {
			wb.register()
			const promptNewVersionAvailable = () => setUpdateAvailable(true)
			wb.addEventListener('waiting', promptNewVersionAvailable)
			// @ts-ignore
			wb.addEventListener('externalwaiting', promptNewVersionAvailable)
			wb.register()
		}
	}, [])

	return (
		<AppBar position="static" color="primary">
			<Container disableGutters>
				<Toolbar>
					<div className={s.main}>
						<div>
							<NextLink href="/" passHref>
								<Link color="inherit" underline="none">
									<Typography variant="h5" className={s.titleContent}>
										<svg
											className={s.logo}
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="m2.666 0c-1.48 0-2.666 1.1993-2.666 2.666v18.668c0 1.4667 1.186 2.666 2.666 2.666h18.668c1.4667 0 2.666-1.1993 2.666-2.666v-18.668c0-1.4667-1.1993-2.666-2.666-2.666h-18.668zm13.572 5.2617c0.276 0 0.5 0.224 0.5 0.5 0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5c0-0.276 0.224-0.5 0.5-0.5zm-7.0625 0.37695 0.70898 0.70898-1.416 1.4141 1.4141 1.4141-0.70703 0.70703-1.4141-1.4141-1.4141 1.4141-0.70898-0.70703 1.4141-1.4141-1.4141-1.4141 0.70703-0.70703 1.416 1.4141 1.4141-1.416zm4.5625 1.623h5v1h-5v-1zm2.5 2c0.276 0 0.5 0.224 0.5 0.5 0 0.276-0.224 0.5-0.5 0.5s-0.5-0.224-0.5-0.5c0-0.276 0.224-0.5 0.5-0.5zm-8.9766 4.4766h1v2h2v1h-2v2h-1v-2h-2v-1h2v-2zm6.4766 1h5v1h-5v-1zm0 2h5v1h-5v-1z"
												fill="currentColor"
												strokeWidth="1.3333"
											/>
										</svg>
										<span className={s.titleShort}>Bludiště</span>
										<span className={s.titleLong}>Matematické bludiště</span>
									</Typography>
								</Link>
							</NextLink>
						</div>
						<div className={s.action}>
							{updateAvailable ? (
								<Button
									size="small"
									variant="outlined"
									color="inherit"
									onClick={updateToNewVersion}
								>
									Aktualizovat
								</Button>
							) : (
								install && (
									<Button
										size="small"
										variant="outlined"
										color="inherit"
										onClick={install}
									>
										Nainstalovat
									</Button>
								)
							)}
						</div>
					</div>
				</Toolbar>
			</Container>
		</AppBar>
	)
}
