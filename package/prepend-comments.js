//prepend-comments.js
import fs from "fs";
import path from "path";
import { AsciiTreeGenerator } from "ascii-tree-generator";

// file extensions that support single-line `//` comments
const COMMENTABLE_EXTENSIONS = [
  ".js", ".ts", ".jsx", ".tsx", ".java", ".c", ".cpp", ".cs", ".go", ".rs", ".php", ".swift", ".kt", ".m", ".scala"
];

// modify files by prepending comment with relative path
function prependComment(filePath, relativePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const commentLine = `//${relativePath}\n`;
  
  if (content.trim().startsWith(commentLine)) {
    return; // already added
  }

  fs.writeFileSync(filePath, commentLine + content, "utf8");
  console.log(`Updated: ${relativePath}`);
}

function processDirectory(dirPath, generator, projectRoot) {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relativePath = path.relative(projectRoot, fullPath);
    const stats = fs.statSync(fullPath);

    if (!generator.shouldIncludeItem(item, relativePath, stats.isDirectory())) {
      continue;
    }

    if (stats.isDirectory()) {
      processDirectory(fullPath, generator, projectRoot);
    } else {
      const ext = path.extname(item).toLowerCase();
      if (COMMENTABLE_EXTENSIONS.includes(ext)) {
        prependComment(fullPath, relativePath);
      }
    }
  }
}

function main() {
  const generator = new AsciiTreeGenerator({});
  const projectRoot = process.cwd();
  processDirectory(projectRoot, generator, projectRoot);
}

main();
