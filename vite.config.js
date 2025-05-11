import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'; // <-- novo plugin

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // <-- ativa o Tailwind
  ],
});
