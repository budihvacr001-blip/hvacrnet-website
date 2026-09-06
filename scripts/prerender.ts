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
  
  const appHtml = renderToString(
    React.createElement(
      StaticRouter,
      { location: pathname },
      React.createElement(App, { helmetContext })
    )
  )
  
  const { helmet } = helmetContext
  
  // 替换模板中的内容
  let html = template
  
  // 替换 root div 内容
  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${appHtml}</div>`
  )
  
  // 注入 helmet 数据
  if (helmet) {
    const helmetTitle = helmet.title?.toString() || ''
    const helmetMeta = helmet.meta?.toString() || ''
    const helmetLink = helmet.link?.toString() || ''
    const helmetScript = helmet.script?.toString() || ''
    
    // 替换 title
    if (helmetTitle) {
      html = html.replace(/<title>.*?<\/title>/, helmetTitle)
    }
    
    // 注入 meta 标签到 head
    if (helmetMeta) {
      html = html.replace('</head>', `${helmetMeta}\n</head>`)
    }
    
    // 注入 link 标签到 head
    if (helmetLink) {
      html = html.replace('</head>', `${helmetLink}\n</head>`)
    }
    
    // 注入 script 标签到 head
    if (helmetScript) {
      html = html.replace('</head>', `${helmetScript}\n</head>`)
    }
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
