import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';

const DIST = resolve(process.cwd(), 'dist');
const IMG_EXT = /\.(png|jpe?g|gif|webp|svg|avif|ico)(\?.*)?$/i;

function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const p = join(dir, entry);
    if (statSync(p).isDirectory()) walk(p, acc);
    else acc.push(p);
  }
  return acc;
}

if (!existsSync(DIST)) {
  console.error('[check-assets] dist not found');
  process.exit(1);
}

const files = walk(DIST);
const assets = new Map(); // url -> {branch:'prod', exists}
let missing = [];

for (const f of files) {
  const rel = f.slice(DIST.length);
  // 登记所有实际存在的图片
  if (IMG_EXT.test(f)) {
    assets.set(rel, true);
  }
}

const srcRe = /(?:src|href|content)=["'](\/[^"']+)["']/g;

for (const f of files) {
  if (!/\.(html|js|css)$/.test(f)) continue;
  const content = readFileSync(f, 'utf-8');
  for (const m of content.matchAll(srcRe)) {
    const url = m[1].split(/[?#]/)[0];
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    if (url.startsWith('/api')) continue;
    if (IMG_EXT.test(url)) {
      const candidate = join(DIST, url);
      if (!existsSync(candidate)) {
        missing.push(url);
      }
    }
  }
}

// 去重
missing = [...new Set(missing)];

if (missing.length) {
  console.error('[check-assets] Missing image/asset references:');
  for (const u of missing) console.error('  - ' + u);
  process.exit(1);
}
console.log(`[check-assets] OK: ${assets.size} image assets, no broken references`);