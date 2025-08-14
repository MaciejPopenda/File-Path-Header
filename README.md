# File Path Header

A lightweight Node.js CLI tool that automatically adds file path comments to your source code files. Perfect for AI coding, documentation, and keeping track of file locations in large projects.

[![npm version](https://badge.fury.io/js/file-path-header.svg)](https://www.npmjs.com/package/file-path-header)
![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

## ✨ Why Use This?

- 🤖 **AI-Friendly**: Makes it easier for AI tools (ChatGPT, Claude, etc.) to understand your project structure
- 🔄 **Auto-Updates**: Automatically updates path comments when files are moved
- 🎯 **Smart Filtering**: Respects `.gitignore` rules and skips irrelevant files
- ⚡ **Zero Config**: Works out of the box with sensible defaults
- 🪝 **Git Integration**: Perfect for git hooks to keep paths synchronized

## 🚀 Quick Start

### Installation
```bash
npm install -g file-path-header
```

### Usage
Simply run in your project directory:
```bash
file-path-header
```

That's it! The tool will automatically find all supported source files and add path comments.

### Before & After

**Before:**
```javascript
import React from 'react';

function Header() {
  return <h1>Hello World</h1>;
}
```

**After:**
(assuming that the file is located in: `src/components/Header.js`)
```javascript
// src/components/Header.js
import React from 'react';

function Header() {
  return <h1>Hello World</h1>;
}
```

## 🎯 Perfect Combo with ASCII Tree Generator

For the ultimate project documentation setup, pair this with [`ascii-tree-generator`](https://www.npmjs.com/package/ascii-tree-generator):

```bash
# First, generate your project tree structure
npx ascii-tree-generator

# Then, add path headers to all source files
npx file-path-header
```

This combination gives AI tools (and developers) complete context about your project structure and individual file locations.

## 🛠 Supported Languages

| Comment Style | File Extensions |
|---------------|-----------------|
| `//` | `.js`, `.ts`, `.jsx`, `.tsx`, `.java`, `.c`, `.cpp`, `.cs`, `.go`, `.rs`, `.php`, `.swift`, `.kt`, `.m`, `.scala`|
| `#` | `.py`, `.sh`, `.rb`, `.pl` |

## 🚫 Smart File Filtering

The tool automatically respects your `.gitignore` files and also ignores common build/temporary directories:

- `node_modules/`, `.git/`
- `dist/`, `build/`
- `.vscode/`, `.idea/`
- System files (`.DS_Store`, `Thumbs.db`)
- Temporary files (`*.tmp`, `*.cache`, `*.log`)

## 🔄 How It Works

1. **Scans** your project for supported source files
2. **Respects** `.gitignore` rules and common ignore patterns
3. **Detects** existing path comments and updates them if files have moved
4. **Adds** clean, consistent path comments at the top of each file

### Smart Comment Handling
- ✅ Adds new comment if none exists
- ✅ Updates existing comment if file path changed
- ✅ Skips files that already have the correct comment
- ✅ Removes outdated path comments before adding new ones

## Git Integration

### Pre-commit Hook
Add to `.git/hooks/pre-commit`:
```bash
#!/bin/sh
# Change to the project root directory
cd "$(git rev-parse --show-toplevel)"

npx file-path-header
git add .
```

### Package.json Script
```json
{
  "scripts": {
    "paths": "file-path-header"
  }
}
```

Then run: `npm run paths`

## 📁 Example Output

After running the tool on a typical React project:

```javascript
// src/App.js
import React from 'react';
// ... rest of your code

// src/components/Header.jsx  
import React from 'react';
// ... component code

// src/utils/helpers.js
export const formatDate = (date) => {
// ... utility functions

// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
// ... custom hook
```

## 🚀 Use Cases

- **AI Coding**: Help AI understand your project structure
- **Code Reviews**: Quickly identify file locations in diffs
- **Large Projects**: Never lose track of where files are located
- **Refactoring**: Automatically update path comments when moving files
- **Documentation**: Generate consistent file headers across your project

## 🤝 Works Great With

- [**ascii-tree-generator**](https://www.npmjs.com/package/ascii-tree-generator) - Generate visual project structure
- **AI coding tools** - ChatGPT, Claude, GitHub Copilot, etc.
- **Git hooks** - Keep file paths in sync automatically
- **Documentation workflows** - Maintain consistent project documentation

## 🔧 Technical Details

- **Zero dependencies** - Lightweight and fast
- **Hierarchical .gitignore support** - Respects all `.gitignore` files in your project
- **Cross-platform** - Works on Windows, macOS, and Linux

## 📄 License

MIT License - feel free to use in your projects!

## 🔗 Links

- [npm package](https://www.npmjs.com/package/file-path-header)
- [GitHub repository](https://github.com/MaciejPopenda/file-path-header)
- [ascii-tree-generator](https://www.npmjs.com/package/ascii-tree-generator)

---

**Made with ❤️ by [Maciej Popenda](https://github.com/MaciejPopenda)**