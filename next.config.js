const withPWA = require('next-pwa')

const runtimeCaching = require('next-pwa/cache')
runtimeCaching[0].handler = 'StaleWhileRevalidate'

module.exports = (phase, { defaultConfig }) =>
	withPWA({
		pwa: {
			dest: 'public',
			additionalManifestEntries: ['/', '/map', '/offline'].map((url) => ({
				url,
				revision: defaultConfig.generateBuildId(),
			})),
			//navigateFallback: '/offline',
			/*ignoreURLParametersMatching: [
				/^s$/, // ?s= Map seed used to generate map on client side
			],*/
			dontCacheBustURLsMatching: /^\/_next\/static\/.*/i,
			skipWaiting: false,
			register: false,
			//runtimeCaching,
			swSrc: 'utils/serviceWorker.ts',
		},
	})
