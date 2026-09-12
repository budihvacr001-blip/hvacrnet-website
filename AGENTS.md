## 项目概述
HVACR NET 外贸企业官网，面向海外空调制冷配件采购商，纯英文展示型网站。

## 技术栈
- React 19 + TypeScript + Vite
- React Router v6（页面路由）
- Tailwind CSS v4（样式）
- Lucide React（图标）
- pnpm 包管理

## 目录结构
- `src/pages/` — 页面：Home / Products / Contact / About / Markets
- `src/components/` — 共享组件：Navbar、Footer、ProductCard、ProductModal、SEO
- `src/data/products.ts` — 产品数据（分类、子分类、卡片信息、SEO 字段）
- `src/index.css` — 全局样式与 Tailwind 入口
- `scripts/generate-sitemap.mjs` — 构建时自动生成 sitemap.xml（读取 products.ts）
- `scripts/build.sh` — 部署构建脚本（pnpm install + vite build + sitemap 生成）
- `server.js` — Express 服务器（301 重定向 + 静态文件服务 + SPA fallback）

## 关键入口
- 路由：`src/App.tsx`
- 入口：`src/main.tsx`
- 构建：`vite.config.ts`

## 运行与预览
- 开发：`pnpm run dev`
- 构建：`pnpm run build`（本地开发构建）
- 部署构建：`bash scripts/build.sh`（包含 sitemap 生成）
- 预览端口：5000（由 .preview 控制）

## SEO 与 Sitemap
- sitemap.xml 在构建时由 `scripts/generate-sitemap.mjs` 自动生成，读取 `src/data/products.ts` 中的分类和产品数据
- 每个产品页/类目页的 title 和 meta description 由 Products.tsx 动态生成，格式：`产品名 - 类目 | HVACR NET HVAC/R Parts Supplier from China`
- 产品数据中的 `metaTitle` 和 `metaDescription` 字段用于产品详情页的 SEO
- `categoryPositioning` 对象提供各类目的全球定位语，用于类目页的 meta description
- canonical 标签由 `CanonicalUpdater` 组件和 `SEO` 组件共同管理，统一指向 `https://www.hvacrnet.com`
- 301 重定向：`hvacrnet.com` → `www.hvacrnet.com`（通过 server.js 中间件实现，读取 `X-Forwarded-Host` 头）

## 用户偏好与长期约束
- 英文为主，预留阿拉伯语切换框架
- 工业风简洁专业设计
- 主色：深蓝 #1a3a5c + 白底 + 浅灰分隔
- 强调色：橙色 #e8722a 用于 CTA
- 字体：Inter
- 响应式，适配移动端
- 轻动效（hover + 滚动渐入），不过度

## 常见问题和预防
- 产品图片暂用占位图，后续替换
- 询盘表单前端提交+弹窗确认，无后端
