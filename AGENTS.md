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
- 开发：`pnpm run dev`（纯本地，默认 5173）
- 构建：`pnpm run build`（本地开发构建）
- 部署构建：`bash scripts/build.sh`（包含 sitemap 生成）
- **预览链路：`.coze` 的 `[dev]` 指向包装脚本，由平台在 5000 常驻拉起**
  - `[dev].build` → `scripts/coze-preview-build.sh`（`pnpm install`）
  - `[dev].run` → `scripts/coze-preview-run.sh`（幂等占 5000 端口，`vite --host 0.0.0.0 --port 5000 --strictPort`，vite 缺失时自动先 `pnpm install`）
  - 预览端口：5000（由 .preview 控制 expose_port=5000）
  - 注意：本环境的 `node_modules` 会在每次 shell 调用后被清空，`[dev].run` 脚本内置自愈 reinstall；手动 nohup 后台无法持久，预览必须走平台管理

## SEO 与 Sitemap
- sitemap.xml 在构建时由 `scripts/generate-sitemap.mjs` 自动生成，读取 `src/data/products.ts` 中的分类和产品数据
- 每个产品页/类目页的 title 和 meta description 由 Products.tsx 动态生成，格式：`产品名 - 类目 | HVACR NET HVAC/R Parts Supplier from China`
- 产品数据中的 `metaTitle` 和 `metaDescription` 字段用于产品详情页的 SEO
- Valves 下的二级目录顺序（侧边栏序号动态按非 overview 项 index 生成）：01 Solenoid → 02 Ball Valves → 03 Thermostatic Expansion Valve → 04 Sight Glasses → 05+ 其余
- Thermostatic Expansion Valve 二级目录（`thermal-expansion-valves`）下含 4 个产品（three-level 结构，third categories：`trf-heavy-duty-txv` TRF / `ter-universal-txv` TER / `tf-replaceable-orifice` TF / `tf-core-replaceable-orifice` TF-Core），对应产品 id `tx-1`~`tx-4`
- 该二级目录 SEO 内容来自 `assets/# 热力膨胀阀_SEO内容_5Products.txt`（4 个正式产品 + 内部对比表；对比总表/TQR/SEO Keywords 标注 `INTERNAL — DO NOT UPLOAD`，未上线）
- Thermostatic Expansion Valve 下含一个 Category Overview 子项 `thermal-expansion-valves-overview`（isOverview，侧边栏"Category Overview"人，CSR 渲染、不入 sitemap，与 ball-valves-overview 一致），内容来自该二级目录的 categoryPage 内容：自定义 metaTitle/metaDescription "Refrigeration Thermostatic Expansion Valves | Types & Selection Guide" + `txvComparison` 对比表（4 行 TRF/TER/TF/TF-Core，产品名列链接到 `/products/valves/thermal-expansion-valves#<thirdCategoryId>`，与 ball-valves-overview 一致，靠 comparison 页的 getProductLink 逐行映射 products 生成）。overview 的自定义 meta 由 `CategoryLandingContent` 的可选字段 metaTitle/metaDescription 提供，`CategoryLanding` 优先使用；howToChoose/FAQ 为空时不渲染该区块
- `categoryPositioning` 对象提供各类目的全球定位语，用于类目页的 meta description
- 约定（所有分类 overview 通用）：每个有 comparison 对比表的 Category Overview，产品名列必须通过 `getProductLink`（comparison 页逐行映射传入的 `products`）链接到产品（`/<category>/<subCategory>#<thirdCategoryId>`）；新目录 overview 渲染时要把 `products` 传成 `categoryProducts`，切勿传空数组，否则产品名列变纯文本
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
- TXV 系列（tx-1~tx-4）图片已替换为实物图：tx-1 TRF `tx-trf-01.png`、tx-2 TER `tx-ter-01.png`、tx-3 TF 内平衡 `tx-tf-01.png` + 外平衡 `tx-tfw-02.png`（两张）、tx-4 TF-Core `tx-core-01.png`（均位于 `public/images/`）
- 询盘表单改用 web3forms：前端 fetch `https://api.web3forms.com/submit`(JSON)，access_key=`b6cec139-6ea9-4c1c-ad3a-f7bf908421a8`、subject/from_name 固定；成功绿色提示+重置，失败红色提示，无后端
- Contact 侧边栏：Get in Touch（Email/WeChat/WhatsApp/Address，高度等齐）+ Follow Us（Instagram→instagram.com/hvacr_net、TikTok→www.tiktok.com/@kongheng66）+ 20+ Years 徽章
- WeChat 二维码缩略图 `public/images/wechat-qr.jpg`（3.5rem，hover scale(3)+box-shadow，点击全屏 modal）
- **env 陷阱：依赖(node_modules)在 pipeline/worktree 中会被清空，`pnpm run dev` 报 `vite: not found` 导致预览/test_run 服务探活失败；用 `pnpm install` 恢复后再验证**
