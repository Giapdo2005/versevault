// vite.config.js
//
// Vite is our build tool — it compiles and serves our React code.
// This file configures it.

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // The react() plugin teaches Vite how to handle .jsx files
  // and enables React's fast-refresh (instant updates while coding).
  plugins: [react()],
})
