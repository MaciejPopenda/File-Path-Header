// package\prepend-comments.js

import fs from "fs";
import path from "path";

// -----------------------
// Gitignore Handling Logic (extracted from ascii-tree-generator.js)
// -----------------------
const DEFAULT_IGNORE_PATTERNS = [
  "node_modules",
  ".git",
  "*.log",
  "dist",
  "build",
  ".vscode",
  ".idea",
  ".DS_Store",
  "Thumbs.db",
  "*.tmp",
  "*.cache"
];

const ALWAYS_IGNORE = [".git"];

class GitignoreHandler {
  constructor(options = {}) {
    this.options = {
      all: false,
      exceptDirs: [],
      exceptFiles: [],
      includePattern: null,
      excludePattern: null,
      debug: false,
      ...options
    };

    this.projectRoot = process.cwd();
    this.gitignoreFiles = this.findAllGitignores();
    this.includeRegex = this.createRegex(this.options.includePattern);
    this.excludeRegex = this.createRegex(this.options.excludePattern);
  }

  createRegex(pattern) {
    if (!pattern) return null;
    try {
      return new RegExp(pattern);
    } catch {
      return null;
    }
  }

  findAllGitignores() {
    if (this.options.all) {
      return this.createDefaultGitignoreStructure();
    }

    const files = [];
    this.findGitignoresRecursive(this.projectRoot, "", files);

    if (files.length === 0) {
      return this.createDefaultGitignoreStructure();
    }

    files.sort((a, b) => a.relativePath.length - b.relativePath.length);
    return files;
  }

  createDefaultGitignoreStructure() {
    const patterns = [...ALWAYS_IGNORE, ...DEFAULT_IGNORE_PATTERNS];
    patterns.push(...this.options.exceptDirs, ...this.options.exceptFiles);

    return [
      {
        absolutePath: this.projectRoot,
        relativePath: "",
        patterns: patterns.map((p) => ({
          pattern: p,
          isNegation: false
        }))
      }
    ];
  }

  findGitignoresRecursive(currentDir, relativePath, result) {
    try {
      const items = fs.readdirSync(currentDir);

      if (items.includes(".gitignore")) {
        const giPath = path.join(currentDir, ".gitignore");
        try {
          const content = fs.readFileSync(giPath, "utf8").trim();
          if (content.length > 0) {
            const patterns = this.parseGitignoreContent(content);

            if (relativePath === "") {
              patterns.unshift(...ALWAYS_IGNORE.map((p) => ({ pattern: p, isNegation: false })));
              patterns.push(
                ...[...this.options.exceptDirs, ...this.options.exceptFiles].map((p) => ({
                  pattern: p,
                  isNegation: false
                }))
              );
            }

            result.push({
              absolutePath: currentDir,
              relativePath,
              patterns
            });
          }
        } catch {}
      }

      for (const item of items) {
        const itemPath = path.join(currentDir, item);
        const itemRelPath = relativePath ? path.join(relativePath, item) : item;
        try {
          const stats = fs.statSync(itemPath);
          if (stats.isDirectory()) {
            if (ALWAYS_IGNORE.includes(item)) continue;
            if (this.isDirectoryIgnoredBySoFar(item, itemRelPath, result)) continue;
            this.findGitignoresRecursive(itemPath, itemRelPath, result);
          }
        } catch {}
      }
    } catch {}
  }

  parseGitignoreContent(content) {
    return content
      .split("\n")
      .map((line) => {
        line = line.trim();
        if (!line || line.startsWith("#")) return null;
        const isNegation = line.startsWith("!");
        if (isNegation) line = line.slice(1);
        if (line.endsWith("/")) line = line.slice(0, -1);
        if (line.startsWith("/")) line = line.slice(1);
        return { pattern: line, isNegation };
      })
      .filter(Boolean);
  }

  isDirectoryIgnoredBySoFar(itemName, relativePath, gitignoreFiles) {
    const itemDirectory = path.dirname(relativePath);
    const applicable = gitignoreFiles.filter((gi) =>
      this.isPathInDirectory(itemDirectory, gi.relativePath)
    );
    applicable.sort((a, b) => a.relativePath.length - b.relativePath.length);

    let ignored = false;
    for (const gi of applicable) {
      let relFromGi =
        gi.relativePath === "" ? relativePath : path.relative(gi.relativePath, relativePath);
      relFromGi = relFromGi.split(path.sep).join("/");
      for (const pat of gi.patterns) {
        if (this.matchesPattern(pat.pattern, itemName, relFromGi)) {
          ignored = pat.isNegation ? false : true;
        }
      }
    }
    return ignored;
  }

