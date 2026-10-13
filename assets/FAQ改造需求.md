# 任务：全站产品 FAQ 机制改造 + 批量写入产品级 FAQ（一次性做对，防止复发）

## 背景（必须先理解，否则会改错）
当前线上所有产品页的 FAQ 几乎都只显示「1 条品类选型问题 + 3 条全站通用问题」，与具体产品不匹配。根因有两个：

1. **读取字段错了**：`src/data/products.ts` 的 `Product` 类型同时有
   - `faq?: ProductFAQ[]`（多条、产品专属，**这是正确字段**）
   - `faqSelection?: ProductFAQ`（单条、历史遗留，全站没有任何产品赋值）
   而页面/结构化数据只调用 `getProductFAQs(categoryId, subCategoryId, product.faqSelection)`，**从不读取 `product.faq` 数组**。焊枪/焊条 9 个产品早已把专属 FAQ 写进了 `faq[]`，但线上根本不显示，就是这个 bug。

2. **大多数产品没有产品级 FAQ**，回退逻辑只给品类问题+通用问题。

本任务同时修机制、补数据、加发布门禁。

---

## 第一步：改造读取机制（一劳永逸）

### 1.1 `src/data/faq-constants.ts`
给 `getProductFAQs` 增加「产品专属 FAQ」最高优先级。新优先级：
**产品自己的 `faq[]`（多条） → 品类选型 1 条 → 全站通用 3 条**。

建议签名（保持向后兼容，`faqSelection` 旧参数保留但不再是主路径）：

```ts
export function getProductFAQs(
  categoryId: string,
  subCategoryId?: string,
  faqSelection?: FAQItem | null,
  productFaqs?: FAQItem[] | null,
): FAQItem[] {
  // 1) 产品专属多条 FAQ 优先
  if (productFaqs && productFaqs.length > 0) {
    return [...productFaqs, ...UNIVERSAL_FAQS]
  }
  // 2) 回退：品类选型 1 条 + 通用 3 条（保留现有逻辑）
  const categoryFAQ = getCategoryFAQ(categoryId, subCategoryId, faqSelection)
  if (categoryFAQ) return [categoryFAQ, ...UNIVERSAL_FAQS]
  return [...UNIVERSAL_FAQS]
}
```

注意：产品专属 FAQ 后**仍追加 3 条 UNIVERSAL_FAQS**（MOQ/证书/替代大牌），保持全站商业转化信息一致；如果你判断产品已有 3-4 条专属问题时不应再叠加通用问题，请先不要自作主张，按上面实现（专属+通用），与我确认后再调。

`getCategoryFAQ` 维持原样不动。

### 1.2 两个调用点都要传第 4 个参数 `product.faq`
- **`src/components/ProductModal.tsx`** 的 `ProductFAQSection`：
  `getProductFAQs(product.categoryId, product.subCategoryId, product.faqSelection, product.faq)`
- **`src/pages/Products.tsx`** 中生成 **FAQPage JSON-LD** 结构化数据的地方（现在约 349–354 行）：同样传第 4 个参数 `product.faq`。务必让 Google/Bing 抓到的 FAQPage 与页面可见 FAQ 完全一致。

改完后，焊枪/焊条 9 个产品（id：torch-jc3 / torch-ta / torch-tb / torch-t2b / torch-tca-fb / torch-tc2a-2f / rod-r25 / rod-f13 / rod-f13-pro）无需补数据，应立即显示各自 `faq[]` 里的 4 条专属问题 + 3 条通用问题。**请在预览里先验证这 9 个产品 FAQ 正常显示。**

---

## 第二步：批量写入 52 个产品的产品级 FAQ

附件 `@product-faq-seed.ts` 是我已生成好的数据模块，按产品 id 索引，共 52 个产品、164 条 `{question, answer}`，全部为英文、已逐条核对参数与产品资料一致。

