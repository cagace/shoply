import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/shoply/', // repo adın neyse bunu birebir yaz; büyük-küçük harf önemli!
})
