import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'
import fs from 'fs'
import path from 'path'

const versionJson = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, './version.json'), 'utf8'),
) as { version?: string }

const config = defineConfig({
  define: {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(versionJson.version ?? '0.0.0.0'),
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  plugins: [
    devtools(),
    // this is the plugin that enables path aliases - must be before tanstackStart
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
})

export default config
