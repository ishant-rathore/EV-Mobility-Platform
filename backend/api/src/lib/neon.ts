import { createClient } from '@neondatabase/neon-js';
import { BetterAuthReactAdapter } from '@neondatabase/neon-js/auth/react/adapters';

export const neon = createClient({
  auth: {
    url: process.env.VITE_NEON_AUTH_URL || 'http://localhost:3000',
    adapter: BetterAuthReactAdapter(),
  },
  dataApi: {
    url: process.env.VITE_NEON_DATA_API_URL || 'http://localhost:3000',
  },
});