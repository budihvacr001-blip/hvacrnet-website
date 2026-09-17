## 项目概述
HVACR NET 外贸企业官网，面向海外空调制冷配件采购商，纯英文展示型网站。

## 技术栈
- React 19 + TypeScript + Vite
- React Router v6（页面路由）
- Tailwind CSS v4（样式）
- Lucide React（图标）
- pnpm 包管理

## 目录结构
- `src/pages/` — 页面：Home / Products / Contact / About / Markets / Admin（后台目录树总览，含空目录，noindex，路由 /admin，不进 sitemap）
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
- `Product` 接口含可选 `keywords` 字段：存储产品 SEO 关键词（`|` 分隔），由 `Products.tsx` 详情页传入 `SEO` 组件、输出 `<meta name="keywords">`（仅 head，不影响页面视觉）。Brazing Torches 6 款产品已配 10 个/款
- Valves 下的二级目录顺序（侧边栏序号动态按非 overview 项 index 生成）：01 Solenoid → 02 Ball Valves → 03 Thermostatic Expansion Valve → 04 Sight Glasses → 05+ 其余
- 一级目录可见顺序（动态序号）：01 Copper Tubes、02 Insulation Tubes、03 Valves、04 Filter Driers、05 Tools & Equipment（等）。空目录/无发布产品的一级目录前台侧边栏不显示，但会显示在 `/admin` 后台页
- Tools & Equipment 一级目录（`tools`）：二级 `welding-gas-equipment`（Welding & Gas Equipment，container），三级 `brazing-torches`（Brazing Torches，6 个产品 torch-jc3/torch-ta/torch-tb/torch-t2b/torch-tca-fb/torch-tc2a-2f，实拍图 `/images/brazing-torch-*.png`）与 `brazing-rods`（Brazing Rods，3 个产品 rod-r25/rod-f13/rod-f13-pro，实拍图 `/images/brazing-rod-r2-5.png` 与 `brazing-rod-f1-3.png`，F1.3 与 F1.3-Pro 共用同一张图）
- 焊枪与焊条产品的 Technical Parameters 表格中不含 Supplier 行（供应商信息不落入产品规格表）
- `src/pages/Admin.tsx` 后台页：展示完整目录树（含空目录/未发布产品），每节点显示序号、published 数量、类型（container/overview），SEO noindex，路由 `/admin`；不会进入 sitemap
- 该二级目录 SEO 内容来自 `assets/# 热力膨胀阀_SEO内容_5Products.txt`（4 个正式产品 + 内部对比表；对比总表/TQR/SEO Keywords 标注 `INTERNAL — DO NOT UPLOAD`，未上线）
- **overview 归属层级约定**：`ThirdCategory` 新增可选字段 `belongsToThird?: string`（仅 isOverview 节点用）。当 overview 所属的产品目录本身是三级目录（如焊枪 `brazing-torches` 下挂多个共享 thirdCategoryId 的产品）时，overview 需置 `belongsToThird: '<该三级目录id>'`，侧边栏渲染会把它作为该三级目录的缩进子项（Brazing Torches → Category Overview），而不是与 Braizing Torches/Brazing Rods 平级显示在上级焊接设备目录。球阀/TXV/Sight Glasses 等 overview 是二级目录下的平级项，**不要**设 `belongsToThird`。URL 不变（仍为 `/products/<category>/<subCategory>/<overviewId>`）
- **共享 thirdCategoryId 目录的侧边栏铺产品**：当某三级目录下多个产品共享同一 `thirdCategoryId`（如 `brazing-torches` 6 个焊枪、`brazing-rods` 3 个焊条），侧边栏会把该目录视为"共享容器"并遵循相对层级（与 valves 下 01/02/03/04 子目录并列一致）：父级 `welding-gas-equipment` 展开时只显示 `01 Brazing Torches`、`02 Brazing Rods` 两个并列子目录；**仅当用户点开该 third 目录（activeThirdCategory/overview/产品高亮命中该 third 家族）时**，才在其下展开 Category Overview + `01..0n` 缩进产品项（链接 `/products/<cat>/<sub>/<third>#product-<id>`）。即 `showDetails = 是共享容器 && (该 third 家族 active || 用户已手动展开 expandedThirds[thirdKey])`，避免父级一展开就把所有产品铺开；共享容器目录行自带 chevron 按钮（`expandedThirds` state），可手动展开/收起该目录下的 Category Overview + 产品，不必依赖路由激活；点击目录名 Link 导航进该 third 页时自动展开（activeThirdCategory 命中）。产品卡 `id=product-<id>` 与 `#product-<id>` hash 滚动定位配合（Products.tsx 增补了 hash 解析 useEffect）
- Brazing Torches 下含一个 Category Overview 子项 `brazing-torches-overview`（isOverview，侧边栏"Category Overview"，CSR 渲染、不入 sitemap）。其 comparison 用 `brazingTorchesComparison`（6 行，对应 torch-jc3/ta/tb/t2b/tca-fb/tc2a-2f），通过 `comparisonMap['welding-gas-equipment']` 匹配。其 meta 简介已改为商业同义词导向（propane torch / gas torch / blowtorch）。6 款 torch 产品的 Product Description 首句均已嵌入商业同义词（propane torch / gas torch / blowtorch）。由于 6 款 torch 产品共享同一 `thirdCategoryId: 'brazing-torches'`（与 ball-valves 每品独立 third 不同），`CategoryLanding.getProductLink` 做了增强：某 thirdCategoryId 下存在多个产品时，产品名列链接到 `/products/tools/welding-gas-equipment/brazing-torches#product-<id>`（不含则链接 `#<thirdCategoryId>`）
- Brazing Rods（`brazing-rods`）下含一个 Category Overview 子项 `brazing-rods-overview`（isOverview，侧边栏"Category Overview"，belongsToThird 归属 `brazing-rods`，CSR 渲染、不入 sitemap），comparison 用 `brazingRodsComparison`（3 行，对应 rod-r25/rod-f13/rod-f13-pro），meta 标题/描述为 "Brazing Rods for HVAC & Refrigeration | Types & Selection Guide"
- Thermostatic Expansion Valve 下含一个 Category Overview 子项 `thermal-expansion-valves-overview`（isOverview，侧边栏"Category Overview"人，CSR 渲染、不入 sitemap，与 ball-valves-overview 一致），内容来自该二级目录的 categoryPage 内容：自定义 metaTitle/metaDescription "Refrigeration Thermostatic Expansion Valves | Types & Selection Guide" + `txvComparison` 对比表（4 行 TRF/TER/TF/TF-Core，产品名列链接到 `/products/valves/thermal-expansion-valves#<thirdCategoryId>`，与 ball-valves-overview 一致，靠 comparison 页的 getProductLink 逐行映射 products 生成）。overview 的自定义 meta 由 `CategoryLandingContent` 的可选字段 metaTitle/metaDescription 提供，`CategoryLanding` 优先使用；howToChoose/FAQ 为空时不渲染该区块
- `categoryPositioning` 对象提供各类目的全球定位语，用于类目页的 meta description
- 约定（所有分类 overview 通用）：每个有 comparison 对比表的 Category Overview，产品名列必须通过 `getProductLink`（comparison 页逐行映射传入的 `products`）链接到产品（`/<category>/<subCategory>#<thirdCategoryId>`）；新目录 overview 渲染时要把 `products` 传成 `categoryProducts`，切勿传空数组，否则产品名列变纯文本
- **同子目录下多个三级 overview 的区分**：`brazing-torches-overview` 与 `brazing-rods-overview` 共享 `subCategoryId: 'welding-gas-equipment'`，因此内容查找和对比表都不能只按 subCategoryId 匹配。`CategoryLandingContent` 提供可选 `overviewId`（放该三级 overview 的 id），Products.tsx 的 landingContent 查找优先用 `overviewId === activeThirdCategory`；comparisonMap 也以 `activeThirdCategory` 优先（`'brazing-torches-overview'`→`brazingTorchesComparison`、`'brazing-rods-overview'`→`brazingRodsComparison`）再 fallback 到 subCategory/map。传入 CategoryLanding 的 `categoryProducts` 在 overview 节点（`belongsToThird`）时按该 third 过滤（`p.thirdCategoryId === belongsToThird`），保证对比表 rowIdx 能正确映射到对应产品。weld-gas 下其他只有单个三级 overview 的目录（ball-valves/TXV/Sight Glasses）不设 overviewId、继续按 subCategoryId 匹配
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
- Brazing Rods 3 个产品（rod-r25/rod-f13/rod-f13-pro）的正文/features 已把学术关键词 "filler metal" 统一替换为 "rod"（如 rod feed/rod distribution），FAQ 保留原 "filler metal" 表述（用户认可）
- TXV 系列（tx-1~tx-4）图片已替换为实物图：tx-1 TRF `tx-trf-01.png`、tx-2 TER `tx-ter-01.png`、tx-3 TF 内平衡 `tx-tf-01.png` + 外平衡 `tx-tfw-02.png`（两张）、tx-4 TF-Core `tx-core-01.png`（均位于 `public/images/`）
- 询盘表单改用 web3forms：前端 fetch `https://api.web3forms.com/submit`(JSON)，access_key=`b6cec139-6ea9-4c1c-ad3a-f7bf908421a8`、subject/from_name 固定；成功绿色提示+重置，失败红色提示，无后端
- Contact 侧边栏：Get in Touch（Email/WeChat/WhatsApp/Address，高度等齐）+ Follow Us（Instagram→instagram.com/hvacr_net、TikTok→www.tiktok.com/@kongheng66）+ 20+ Years 徽章
- WeChat 二维码缩略图 `public/images/wechat-qr.jpg`（3.5rem，hover scale(3)+box-shadow，点击全屏 modal）
- **env 陷阱：依赖(node_modules)在 pipeline/worktree 中会被清空，`pnpm run dev` 报 `vite: not found` 导致预览/test_run 服务探活失败；用 `pnpm install` 恢复后再验证**
