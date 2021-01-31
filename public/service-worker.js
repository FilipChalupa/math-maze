importScripts(
	'https://storage.googleapis.com/workbox-cdn/releases/6.0.2/workbox-sw.js',
)

addEventListener('message', (event) => {
	if (event.data && event.data.type === 'SKIP_WAITING') {
		skipWaiting()
	}
})
