import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: false
  },
  base: './' // ensures relative assets so it works in any HostGator subdirectory like /barber1/ or root /
});

