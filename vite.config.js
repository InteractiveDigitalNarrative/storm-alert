import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execSync } from 'node:child_process'
import process from 'node:process'

// Game version for research data = current git commit (short). 'dev' if git
// isn't available.
try {
  process.env.VITE_GAME_VERSION ||= execSync('git rev-parse --short HEAD').toString().trim()
} catch {
  process.env.VITE_GAME_VERSION ||= 'dev'
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/storm-alert/',
})
