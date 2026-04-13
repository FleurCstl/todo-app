/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import devServer from '@hono/vite-dev-server'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    devServer({
      entry: 'src/server/index.ts',
      exclude: [
        /^\/(client|src|node_modules|@vite|@react-refresh|index\.html|main\.tsx).*/,
        /^\/$/,
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': '/src/client',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    globals: true,
  },
})
