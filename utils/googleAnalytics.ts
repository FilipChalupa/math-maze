// Based on: https://medium.com/frontend-digest/using-nextjs-with-google-analytics-and-typescript-620ba2359dea

export const GA_TRACKING_ID = 'G-SWQFH87Z1F'

export const trackPageview = (url: URL) => {
	;(window as any).gtag('config', GA_TRACKING_ID, {
		page_path: url,
	})
}

type GTagEvent = {
	action: string
	category: string
	label: string
	value: number
}

export const trackEvent = ({ action, category, label, value }: GTagEvent) => {
	;(window as any).gtag('event', action, {
		event_category: category,
		event_label: label,
		value: value,
	})
}
