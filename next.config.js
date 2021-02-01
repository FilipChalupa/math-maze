const withPWA = require('next-pwa')

module.exports = (phase, { defaultConfig }) => {
	const buildId = `${Date.now()}`
	const generateBuildId = async () => {
		return buildId
	}
	return withPWA({
		generateBuildId, // Z nějakého důvodu defaultConfig.generateBuildId začal vracet null
		pwa: {
			dest: 'public',
			additionalManifestEntries: ['/', '/map', '/collection', '/offline'].map(
				(url) => ({
					url,
					revision: buildId,
				}),
			),
			dontCacheBustURLsMatching: /^\/_next\/static\/.*/i,
			skipWaiting: false,
			register: false,
			swSrc: 'utils/serviceWorker.ts',
		},
	})
}