  matchesPattern(pattern, itemName, relativePath) {
    const normalizedPattern = pattern.split(path.sep).join("/");
    const normalizedRel = relativePath.split(path.sep).join("/");

    if (pattern.includes("*") || pattern.includes("?")) {
      const regex = new RegExp(
        "^" +
          normalizedPattern.replace(/\./g, "\\.").replace(/\*/g, ".*").replace(/\?/g, ".") +
          "$"
      );
      if (regex.test(itemName) || regex.test(normalizedRel)) return true;
      return normalizedRel.split("/").some((_, i, arr) =>
        regex.test(arr.slice(0, i + 1).join("/"))
      );
    }

    if (itemName === normalizedPattern || normalizedRel === normalizedPattern) return true;
    if (normalizedPattern.includes("/")) {
      return (
        normalizedRel.startsWith(normalizedPattern + "/") || normalizedRel === normalizedPattern
      );
    } else {
      return normalizedRel.split("/").includes(normalizedPattern);
    }
  }

  isPathInDirectory(itemPath, dirPath) {
    if (dirPath === "") return true;
    const normItem = itemPath.split(path.sep).join("/");
    const normDir = dirPath.split(path.sep).join("/");
    return normItem.startsWith(normDir + "/") || normItem === normDir;
  }

  shouldIgnore(itemName, relativePath) {
    const itemDirectory = path.dirname(relativePath);
    const applicable = this.gitignoreFiles.filter((gi) =>
      this.isPathInDirectory(itemDirectory, gi.relativePath)
    );
    applicable.sort((a, b) => a.relativePath.length - b.relativePath.length);

    let ignored = false;
    for (const gi of applicable) {
      let relFromGi =
        gi.relativePath === "" ? relativePath : path.relative(gi.relativePath, relativePath);
      relFromGi = relFromGi.split(path.sep).join("/");
      for (const pat of gi.patterns) {
        if (this.matchesPattern(pat.pattern, itemName, relFromGi)) {
          ignored = pat.isNegation ? false : true;
        }
      }
    }
    return ignored;
  }

  shouldIncludeByPatterns(itemName, relativePath, isDir) {
    const normalizedRel = relativePath.split(path.sep).join("/");
    if (isDir) {
      if (
        this.excludeRegex &&
        (this.excludeRegex.test(itemName) || this.excludeRegex.test(normalizedRel))
      )
        return false;
      return true;
    }
    if (
      this.excludeRegex &&
      (this.excludeRegex.test(itemName) || this.excludeRegex.test(normalizedRel))
    )
      return false;
    if (
      this.includeRegex &&
      !(this.includeRegex.test(itemName) || this.includeRegex.test(normalizedRel))
    )
      return false;
    return true;
  }

  shouldIncludeItem(itemName, relativePath, isDir) {
    if (this.shouldIgnore(itemName, relativePath)) return false;
    return this.shouldIncludeByPatterns(itemName, relativePath, isDir);
  }
}

// -----------------------
// Comment Prepending Logic
// -----------------------
const COMMENT_STYLES = {
  "//": [".js", ".ts", ".jsx", ".tsx", ".java", ".c", ".cpp", ".cs", ".go", ".rs", ".php", ".swift", ".kt", ".m", ".scala"],
  "#": [".py", ".sh", ".rb", ".pl"]
};

function getCommentPrefix(extension) {
  for (const [prefix, extensions] of Object.entries(COMMENT_STYLES)) {
    if (extensions.includes(extension)) {
      return prefix;
    }
  }
  return null;
}

function prependComment(filePath, relativePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const ext = path.extname(filePath).toLowerCase();
  const prefix = getCommentPrefix(ext);
  if (!prefix) return;

  const commentLine = `${prefix} ${relativePath}`;
  const lines = content.split("\n");

  if (lines.length > 0) {
    const firstLine = lines[0].trim();

    // If already correct, skip
    if (firstLine === commentLine) return;

    // If the first line contains the filename (case insensitive)
    const fileName = path.basename(filePath);
    if (firstLine.toLowerCase().includes(fileName.toLowerCase())) {
      // Remove old first line
      lines.shift();
    }
  }

  // Prepend correct comment line
  const newContent = [commentLine, ...lines].join("\n");
  fs.writeFileSync(filePath, newContent, "utf8");
  console.log(`Updated: ${relativePath}`);
}

function processDirectory(dirPath, gitHandler, projectRoot) {
  const items = fs.readdirSync(dirPath);
  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relativePath = path.relative(projectRoot, fullPath);
    const stats = fs.statSync(fullPath);
    if (!gitHandler.shouldIncludeItem(item, relativePath, stats.isDirectory())) continue;

    if (stats.isDirectory()) {
      processDirectory(fullPath, gitHandler, projectRoot);
    } else {
      const ext = path.extname(item).toLowerCase();
      if (getCommentPrefix(ext)) {
        prependComment(fullPath, relativePath);
      }
    }
  }
}

// -----------------------
// Main
// -----------------------
function main() {
  const gitHandler = new GitignoreHandler({});
  const projectRoot = process.cwd();
  processDirectory(projectRoot, gitHandler, projectRoot);
}

main();
