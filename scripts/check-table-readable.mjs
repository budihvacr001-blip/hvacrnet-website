#!/usr/bin/env node
/**
 * Build-time guard for comparison / data tables.
 *
 * Ensures the shared DataTable component preserves readable spacing:
 *  - No word-breaking (no `break-all` / `word-break: break-all`), so headers
 *    and cells are never split mid-word.
 *  - Auto table layout (table-auto), not fixed percentage colwidths, so narrow
 *    columns are not forcibly squeezed.
 *  - Cell padding of at least 12px (px-3), guaranteeing a minimum visual gap
 *    of 16px between adjacent columns.
 *
 * Any violation fails the build (exit 1).
 */
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const src = join(root, 'src')
const file = join(src, 'components', 'DataTable.tsx')

const code = readFileSync(file, 'utf-8')

// Strip comments so the guard inspects only the rendered markup classes,
// not documentation notes inside the same file/script.
const codeNoComments = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '')

const failures = []

// 1. No word-breaking utilities (matched against class tokens / css values)
if (/\bbox\b|break-all|word-break:\s*break-all/.test(codeNoComments)) {
  failures.push('DataTable uses break-all / word-break: break-all — words would be split mid-word')
}

// 2. Table must use auto layout (no table-fixed, no fixed % colgroup width)
if (/table-fixed/.test(codeNoComments)) {
  failures.push('DataTable uses table-fixed — fixed column widths squeeze narrow columns and truncate content')
}

// 3. Cell padding must guarantee >=16px visual gap between adjacent columns.
//    Each cell pads left+right; two adjacent cells contribute 2 * padX. Require
//    px-3.5 (14px) or px-3 (12px) cell padding.
const padCount = (codeNoComments.match(/px-3(?:\.[05])?\s+py-2/g) || []).length
if (padCount < 2) {
  failures.push(`DataTable cell padding below px-3.5/px-3 — adjacent column gap would be < 16px (found ${padCount} px-3*.5 py-2 cell classes)`)
}

if (failures.length > 0) {
  console.error('✗ Table readability check FAILED:')
  failures.forEach(f => console.error(`  - ${f}`))
  process.exit(1)
}

console.log('✓ Table readability check passed (no break-all, auto layout, padding ≥ px-3)')