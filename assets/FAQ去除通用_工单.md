# 工单：全站产品 FAQ 只保留「型号专属」问答，移除末尾 3 条全站通用问答 + 让 5 个截止阀用上新定制 FAQ

## 背景
上一轮我们让 `getProductFAQs` 在「产品专属 FAQ」之后，对每个产品都追加了 3 条全站通用问答（UNIVERSAL_FAQS：MOQ/lead time、quality certificates、replace major-brand）。
现产品负责人决定：**产品页只保留针对该型号的专属定制 FAQ，3 条全站通用问答不再出现在任何产品的 FAQ 列表 / FAQPage 结构化数据中。**
同时，5 个截止阀（st-1 ~ st-5）此前因「已有内联 faq 就不覆盖」的保护逻辑，导致 product-faq-seed.ts 里为它们新起草的定制 FAQ 没有生效；本轮要让 seed 对这 5 个产品生效。

## 改动点（只做这些，不要动路由 / URL / 页面结构）

### 1) src/data/faq-constants.ts —— getProductFAQs
- 当传入的产品专属 FAQ（第 4 个参数 `productFaqs`）非空时：**直接返回 `[...productFaqs]`，不要再 `...UNIVERSAL_FAQS`**。
- 即：有型号专属 FAQ 的产品，最终 FAQ = 仅型号专属，条数就是该产品自己的条数（3 或 4 条）。
- `productFaqs` 为空时的兜底分支（categoryFAQ / 全通用）保持原样，作为安全网保留；`UNIVERSAL_FAQS` 常量定义不要删（兜底仍引用）。
- 期望形态：
  ```ts
  if (productFaqs && productFaqs.length > 0) return [...productFaqs]
  ```

### 2) products.ts 注入 product-faq-seed 的逻辑 —— 让 seed 覆盖 5 个截止阀
- 当前规则是「仅当产品没有内联 faq 时才注入 seed」。改为：
  **凡是 `PRODUCT_FAQ_SEED` 中存在该产品 id 的，一律用 seed 的数组作为该产品的 `faq`（即覆盖原有内联 faq）；seed 中没有的产品，保持其原有内联 faq 不变。**
- 影响范围（已核对，属预期）：
  - st-1 ~ st-5（5 个 KM/HS 截止阀）：从旧 3 条换成 seed 里的新定制 3 条。
  - sv-1 ~ sv-5、cv-1 ~ cv-4：seed 内容与原内联一致，覆盖后页面无可见变化。
  - 焊枪/焊条 9 个（torch-*、rod-*）：不在 seed 中，保留其原有型号专属内联 FAQ（每个 4 条），不要动。
- 构建期断言保持：seed 产品数 = 52；每个被注入产品最终 `faq.length >= 3`，否则 throw。

### 3) src/pages/Products.tsx 与 src/components/ProductModal.tsx
- 调用点不用改签名（仍传第 4 参 `product.faq`），由 getProductFAQs 内部行为变化自动生效。
- 确认详情页 `faqPageSchema` 的 mainEntity 条数 = 该产品专属 FAQ 条数（不再 +3）。

### 4) scripts/generate-sitemap.mjs 与 AGENTS.md
- sitemap 门禁中「产品 faq 非空且 >=3」的判定保留；现在它衡量的是型号专属 FAQ（所有已发布产品仍满足 >=3）。
- 更新 AGENTS.md 发布 SOP 的 FAQ 条款：新产品必须在 `product.faq[]` 写入 ≥3 条**针对该型号**的专属问答；删除/修正任何「会再自动追加 3 条通用 FAQ（MOQ/证书/替代大牌）」的旧描述。

## 不要做
- 不要修改任何路由、URL、分类层级、sitemap 枚举逻辑（铜管/保温管/过滤器的列表页→详情页结构优化是另一个独立任务，本轮不做）。
- 不要 push、不要部署；本地构建自测通过后停下汇报。
- 不要改动 seed 文件内容本身。

## 自测 / 验收标准（请在汇报中逐条给出结果）
1. `npm run build` 成功，无 TS 报错。
2. 本地或构建产物中，阀门详情页（如 solenoid standard-piston-nc、stop-valves/km-sae-diaphragm-stop、safety-valves/fs-inline-npt）的 FAQPage JSON-LD：
   - mainEntity 只含型号专属问答，**不再包含** “What is your MOQ and lead time?” / “Do you provide quality certificates with orders?” / “Can your parts replace major-brand components?” 这 3 条；
   - standard-piston-nc 为 3 条；fs-inline-npt 这类 4 条专属产品为 4 条。
3. km-sae-diaphragm-stop（st 类）FAQPage 显示的是 seed 新 3 条（如含 “twin-diaphragm design in the KM stop valve” 这类新问题），而不是旧的 “How do the twin diaphragms prevent stem leakage?” 3 条。
4. 焊枪/焊条产品仍保留其原有 4 条型号专属 FAQ，且末尾也不再出现那 3 条通用问答。
5. 站点内全局搜索确认这 3 条通用问题不再出现在任何产品详情 JSON-LD / 产品 FAQ 渲染中（兜底常量可保留在源码，但不进任何产品输出）。
6. sitemap 生成脚本运行通过，深链数量不减少（应仍为此前的 43 条三级深链）。

完成后把改动文件清单、每条验收的实际结果、以及构建退出码告诉我，等我确认后再发布。
