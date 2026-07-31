/**
 * One-shot optimizer for the code-owned `/public` image set.
 *
 * The Phase-1 surfaces render these through plain `<img>` / `background-image`
 * (see MediaImage.tsx's note), so nothing resizes them at request time — the
 * browser downloaded the raw 1024²  PNGs and 4272×2848 JPEGs verbatim. This
 * rewrites each one as webp, capped at BOTH a sensible max width for its slot
 * and a hard `MAX_BYTES` budget, by walking quality down and then width down
 * until it fits.
 *
 * Idempotent: a `.webp` that already fits the budget is left untouched, so
 * re-running never re-encodes (and never degrades) an already-optimized file.
 *
 * Usage:  node scripts/optimize-public-images.mjs [--dry]
 * Originals live in the gitignored `.design/` + `.design-v3/` reference dirs and
 * in git history, so this is recoverable.
 */
import fs from 'node:fs'
import path from 'node:path'

import sharp from 'sharp'

/** Hard per-file budget. */
const MAX_BYTES = 200 * 1024
/** Files at or below this stay as-is — logos/icons, already cheap. */
const SKIP_UNDER_BYTES = 20 * 1024
/** Quality ladder, then width ladder, tried in order until under budget. */
const QUALITIES = [82, 76, 70, 64, 58, 50, 42]
const WIDTH_FALLBACKS = [1, 0.8, 0.65, 0.5]

/** Max rendered width per slot family — the widest the asset is ever painted. */
function maxWidthFor(rel) {
  if (rel.startsWith('hero/')) return 1920 // mosaic tile + mobile bloom
  if (rel.startsWith('shop/')) return 1400 // marketplace screenshots, need detail
  if (rel.startsWith('products/')) return 1000 // card + quick-view gallery
  if (/^(cat|health)-/.test(rel)) return 1024 // square category tiles
  if (/^mototou-/.test(rel)) return 1600 // brand page hero art
  return 1400 // team-*, ceo-photo, stats-team-*
}

const dry = process.argv.includes('--dry')
const root = 'public'

const files = []
;(function walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p)
    else if (/\.(png|jpe?g|webp)$/i.test(e.name)) files.push(p)
  }
})(root)
files.sort()

/** Encode at `width`/`quality` and return the buffer. */
const encode = (input, width, quality) =>
  sharp(input).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 6 }).toBuffer()

let before = 0
let after = 0
let converted = 0
let skipped = 0
const renames = []

for (const file of files) {
  const rel = path.relative(root, file)
  const size = fs.statSync(file).size
  before += size

  const isWebp = /\.webp$/i.test(file)
  if (size <= SKIP_UNDER_BYTES || (isWebp && size <= MAX_BYTES)) {
    after += size
    skipped++
    continue
  }

  const input = fs.readFileSync(file)
  const meta = await sharp(input).metadata()
  const cap = Math.min(maxWidthFor(rel), meta.width ?? maxWidthFor(rel))

  let best = null
  outer: for (const scale of WIDTH_FALLBACKS) {
    const width = Math.round(cap * scale)
    for (const quality of QUALITIES) {
      const buf = await encode(input, width, quality)
      if (!best || buf.length < best.buf.length) best = { buf, width, quality }
      if (buf.length <= MAX_BYTES) {
        best = { buf, width, quality }
        break outer
      }
    }
  }

  const outPath = file.replace(/\.(png|jpe?g|webp)$/i, '.webp')
  const flag = best.buf.length <= MAX_BYTES ? '' : '  ⚠ over budget'
  console.log(
    `${rel.padEnd(38)} ${String(Math.round(size / 1024)).padStart(5)}KB → ` +
      `${String(Math.round(best.buf.length / 1024)).padStart(4)}KB  ` +
      `(w${best.width} q${best.quality})${flag}`,
  )

  if (!dry) {
    fs.writeFileSync(outPath, best.buf)
    if (outPath !== file) fs.unlinkSync(file)
  }
  if (outPath !== file) renames.push(['/' + rel, '/' + path.relative(root, outPath)])
  after += best.buf.length
  converted++
}

console.log(
  `\n${converted} converted, ${skipped} left as-is — ` +
    `${(before / 1048576).toFixed(1)} MB → ${(after / 1048576).toFixed(2)} MB ` +
    `(-${(100 - (after / before) * 100).toFixed(0)}%)`,
)

if (renames.length && !dry) {
  fs.writeFileSync('.image-renames.json', JSON.stringify(Object.fromEntries(renames), null, 2))
  console.log(`Wrote .image-renames.json (${renames.length} path rewrites to apply in src/).`)
}
