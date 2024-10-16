import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Read the sidebar configuration
const sidebar = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'sidebar.json'), 'utf-8')
)

export default defineConfig({
  title: "Notes",
  description: "Digital Garden",
  base: '/notes/',
  publicDir: '../public', // Adjusted path
  cleanUrls: true, // Enables clean URLs by removing the .html extension
  themeConfig: {
    sidebar: sidebar,
    /*
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Examples', link: '/markdown-examples' }
    ],
    */

    /*socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
    */
  }
})