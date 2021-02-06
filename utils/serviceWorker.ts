import { CacheableResponsePlugin } from 'workbox-cacheable-response'
import { skipWaiting } from 'workbox-core'
import { ExpirationPlugin } from 'workbox-expiration'
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
		/^i$/, // ?s= Map seed used to generate map on client side
		/^utm_source$/,
	],
})

registerRoute(
	({ url }) => url.origin === 'https://fonts.googleapis.com',
	new StaleWhileRevalidate({
		cacheName: 'google-fonts-stylesheets',
	}),
)

registerRoute(
	({ url }) => url.origin === 'https://fonts.gstatic.com',
	new CacheFirst({
		cacheName: 'google-fonts-webfonts',
		plugins: [
			new CacheableResponsePlugin({
				statuses: [0, 200],
			}),
			new ExpirationPlugin({
				maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
				maxEntries: 30,
			}),
		],
	}),
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
