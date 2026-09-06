#!/usr/bin/env node
/**
 * IndexNow 主动推送脚本
 * 每次部署时，把 sitemap.xml 中的全部 URL 一次性 POST 到 IndexNow API
 * 脚本失败不阻断部署，仅输出日志
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// IndexNow 配置
const INDEXNOW_HOST = 'www.hvacrnet.com'
const INDEXNOW_KEY_FILE = join(projectRoot, 'public', 'indexnow-key.txt')
const INDEXNOW_API = 'https://api.indexnow.org/indexnow'

// 生成或读取 IndexNow key
function getIndexNowKey() {
  if (existsSync(INDEXNOW_KEY_FILE)) {
    return readFileSync(INDEXNOW_KEY_FILE, 'utf-8').trim()
  }
  // 生成新的 key（32 位十六进制）
  const key = Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('')
  writeFileSync(INDEXNOW_KEY_FILE, key)
  console.log(`[IndexNow] Generated new key: ${key}`)
  return key
}

// 从 sitemap.xml 读取 URL 列表
function getSitemapUrls() {
  const sitemapPath = join(projectRoot, 'dist', 'sitemap.xml')
  if (!existsSync(sitemapPath)) {
    console.log('[IndexNow] sitemap.xml not found, skipping')
    return []
  }
  
  const content = readFileSync(sitemapPath, 'utf-8')
  const urls = []
  const regex = /<loc>(.*?)<\/loc>/g
  let match
  
  while ((match = regex.exec(content)) !== null) {
    urls.push(match[1])
  }
  
  return urls
}

// 提交 URL 到 IndexNow
async function submitToIndexNow(key, urls) {
  if (urls.length === 0) {
    console.log('[IndexNow] No URLs to submit')
    return
  }
  
  const payload = {
    host: INDEXNOW_HOST,
    key: key,
    keyLocation: `https://${INDEXNOW_HOST}/${key}.txt`,
    urlList: urls
  }
  
  try {
    const response = await fetch(INDEXNOW_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    
    if (response.ok) {
      console.log(`[IndexNow] Successfully submitted ${urls.length} URLs`)
    } else {
      console.log(`[IndexNow] API returned ${response.status}: ${await response.text()}`)
    }
  } catch (error) {
    console.log(`[IndexNow] Failed to submit: ${error.message}`)
  }
}

// 复制 key 文件到 dist 目录
function copyKeyToDist(key) {
  const distKeyFile = join(projectRoot, 'dist', `${key}.txt`)
  writeFileSync(distKeyFile, key)
  console.log(`[IndexNow] Copied key file to dist/${key}.txt`)
}

async function main() {
  console.log('[IndexNow] Starting IndexNow submission...')
  
  const key = getIndexNowKey()
  const urls = getSitemapUrls()
  
  console.log(`[IndexNow] Found ${urls.length} URLs in sitemap.xml`)
  
  await submitToIndexNow(key, urls)
  copyKeyToDist(key)
  
  console.log('[IndexNow] Done')
}

main().catch(error => {
  console.log(`[IndexNow] Error: ${error.message}`)
  // 不抛出错误，不阻断部署
})
