import { skipWaiting } from 'workbox-core'
import { matchPrecache, precacheAndRoute } from 'workbox-precaching'
import { registerRoute, setCatchHandler } from 'workbox-routing'
import {
	CacheFirst,
	NetworkFirst,
	StaleWhileRevalidate,
} from 'workbox-strategies'

addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		skipWaiting()
	}
})

const manifest = (self as any).__WB_MANIFEST
const FALLBACK_HTML_URL = '/offline'

precacheAndRoute(manifest, {
	ignoreURLParametersMatching: [
		/^s$/, // ?s= Map seed used to generate map on client side
	],
})

registerRoute(
	/^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
	new CacheFirst({ cacheName: 'google-fonts' }),
)

registerRoute(
	/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
	new StaleWhileRevalidate({ cacheName: 'fonts' }),
)

registerRoute(({ request }) => {
	return request.destination === 'style'
}, new StaleWhileRevalidate({ cacheName: 'styles' }))

registerRoute(({ request }) => {
	return request.destination === 'script'
}, new StaleWhileRevalidate({ cacheName: 'scripts' }))

registerRoute(({ request }) => {
	return request.destination === 'image'
}, new StaleWhileRevalidate({ cacheName: 'images' }))

registerRoute(({ request }) => {
	return request.destination === 'document'
}, new NetworkFirst({ cacheName: 'documents' }))

registerRoute(/\.(?:json|xml|csv)$/i, new NetworkFirst({ cacheName: 'data' }))

registerRoute(/\/api\/.*$/i, new NetworkFirst({ cacheName: 'apis' }))

registerRoute(/.*/i, new NetworkFirst({ cacheName: 'others' }))

// @ts-ignore
setCatchHandler(({ event }) => {
	if (event.request.destination === 'document') {
		return matchPrecache(FALLBACK_HTML_URL)
	}
	return Response.error()
})
