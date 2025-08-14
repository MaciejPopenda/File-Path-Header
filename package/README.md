# file-path-header

**file-path-header** is a Node.js CLI tool that prepends a comment containing the file's relative path at the top of supported source files.  
It’s especially useful for large projects, code reviews, and moving files between directories — the path header automatically updates when the file is moved.

## ✨ Features
- Adds a comment with the file’s relative path at the top of each supported file.
- Detects moved/renamed files and automatically updates the comment.
- Supports multiple comment styles (`//` and `#`) depending on file type.
- Respects `.gitignore` rules to skip irrelevant files.
- Can be used as a Git pre-commit hook to keep paths up to date.

## 🛠 Supported languages & comment styles

| Comment Style | Extensions |
|---------------|------------|
| `//`          | `.js`, `.ts`, `.jsx`, `.tsx`, `.java`, `.c`, `.cpp`, `.cs`, `.go`, `.rs`, `.php`, `.swift`, `.kt`, `.m`, `.scala` |
| `#`           | `.py`, `.sh`, `.rb`, `.pl` |

## 🚫 Files ignored
The tool automatically ignores:
- `node_modules/`
- `.git/`
- `dist/`, `build/`
- `.vscode/`, `.idea/`
- `.DS_Store`, `Thumbs.db`
- Temporary/cache files (`*.tmp`, `*.cache`, `*.log`)
- Any patterns listed in your `.gitignore`

## 📦 Installation
```bash
npm install -g file-path-header
```