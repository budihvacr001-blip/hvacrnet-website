#!/usr/bin/env node
/**
 * 构建时预渲染脚本（SSG）
 * 使用 React 的 renderToString 预渲染所有路由到静态 HTML
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import React from 'react'

// 设置全局 React（用于 JSX 转换）
;(globalThis as any).React = React

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = join(__dirname, '..')

// 导入 App 组件
import App from '../src/App.tsx'

// 从 sitemap.xml 读取 URL 列表
function getSitemapUrls() {
  const sitemapPath = join(projectRoot, 'dist', 'sitemap.xml')
  if (!existsSync(sitemapPath)) {
    console.log('[SSG] sitemap.xml not found, using default routes')
    return ['/', '/products', '/about', '/contact', '/markets-we-serve']
  }
  
  const content = readFileSync(sitemapPath, 'utf-8')
  const urls = []
  const regex = /<loc>(.*?)<\/loc>/g
  let match
  
  while ((match = regex.exec(content)) !== null) {
    const url = new URL(match[1])
    urls.push(url.pathname)
  }
  
  return urls
}

// 读取 index.html 模板
function getIndexTemplate() {
  const indexPath = join(projectRoot, 'dist', 'index.html')
  return readFileSync(indexPath, 'utf-8')
}

// 预渲染单个路由
function prerenderRoute(pathname: string, template: string) {
  const helmetContext: any = {}
  
  // Wrap with HelmetProvider at the top level
  const appHtml = renderToString(
    React.createElement(
      HelmetProvider,
      { context: helmetContext },
      React.createElement(
        StaticRouter,
        { location: pathname },
        React.createElement(App, { helmetContext: null }) // Pass null to force App to use parent HelmetProvider
      )
    )
  )
  
  // Extract title and meta from rendered HTML (since helmetContext is not populated)
  const titleMatch = appHtml.match(/<title>(.*?)<\/title>/)
  const title = titleMatch ? titleMatch[1] : ''
  
  // Extract meta description
  const metaDescMatch = appHtml.match(/<meta name="description" content="(.*?)"/)
  const metaDesc = metaDescMatch ? metaDescMatch[1] : ''
  
  // Extract all meta and link tags
  const metaTags = appHtml.match(/<meta[^>]*>/g) || []
  const linkTags = appHtml.match(/<link[^>]*rel="(canonical|preload)"[^>]*>/g) || []
  
  console.log(`[SSG] Pre-rendered: ${pathname} - title: ${title.substring(0, 50)}...`)
  
  // 替换模板中的内容
  let html = template
  
  // 替换 root div 内容 (remove title/meta/link from appHtml since they belong in head)
  const bodyContent = appHtml
    .replace(/<title>.*?<\/title>/, '')
    .replace(/<meta[^>]*>/g, '')
    .replace(/<link[^>]*rel="(canonical|preload)"[^>]*>/g, '')
  
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${bodyContent}</div>`
  )
  
  // 替换 title
  if (title) {
    html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  }
  
  // 注入 meta description
  if (metaDesc) {
    html = html.replace(/<meta name="description" content=".*?"/, `<meta name="description" content="${metaDesc}"`)
  }
  
  // 注入 canonical link
  const canonicalLink = linkTags.find(l => l.includes('canonical'))
  if (canonicalLink) {
    html = html.replace(/<link rel="canonical" href=".*?"/, canonicalLink)
  }
  
  return html
}

// 主函数
async function main() {
  console.log('[SSG] Starting pre-rendering...')
  
  const urls = getSitemapUrls()
  const template = getIndexTemplate()
  
  console.log(`[SSG] Found ${urls.length} URLs to pre-render`)
  
  for (const url of urls) {
    try {
      const html = prerenderRoute(url, template)
      
      // 确定输出文件路径
      let outputPath
      if (url === '/') {
        outputPath = join(projectRoot, 'dist', 'index.html')
      } else {
        const dir = join(projectRoot, 'dist', url)
        if (!existsSync(dir)) {
          mkdirSync(dir, { recursive: true })
        }
        outputPath = join(dir, 'index.html')
      }
      
      writeFileSync(outputPath, html)
      console.log(`[SSG] Pre-rendered: ${url}`)
    } catch (error: any) {
      console.log(`[SSG] Failed to pre-render ${url}: ${error.message}`)
    }
  }
  
  console.log('[SSG] Done')
}

main().catch(error => {
  console.log(`[SSG] Error: ${error.message}`)
  process.exit(1)
})
