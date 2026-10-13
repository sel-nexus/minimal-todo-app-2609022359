import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

/** Configure Vite and the browser-like environment used by component tests. */
export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/**/*.test.{js,jsx}'],
    environment: 'jsdom',
    setupFiles: [],
    clearMocks: true,
    restoreMocks: true,
  },
});
