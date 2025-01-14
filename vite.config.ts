import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import raw from 'vite-raw-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), raw({
	fileRegex: /\.(csv)$/i,
  })],
  assetsInclude: ['**/*.csv'],
})
