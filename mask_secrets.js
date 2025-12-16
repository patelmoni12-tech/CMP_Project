// mask_secrets.js
import fs from 'fs';
import path from 'path';

// Patterns to automatically redact common secrets
const PATTERNS = [
  { regex: /(LOGIN_USERNAME\s*=\s*['"])[^'"]+(['"])/gi, replace: '$1<REDACTED_EMAIL>$2' },
  { regex: /(LOGIN_PASSWORD\s*=\s*['"])[^'"]+(['"])/gi, replace: '$1<REDACTED_PASSWORD>$2' },
  { regex: /(BASE_URL\s*=\s*['"])[^'"]+(['"])/gi, replace: '$1https://<REDACTED_DOMAIN>$2' },
  { regex: /(api_key\s*[:=]\s*['"])[^'"]+(['"])/gi, replace: '$1<REDACTED_API_KEY>$2' },
  { regex: /(token\s*[:=]\s*['"])[^'"]+(['"])/gi, replace: '$1<REDACTED_TOKEN>$2' },
];

function maskFile(filePath) {
  let text = fs.readFileSync(filePath, 'utf-8');
  for (const { regex, replace } of PATTERNS) {
    text = text.replace(regex, replace);
  }

  const { dir, name, ext } = path.parse(filePath);
  const outputPath = path.join(dir, `${name}_for_ai${ext}`);
  fs.writeFileSync(outputPath, text, 'utf-8');
  console.log(`Redacted file saved as: ${outputPath}`);
}

// ---------------- CLI ----------------
const files = process.argv.slice(2);
if (files.length === 0) {
  console.log('Usage: node mask_secrets.js <file1> [file2 ...]');
  process.exit(1);
}

files.forEach(maskFile);
