import { defineConfig } from "vite"
import { viteSingleFile } from "vite-plugin-singlefile"
import json5Plugin from 'vite-plugin-json5';

export default defineConfig({
	plugins: [viteSingleFile(), json5Plugin()],
	base: '/GToH-4/',
	server: {
		host: true
	}
})