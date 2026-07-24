import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, type PluginOption } from 'vite';

// Workaround for Svelte 5 HMR bug (sveltejs/svelte#17483):
// first_child_getter is undefined on soft reload with SSR hydration.
// Force full-page reloads instead of partial HMR updates.
const fullReloadAlways: PluginOption = {
	name: 'full-reload-always',
	handleHotUpdate({ server }) {
		server.ws.send({ type: 'full-reload' });
		return [];
	}
};

export default defineConfig({
	plugins: [sveltekit(), fullReloadAlways]
});
