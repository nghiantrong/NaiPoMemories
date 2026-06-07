const fs = require('fs');
const path = require('path');

function findClosingBrace(text, startPos) {
  let depth = 0;
  for (let i = startPos; i < text.length; i++) {
    if (text[i] === '{') depth++;
    else if (text[i] === '}') {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDirectory(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      if (file.endsWith('.styles.ts')) continue;
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  const styleMatch = content.match(/const\s+styles\s*=\s*StyleSheet\.create\s*\(\s*\{/);
  if (!styleMatch) return;

  const startIdx = styleMatch.index;
  const objectStartIdx = content.indexOf('{', startIdx);
  const objectEndIdx = findClosingBrace(content, objectStartIdx);
  
  if (objectEndIdx === -1) {
    console.error(`Could not find closing brace in ${filePath}`);
    return;
  }

  // Find the end of the `);`
  let endOfStatement = content.indexOf(';', objectEndIdx);
  if (endOfStatement === -1) endOfStatement = objectEndIdx + 1;
  else endOfStatement += 1;

  const styleBlock = content.substring(startIdx, endOfStatement);
  
  // Extract dependencies used inside the style block
  const imports = new Set();
  imports.add(`import { StyleSheet } from 'react-native';`);

  if (styleBlock.includes('colors.')) imports.add(`import { colors } from '@/theme/colors';`);
  if (styleBlock.includes('typography.')) imports.add(`import { typography } from '@/theme/typography';`);
  if (styleBlock.includes('spacing.')) imports.add(`import { spacing } from '@/theme/spacing';`);
  if (styleBlock.includes('borderRadius.')) imports.add(`import { borderRadius } from '@/theme/spacing';`);
  if (styleBlock.includes('shadows.')) imports.add(`import { shadows } from '@/theme/shadows';`);
  
  let hasReactNativeCore = false;
  let rnImports = [];
  if (styleBlock.includes('Dimensions.')) rnImports.push('Dimensions');
  if (styleBlock.includes('Platform.')) rnImports.push('Platform');
  
  if (rnImports.length > 0) {
    imports.add(`import { StyleSheet, ${rnImports.join(', ')} } from 'react-native';`);
    imports.delete(`import { StyleSheet } from 'react-native';`); // Replace with combined
  }

  const newStyleContent = Array.from(imports).join('\n') + '\n\nexport ' + styleBlock + '\n';
  
  const dir = path.dirname(filePath);
  const ext = path.extname(filePath);
  const baseName = path.basename(filePath, ext);
  const styleFileName = `${baseName}.styles.ts`;
  const styleFilePath = path.join(dir, styleFileName);

  fs.writeFileSync(styleFilePath, newStyleContent, 'utf8');
  console.log(`Created ${styleFilePath}`);

  // Replace block in original file
  let newContent = content.substring(0, startIdx) + content.substring(endOfStatement);
  
  // Remove unused StyleSheet import from original file if it's not used elsewhere
  if (!newContent.includes('StyleSheet.') && !newContent.match(/\bStyleSheet\b(?!\s+from)/)) {
    // Basic regex to remove StyleSheet from import { ... } from 'react-native'
    newContent = newContent.replace(/,\s*StyleSheet\b|\bStyleSheet\s*,\s*|\bStyleSheet\b/, '');
    // If import { } is left empty, cleanup
    newContent = newContent.replace(/import\s*\{\s*\}\s*from\s*['"]react-native['"];\n?/, '');
  }

  // Add the new import to the original file
  const importStatement = `import { styles } from './${baseName}.styles';\n`;
  // Add after the last import
  const lastImportIdx = newContent.lastIndexOf('import ');
  if (lastImportIdx !== -1) {
    const endOfLastImport = newContent.indexOf('\n', lastImportIdx) + 1;
    newContent = newContent.substring(0, endOfLastImport) + importStatement + newContent.substring(endOfLastImport);
  } else {
    newContent = importStatement + newContent;
  }

  fs.writeFileSync(filePath, newContent.trim() + '\n', 'utf8');
  console.log(`Updated ${filePath}`);
}

processDirectory(path.join(__dirname, '../src'));
console.log('Extraction complete.');
