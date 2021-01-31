import { skipWaiting } from 'workbox-core'
import { precacheAndRoute } from 'workbox-precaching'

addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		skipWaiting()
	}
})

const manifest = (self as any).__WB_MANIFEST

precacheAndRoute(manifest)
