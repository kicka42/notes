import { defineConfig } from 'vitepress'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Function to generate sidebar structure
function generateSidebar(dir) {
  const docsPath = path.resolve(__dirname, '..')
  
  function getItems(currentPath) {
    const items = []
    const files = fs.readdirSync(currentPath)
    
    // Sort files to ensure consistent ordering
    files.sort((a, b) => {
      // Put directories first
      const aIsDir = fs.statSync(path.join(currentPath, a)).isDirectory()
      const bIsDir = fs.statSync(path.join(currentPath, b)).isDirectory()
      if (aIsDir && !bIsDir) return -1
      if (!aIsDir && bIsDir) return 1
      return a.localeCompare(b)
    })

    files.forEach(file => {
      // Skip hidden files and specific directories
      if (file.startsWith('.') || ['node_modules', 'public', '.vitepress'].includes(file)) {
        return
      }

      const fullPath = path.join(currentPath, file)
      const stat = fs.statSync(fullPath)
      const relativePath = path.relative(docsPath, fullPath).replace(/\\/g, '/')
      
      if (stat.isDirectory()) {
        // Check if directory has index.md
        const hasIndex = fs.existsSync(path.join(fullPath, 'index.md'))
        
        if (hasIndex) {
          // Add as a file link
          items.push({
            text: file,
            link: `/${relativePath}/`
          })
        } else {
          // Get nested items
          const children = getItems(fullPath)
          if (children.length) {
            items.push({
              text: file,
              collapsed: true, // Makes folders collapsible
              items: children
            })
          }
        }
      } else if (file.endsWith('.md') && file !== 'index.md') {
        // Add regular markdown files
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

// Generate the sidebar
const autoSidebar = generateSidebar(path.resolve(__dirname, '..'))

// Merge with existing sidebar configuration if needed
let finalSidebar
try {
  const manualSidebar = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, 'sidebar.json'), 'utf-8')
  )
  // You can choose to merge autoSidebar with manualSidebar here if needed
  finalSidebar = autoSidebar // or implement custom merging logic
} catch (error) {
  // If sidebar.json doesn't exist or has issues, use auto-generated sidebar
  finalSidebar = autoSidebar
}

export default defineConfig({
  title: "Notes",
  description: "Digital Garden",
  base: '/notes/',
  publicDir: '../public',
  cleanUrls: true,
  themeConfig: {
    sidebar: finalSidebar,
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