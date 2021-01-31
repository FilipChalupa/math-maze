importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js',
)

workbox.loadModule('workbox-precaching')
workbox.loadModule('workbox-strategies')

workbox.precaching.precacheAndRoute([])

addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		skipWaiting()
	}
})