### 推荐做法（最稳妥，不要手工誊抄 164 条）
1. 把 `product-faq-seed.ts` 放到 `src/data/` 目录（它 `import type { ProductFAQ } from './products'`，如类型名/路径不符请按实际调整；products.ts 里类型名就是 `ProductFAQ`）。
2. 在 `src/data/products.ts` 顶部 `import { PRODUCT_FAQ_SEED } from './product-faq-seed'`。
3. 在产品数据数组构建之后、export 之前，用一小段装配逻辑把 seed 合并进对应产品，而不是在每个产品对象字面量里手写：

```ts
// attach product-level FAQ seed (product.faq takes precedence if already authored inline)
for (const p of products) {
  const seeded = PRODUCT_FAQ_SEED[p.id]
  if (seeded && (!p.faq || p.faq.length === 0)) {
    p.faq = seeded
  }
}
```
（请按 products.ts 实际的产品聚合变量名/导出结构落地；若产品分散在多个 category 树里，需递归遍历所有产品节点。核心要求：**只对没有内联 faq 的产品注入 seed；焊枪焊条等已有 faq[] 的产品保持原内容不被覆盖**。）

4. 52 个产品 id 清单（必须全部命中，注入后做断言校验数量=52）：
sv-1,sv-2,sv-3,sv-4,sv-5,
cv-1,cv-2,cv-3,cv-4,
im-1,im-2,
v-1..v-15,
bv-1..bv-5,
fd-1..fd-5,
sg-1..sg-3,
st-1..st-5,
tx-1..tx-4,
ct-1,ct-3,ct-4,ct-mjc-1

请写一个一次性校验（控制台输出即可）：遍历这 52 个 id，确认每个产品最终 `faq.length >= 3`；有任何一个缺失或为 0，构建报错或明确报告，不要静默。

### 不在本批范围
- copper-fittings（cf-*，如 cf-2/cf-5）、insulation-materials 的 im-3：线上无三级独立产品落地页（sitemap 无深链），本批不写产品级 FAQ，保持现状回退即可。
- published:false 的产品（如 sg-4/sg-5）不要写。

---

## 第三步：发布门禁硬规则（防止以后复发）

### 3.1 `AGENTS.md`
在《发布到正式站 SOP（强制）》里新增一条发布前必检硬规则，大意：
> **产品级 FAQ 门禁**：任何标记为发布（`published !== false`）的产品，必须在其 SEO 文档基础上配置至少 3 条产品专属 FAQ（写入产品 `faq: ProductFAQ[]`）。上架新产品时，必须同步把该产品 SEO 文档里的 FAQ 写入 `faq[]`，否则不得标记发布、不得通过发布核验。禁止让产品页只回退显示品类通用问题。

### 3.2 `scripts/generate-sitemap.mjs`
在现有的 `isProductContentComplete`（现在校验 images / specTable 或 specs / description≥100 字符）里**增加 FAQ 完整度判定**：要求产品有非空 `faq` 数组且长度 ≥ 3，否则视为内容不完整，不生成其三级深链（与现有不完整内容的处理方式一致）。
- 加判定时注意：本批 52 个产品注入 seed 后都能满足；焊枪焊条 9 个本就有 4 条；published:false 的产品本就不参与。
- 跑一次 sitemap 生成，确认改造后已上线的三级产品深链数量不减少、且 52+焊接产品都仍合格。

---

## 验收标准（自测通过后再回复我）
1. `npm run build`（或项目实际构建命令）通过，无 TS 类型错误。
2. 预览中抽验：
   - 焊枪/焊条 9 个产品：显示各自 4 条专属 FAQ（不再是只有 3 条通用问题）。
   - 安全阀 sv-1、电磁阀 v-1、截止阀 st-1、TXV tx-1、铜管 ct-1：显示 3 条该产品专属问题 + 3 条通用问题，问题内容确实针对该型号。
   - 查看页面 FAQPage JSON-LD，mainEntity 与可见问答一致。
3. 52 个 id 全部注入成功的校验输出。
4. sitemap 生成后三级产品深链数量与现状一致（不减少）。
5. 不要执行 git push / 生产部署；改完、自测通过后把「改动文件清单 + 自测结果」回复给我，由我确认后再走正式发布 SOP。

完成后请明确列出：实际改动了哪些文件、注入校验结果、以及你在预览里抽验的产品 FAQ 情况。
