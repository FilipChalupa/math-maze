const withPWA = require('next-pwa')

module.exports = (phase, { defaultConfig }) =>
	withPWA({
		pwa: {
			dest: 'public',
			additionalManifestEntries: ['/', '/map', '/offline'].map((url) => ({
				url,
				revision: defaultConfig.generateBuildId(),
			})),
			navigateFallback: '/offline',
			ignoreURLParametersMatching: [
				/^s$/, // ?s= Map seed used to generate map on client side
			],
			dontCacheBustURLsMatching: /^\/_next\/static\/.*/i,
			register: false,
		},
	})
