import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    // The engine tests are pure functions and need no database.
    globals: false,
  },
});
