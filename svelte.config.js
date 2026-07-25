import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
		prerender: {
			entries: ['*']
		},
		// Set BASE_PATH env variable when building for a subdirectory.
		// Example: BASE_PATH=/mon-article npm run build
		// Leave unset (or empty) for root deployment.
		paths: {
			base: process.env.BASE_PATH ?? '',
			relative: false
		}
	}
};

export default config;
