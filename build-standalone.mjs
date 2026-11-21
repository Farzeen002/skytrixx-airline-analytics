import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

const root = dirname(fileURLToPath(import.meta.url))
const css = readFileSync(join(root, 'src/style.css'), 'utf8')
const shareDir = join(root, 'share')
mkdirSync(shareDir, { recursive: true })

const bundlePath = join(shareDir, 'bundle.js')
execSync(
  `npx --yes esbuild src/standalone-entry.ts --bundle --format=iife --outfile="${bundlePath}" --platform=browser`,
  { cwd: root, stdio: 'inherit' },
)

const js = readFileSync(bundlePath, 'utf8')

const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>SkyTrixx — Airline Commercial Analytics</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Figtree:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
${css}
  </style>
</head>
<body>
  <div id="app"></div>
  <script>
${js}
  </script>
</body>
</html>
`

const outFile = join(shareDir, 'SkyTrixx-Airline-Analytics-Prototype.html')
writeFileSync(outFile, html, 'utf8')

const downloadsHtml = join(
  process.env.USERPROFILE || '',
  'Downloads',
  'SkyTrixx-Airline-Analytics-Prototype.html',
)
const downloadsZip = join(
  process.env.USERPROFILE || '',
  'Downloads',
  'SkyTrixx-Airline-Analytics-Prototype.zip',
)
copyFileSync(outFile, downloadsHtml)
execSync(
  `powershell -NoProfile -Command "Compress-Archive -LiteralPath '${outFile.replace(/'/g, "''")}' -DestinationPath '${downloadsZip.replace(/'/g, "''")}' -Force"`,
  { stdio: 'inherit' },
)

console.log('HTML:', downloadsHtml)
console.log('ZIP :', downloadsZip)
console.log('Size:', Math.round(Buffer.byteLength(html, 'utf8') / 1024), 'KB')
