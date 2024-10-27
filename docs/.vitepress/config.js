import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function generateSidebar(dir) {
  const docsPath = path.resolve(__dirname, '..')
  
  function getItems(currentPath) {
    const items = []
    const files = fs.readdirSync(currentPath)
    
    files.sort((a, b) => {
      const aIsDir = fs.statSync(path.join(currentPath, a)).isDirectory()
      const bIsDir = fs.statSync(path.join(currentPath, b)).isDirectory()
      if (aIsDir && !bIsDir) return -1
      if (!aIsDir && bIsDir) return 1
      return a.localeCompare(b)
    })

    files.forEach(file => {
      if (file.startsWith('.') || ['node_modules', 'public', '.vitepress'].includes(file)) {
        return
      }

      const fullPath = path.join(currentPath, file)
      const stat = fs.statSync(fullPath)
      const relativePath = path.relative(docsPath, fullPath).replace(/\\/g, '/')
      
      if (stat.isDirectory()) {
        const hasIndex = fs.existsSync(path.join(fullPath, 'index.md'))
        const children = getItems(fullPath)
        
        if (hasIndex) {
          // Create a group with the index page as first item
          items.push({
            text: file,
            collapsed: true,
            items: [
              {
                text: 'Overview', // or 'Index' or whatever text you prefer
                link: `/${relativePath}/`
              },
              ...children // Spread the other files in the directory
            ]
          })
        } else if (children.length) {
          items.push({
            text: file,
            collapsed: true,
            items: children
          })
        }
      } else if (file.endsWith('.md') && file !== 'index.md') {
        items.push({
          text: file.replace('.md', ''),
          link: `/${relativePath.replace('.md', '')}`
        })
      }
    })
    
    return items
  }
  
  return getItems(dir)
}

const autoSidebar = generateSidebar(path.resolve(__dirname, '..'))

let finalSidebar
try {
  const manualSidebar = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'sidebar.json'), 'utf-8')
  )
  finalSidebar = autoSidebar
} catch (error) {
  finalSidebar = autoSidebar
}

export default defineConfig({
  title: "Notes",
  description: "Digital Garden",
  base: '/notes/',
  publicDir: '../public',
  cleanUrls: true,
  themeConfig: {
    sidebar: finalSidebar
  }
})