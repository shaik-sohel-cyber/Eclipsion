import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'react-router-future-flags',
      config: () => ({
        define: {
          'process.env.REACT_ROUTER_FUTURE_FLAGS': JSON.stringify({
            v7_startTransition: true,
            v7_relativeSplatPath: true
          })
        }
      })
    }
  ]
});