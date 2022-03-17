import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
// https://vitejs.dev/config/
export default defineConfig({
    plugins: [svelte()],
    //base: "agt2",
    build: {
        outDir: 'build',
    }
});
//# sourceMappingURL=vite.config.js.map