// create_structure.js
import fs from 'fs';
import path from 'path';

const baseFolder = process.cwd(); // current working directory

const projectStructure = {
  tests: {
    'test_login.js': "test('login test', () => { expect(true).toBe(true); });\n"
  },
  pages: {
    'login_page.js': "export class LoginPage {}\n"
  },
  utils: {
    'helper.js': "export function sayHello() { console.log('Hello from helper!'); }\n"
  },
  config: {
    'settings.js': "export const BASE_URL = 'https://example.com';\n"
  },
  '': {
    'playwright.config.js': "// Playwright config\n",
    'package.json': JSON.stringify({
      name: 'cmp-project',
      version: '1.0.0',
      scripts: { test: 'npx playwright test' },
      dependencies: {},
    }, null, 2),
    'README.md': '# CMP Project\nThis is a Playwright + JS test framework.'
  }
};

function createStructure(basePath, structure) {
  for (const [folder, files] of Object.entries(structure)) {
    const folderPath = path.join(basePath, folder);
    fs.mkdirSync(folderPath, { recursive: true });

    for (const [filename, content] of Object.entries(files)) {
      const filePath = path.join(folderPath, filename);
      fs.writeFileSync(filePath, content, 'utf-8');
    }
  }
}

// 🚀 Main Execution
createStructure(baseFolder, projectStructure);
console.log(`✅ Folder and file structure created successfully inside: ${baseFolder}`);
