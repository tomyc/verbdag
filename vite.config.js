import { defineConfig } from 'vite';

// base './' – działa zarówno na GitHub Pages (podkatalog repo), jak i na Netlify/Vercel/Cloudflare Pages
export default defineConfig({
  base: './',
  esbuild: { jsx: 'transform', jsxFactory: 'React.createElement', jsxFragment: 'React.Fragment' },
});
