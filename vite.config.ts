import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Vercel deploys at root — no subpath needed
  base: '/',

  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  // Strip console.log and debugger in production
  esbuild: {
    drop: ['debugger'],
    legalComments: 'none',
  },

  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    cssTarget: 'chrome80',
    // Split vendor & app code for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-gsap': ['gsap'],
          'vendor-three': ['three'],
          'vendor-motion': ['motion'],
        },
      },
    },
    // Use esbuild for minification (built-in, no extra deps)
    minify: 'esbuild',
    // Increase chunk size warning limit (Three.js is inherently large)
    chunkSizeWarningLimit: 500,
    // Asset inlining threshold for small assets
    assetsInlineLimit: 4096,
    // Source maps for debugging (disable in real prod with false)
    sourcemap: false,
  },
})
