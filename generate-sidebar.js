import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function generateSidebar(dir, basePath = '') {
    let sidebar = [];
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            // Recursively process subdirectories
            const nestedItems = generateSidebar(filePath, path.join(basePath, file));
            if (nestedItems.length > 0) {
                sidebar.push({
                    text: file,
                    collapsible: true,
                    items: nestedItems
                });
            }
        } else if (path.extname(file) === '.md' && file !== 'index.md') {
            // Add .md files to the sidebar
            sidebar.push({
                text: path.basename(file, '.md'),
                link: path.join('/', basePath, path.basename(file, '.md'))
            });
        }
    });

    return sidebar;
}

const sidebarConfig = generateSidebar(path.join(__dirname, 'docs'));
fs.writeFileSync(
    path.join(__dirname, 'docs', '.vitepress', 'sidebar.json'),
    JSON.stringify(sidebarConfig, null, 2)
);

console.log('Sidebar configuration generated successfully.');