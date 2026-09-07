export interface ThirdCategory {
  id: string
  name: string
  description?: string
  isOverview?: boolean
  published?: boolean // defaults to true if not specified
}

export interface SubCategory {
  isOverview?: boolean
  id: string
  name: string
  description?: string
  subCategories?: ThirdCategory[]
  published?: boolean // defaults to true if not specified
}

export interface ProductFAQ {
  question: string
  answer: string
}

export interface Product {
  id: string
  categoryId: string
  subCategoryId?: string
  thirdCategoryId?: string
  name: string
  shortDesc: string
  description: string
  metaTitle?: string
  metaDescription?: string
  images?: string[]
  features?: string[]
  specs?: { label: string; value: string }[]
  applications?: string
  materialStandard?: { label: string; value: string }[]
  specTable?: { headers: string[]; rows: string[][] }
  availableModels?: { headers: string[]; rows: string[][] }
  faq?: ProductFAQ[]
  faqSelection?: ProductFAQ // product-specific selection FAQ (overrides category default)
  published?: boolean // defaults to true if not specified
}

export interface Category {
  id: string
  name: string
  icon: string
  subCategories: SubCategory[]
  products: Product[]
  published?: boolean // defaults to true if not specified
  isOverview?: boolean // defaults to false if not specified
}

// Publishing gate helper functions
export const isPublished = (item: { published?: boolean }): boolean => {
  return item.published !== false // defaults to true if not specified
}

// Check if a product has complete content (has required fields for publishing)
// Requirements: images non-empty, specTable with >= 3 rows, description >= 100 chars
export const isProductContentComplete = (product: Product): boolean => {
  // 1. Has main image: images array non-empty with valid paths
  if (!product.images || product.images.length === 0) return false
  if (!product.images.some(img => img && img.trim().length > 0)) return false
  
  // 2. Has spec table: specTable non-empty with at least 3 rows, OR specs with at least 3 items
  const hasSpecTable = product.specTable && product.specTable.rows && product.specTable.rows.length >= 3
  const hasSpecs = product.specs && product.specs.length >= 3
  if (!hasSpecTable && !hasSpecs) return false
  
  // 3. Has description: description non-empty and at least 100 characters
  if (!product.description || product.description.trim().length < 100) return false
  
  return true
}

// Check if a product is "published" - combines manual published field AND content completeness
// If published=false (manual draft) OR content incomplete, product is unpublished
export const isProductPublished = (product: Product): boolean => {
  // Manual draft takes precedence
  if (product.published === false) return false
  // Content completeness check
  return isProductContentComplete(product)
}

// Legacy: Check if a product is complete (for publishing validation messages)
export const isProductComplete = (product: Product): { complete: boolean; missing: string[] } => {
  const missing: string[] = []
  if (!product.images || product.images.length === 0) missing.push('主图')
  if (!product.specTable && (!product.specs || product.specs.length < 3)) missing.push('规格参数表（至少3行）')
  if (!product.description || product.description.length < 100) missing.push('详细描述（至少100字符）')
  return { complete: missing.length === 0, missing }
}

// Minimum number of published products required for a container category to be visible in frontend navigation
export const MIN_PRODUCTS_TO_SHOW = 2

// Check if a node is a leaf node (product hanging point)
// A leaf node is not an overview and has no subcategories
export const isLeafNode = (node: { isOverview?: boolean; subCategories?: unknown[] }): boolean => {
  return !node.isOverview && (!node.subCategories || node.subCategories.length === 0)
}

// Recursively count published products under a category node (including all subcategories)
export const getVisibleProductCount = (
  categoryId: string,
  subCategoryId: string | undefined,
  allProducts: Product[]
): number => {
  return allProducts.filter(p => {
    // Must be published (content-complete)
    if (!isProductPublished(p)) return false
    // Must belong to this category
    if (p.categoryId !== categoryId) return false
    // If subCategoryId is specified, product must belong to it or its children
    if (subCategoryId && p.subCategoryId !== subCategoryId) return false
    return true
  }).length
}

// Count published products directly under a third category (leaf node)
export const getThirdCategoryProductCount = (
  categoryId: string,
  subCategoryId: string,
  thirdCategoryId: string,
  allProducts: Product[]
): number => {
  return allProducts.filter(p => {
    if (!isProductPublished(p)) return false
    return p.categoryId === categoryId && p.subCategoryId === subCategoryId && p.thirdCategoryId === thirdCategoryId
  }).length
}

// Unified visibility check for frontend navigation
// Rules:
// - Overview nodes: always show (if published !== false)
// - Leaf nodes (product hanging points): show if count >= 1
// - Container categories: show if count >= MIN_PRODUCTS_TO_SHOW
export const isCategoryVisibleOnStorefront = (
  node: { id: string; isOverview?: boolean; subCategories?: unknown[]; published?: boolean },
  categoryId: string,
  subCategoryId: string | undefined,
  allProducts: Product[]
): boolean => {
  if (node.published === false) return false
  // Overview nodes always show
  if (node.isOverview) return true
  const count = getVisibleProductCount(categoryId, subCategoryId, allProducts)
  // Leaf nodes: show if has at least 1 published product
  if (isLeafNode(node)) return count >= 1
  // Container categories: show if has >= MIN_PRODUCTS_TO_SHOW published products
  return count >= MIN_PRODUCTS_TO_SHOW
}

// Legacy function for backward compatibility
export const isCategoryVisible = (
  categoryId: string,
  subCategoryId: string | undefined,
  allProducts: Product[],
  minCount: number = MIN_PRODUCTS_TO_SHOW
): boolean => {
  const count = getVisibleProductCount(categoryId, subCategoryId, allProducts)
  return count >= minCount
}

// Get all visible categories for navigation (recursive, includes subcategories)
export const getVisibleCategories = (categories: Category[], _allProducts: Product[]): Category[] => {
  return categories.filter(cat => {
    if (cat.published === false) return false
    // Overview nodes always show
    if (cat.isOverview) return true
    // Count all published products under this category (including subcategories)
    const count = cat.products.filter(p => isProductPublished(p)).length
    // Leaf nodes: show if has at least 1 published product
    if (isLeafNode(cat)) return count >= 1
    // Container categories: show if has >= MIN_PRODUCTS_TO_SHOW published products
    return count >= MIN_PRODUCTS_TO_SHOW
  })
}

// Get visible subcategories for a category
export const getVisibleSubCategories = (category: Category, _allProducts: Product[]): SubCategory[] => {
  return category.subCategories.filter(sub => {
    if (sub.published === false) return false
    // Count published products under this subcategory
    const count = category.products.filter(p => 
      p.subCategoryId === sub.id && isProductPublished(p)
    ).length
    return count >= MIN_PRODUCTS_TO_SHOW
  })
}

// Filter categories for navigation: only published categories with at least 3 published products
export const getPublishedCategories = (categories: Category[]): Category[] => {
  return categories.filter(cat => {
    if (cat.published === false) return false
    const publishedProducts = cat.products.filter(p => isProductPublished(p))
    return publishedProducts.length >= 3
  })
}

// Get published products for a category (content-complete products)
export const getPublishedProducts = (category: Category): Product[] => {
  return category.products.filter(p => isProductPublished(p))
}

// Check if a category has enough published products for navigation visibility (>= 3)
export const hasEnoughProductsForNav = (category: Category, minCount = 3): boolean => {
  return getPublishedProducts(category).length >= minCount
}

// Get all categories with their published product counts
export const getCategoryProductCounts = (categories: Category[]): { category: Category; count: number }[] => {
  return categories
    .filter(cat => cat.published !== false)
    .map(cat => ({ category: cat, count: getPublishedProducts(cat).length }))
}


// Sight Glasses Comparison Table Data
export const sightGlassesComparison = {
  title: "Refrigeration Sight Glasses",
  subtitle: "Five sight glass series for refrigeration and HVAC systems — from brazed ODF to SAE flare, NPT threaded, and oil level indicators.",
  headers: ["#", "Product", "Function", "Connection", "Port Range", "Moisture Indicator", "MWP", "Temp Range", "Models"],
  rows: [
    ["1", "Moisture Indicator Sight Glass (Brazed ODF)", "Moisture & Flow Indicator", "Brazed (ODF)", "1/4\"–1-1/8\"", "Yes", "45 bar", "-40~+80°C", "7"],
    ["2", "Moisture Indicator Sight Glass (SAE Flare)", "Moisture & Flow Indicator", "SAE Flare (UNF)", "1/4\"–3/4\"", "Yes", "45 bar", "-40~+80°C", "5"],
    ["3", "Moisture Indicator Sight Glass (SAE Flare, M/F)", "Moisture & Flow Indicator", "SAE Flare, M/F", "1/4\"–5/8\"", "Yes", "45 bar", "-40~+80°C", "4"],
    ["4", "Moisture Indicator Sight Glass (NPT Threaded)", "Moisture & Flow Indicator", "NPT Threaded", "3/4\"", "Yes", "45 bar", "-40~+80°C", "1"],
    ["5", "Oil Level Sight Glass (G Thread)", "Oil Level Indicator", "G Thread (BSPP)", "3/4\"", "No", "45 bar", "-40~+80°C", "1"],
  ],
};

export const categories: Category[] = [
  {
    id: 'copper-tubes',
    name: 'Copper Tubes',
    icon: 'Circle',
    subCategories: [
      { id: 'pancake-coils', name: 'Pancake Coils' },
      { id: 'mini-jumbo-coils', name: 'Mini Jumbo Coils' },
      { id: 'jumbo-coils', name: 'Jumbo Coils' },
      { id: 'straight-tubes', name: 'Straight Tubes' },
    ],
    products: [

      {
        id: 'ct-mjc-1',
        categoryId: 'copper-tubes',
        subCategoryId: 'mini-jumbo-coils',
        images: [
          '/images/mini-jumbo-01.jpg',
          '/images/mini-jumbo-02.jpg',
          '/images/mini-jumbo-03.jpg',
          '/images/mini-jumbo-04.jpg',
          '/images/mini-jumbo-05.jpg',
        ],
        metaTitle: "Mini Jumbo Copper Coil Supplier | LWC Soft Copper Coil",
        metaDescription: "Wholesale soft copper mini jumbo coil for HVAC & refrigeration. O60, 1/4\"–1-1/8\" OD, level-wound LWC ~50kg/roll, ASTM B280, ECT tested. Low MOQ.",
        name: "ACR Soft Copper Mini Jumbo Coil for Air Conditioning & Refrigeration",
        shortDesc: "Level-wound soft copper mini jumbo coil (LWC without reel) for AC installation and refrigeration projects. Sizes 1/4\"–1-1/8\" OD, supplied at ~50 kg per roll. O60 annealed, ASTM B280, 100% ECT tested. Low MOQ, ready to ship.",
        description: "ACR soft copper mini jumbo coil is the compact level-wound coil (LWC) format for air conditioning and refrigeration installations. Made from C12200 (TP2) phosphorus-deoxidized copper and produced to ASTM B280 and EN 12735-1 standards, mini jumbo coils share the exact same OD and wall-thickness program as our jumbo coils — the only difference is the roll size: mini jumbo coils weigh approximately 50 kg per roll and are wound without a wooden reel, while jumbo coils weigh approximately 110 kg per roll on a wooden bobbin.\n\nEach roll is sold by net weight. Because every size uses the same target roll weight, the tube length per roll varies with OD and wall thickness — smaller diameters yield more meters per roll. The ~50 kg format can be handled by one or two technicians without a forklift or reel dispenser, while still offering far longer continuous runs than pancake coils, reducing coupling joints and leak points on mini-split, VRF and light commercial jobs.",
        features: [
          "Level-wound coil (LWC) without wooden reel — compact and easy to handle on site",
          "Same OD, wall thickness and specifications as jumbo coil; only the roll size differs (~50 kg vs ~110 kg)",
          "Sold by net weight (~50 kg per roll); tube length per roll depends on OD and wall thickness",
          "Manually portable — no forklift or dispensing rack required",
          "Longer continuous runs than pancake coils, reducing joints and leak points",
          "O60 soft annealed temper for easy field bending and flaring",
          "Phosphorus-deoxidized copper, Cu+Ag ≥ 99.90%; compatible with R22, R410A and R32",
          "100% online eddy current tested; bright, clean, oxidation-free inner surface",
          "Optional nitrogen purging and end-sealing; MTC (EN 10204 3.1) per shipment",
        ],
        specTable: {
          headers: ['OD (Inch)', 'OD (mm)', 'Wall Thickness (mm)', 'Weight per Meter (kg)', 'Approx. Length per Roll (m, ~50 kg)'],
          rows: [
            ['1/4"', '6.35', '0.6', '0.0966', '518'],
            ['1/4"', '6.35', '0.7', '0.1108', '451'],
            ['1/4"', '6.35', '0.8', '0.1244', '402'],
            ['3/8"', '9.52', '0.6', '0.15', '333'],
            ['3/8"', '9.52', '0.7', '0.173', '289'],
            ['3/8"', '9.52', '0.75', '0.1842', '271'],
            ['3/8"', '9.52', '0.8', '0.1954', '256'],
            ['1/2"', '12.7', '0.7', '0.2352', '213'],
            ['1/2"', '12.7', '0.75', '0.251', '199'],
            ['1/2"', '12.7', '0.8', '0.2666', '188'],
            ['5/8"', '15.88', '0.8', '0.3378', '148'],
            ['5/8"', '15.88', '0.9', '0.3776', '132'],
            ['5/8"', '15.88', '1.0', '0.4168', '120'],
            ['3/4"', '19.05', '0.9', '0.4574', '109'],
            ['3/4"', '19.05', '1.0', '0.5054', '99'],
            ['7/8"', '22.2', '1.0', '0.5936', '84'],
            ['7/8"', '22.2', '1.1', '0.65', '77'],
            ['7/8"', '22.2', '1.2', '0.7056', '71'],
            ['1"', '25.4', '1.0', '0.6844', '73'],
            ['1"', '25.4', '1.1', '0.7502', '67'],
            ['1"', '25.4', '1.2', '0.8152', '61'],
            ['1-1/8"', '28.6', '1.0', '0.771', '65'],
            ['1-1/8"', '28.6', '1.1', '0.8454', '59'],
            ['1-1/8"', '28.6', '1.2', '0.9192', '54'],
          ],
        },
        applications: "Split AC / mini-split and VRF installation, central AC / chiller systems, commercial refrigeration and cold storage, heat pump systems, service trucks, contractors and wholesalers needing portable bulk coils",
        materialStandard: [
          { label: "Material", value: "C12200 (ASTM) / Cu-DHP (EN) / TP2 (GB) — Phosphorus-Deoxidized Copper" },
          { label: "Copper Content", value: "Cu+Ag ≥ 99.90%" },
          { label: "Temper", value: "O60 (Annealed / Soft), Elongation ≥ 40%" },
          { label: "Standards", value: "ASTM B280; EN 12735-1; GB/T 17791; GB/T 1527; GB/T 18033-2017; YS/T 450; ASTM B68; ASTM B75; ASTM B88; AS 1571; JIS H3300; EN 1057" },
          { label: "OD Tolerance", value: "Per ASTM B280 (OD ±0.025mm~0.051mm depending on size)" },
          { label: "Wall Tolerance", value: "Per ASTM B280 / GB/T 17791" },
          { label: "Eddy Current Testing", value: "100% online ECT" },
          { label: "Mill Test Certificate", value: "EN 10204 3.1 per batch" },
        ],
        specs: [
          { label: "Nominal Roll Weight", value: "~50 kg per roll (sold by net weight; tube length per roll varies with OD and wall thickness)" },
          { label: "Outer Diameter", value: "1/4\" (6.35mm), 3/8\" (9.52mm), 1/2\" (12.7mm), 5/8\" (15.88mm), 3/4\" (19.05mm), 7/8\" (22.2mm), 1\" (25.4mm), 1-1/8\" (28.6mm)" },
          { label: "Wall Thickness", value: "0.6mm, 0.7mm, 0.8mm, 0.9mm, 1.0mm, 1.1mm, 1.2mm" },
          { label: "Packaging", value: "Level-wound without reel, individually packed in cartons or polyethylene wrapping, bundled on wooden pallets for safe international transport" },
        ],
      },
      {
        id: 'ct-1',
        categoryId: 'copper-tubes',
        subCategoryId: 'jumbo-coils',
        name: 'ACR Soft Copper Jumbo Coil for HVAC Refrigeration Systems',
        shortDesc: 'Level-wound soft copper jumbo coil for high-volume AC installation and refrigeration. Sizes 1/4"–1-1/8" OD, 30M/50M lengths. O60 annealed, ASTM B280. Low MOQ, ready to ship.',
        description: 'ACR soft copper jumbo coil is designed for high-volume AC installation and refrigeration projects where longer continuous runs reduce joint connections and installation time. Made from C12200 (TP2) phosphorus-deoxidized copper, our jumbo coils comply with ASTM B280 and EN 12735-1 standards.\n\nThe level-wound format allows smooth, tangle-free dispensing during installation, while the O60 soft annealed temper ensures easy bending and flaring on-site. Each coil is 100% eddy current tested and supplied with a Mill Test Certificate (EN 10204 3.1).',
        images: [
          '/images/jumbo-coil-01.jpg',
          '/images/jumbo-coil-02.jpg',
          '/images/jumbo-coil-03.jpg',
          '/images/jumbo-coil-04.jpg',
          '/images/jumbo-coil-05.jpg',
        ],
        features: [
          'Level-wound for smooth dispensing — no tangles during installation',
          'O60 soft annealed temper for easy field bending',
          'Extended lengths (30M / 50M) reduce coupling joints and leak points',
          'Compatible with R22, R410A, and R32 refrigerants',
          '100% online eddy current tested',
          'Bright, clean, oxidation-free inner surface',
          'Optional nitrogen purging and end-sealing',
          'MTC (EN 10204 3.1) provided with each shipment',
        ],
        applications: 'Split AC / mini-split installation, VRF / VRV systems, central AC / chiller systems, commercial refrigeration, heat pump systems',
        materialStandard: [
          { label: 'Material', value: 'C12200 (ASTM) / Cu-DHP (EN) / TP2 (GB) — Phosphorus-Deoxidized Copper' },
          { label: 'Copper Content', value: 'Cu+Ag ≥ 99.90%' },
          { label: 'Temper', value: 'O60 (Annealed / Soft), Elongation ≥ 40%' },
          { label: 'Standards', value: 'ASTM B280; EN 12735-1; GB/T 17791; GB/T 1527; GB/T 18033-2017; YS/T 450; ASTM B68; ASTM B75; ASTM B88; AS 1571; JIS H3300; EN 1057' },
          { label: 'OD Tolerance', value: 'Per ASTM B280 (OD ±0.025mm~0.051mm depending on size)' },
          { label: 'Wall Tolerance', value: 'Per ASTM B280 / GB/T 17791' },
          { label: 'Eddy Current Testing', value: '100% online ECT' },
          { label: 'Mill Test Certificate', value: 'EN 10204 3.1 per batch' },
        ],
        specTable: {
          headers: ['OD (Inch)', 'OD (mm)', 'Wall Thickness (mm)', 'Weight per 30M Coil (kg)', 'Weight per 50M Coil (kg)'],
          rows: [
            ['1/4"', '6.35', '0.6', '2.90', '4.83'],
            ['1/4"', '6.35', '0.7', '3.32', '5.54'],
            ['1/4"', '6.35', '0.8', '3.73', '6.22'],
            ['3/8"', '9.52', '0.6', '4.50', '7.50'],
            ['3/8"', '9.52', '0.7', '5.19', '8.65'],
            ['3/8"', '9.52', '0.75', '5.53', '9.21'],
            ['3/8"', '9.52', '0.8', '5.86', '9.77'],
            ['1/2"', '12.7', '0.7', '7.06', '11.76'],
            ['1/2"', '12.7', '0.75', '7.53', '12.55'],
            ['1/2"', '12.7', '0.8', '8.00', '13.33'],
            ['5/8"', '15.88', '0.8', '10.13', '16.89'],
            ['5/8"', '15.88', '0.9', '11.33', '18.88'],
            ['5/8"', '15.88', '1.0', '12.50', '20.84'],
            ['3/4"', '19.05', '0.9', '13.72', '22.87'],
            ['3/4"', '19.05', '1.0', '15.16', '25.27'],
            ['7/8"', '22.2', '1.0', '17.81', '29.68'],
            ['7/8"', '22.2', '1.1', '19.50', '32.50'],
            ['7/8"', '22.2', '1.2', '21.17', '35.28'],
            ['1"', '25.4', '1.0', '20.50', '34.16'],
            ['1"', '25.4', '1.1', '22.46', '37.43'],
            ['1"', '25.4', '1.2', '24.36', '40.60'],
            ['1-1/8"', '28.6', '1.0', '23.18', '38.64'],
            ['1-1/8"', '28.6', '1.1', '25.41', '42.35'],
            ['1-1/8"', '28.6', '1.2', '27.62', '46.04'],
          ],
        },
      },
      {
        id: 'ct-3',
        categoryId: 'copper-tubes',
        subCategoryId: 'pancake-coils',
        name: 'ACR Soft Copper Pancake Coil for Air Conditioning & Refrigeration',
        shortDesc: 'Soft annealed (O60) copper pancake coil for split AC installation and refrigeration systems. Sizes 1/4"–7/8" OD, 15M/30M lengths. 100% eddy current tested. Low MOQ, ready to ship.',
        description: 'ACR soft copper pancake coil is the most widely used copper tubing for split air conditioner installation and refrigeration systems. Made from phosphorus-deoxidized copper (C12200 / TP2), our pancake coils are produced to ASTM B280 and EN 12735-1 standards, ensuring reliable performance across R22, R410A, and R32 refrigerant systems.\n\nThe O60 annealed (soft) temper allows easy bending and flaring on-site, making it the preferred choice for HVAC technicians handling mini-split, VRF, and heat pump installations. Each coil undergoes 100% online eddy current testing (ECT) to guarantee wall integrity, and comes with a Mill Test Certificate (EN 10204 3.1) for every batch.',
        images: [
          '/images/pancake-coil-01.jpg',
          '/images/pancake-coil-02.jpg',
          '/images/pancake-coil-03.png',
          '/images/pancake-coil-04.jpg',
          '/images/pancake-coil-05.jpg',
        ],
        features: [
          'O60 soft annealed temper for easy field bending',
          'Phosphorus-deoxidized copper, Cu+Ag ≥ 99.90%',
          'Compatible with R22, R410A, and R32 refrigerants',
          '100% online eddy current tested',
          'Bright, clean, oxidation-free inner surface',
          'Optional nitrogen purging and end-sealing',
          'MTC (EN 10204 3.1) provided with each shipment',
        ],
        applications: 'Split AC / mini-split installation, light commercial / VRF systems, central AC / chiller systems, refrigeration and cold storage, heat pump systems',
        materialStandard: [
          { label: 'Material', value: 'C12200 (ASTM) / Cu-DHP (EN) / TP2 (GB) — Phosphorus-Deoxidized Copper' },
          { label: 'Copper Content', value: 'Cu+Ag ≥ 99.90%' },
          { label: 'Temper', value: 'O60 (Annealed / Soft), Elongation ≥ 40%' },
          { label: 'Standards', value: 'ASTM B280; EN 12735-1; GB/T 17791; GB/T 1527; GB/T 18033-2017; YS/T 450; ASTM B68; ASTM B75; ASTM B88; AS 1571; JIS H3300; EN 1057' },
          { label: 'OD Tolerance', value: 'Per ASTM B280 (OD ±0.025mm~0.051mm depending on size)' },
          { label: 'Wall Tolerance', value: 'Per ASTM B280 / GB/T 17791' },
          { label: 'Eddy Current Testing', value: '100% online ECT' },
          { label: 'Mill Test Certificate', value: 'EN 10204 3.1 per batch' },
        ],
        specTable: {
          headers: ['OD (Inch)', 'OD (mm)', 'Wall Thickness (mm)', 'Weight per 15M Coil (kg)', 'Weight per 30M Coil (kg)'],
          rows: [
            ['1/4"', '6.35', '0.6', '1.45', '2.90'],
            ['1/4"', '6.35', '0.7', '1.66', '3.32'],
            ['1/4"', '6.35', '0.8', '1.86', '3.72'],
            ['3/8"', '9.52', '0.6', '2.25', '4.50'],
            ['3/8"', '9.52', '0.7', '2.59', '5.18'],
            ['3/8"', '9.52', '0.75', '2.76', '5.52'],
            ['3/8"', '9.52', '0.8', '2.93', '5.86'],
            ['1/2"', '12.7', '0.7', '3.53', '7.06'],
            ['1/2"', '12.7', '0.75', '3.77', '7.54'],
            ['1/2"', '12.7', '0.8', '4.00', '8.00'],
            ['5/8"', '15.88', '0.8', '5.07', '10.14'],
            ['5/8"', '15.88', '0.9', '5.66', '11.32'],
            ['5/8"', '15.88', '1.0', '6.25', '12.50'],
            ['3/4"', '19.05', '0.9', '6.86', '13.72'],
            ['3/4"', '19.05', '1.0', '7.58', '15.16'],
            ['7/8"', '22.2', '1.0', '8.90', '17.80'],
            ['7/8"', '22.2', '1.1', '9.75', '19.50'],
            ['7/8"', '22.2', '1.2', '10.58', '21.16'],
          ],
        },
      },
      {
        id: 'ct-4',
        categoryId: 'copper-tubes',
        subCategoryId: 'straight-tubes',
        name: 'ACR Hard Copper Straight Tube for HVAC & Refrigeration',
        shortDesc: 'Hard drawn (H80) copper straight tube for HVAC & refrigeration. H80 hard drawn, 1/4"–2-1/8" OD, 3M length. 100% ECT tested, MTC per batch. Low MOQ China supplier.',
        description: 'ACR hard copper straight tube is manufactured from C12200 (TP2) phosphorus-deoxidized copper, designed for HVAC and refrigeration piping systems that require rigid, structurally stable piping. Produced to GB/T 1527, GB/T 17791, and ASTM B75 standards, each tube undergoes 100% eddy current testing and is supplied with a Mill Test Certificate (EN 10204 3.1).\n\nThe hard-drawn temper maintains straightness during transport and installation, making it ideal for applications where rigid piping is required.',
        images: [
          '/images/straight-tube-01.jpg',
          '/images/straight-tube-02.jpg',
          '/images/straight-tube-03.jpg',
          '/images/straight-tube-04.jpg',
          '/images/straight-tube-05.jpg',
        ],
        features: [
          'H80 hard drawn temper for structural rigidity',
          'Phosphorus-deoxidized copper, Cu+Ag ≥ 99.90%',
          'Compatible with R22, R410A, and R32 refrigerants',
          '100% online eddy current tested',
          'Standard 3M straight lengths',
          'MTC (EN 10204 3.1) provided with each shipment',
        ],
        applications: 'Central air conditioning connection lines, VRF / VRV and heat pump systems, commercial refrigeration, medical gas piping, water and gas lines, electrical conductivity piping',
        materialStandard: [
          { label: 'Material', value: 'C12200 (ASTM) / Cu-DHP (EN) / TP2 (GB) — Phosphorus-Deoxidized Copper' },
          { label: 'Copper Content', value: 'Cu+Ag ≥ 99.90%' },
          { label: 'Temper', value: 'H80 (Hard Drawn)' },
          { label: 'Standards', value: 'GB/T 1527-2017; GB/T 17791-2017; GB/T 18033-2017; ASTM B75; EN 12735-1; JIS H3300' },
          { label: 'OD Tolerance', value: 'Per GB/T 1527 / GB/T 17791' },
          { label: 'Wall Tolerance', value: 'Per GB/T 1527 / GB/T 17791' },
          { label: 'Eddy Current Testing', value: '100% online ECT' },
          { label: 'Mill Test Certificate', value: 'EN 10204 3.1 per batch' },
        ],
        specTable: {
          headers: ['OD (Inch)', 'OD (mm)', 'Wall Thickness (mm)', 'Weight per 3M (kg)'],
          rows: [
            ['1/4"', '6.35', '0.6', '0.29'],
            ['1/4"', '6.35', '0.7', '0.33'],
            ['1/4"', '6.35', '0.8', '0.37'],
            ['3/8"', '9.52', '0.6', '0.45'],
            ['3/8"', '9.52', '0.7', '0.52'],
            ['3/8"', '9.52', '0.75', '0.55'],
            ['3/8"', '9.52', '0.8', '0.59'],
            ['1/2"', '12.7', '0.7', '0.71'],
            ['1/2"', '12.7', '0.75', '0.75'],
            ['1/2"', '12.7', '0.8', '0.80'],
            ['5/8"', '15.88', '0.8', '1.01'],
            ['5/8"', '15.88', '0.9', '1.13'],
            ['5/8"', '15.88', '1.0', '1.25'],
            ['3/4"', '19.05', '0.9', '1.37'],
            ['3/4"', '19.05', '1.0', '1.52'],
            ['7/8"', '22.2', '1.0', '1.78'],
            ['7/8"', '22.2', '1.1', '1.95'],
            ['7/8"', '22.2', '1.2', '2.12'],
            ['1"', '25.4', '1.0', '2.05'],
            ['1"', '25.4', '1.1', '2.25'],
            ['1"', '25.4', '1.2', '2.44'],
            ['1-1/8"', '28.6', '1.0', '2.32'],
            ['1-1/8"', '28.6', '1.1', '2.54'],
            ['1-1/8"', '28.6', '1.2', '2.76'],
            ['1-1/4"', '31.8', '1.1', '2.84'],
            ['1-1/4"', '31.8', '1.2', '3.08'],
            ['1-1/4"', '31.8', '1.5', '3.82'],
            ['1-3/8"', '34.9', '1.3', '3.67'],
            ['1-3/8"', '34.9', '1.4', '3.94'],
            ['1-3/8"', '34.9', '1.5', '4.21'],
            ['1-1/2"', '38.1', '1.3', '4.02'],
            ['1-1/2"', '38.1', '1.4', '4.32'],
            ['1-1/2"', '38.1', '1.5', '4.61'],
            ['1-5/8"', '41.3', '1.4', '4.69'],
            ['1-5/8"', '41.3', '1.5', '5.01'],
            ['2-1/8"', '53.9', '1.5', '6.60'],
            ['2-1/8"', '53.9', '1.8', '7.88'],
            ['2-1/8"', '53.9', '2.0', '8.72'],
          ],
        },
      },
    ],
  },
  {
    id: 'copper-fittings',
    name: 'Copper Fittings',
    icon: 'GitBranch',
    subCategories: [
      { id: 'elbows', name: 'Elbows' },
      { id: 'tees', name: 'Tees' },
      { id: 'couplings', name: 'Couplings' },
      { id: 'flare-fittings', name: 'Flare Fittings' },
      { id: 'adapters-reducers', name: 'Adapters & Reducers' },
    ],
    products: [
      { id: 'cf-1', categoryId: 'copper-fittings', subCategoryId: 'elbows', name: 'Copper Elbow 90°', shortDesc: '90-degree copper elbow for piping direction changes.', description: 'Precision-manufactured 90° copper elbows for smooth direction changes in refrigeration piping.', specs: [{ label: 'Sizes', value: '1/4" - 4"' }, { label: 'Type', value: 'Solder / Flare' }, { label: 'Material', value: 'C12200' }], applications: 'HVAC piping, refrigeration systems' },
      { id: 'cf-2', categoryId: 'copper-fittings', subCategoryId: 'tees', name: 'Copper Tee', shortDesc: 'Equal and reducing tees for branch connections.', description: 'Copper tees for creating branch connections in piping systems. Available in equal and reducing configurations.', specs: [{ label: 'Sizes', value: '1/4" - 4"' }, { label: 'Type', value: 'Equal / Reducing' }], applications: 'Refrigeration manifold, HVAC distribution' },
      { id: 'cf-3', categoryId: 'copper-fittings', subCategoryId: 'couplings', name: 'Copper Coupling', shortDesc: 'Straight couplings for tube-to-tube connections.', description: 'Straight copper couplings for joining two copper tubes of the same diameter.', specs: [{ label: 'Sizes', value: '1/4" - 4"' }], applications: 'Pipe extension, repair connections' },
      { id: 'cf-4', categoryId: 'copper-fittings', subCategoryId: 'flare-fittings', name: 'Flare Fittings', shortDesc: 'Flare-type fittings for leak-proof connections.', description: 'Precision flare fittings for reliable, leak-proof connections in HVAC and refrigeration systems.', specs: [{ label: 'Sizes', value: '1/4" - 1-1/8"' }, { label: 'Type', value: '45° flare' }], applications: 'AC installation, gas piping' },
      { id: 'cf-5', categoryId: 'copper-fittings', subCategoryId: 'adapters-reducers', name: 'Adapter & Reducer', shortDesc: 'Transition fittings for different tube sizes.', description: 'Copper adapters and reducers for connecting tubes of different diameters or transitioning between connection types.', specs: [{ label: 'Sizes', value: 'Various' }, { label: 'Type', value: 'Concentric / Eccentric' }], applications: 'System retrofit, size transition' },
    ],
  },
  {
    id: 'insulation-tubes',
    name: 'Insulation Tubes',
    icon: 'Shield',
    subCategories: [
      { id: 'standard-b1-rubber-foam-insulation', name: 'Standard B1 Rubber Foam Insulation' },
      { id: 'high-density-b1-rubber-foam-insulation', name: 'High-Density B1 Rubber Foam Insulation' },
    ],
    products: [
      {
        id: 'im-1',
        categoryId: 'insulation-tubes',
        subCategoryId: 'standard-b1-rubber-foam-insulation',
        name: 'Standard B1 Rubber Foam Insulation Tube',
        metaTitle: 'Wholesale Standard B1 Rubber Foam Insulation Tube | HVACR NET',
        metaDescription: 'Standard B1 NBR/PVC rubber foam insulation tube, density 55 kg/m³, OD 6–48 mm, wall 9–20 mm. Black & blue, flexible, flame-retardant. MOQ 1 pc. Supplier from China.',
        shortDesc: 'B1-class NBR/PVC rubber foam insulation tube with 55 kg/m³ density. Available in black (standard) and blue (optional). Flexible closed-cell structure for HVAC piping, refrigeration lines, and plumbing. Flame-retardant, low thermal conductivity, and high water vapour resistance.',
        description: 'Our Standard B1 rubber foam insulation tube is the go-to choice for general-purpose thermal insulation in HVAC, refrigeration, and plumbing systems. Built on a proven NBR/PVC blend with 55 kg/m³ density, it delivers reliable performance at a competitive price point—ideal for contractors, maintenance teams, and distributors who need consistent quality without over-specifying.\n\nMade from nitrile butadiene rubber (NBR) blended with polyvinyl chloride (PVC), this closed-cell foam prevents moisture ingress and eliminates the need for a separate vapour barrier. The B1 fire rating (Class 1 per GB/T 17794-2021) ensures the material self-extinguishes and produces low smoke density in fire conditions.',
        features: [
          'B1 Fire Rating (Class C-s2, d0, t1) — Self-extinguishing, low smoke density ≤41, LOI ≥35%',
          'Low Thermal Conductivity — 0.033 W/(m·K) at 0°C, effective for energy-saving insulation',
          'High Water Vapour Resistance — μ ≥ 12,000, closed-cell structure blocks moisture penetration',
          'Low Water Absorption — ≤0.17%, maintains insulation performance in humid environments',
          'Flexible & Easy to Install — High rebound rate (≥80%), conforms to pipes and fittings without cracking',
          'Wide Compatibility — Fits copper tube OD from 6 mm to 48 mm (1/4" to 1-7/8"), wall thickness 9/13/15/20 mm',
          'Temperature Range — -40°C to +105°C, suitable for chilled water, refrigerant lines, and hot water',
        ],
        materialStandard: [
          { label: 'Material', value: 'NBR/PVC (Nitrile Butadiene Rubber / Polyvinyl Chloride)' },
          { label: 'Fire Rating', value: 'B1 (GB/T 17794-2021), Class C-s2, d0, t1 (EN 13501-1)' },
          { label: 'Density', value: '55 kg/m³' },
          { label: 'Standard', value: 'GB/T 17794-2021, EN 14304' },
          { label: 'Color', value: 'Black (standard), Blue (optional)' },
          { label: 'Cell Structure', value: 'Closed-cell' },
        ],
        specTable: {
          headers: ['Model', 'For Copper Tube OD', 'OD (mm)', 'Wall (mm)', 'Length (m)', 'Color', 'Packing (PCS/bag)'],
          rows: [
            ['ZJ-BK-6×9', '1/4"', '6', '9', '2', 'Black', '180'],
            ['ZJ-BK-10×9', '3/8"', '10', '9', '2', 'Black', '140'],
            ['ZJ-BK-13×9', '1/2"', '13', '9', '2', 'Black', '120'],
            ['ZJ-BK-16×9', '5/8"', '16', '9', '2', 'Black', '100'],
            ['ZJ-BK-19×9', '3/4"', '19', '9', '2', 'Black', '100'],
            ['ZJ-BK-25×9', '1"', '25', '9', '2', 'Black', '80'],
            ['ZJ-BK-32×9', '1-1/4"', '32', '9', '2', 'Black', '60'],
            ['ZJ-BK-43×9', '1-5/8"', '43', '9', '2', 'Black', '50'],
            ['ZJ-BK-48×9', '1-7/8"', '48', '9', '2', 'Black', '50'],
            ['ZJ-BK-6×15', '1/4"', '6', '15', '2', 'Black', '100'],
            ['ZJ-BK-10×15', '3/8"', '10', '15', '2', 'Black', '80'],
            ['ZJ-BK-13×15', '1/2"', '13', '15', '2', 'Black', '80'],
            ['ZJ-BK-16×15', '5/8"', '16', '15', '2', 'Black', '60'],
            ['ZJ-BK-20×15', '3/4"', '20', '15', '2', 'Black', '60'],
            ['ZJ-BK-16×20', '5/8"', '16', '20', '2', 'Black', '50'],
            ['ZJ-BK-20×20', '3/4"', '20', '20', '2', 'Black', '45'],
            ['ZJ-BK-22×20', '7/8"', '22', '20', '2', 'Black', '40'],
            ['ZJ-BK-25×20', '1"', '25', '20', '2', 'Black', '40'],
            ['ZJ-BK-28×20', '1-1/8"', '28', '20', '2', 'Black', '35'],
            ['ZJ-BK-34×20', '1-1/4"', '34', '20', '2', 'Black', '30'],
            ['ZJ-BK-38×20', '1-1/2"', '38', '20', '2', 'Black', '30'],
            ['ZJ-BK-43×20', '1-5/8"', '43', '20', '2', 'Black', '25'],
            ['ZJ-BK-48×20', '1-7/8"', '48', '20', '2', 'Black', '25'],
            ['ZJ-BL-6×9', '1/4"', '6', '9', '2', 'Blue', '180'],
            ['ZJ-BL-10×9', '3/8"', '10', '9', '2', 'Blue', '140'],
            ['ZJ-BL-13×9', '1/2"', '13', '9', '2', 'Blue', '120'],
            ['ZJ-BL-16×9', '5/8"', '16', '9', '2', 'Blue', '100'],
            ['ZJ-BL-19×9', '3/4"', '19', '9', '2', 'Blue', '100'],
            ['ZJ-BL-25×9', '1"', '25', '9', '2', 'Blue', '80'],
            ['ZJ-BL-32×9', '1-1/4"', '32', '9', '2', 'Blue', '60'],
            ['ZJ-BL-43×9', '1-5/8"', '43', '9', '2', 'Blue', '50'],
            ['ZJ-BL-48×9', '1-7/8"', '48', '9', '2', 'Blue', '50'],
            ['ZJ-BL-6×13', '1/4"', '6', '13', '2', 'Blue', '120'],
            ['ZJ-BL-10×13', '3/8"', '10', '13', '2', 'Blue', '110'],
            ['ZJ-BL-13×13', '1/2"', '13', '13', '2', 'Blue', '100'],
            ['ZJ-BL-16×13', '5/8"', '16', '13', '2', 'Blue', '80'],
            ['ZJ-BL-6×15', '1/4"', '6', '15', '2', 'Blue', '100'],
            ['ZJ-BL-10×15', '3/8"', '10', '15', '2', 'Blue', '80'],
            ['ZJ-BL-13×15', '1/2"', '13', '15', '2', 'Blue', '80'],
            ['ZJ-BL-16×15', '5/8"', '16', '15', '2', 'Blue', '60'],
            ['ZJ-BL-20×15', '3/4"', '20', '15', '2', 'Blue', '60'],
            ['ZJ-BL-16×20', '5/8"', '16', '20', '2', 'Blue', '50'],
            ['ZJ-BL-20×20', '3/4"', '20', '20', '2', 'Blue', '45'],
            ['ZJ-BL-22×20', '7/8"', '22', '20', '2', 'Blue', '40'],
            ['ZJ-BL-25×20', '1"', '25', '20', '2', 'Blue', '40'],
            ['ZJ-BL-28×20', '1-1/8"', '28', '20', '2', 'Blue', '35'],
            ['ZJ-BL-34×20', '1-1/4"', '34', '20', '2', 'Blue', '30'],
            ['ZJ-BL-38×20', '1-1/2"', '38', '20', '2', 'Blue', '30'],
            ['ZJ-BL-43×20', '1-5/8"', '43', '20', '2', 'Blue', '25'],
            ['ZJ-BL-48×20', '1-7/8"', '48', '20', '2', 'Blue', '25'],
          ],
        },
        applications: 'Air conditioning chilled water pipes, refrigeration suction and discharge lines, hot and cold water plumbing systems, ductwork insulation, HVAC maintenance and retrofit projects',
        images: [
          '/images/standard-b1-01.jpg',
          '/images/standard-b1-02.jpg',
          '/images/standard-b1-03.jpg',
          '/images/standard-b1-04.jpg',
          '/images/standard-b1-05.jpg',
        ],
      },
      {
        id: 'im-2',
        categoryId: 'insulation-tubes',
        subCategoryId: 'high-density-b1-rubber-foam-insulation',
        name: 'High-Density B1 Rubber Foam Insulation Tube',
        metaTitle: 'Wholesale High-Density B1 Rubber Foam Insulation Tube | HVACR NET',
        metaDescription: 'High-density B1 NBR/PVC rubber foam insulation tube, 65 kg/m³, OD 6–32 mm, wall 9–20 mm. Blue & red, low TVOC, RoHS, -50 to 110°C. MOQ 1 pc. China supplier.',
        shortDesc: 'Premium high-density B1 rubber foam insulation tube at 65 kg/m³ for demanding HVAC and refrigeration applications. Available in blue and red. Features ultra-low TVOC emission (≤0.02 mg/m³), RoHS compliance, and Green Building 3-star certification. Wider temperature range (-50°C to +110°C) and higher structural rigidity than standard density foam.',
        description: 'Our High-Density B1 rubber foam insulation tube is engineered for projects that demand superior structural integrity, wider operating temperature range, and stricter environmental compliance. At 65 kg/m³ density, this tube offers enhanced rigidity and durability compared to standard 55 kg/m³ foam—ideal for critical HVAC systems, clean-room environments, and green building projects with low-VOC requirements.\n\nManufactured from high-grade NBR/PVC compound with optimized foaming process, the 65 kg/m³ density creates a tighter closed-cell structure that resists compression and maintains shape over time. The B1 fire rating ensures self-extinguishing performance with low smoke emission. Ultra-low TVOC formulation (≤0.02 mg/m³) meets stringent indoor air quality standards for hospitals, laboratories, and commercial buildings.',
        features: [
          'High Density 65 kg/m³ — Enhanced rigidity and structural stability, resists compression and deformation',
          'B1 Fire Rating (Class C-s2, d0, t1) — Self-extinguishing, low smoke density, LOI ≥36%',
          'Wider Temperature Range — -50°C to +110°C, suitable for extreme cold and hot water applications',
          'Ultra-Low TVOC Emission — ≤0.02 mg/m³, meets green building and indoor air quality standards',
          'RoHS Compliant — Free from heavy metals and hazardous substances',
          'Green Building 3-Star Certified — Meets China\'s highest green building material standard',
          'High Water Vapour Resistance — μ ≥ 10,000, closed-cell structure blocks moisture',
          'Color Options — Blue and red available for color-coding hot/cold lines or system identification',
        ],
        materialStandard: [
          { label: 'Material', value: 'NBR/PVC (Nitrile Butadiene Rubber / Polyvinyl Chloride)' },
          { label: 'Fire Rating', value: 'B1 (GB/T 17794-2021), Class C-s2, d0, t1 (EN 13501-1)' },
          { label: 'Density', value: '65 kg/m³' },
          { label: 'Standard', value: 'GB/T 17794-2021, EN 14304' },
          { label: 'Color', value: 'Blue (standard), Red (optional)' },
          { label: 'Cell Structure', value: 'Closed-cell' },
          { label: 'TVOC Emission', value: '≤0.02 mg/m³' },
          { label: 'Certifications', value: 'RoHS, Green Building 3-Star' },
        ],
        specTable: {
          headers: ['Model', 'For Copper Tube OD', 'OD (mm)', 'Wall (mm)', 'Length (m)', 'Color', 'Packing (PCS/bag)'],
          rows: [
            ['JH-BL-25×9', '1"', '25', '9', '1.8', 'Blue', '56'],
            ['JH-BL-32×9', '1-1/4"', '32', '9', '1.8', 'Blue', '—'],
            ['JH-BL-6×15', '1/4"', '6', '15', '2', 'Blue', '81'],
            ['JH-BL-10×15', '3/8"', '10', '15', '2', 'Blue', '64'],
            ['JH-BL-13×15', '1/2"', '13', '15', '2', 'Blue', '56'],
            ['JH-BL-16×15', '5/8"', '16', '15', '2', 'Blue', '49'],
            ['JH-BL-20×15', '3/4"', '20', '15', '2', 'Blue', '42'],
            ['YF-RD-25×9', '1"', '25', '9', '1.8', 'Red', '56'],
            ['YF-RD-25×10', '1"', '25', '10', '2', 'Red', '56'],
            ['YF-RD-6×15', '1/4"', '6', '15', '2', 'Red', '81'],
            ['YF-RD-10×15', '3/8"', '10', '15', '2', 'Red', '64'],
            ['YF-RD-13×15', '1/2"', '13', '15', '2', 'Red', '56'],
            ['YF-RD-16×20', '5/8"', '16', '20', '2', 'Red', '30'],
            ['YF-RD-20×20', '3/4"', '20', '20', '2', 'Red', '30'],
          ],
        },
        applications: 'High-performance HVAC systems in commercial buildings, hospital and laboratory ventilation systems, clean-room and data center cooling systems, green building projects requiring low-VOC materials, refrigeration systems with extreme temperature requirements, hot water systems up to 110°C, color-coded piping systems (blue for cold, red for hot)',
        images: [
          '/images/high-density-b1-01.jpg',
          '/images/high-density-b1-02.jpg',
          '/images/high-density-b1-03.jpg',
          '/images/high-density-b1-04.jpg',
          '/images/high-density-b1-05.jpg',
        ],
      },
      { id: 'im-3', categoryId: 'insulation-materials', subCategoryId: 'insulation-sheets', name: 'Insulation Sheet / Roll', shortDesc: 'Flexible insulation sheets for duct and equipment wrapping.', description: 'Flexible insulation sheets and rolls for large-area thermal insulation of ducts, tanks, and equipment.', specs: [{ label: 'Thickness', value: '5mm - 50mm' }, { label: 'Size', value: '1m x 2m / roll' }, { label: 'Material', value: 'NBR/PVC or PE' }], applications: 'Duct insulation, tank insulation, equipment wrapping' },
    ],
  },
  {
    id: 'valves',
    name: 'Valves',
    icon: 'Settings',
    subCategories: [
      {
        id: 'solenoid-valves',
        name: 'Solenoid Valves',
        subCategories: [
          { id: 'solenoid-valves-overview', name: 'Category Overview', isOverview: true },
          { id: 'standard-piston-nc', name: 'Standard Piston Solenoid Valve — ODF, NC (HVD)' },
          { id: 'high-flow-flanged-piston', name: 'High Flow Solenoid Valve — Piston, Flanged ODF (HVP)' },
          { id: 'clamping-type-small-port', name: 'Clamping Type Solenoid Valve — Small Port (HV)' },
          { id: 'clamping-type-large-port', name: 'Clamping Type Solenoid Valve — Large Port (HV)' },
          { id: 'ip65-direct-operated', name: 'IP65 Sealed Solenoid Valve — Direct Operated (SV)' },
          { id: 'ip65-servo-operated', name: 'IP65 Sealed Solenoid Valve — Servo Operated (SV)' },
          { id: 'low-power-8w-direct', name: 'Low Power Solenoid Valve 8W — Direct Operated (10 Series)' },
          { id: 'low-power-8w-servo', name: 'Low Power Solenoid Valve 8W — Servo Operated (10 Series)' },
          { id: 'normally-open-small-port', name: 'Normally Open Solenoid Valve — Small Port (HVK)' },
          { id: 'normally-open-large-port', name: 'Normally Open Solenoid Valve — Large Port (HVK)' },
          { id: 'compressor-unloading-flanged', name: 'Compressor Unloading Solenoid Valve — Flanged (HV)' },
          { id: 'compressor-unloading-odf', name: 'Compressor Unloading Solenoid Valve — ODF (HV)' },
          { id: 'hot-gas-defrost-3-way', name: 'Hot Gas Defrost Solenoid Valve — 3-Way (HVS)' },
          { id: 'high-flow-piston-odf', name: 'High Flow Piston Solenoid Valve — ODF Brazed (HVDF)' },
          { id: 'high-flow-piston-flanged', name: 'High Flow Piston Solenoid Valve — Flanged, Built-in Filter (HVPF)' },
        ],
      },
      {
        id: 'ball-valves',
        name: 'Ball Valves',
        subCategories: [
          { id: 'ball-valves-overview', name: 'Category Overview', isOverview: true },
          { id: 'electric-ball-valve-full-bore', name: 'Electric Ball Valve — Full Bore, ODF (DQF)' },
          { id: 'manual-ball-valve-full-bore', name: 'Manual Ball Valve — Full Bore, ODF (HBC)' },
          { id: 'manual-ball-valve-reduced-bore', name: 'Manual Ball Valve — Reduced Bore, ODF (QFT)' },
          { id: 'co2-ball-valve-120bar', name: 'CO₂ Ball Valve — Full Bore, 120 bar (QF-CO2)' },
          { id: 'threaded-ball-valve-npt', name: 'Threaded Ball Valve — NPT Connection (GFM-S)' },
        ],
      },
      {
        id: 'sight-glasses',
        name: 'Sight Glasses',
        subCategories: [
          { id: 'sight-glasses-overview', name: 'Category Overview', isOverview: true },
          { id: 'moisture-indicator-brazed-odf', name: 'Moisture Indicator – Brazed ODF' },
          { id: 'moisture-indicator-sae-flare', name: 'Moisture Indicator – SAE Flare' },
          { id: 'moisture-indicator-sae-flare-mf', name: 'Moisture Indicator – SAE Flare M/F' },
          { id: 'moisture-indicator-npt', name: 'Moisture Indicator – NPT Threaded' },
          { id: 'oil-level-g-thread', name: 'Oil Level Sight Glass – G Thread' },
        ],
      },
      { id: 'thermal-expansion-valves', name: 'Thermal Expansion Valves' },
      { id: 'safety-valves', name: 'Safety Valves' },
      { id: 'check-valves', name: 'Check Valves' },
      { id: 'stop-valves', name: 'Stop Valves' },
      { id: '4-way-reversing-valves', name: '4-Way Reversing Valves' },
    ],
    products: [
      { id: 'v-1', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'standard-piston-nc', images: ['/images/hvd-standard-01.jpg'], metaTitle: 'Standard Piston Solenoid Valve (ODF, NC) | Refrigeration', metaDescription: 'NC piston solenoid valve with brazed ODF, 3/8\"–1-5/8\", Kv 0.8–25 m³/h, MWP 45 bar, AC220/380V. 8 models in stock. MOQ 1 pc.', name: 'Standard Solenoid Valve — Piston, NC, Brazed ODF (HVD Series)', shortDesc: 'The standard mainstay refrigeration solenoid valve in this range, the HVD Series features a piston structure and pure ODF brazed connection for reliable high-pressure operation. With 8 models covering port sizes from 3/8\" to 1-5/8\", it serves a wide range of HCFC and HFC refrigeration and air conditioning systems.', description: '• Servo-operated solenoid valve designed for one-way flow control in refrigeration, cold storage, and air conditioning systems.\n• Suitable for installation on liquid lines, suction lines, and hot gas lines.\n• Compatible with coils of various voltages through a universal valve body design.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately) for flexible installation and maintenance.', features: [
      "Proprietary solenoid coil with excellent waterproof performance (IP65)",
      "Advanced materials provide superior high and low temperature resistance",
      "24W high-power solenoid coil delivers strong valve opening capability",
      "Large piston stroke ensures high flow rate performance",
      "Various AC and DC solenoid coil options available",
      "Maximum welded connection size: 1-5/8\""
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["HVD8-3T", "3/8\"", "0.8"],
      ["HVD10-4T", "1/2\"", "1.4"],
      ["HVD10-5T", "5/8\"", "1.9"],
      ["HVD15-6T", "3/4\"", "2.6"],
      ["HVD15-7T", "7/8\"", "2.8"],
      ["HVD25-9T", "1-1/8\"", "10"],
      ["HVD32-11T", "1-3/8\"", "16"],
      ["HVD40-13T", "1-5/8\"", "25"]
    ] }, specs: [
      { "label": "Series Code", "value": "HVD" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / AC220V / 50Hz" },
      { "label": "Connection Type", "value": "Brazed (ODF)" },
      { "label": "Valve Type", "value": "Piston" },
      { "label": "Opening Type", "value": "Servo-Operated" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-2', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'high-flow-flanged-piston', images: ['/images/hvp-high-flow-01.png'], metaTitle: 'High Flow Solenoid Valve, Flanged ODF | Refrigeration', metaDescription: 'High flow NC piston solenoid valve with flanged ODF, 1-1/8\"–2-1/8\", Kv 10–28 m³/h, MWP 45 bar. Large-diameter refrigeration. MOQ 1 pc.', name: 'High Flow Solenoid Valve — Piston, NC, Flanged ODF (HVP Series)', shortDesc: 'Delivering the highest flow capacity among standard refrigeration solenoid valves, the HVP Series features a flanged-edge valve body designed for large-diameter refrigeration applications. With 4 models covering ports from 1-1/8\" to 2-1/8\" and Kv values up to 28 m³/h, it is ideal for industrial and commercial refrigeration systems requiring high-capacity refrigerant flow.', description: '• Servo-operated solenoid valve designed for one-way flow control in refrigeration, cold storage, and air conditioning systems.\n• Suitable for installation on liquid lines, suction lines, and hot gas lines.\n• Compatible with coils of various voltages through a universal valve body design.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately) for flexible installation and maintenance.', features: [
      "Proprietary solenoid coil with excellent waterproof performance (IP65)",
      "Advanced materials provide superior high and low temperature resistance",
      "24W high-power solenoid coil delivers strong valve opening capability",
      "Large piston stroke ensures high flow rate performance",
      "Various AC and DC solenoid coil options available",
      "Maximum welded connection size: 2-1/8\""
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["HVP25", "1-1/8\"", "10"],
      ["HVP32", "1-3/8\"", "16"],
      ["HVP40", "1-5/8\"", "25"],
      ["HVP54", "2-1/8\"", "28"]
    ] }, specs: [
      { "label": "Series Code", "value": "HVP" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / AC220V / 50Hz" },
      { "label": "Connection Type", "value": "Brazed (ODF, flanged edge)" },
      { "label": "Valve Type", "value": "Piston" },
      { "label": "Opening Type", "value": "Servo-Operated" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-3', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'clamping-type-small-port', images: ['/images/hv-clamping-small-01.png'], metaTitle: 'Clamping Type Solenoid Valve, Small Port | Refrigeration', metaDescription: 'Small port clamping solenoid valve, diaphragm NC, SAE flare/ODF, 1/4\"–3/8\", Kv 0.2–0.27, MWP 45 bar, wide voltage. MOQ 1 pc.', name: 'Clamping Type Solenoid Valve — Small Port, Diaphragm, NC (HV Series)', shortDesc: 'A compact diaphragm solenoid valve with a clamping coil design that allows tool-free coil removal for quick maintenance, the HV Series (Small Port) covers port sizes from 1/4\" to 3/8\" and offers the widest voltage range in the lineup (AC380V/220V/110V/24V, DC12V). It is ideal for compact refrigeration and air conditioning installations.', description: '• Direct-operated or servo-operated solenoid valve designed for one-way flow control.\n• Used on liquid lines, suction lines, and hot gas lines in refrigeration, cold storage, and air conditioning units.\n• Precision-engineered valve seat and seals deliver excellent sealing performance.\n• Compatible with coils of various voltages for flexible electrical configuration.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "NC (Normally Closed) type available",
      "Various port sizes available to suit different system requirements",
      "Coils of various power supply options available for selection",
      "9W solenoid coil with MOPD up to 3.1 MPa",
      "Clamping-type design enables tool-free disassembly using only a screwdriver",
      "Suitable for diverse applications in refrigeration, cold storage, and air conditioning",
      "Sealed coil with extended service life, suitable for harsh environments",
      "Certifications: ISO 9001, CE, UL"
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["HV3-2", "1/4\"", "0.2"],
      ["HV3-2T", "1/4\"", "0.2"],
      ["HV3-3", "3/8\"", "0.27"],
      ["HV3-3T", "3/8\"", "0.27"]
    ] }, specs: [
      { "label": "Series Code", "value": "HV (Small Port)" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / 220V / 110V / 24V 50/60Hz, DC12V" },
      { "label": "Connection Type", "value": "SAE Flare / Brazed (ODF)" },
      { "label": "Valve Type", "value": "Diaphragm" },
      { "label": "Opening Type", "value": "Servo-Operated" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-4', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'clamping-type-large-port', images: ['/images/hv-clamping-large-01.png'], metaTitle: 'Clamping Type Solenoid Valve, Large Port | Refrigeration', metaDescription: 'Large port clamping solenoid valve, diaphragm NC, SAE flare/ODF, 1/2\"–1-1/8\", Kv 0.5–4.5, MWP 45 bar. MOQ 1 pc.', name: 'Clamping Type Solenoid Valve — Large Port, Diaphragm, NC (HV Series)', shortDesc: 'The large-port variant of the clamping-type solenoid valve, covering port sizes from 1/2\" to 1-1/8\" with Kv values up to 4.5 m³/h. Shares the same tool-free clamping coil design as the small-port version, making it ideal for medium-capacity refrigeration and air conditioning systems.', description: '• Direct-operated or servo-operated solenoid valve designed for one-way flow control.\n• Used on liquid lines, suction lines, and hot gas lines in refrigeration, cold storage, and air conditioning units.\n• Precision-engineered valve seat and seals deliver excellent sealing performance.\n• Compatible with coils of various voltages for flexible electrical configuration.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "NC (Normally Closed) type available",
      "Various port sizes available to suit different system requirements",
      "Coils of various power supply options available for selection",
      "9W solenoid coil with MOPD up to 3.1 MPa",
      "Clamping-type design enables tool-free disassembly using only a screwdriver",
      "Suitable for diverse applications in refrigeration, cold storage, and air conditioning",
      "Sealed coil with extended service life, suitable for harsh environments",
      "Certifications: ISO 9001, CE, UL"
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["HV5-4", "1/2\"", "0.5"],
      ["HV5-4T", "1/2\"", "0.5"],
      ["HV8-6", "3/4\"", "1.2"],
      ["HV8-6T", "3/4\"", "1.2"],
      ["HV10-8", "7/8\"", "2.0"],
      ["HV10-8T", "7/8\"", "2.0"],
      ["HV15-10", "1-1/8\"", "4.5"],
      ["HV15-10T", "1-1/8\"", "4.5"]
    ] }, specs: [
      { "label": "Series Code", "value": "HV (Large Port)" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / 220V / 110V / 24V 50/60Hz, DC12V" },
      { "label": "Connection Type", "value": "SAE Flare / Brazed (ODF)" },
      { "label": "Valve Type", "value": "Diaphragm" },
      { "label": "Opening Type", "value": "Servo-Operated" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-5', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'ip65-direct-operated', images: ['/images/sv-ip65-direct-01.png'], metaTitle: 'IP65 Direct-Acting Solenoid Valve | Refrigeration', metaDescription: 'IP65 direct-acting solenoid valve, diaphragm NC, 1/4\"–3/8\", Kv 0.2–0.27, MWP 45 bar, wide voltage range. MOQ 1 pc.', name: 'IP65 Direct-Acting Solenoid Valve — Diaphragm, NC (SV Series)', shortDesc: 'A compact direct-acting solenoid valve with IP65 protection rating, the SV Series (Direct) covers port sizes from 1/4\" to 3/8\". Its direct-acting design ensures reliable operation even at zero pressure differential, making it suitable for small-capacity refrigeration systems.', description: '• Direct-operated solenoid valve designed for one-way flow control in refrigeration and air conditioning systems.\n• IP65 protection rating ensures reliable operation in humid and dusty environments.\n• Suitable for installation on liquid lines, suction lines, and hot gas lines.\n• Compatible with coils of various voltages through a universal valve body design.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "IP65 protection rating for harsh environment operation",
      "Direct-acting design works at zero pressure differential",
      "9W solenoid coil with MOPD up to 3.1 MPa",
      "Various AC and DC voltage options available",
      "Compact diaphragm structure for reliable sealing",
      "Certifications: ISO 9001, CE, UL"
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["SV3-2", "1/4\"", "0.2"],
      ["SV3-2T", "1/4\"", "0.2"],
      ["SV3-3", "3/8\"", "0.27"],
      ["SV3-3T", "3/8\"", "0.27"]
    ] }, specs: [
      { "label": "Series Code", "value": "SV (Direct)" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / 220V / 110V / 24V 50/60Hz, DC12V" },
      { "label": "Connection Type", "value": "SAE Flare / Brazed (ODF)" },
      { "label": "Valve Type", "value": "Diaphragm" },
      { "label": "Opening Type", "value": "Direct-Acting" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-6', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'ip65-servo-operated', images: ['/images/sv-ip65-servo-01.png'], metaTitle: 'IP65 Servo-Operated Solenoid Valve | Refrigeration', metaDescription: 'IP65 servo-operated solenoid valve, diaphragm NC, 1/2\"–1-1/8\", Kv 0.5–4.5, MWP 45 bar. MOQ 1 pc.', name: 'IP65 Servo-Operated Solenoid Valve — Diaphragm, NC (SV Series)', shortDesc: 'The servo-operated variant of the IP65 solenoid valve, covering larger port sizes from 1/2\" to 1-1/8\" with Kv values up to 4.5 m³/h. Ideal for medium-capacity refrigeration systems requiring higher flow rates.', description: '• Servo-operated solenoid valve designed for one-way flow control in refrigeration and air conditioning systems.\n• IP65 protection rating ensures reliable operation in humid and dusty environments.\n• Suitable for installation on liquid lines, suction lines, and hot gas lines.\n• Compatible with coils of various voltages through a universal valve body design.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "IP65 protection rating for harsh environment operation",
      "Servo-operated design for higher flow capacity",
      "9W solenoid coil with MOPD up to 3.1 MPa",
      "Various AC and DC voltage options available",
      "Compact diaphragm structure for reliable sealing",
      "Certifications: ISO 9001, CE, UL"
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["SV5-4", "1/2\"", "0.5"],
      ["SV5-4T", "1/2\"", "0.5"],
      ["SV8-6", "3/4\"", "1.2"],
      ["SV8-6T", "3/4\"", "1.2"],
      ["SV10-8", "7/8\"", "2.0"],
      ["SV10-8T", "7/8\"", "2.0"],
      ["SV15-10", "1-1/8\"", "4.5"],
      ["SV15-10T", "1-1/8\"", "4.5"]
    ] }, specs: [
      { "label": "Series Code", "value": "SV (Servo)" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / 220V / 110V / 24V 50/60Hz, DC12V" },
      { "label": "Connection Type", "value": "SAE Flare / Brazed (ODF)" },
      { "label": "Valve Type", "value": "Diaphragm" },
      { "label": "Opening Type", "value": "Servo-Operated" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-7', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'low-power-8w-direct', images: ['/images/10-8w-direct-01.jpg'], metaTitle: '8W Low Power Direct-Acting Solenoid Valve | Refrigeration', metaDescription: '8W low power direct-acting solenoid valve, diaphragm NC, 1/4\"–3/8\", Kv 0.2–0.27, MWP 45 bar. Energy efficient. MOQ 1 pc.', name: '8W Low Power Direct-Acting Solenoid Valve — Diaphragm, NC (10 Series)', shortDesc: 'An energy-efficient direct-acting solenoid valve with only 8W power consumption, the 10 Series (Direct) covers port sizes from 1/4\" to 3/8\". Its low power design reduces heat generation and extends coil life, making it ideal for continuous-operation refrigeration systems.', description: '• Direct-operated solenoid valve designed for one-way flow control in refrigeration and air conditioning systems.\n• Ultra-low 8W power consumption reduces heat generation and energy costs.\n• Suitable for installation on liquid lines, suction lines, and hot gas lines.\n• Compatible with coils of various voltages through a universal valve body design.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "Ultra-low 8W power consumption for energy efficiency",
      "Direct-acting design works at zero pressure differential",
      "Reduced heat generation extends coil service life",
      "Various AC and DC voltage options available",
      "Compact diaphragm structure for reliable sealing",
      "Certifications: ISO 9001, CE, UL"
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["10-3-2", "1/4\"", "0.2"],
      ["10-3-2T", "1/4\"", "0.2"],
      ["10-3-3", "3/8\"", "0.27"],
      ["10-3-3T", "3/8\"", "0.27"]
    ] }, specs: [
      { "label": "Series Code", "value": "10 (Direct)" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / 220V / 110V / 24V 50/60Hz, DC12V" },
      { "label": "Connection Type", "value": "SAE Flare / Brazed (ODF)" },
      { "label": "Valve Type", "value": "Diaphragm" },
      { "label": "Opening Type", "value": "Direct-Acting" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-8', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'low-power-8w-servo', images: ['/images/10-8w-servo-01.jpg'], metaTitle: '8W Low Power Servo-Operated Solenoid Valve | Refrigeration', metaDescription: '8W low power servo-operated solenoid valve, diaphragm NC, 1/2\"–1-1/8\", Kv 0.5–4.5, MWP 45 bar. Energy efficient. MOQ 1 pc.', name: '8W Low Power Servo-Operated Solenoid Valve — Diaphragm, NC (10 Series)', shortDesc: 'The servo-operated variant of the 8W low power solenoid valve, covering larger port sizes from 1/2\" to 1-1/8\" with Kv values up to 4.5 m³/h. Combines energy efficiency with higher flow capacity for medium-capacity refrigeration systems.', description: '• Servo-operated solenoid valve designed for one-way flow control in refrigeration and air conditioning systems.\n• Ultra-low 8W power consumption reduces heat generation and energy costs.\n• Suitable for installation on liquid lines, suction lines, and hot gas lines.\n• Compatible with coils of various voltages through a universal valve body design.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "Ultra-low 8W power consumption for energy efficiency",
      "Servo-operated design for higher flow capacity",
      "Reduced heat generation extends coil service life",
      "Various AC and DC voltage options available",
      "Compact diaphragm structure for reliable sealing",
      "Certifications: ISO 9001, CE, UL"
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["10-5-4", "1/2\"", "0.5"],
      ["10-5-4T", "1/2\"", "0.5"],
      ["10-8-6", "3/4\"", "1.2"],
      ["10-8-6T", "3/4\"", "1.2"],
      ["10-10-8", "7/8\"", "2.0"],
      ["10-10-8T", "7/8\"", "2.0"],
      ["10-15-10", "1-1/8\"", "4.5"],
      ["10-15-10T", "1-1/8\"", "4.5"]
    ] }, specs: [
      { "label": "Series Code", "value": "10 (Servo)" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / 220V / 110V / 24V 50/60Hz, DC12V" },
      { "label": "Connection Type", "value": "SAE Flare / Brazed (ODF)" },
      { "label": "Valve Type", "value": "Diaphragm" },
      { "label": "Opening Type", "value": "Servo-Operated" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-9', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'normally-open-small-port', images: ['/images/hvk-no-small-01.png'], metaTitle: 'Normally Open Solenoid Valve, Small Port | Refrigeration', metaDescription: 'Normally open solenoid valve, small port, diaphragm, 1/4\"–3/8\", Kv 0.2–0.27, MWP 45 bar. MOQ 1 pc.', name: 'Normally Open Solenoid Valve — Small Port, Diaphragm (HVK Series)', shortDesc: 'A normally open (NO) solenoid valve that remains open when de-energized and closes when powered, the HVK Series (Small Port) covers port sizes from 1/4\" to 3/8\". Ideal for safety applications where flow must continue during power failure.', description: '• Direct-operated normally open solenoid valve designed for one-way flow control.\n• Remains open when de-energized, closes when powered — ideal for safety-critical applications.\n• Used on liquid lines, suction lines, and hot gas lines in refrigeration and air conditioning units.\n• Compatible with coils of various voltages for flexible electrical configuration.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "Normally Open (NO) configuration for safety applications",
      "Various port sizes available to suit different system requirements",
      "Coils of various power supply options available for selection",
      "9W solenoid coil with MOPD up to 3.1 MPa",
      "Clamping-type design enables tool-free disassembly using only a screwdriver",
      "Suitable for diverse applications in refrigeration, cold storage, and air conditioning",
      "Sealed coil with extended service life, suitable for harsh environments",
      "Certifications: ISO 9001, CE, UL"
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["HVK3-2", "1/4\"", "0.2"],
      ["HVK3-2T", "1/4\"", "0.2"],
      ["HVK3-3", "3/8\"", "0.27"],
      ["HVK3-3T", "3/8\"", "0.27"]
    ] }, specs: [
      { "label": "Series Code", "value": "HVK (Small Port)" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / 220V / 110V / 24V 50/60Hz, DC12V" },
      { "label": "Connection Type", "value": "SAE Flare / Brazed (ODF)" },
      { "label": "Valve Type", "value": "Diaphragm" },
      { "label": "Opening Type", "value": "Direct-Acting" },
      { "label": "NO/NC", "value": "NO (Normally Open)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-10', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'normally-open-large-port', images: ['/images/hvk-no-large-01.png'], metaTitle: 'Normally Open Solenoid Valve, Large Port | Refrigeration', metaDescription: 'Normally open solenoid valve, large port, diaphragm, 1/2\"–1-1/8\", Kv 0.5–4.5, MWP 45 bar. MOQ 1 pc.', name: 'Normally Open Solenoid Valve — Large Port, Diaphragm (HVK Series)', shortDesc: 'The large-port variant of the normally open solenoid valve, covering port sizes from 1/2\" to 1-1/8\" with Kv values up to 4.5 m³/h. Ideal for medium-capacity refrigeration systems requiring fail-open safety configuration.', description: '• Direct-operated normally open solenoid valve designed for one-way flow control.\n• Remains open when de-energized, closes when powered — ideal for safety-critical applications.\n• Used on liquid lines, suction lines, and hot gas lines in refrigeration and air conditioning units.\n• Compatible with coils of various voltages for flexible electrical configuration.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "Normally Open (NO) configuration for safety applications",
      "Various port sizes available to suit different system requirements",
      "Coils of various power supply options available for selection",
      "9W solenoid coil with MOPD up to 3.1 MPa",
      "Clamping-type design enables tool-free disassembly using only a screwdriver",
      "Suitable for diverse applications in refrigeration, cold storage, and air conditioning",
      "Sealed coil with extended service life, suitable for harsh environments",
      "Certifications: ISO 9001, CE, UL"
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["HVK5-4", "1/2\"", "0.5"],
      ["HVK5-4T", "1/2\"", "0.5"],
      ["HVK8-6", "3/4\"", "1.2"],
      ["HVK8-6T", "3/4\"", "1.2"],
      ["HVK10-8", "7/8\"", "2.0"],
      ["HVK10-8T", "7/8\"", "2.0"],
      ["HVK15-10", "1-1/8\"", "4.5"],
      ["HVK15-10T", "1-1/8\"", "4.5"]
    ] }, specs: [
      { "label": "Series Code", "value": "HVK (Large Port)" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / 220V / 110V / 24V 50/60Hz, DC12V" },
      { "label": "Connection Type", "value": "SAE Flare / Brazed (ODF)" },
      { "label": "Valve Type", "value": "Diaphragm" },
      { "label": "Opening Type", "value": "Direct-Acting" },
      { "label": "NO/NC", "value": "NO (Normally Open)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-11', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'compressor-unloading-flanged', images: ['/images/hv-unloading-flanged-01.png'], metaTitle: 'Unloading Solenoid Valve, Flanged | Refrigeration', metaDescription: 'Unloading solenoid valve with flanged connection, piston NC, 1-1/8\"–2-1/8\", Kv 10–28, MWP 45 bar. MOQ 1 pc.', name: 'Unloading Solenoid Valve — Flanged, Piston, NC (HV Series)', shortDesc: 'A high-capacity unloading solenoid valve with flanged connection, designed for large-diameter refrigeration systems. The HV Series (Unloading, Flanged) covers port sizes from 1-1/8\" to 2-1/8\" with Kv values up to 28 m³/h, ideal for industrial refrigeration compressor unloading applications.', description: '• Servo-operated solenoid valve designed for compressor unloading in large refrigeration systems.\n• Flanged connection ensures secure, leak-free installation on large-diameter pipelines.\n• Suitable for hot gas bypass and capacity control applications.\n• Compatible with coils of various voltages through a universal valve body design.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "High-capacity piston design for large-diameter applications",
      "Flanged connection for secure, leak-free installation",
      "24W high-power solenoid coil delivers strong valve opening capability",
      "Various AC and DC solenoid coil options available",
      "Suitable for compressor unloading and capacity control",
      "Maximum connection size: 2-1/8\""
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["HV25F", "1-1/8\"", "10"],
      ["HV32F", "1-3/8\"", "16"],
      ["HV40F", "1-5/8\"", "25"],
      ["HV54F", "2-1/8\"", "28"]
    ] }, specs: [
      { "label": "Series Code", "value": "HV (Unloading, Flanged)" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / AC220V / 50Hz" },
      { "label": "Connection Type", "value": "Flanged" },
      { "label": "Valve Type", "value": "Piston" },
      { "label": "Opening Type", "value": "Servo-Operated" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-12', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'compressor-unloading-odf', images: ['/images/hv-unloading-odf-01.png'], metaTitle: 'Unloading Solenoid Valve, ODF | Refrigeration', metaDescription: 'Unloading solenoid valve with brazed ODF connection, piston NC, 1-1/8\"–2-1/8\", Kv 10–28, MWP 45 bar. MOQ 1 pc.', name: 'Unloading Solenoid Valve — Brazed ODF, Piston, NC (HV Series)', shortDesc: 'A high-capacity unloading solenoid valve with brazed ODF connection, designed for large-diameter refrigeration systems. The HV Series (Unloading, ODF) covers port sizes from 1-1/8\" to 2-1/8\" with Kv values up to 28 m³/h, ideal for industrial refrigeration compressor unloading applications.', description: '• Servo-operated solenoid valve designed for compressor unloading in large refrigeration systems.\n• Brazed ODF connection ensures secure, leak-free installation on large-diameter pipelines.\n• Suitable for hot gas bypass and capacity control applications.\n• Compatible with coils of various voltages through a universal valve body design.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "High-capacity piston design for large-diameter applications",
      "Brazed ODF connection for secure, leak-free installation",
      "24W high-power solenoid coil delivers strong valve opening capability",
      "Various AC and DC solenoid coil options available",
      "Suitable for compressor unloading and capacity control",
      "Maximum connection size: 2-1/8\""
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["HV25T", "1-1/8\"", "10"],
      ["HV32T", "1-3/8\"", "16"],
      ["HV40T", "1-5/8\"", "25"],
      ["HV54T", "2-1/8\"", "28"]
    ] }, specs: [
      { "label": "Series Code", "value": "HV (Unloading, ODF)" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / AC220V / 50Hz" },
      { "label": "Connection Type", "value": "Brazed (ODF)" },
      { "label": "Valve Type", "value": "Piston" },
      { "label": "Opening Type", "value": "Servo-Operated" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-13', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'hot-gas-defrost-3-way', images: ['/images/hvs-hot-gas-01.png'], metaTitle: 'Hot Gas Defrost Solenoid Valve | Refrigeration', metaDescription: 'Hot gas defrost solenoid valve, piston NC, brazed ODF, 1/2\"–1-5/8\", Kv 2.6–25, MWP 45 bar. MOQ 1 pc.', name: 'Hot Gas Defrost Solenoid Valve — Piston, NC, Brazed ODF (HVS Series)', shortDesc: 'A specialized solenoid valve designed for hot gas defrost applications in refrigeration systems, the HVS Series features a piston structure and brazed ODF connection. With models covering port sizes from 1/2\" to 1-5/8\", it enables efficient defrost cycles in cold storage and commercial refrigeration systems.', description: '• Servo-operated solenoid valve specifically designed for hot gas defrost in refrigeration systems.\n• Enables efficient defrost cycles by redirecting hot discharge gas to the evaporator.\n• Suitable for installation on hot gas defrost lines in cold storage and commercial refrigeration.\n• Compatible with coils of various voltages through a universal valve body design.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "Specialized design for hot gas defrost applications",
      "Piston structure for reliable high-pressure operation",
      "24W high-power solenoid coil delivers strong valve opening capability",
      "Various AC and DC solenoid coil options available",
      "Brazed ODF connection for secure, leak-free installation",
      "Maximum connection size: 1-5/8\""
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["HVS15-6T", "1/2\"", "2.6"],
      ["HVS15-7T", "5/8\"", "2.8"],
      ["HVS25-9T", "3/4\"", "5.0"],
      ["HVS32-11T", "1-1/8\"", "10"],
      ["HVS40-13T", "1-3/8\"", "16"],
      ["HVS50-15T", "1-5/8\"", "25"]
    ] }, specs: [
      { "label": "Series Code", "value": "HVS" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / AC220V / 50Hz" },
      { "label": "Connection Type", "value": "Brazed (ODF)" },
      { "label": "Valve Type", "value": "Piston" },
      { "label": "Opening Type", "value": "Servo-Operated" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-14', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'high-flow-piston-odf', images: ['/images/hvdf-high-flow-01.png'], metaTitle: 'High Flow Solenoid Valve, ODF | Refrigeration', metaDescription: 'High flow solenoid valve with brazed ODF, piston NC, 1-1/8\"–2-1/8\", Kv 10–28, MWP 45 bar. MOQ 1 pc.', name: 'High Flow Solenoid Valve — Brazed ODF, Piston, NC (HVDF Series)', shortDesc: 'A high-flow solenoid valve with brazed ODF connection, the HVDF Series covers port sizes from 1-1/8\" to 2-1/8\" with Kv values up to 28 m³/h. Designed for large-capacity refrigeration systems requiring maximum flow performance.', description: '• Servo-operated solenoid valve designed for high-flow applications in large refrigeration systems.\n• Brazed ODF connection ensures secure, leak-free installation on large-diameter pipelines.\n• Suitable for installation on liquid lines, suction lines, and hot gas lines.\n• Compatible with coils of various voltages through a universal valve body design.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "High-capacity piston design for large-diameter applications",
      "Brazed ODF connection for secure, leak-free installation",
      "24W high-power solenoid coil delivers strong valve opening capability",
      "Various AC and DC solenoid coil options available",
      "Maximum flow capacity: Kv 28 m³/h",
      "Maximum connection size: 2-1/8\""
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["HVDF25", "1-1/8\"", "10"],
      ["HVDF32", "1-3/8\"", "16"],
      ["HVDF40", "1-5/8\"", "25"],
      ["HVDF54", "2-1/8\"", "28"]
    ] }, specs: [
      { "label": "Series Code", "value": "HVDF" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / AC220V / 50Hz" },
      { "label": "Connection Type", "value": "Brazed (ODF)" },
      { "label": "Valve Type", "value": "Piston" },
      { "label": "Opening Type", "value": "Servo-Operated" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'v-15', categoryId: 'valves', subCategoryId: 'solenoid-valves', thirdCategoryId: 'high-flow-piston-flanged', images: ['/images/hvpf-high-flow-01.png'], metaTitle: 'High Flow Solenoid Valve, Flanged | Refrigeration', metaDescription: 'High flow solenoid valve with flanged connection, piston NC, 1-1/8\"–2-1/8\", Kv 10–28, MWP 45 bar. MOQ 1 pc.', name: 'High Flow Solenoid Valve — Flanged, Piston, NC (HVPF Series)', shortDesc: 'A high-flow solenoid valve with flanged connection, the HVPF Series covers port sizes from 1-1/8\" to 2-1/8\" with Kv values up to 28 m³/h. Designed for large-capacity industrial refrigeration systems requiring maximum flow performance with flanged pipeline connection.', description: '• Servo-operated solenoid valve designed for high-flow applications in large industrial refrigeration systems.\n• Flanged connection ensures secure, leak-free installation on large-diameter pipelines.\n• Suitable for installation on liquid lines, suction lines, and hot gas lines.\n• Compatible with coils of various voltages through a universal valve body design.\n• Available as a complete assembly or as split supply (valve body and coil supplied separately).', features: [
      "High-capacity piston design for large-diameter applications",
      "Flanged connection for secure, leak-free installation",
      "24W high-power solenoid coil delivers strong valve opening capability",
      "Various AC and DC solenoid coil options available",
      "Maximum flow capacity: Kv 28 m³/h",
      "Maximum connection size: 2-1/8\""
    ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m\u00b3/h)"], rows: [
      ["HVPF25", "1-1/8\"", "10"],
      ["HVPF32", "1-3/8\"", "16"],
      ["HVPF40", "1-5/8\"", "25"],
      ["HVPF54", "2-1/8\"", "28"]
    ] }, specs: [
      { "label": "Series Code", "value": "HVPF" },
      { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
      { "label": "Rated Voltage", "value": "AC380V / AC220V / 50Hz" },
      { "label": "Connection Type", "value": "Flanged" },
      { "label": "Valve Type", "value": "Piston" },
      { "label": "Opening Type", "value": "Servo-Operated" },
      { "label": "NO/NC", "value": "NC (Normally Closed)" },
      { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
      { "label": "Medium Temperature Range", "value": "−30 °C ~ +105 °C" },
      { "label": "Ambient Temperature", "value": "−40 °C ~ +65 °C" },
      { "label": "Voltage Fluctuation", "value": "+10% / −15%" },
      { "label": "Coil Connection", "value": "Standard 3-wire insert connector" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'bv-1', categoryId: 'valves', subCategoryId: 'ball-valves', thirdCategoryId: 'electric-ball-valve-full-bore', images: ['/images/dqf-electric-01.jpg'], metaTitle: "Electric Ball Valve (Full Bore, ODF) | Refrigeration", metaDescription: "Electric ball valve with full bore ODF connection, 3/8\"–3-1/8\", Kv 5.7–200, MWP 45 bar, AC/DC 24V actuator, IP54. 11 models. MOQ 1 pc.", name: "Electric Ball Valve — Full Bore, Brazed ODF, AC/DC 24V Actuator (DQF Series)", shortDesc: "The only electrically actuated ball valve in this range, the DQF Series combines full bore flow design with automatic 90° rotation control. With 11 models covering port sizes from 3/8\" to 3-1/8\" and Kv values from 5.7 to 200 m³/h, it provides reliable remote shut-off for commercial and industrial refrigeration systems requiring automated flow control.", description: "• Electric ball valve designed for automatic shut-off control in refrigeration, cold storage, and air conditioning systems.\n• Suitable for installation on liquid lines, suction lines, and discharge lines where remote or automated flow control is required.\n• Electric actuator enables automatic full-open and full-close operation; manual override is available during power failure for emergency maintenance.\n• TIG welded copper valve body ensures high structural strength and corrosion resistance compatible with refrigeration environments.\n• Full bore design ensures flow without pressure drop, maintaining system efficiency.\n• Supplied as a complete assembly (valve body + electric actuator).", features: [
        "Automatic full-open and full-close operation via electric actuator",
        "Bidirectional flow capability — can be installed in either direction",
        "Manual override available during power failure for emergency operation",
        "Ultra-low operating noise (55 dB) suitable for noise-sensitive environments",
        "Full bore design — flow without pressure drop",
        "Only 1/4 turn (90°) from full open to full close",
        "TIG welded structure ensures high structural strength",
        "Anti-blowout valve stem design for operational safety",
        "Modified PTFE seal for reliable long-term sealing performance"
      ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m³/h)", "Actuator Model"], rows: [
        ["DQF10", "3/8 (φ10)", "5.7", "HS/HVD24-5Q"],
        ["DQF12", "1/2 (φ12)", "10.6", "HS/HVD24-10Q"],
        ["DQF16", "5/8 (φ16)", "14.1", "HS/HVD24-10Q"],
        ["DQF19", "3/4 (φ19)", "20.4", "HS/HVD24-10Q"],
        ["DQF22", "7/8 (φ22)", "28.2", "HS/HVD24-10Q"],
        ["DQF28", "1-1/8 (φ28)", "52", "HS/HVD24-10Q"],
        ["DQF35", "1-3/8 (φ35)", "80", "HS/HVD24-20Q"],
        ["DQF42", "1-5/8 (φ42)", "121", "HS/HVD24-40Q"],
        ["DQF54", "2-1/8 (φ54)", "200", "HS/HVD24-40Q"],
        ["DQF67", "2-5/8 (φ67)", "200", "HS/HVD24-40Q"],
        ["DQF79", "3-1/8 (φ79)", "200", "HS/HVD24-40Q"]
      ] }, specs: [
        { "label": "Series Code", "value": "DQF" },
        { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
        { "label": "Connection Type", "value": "Brazed (ODF)" },
        { "label": "Bore Type", "value": "Full Bore" },
        { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
        { "label": "Medium Temperature Range", "value": "−40 °C ~ +120 °C" },
        { "label": "Handle Type", "value": "Electric Actuator" },
        { "label": "Valve Body Material", "value": "Copper (TIG Welded)" },
        { "label": "Sealing Material", "value": "Modified PTFE" },
        { "label": "Actuator Voltage", "value": "AC/DC 24V 50/60Hz" },
        { "label": "Actuator Torque", "value": "5 ~ 40 N·m" },
        { "label": "Rotation Angle", "value": "90°" },
        { "label": "Running Time", "value": "20 s" },
        { "label": "Actuator Power (Run/Standby)", "value": "3.0 ~ 15 W / 0.5 ~ 3.0 W" },
        { "label": "Protection Rating", "value": "IP54" },
        { "label": "Noise Level", "value": "55 dB" },
        { "label": "Mounting Direction", "value": "Bidirectional flow, any direction" }
      ], applications: 'Refrigeration, cold storage, air conditioning systems requiring automated flow control' },
      { id: 'bv-2', categoryId: 'valves', subCategoryId: 'ball-valves', thirdCategoryId: 'manual-ball-valve-full-bore', images: ['/images/hbc-no-charge-01.jpg', '/images/hbc-with-charge-02.jpg'], metaTitle: "Manual Ball Valve (Full Bore, ODF) | Refrigeration", metaDescription: "Manual full bore ball valve with brazed ODF, 1/4\"–3-1/8\", Kv 2–700, MWP 45 bar, with/without charging port. 16 models. MOQ 1 pc.", name: "Manual Ball Valve — Full Bore, Brazed ODF (HBC Series)", shortDesc: "Offering the widest port size range in this catalog, the HBC Series features a full bore design with TIG welded copper body and bidirectional flow capability. With 16 models covering 1/4\" to 3-1/8\" and Kv values up to 700 m³/h, it is available with or without a charging port for flexible system integration across commercial and industrial refrigeration applications.", description: "• Manual ball valve designed for shut-off control in refrigeration, cold storage, and air conditioning systems.\n• Suitable for installation on liquid lines, suction lines, and discharge lines.\n• Bidirectional flow design allows installation in any direction without flow direction restriction.\n• TIG welded copper valve body with full bore design ensures flow without pressure drop.\n• Available with or without charging port for system service and refrigerant charging convenience.\n• Can be mounted on control panels for easy installation and fixation.\n• Valve stem top mark indicates full open and full close positions for visual confirmation.", features: [
        "Flow without pressure drop — full bore design matches pipe internal diameter",
        "Only 1/4 turn (90°) from full open to full close",
        "Rotation limiters at both full open and full close positions",
        "Valve stem top mark indicates full open and full close positions",
        "Bidirectional flow capability",
        "TIG welded structure for high structural strength",
        "Anti-blowout valve stem design for operational safety",
        "Modified PTFE seal for reliable long-term sealing performance",
        "Prevents internal liquid accumulation",
        "Can be mounted on control panels"
      ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m³/h)"], rows: [
        ["HBC-6S", "1/4 (φ6)", "2"],
        ["HBC-10S", "3/8 (φ10)", "5.7"],
        ["HBC-12S", "1/2 (φ12)", "5.7"],
        ["HBC-10", "3/8 (φ10)", "5.7"],
        ["HBC-12", "1/2 (φ12)", "10.6"],
        ["HBC-16", "5/8 (φ16)", "14.1"],
        ["HBC-19", "3/4 (φ19)", "20.4"],
        ["HBC-22", "7/8 (φ22)", "28.2"],
        ["HBC-28", "1-1/8 (φ28)", "52"],
        ["HBC-35", "1-3/8 (φ35)", "80"],
        ["HBC-42", "1-5/8 (φ42)", "121"],
        ["HBC-54", "2-1/8 (φ54)", "200"],
        ["HBC-67", "2-5/8 (φ67)", "200"],
        ["HBC-79", "3-1/8 (φ79)", "200"],
        ["HBC-67A", "2-5/8 (φ67)", "310"],
        ["HBC-79A", "3-1/8 (φ79)", "700"]
      ] }, specs: [
        { "label": "Series Code", "value": "HBC" },
        { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa)" },
        { "label": "Connection Type", "value": "Brazed (ODF)" },
        { "label": "Bore Type", "value": "Full Bore" },
        { "label": "Refrigerant Compatibility", "value": "HCFC, HFC" },
        { "label": "Medium Temperature Range", "value": "−40 °C ~ +120 °C" },
        { "label": "Handle Type", "value": "Manual Lever" },
        { "label": "Valve Body Material", "value": "Copper (TIG Welded)" },
        { "label": "Sealing Material", "value": "Modified PTFE" },
        { "label": "Charging Port", "value": "Available with/without" },
        { "label": "Mounting Direction", "value": "Bidirectional flow, any direction" },
        { "label": "Panel Mounting", "value": "Yes" }
      ], applications: 'Commercial and industrial refrigeration, cold storage, air conditioning systems' },
      { id: 'bv-3', categoryId: 'valves', subCategoryId: 'ball-valves', thirdCategoryId: 'manual-ball-valve-reduced-bore', images: ['/images/qft-no-charge-01.jpg', '/images/qft-with-charge-02.jpg'], metaTitle: "Manual Ball Valve (Reduced Bore, ODF) | Refrigeration", metaDescription: "Manual reduced bore ball valve, brazed ODF, 1/4\"–2-1/8\", MWP 45 bar, with/without charging port, forged copper body. 10 models. MOQ 1 pc.", name: "Manual Ball Valve — Reduced Bore, Brazed ODF (QFT Series)", shortDesc: "A precision-forged copper ball valve with reduced bore design, the QFT Series offers 10 models covering port sizes from 1/4\" to 2-1/8\". Available with or without a charging port (designated by the V suffix), it features specially selected seals compatible with common refrigerants and a secondary reliable sealing structure at the valve stem for enhanced leak prevention.", description: "• Manual ball valve with reduced bore design for shut-off control in refrigeration and air conditioning systems.\n• Suitable for installation on liquid lines, suction lines, and discharge lines.\n• Precision forged high-quality copper valve body ensures structural integrity and corrosion resistance.\n• Bidirectional flow design allows installation in any direction.\n• Available with or without charging port — models with the V suffix (e.g., QFT-6V) include an integrated charging port with valve core for system service access.\n• Specially selected seals compatible with common refrigerant operating environments.\n• Can be mounted on control panels for easy installation and fixation.", features: [
        "Bidirectional flow — can be installed in any direction",
        "Precision forged high-quality copper valve body",
        "Minimal pressure drop in medium flow (reduced bore design)",
        "Anti-blowout valve stem design for operational safety",
        "Specially selected seals compatible with common refrigerants",
        "Rotation limiters at both full open and full close positions",
        "Secondary reliable sealing structure at valve stem for enhanced leak prevention",
        "Can be mounted on control panels for easy fixation"
      ], availableModels: { headers: ["Model", "Port Size (Inch)", "Welding Port ID (mm)"], rows: [
        ["QFT-6 / QFT-6V", "1/4 (φ6)", "6.5"],
        ["QFT-10 / QFT-10V", "3/8 (φ10)", "10.1"],
        ["QFT-12 / QFT-12V", "1/2 (φ12)", "12.8"],
        ["QFT-16 / QFT-16V", "5/8 (φ16)", "16.1"],
        ["QFT-19 / QFT-19V", "3/4 (φ19)", "19.2"],
        ["QFT-22 / QFT-22V", "7/8 (φ22)", "22.3"],
        ["QFT-28 / QFT-28V", "1-1/8 (φ28)", "28.7"],
        ["QFT-35 / QFT-35V", "1-3/8 (φ35)", "35.2"],
        ["QFT-42 / QFT-42V", "1-5/8 (φ42)", "41.5"],
        ["QFT-54 / QFT-54V", "2-1/8 (φ54)", "54.2"]
      ] }, specs: [
        { "label": "Series Code", "value": "QFT" },
        { "label": "MWP (Maximum Working Pressure)", "value": "45 bar (4.5 MPa / 650 PSI)" },
        { "label": "Connection Type", "value": "Brazed (ODF)" },
        { "label": "Bore Type", "value": "Reduced Bore" },
        { "label": "Refrigerant Compatibility", "value": "R22, R134a, R404A, R407C, R410A, etc." },
        { "label": "Medium Temperature Range", "value": "−40 °C ~ +120 °C" },
        { "label": "Handle Type", "value": "Manual Lever" },
        { "label": "Valve Body Material", "value": "Copper (Precision Forged)" },
        { "label": "Sealing Material", "value": "Refrigerant-compatible seals" },
        { "label": "Charging Port", "value": "Available with/without (V suffix)" },
        { "label": "Mounting Direction", "value": "Bidirectional flow, any direction" },
        { "label": "Panel Mounting", "value": "Yes" }
      ], applications: 'Refrigeration and air conditioning systems, service and maintenance applications' },
      { id: 'bv-4', categoryId: 'valves', subCategoryId: 'ball-valves', thirdCategoryId: 'co2-ball-valve-120bar', images: ['/images/qf-co2-01.jpg'], metaTitle: "CO₂ Ball Valve (Full Bore, 120 bar) | Refrigeration", metaDescription: "CO₂ refrigerant ball valve, full bore ODF, 1/2\"–2-1/8\", Kv 10–200, MWP 120 bar, −50°C~+150°C, stainless steel valve body. 8 models. MOQ 1 pc.", name: "CO₂ Ball Valve — Full Bore, Brazed ODF, 120 bar (QF-CO2 Series)", shortDesc: "Engineered specifically for transcritical CO₂ refrigeration systems, the QF-CO2 Series features a precision-cast valve body with integrated stainless steel tube and full bore design for flow without pressure drop. With 8 models covering port sizes from 1/2\" to 2-1/8\" and a maximum working pressure of 120 bar, it uses specially selected CO₂-compatible seals for reliable operation at extreme pressures and temperatures.", description: "• CO₂-specific ball valve designed for transcritical CO₂ refrigeration systems operating at high pressures.\n• Suitable for installation on CO₂ liquid lines, suction lines, and discharge lines in commercial and industrial refrigeration.\n• Precision cast valve body with integrated stainless steel tube ensures CO₂ compatibility and structural integrity under high pressure.\n• Full bore design — valve port structure matches pipe internal diameter for flow without pressure drop.\n• Specially selected seals compatible with CO₂ operating environments.\n• Bidirectional flow design allows installation in any direction.\n• TIG welded connection structure for permanent, leak-free installations.", features: [
        "Flow without pressure drop — full bore design",
        "Only 1/4 turn (90°) from full open to full close",
        "Rotation limiters at both full open and full close positions",
        "Valve stem top mark indicates full open and full close positions",
        "Bidirectional flow capability",
        "TIG welded connection structure for high strength",
        "Anti-blowout valve stem design for operational safety",
        "Modified PTFE seal for reliable long-term sealing performance",
        "Prevents internal liquid accumulation",
        "Can be mounted on control panels",
        "Specially selected CO₂-compatible seals for high-pressure CO₂ environments",
        "Secondary reliable sealing structure at valve stem"
      ], availableModels: { headers: ["Model", "Port Size (Inch)", "Kv (m³/h)"], rows: [
        ["QF12-CO2", "1/2 (φ12)", "10"],
        ["QF16-CO2", "5/8 (φ16)", "14"],
        ["QF19-CO2", "3/4 (φ19)", "20"],
        ["QF22-CO2", "7/8 (φ22)", "28"],
        ["QF28-CO2", "1-1/8 (φ28)", "52"],
        ["QF35-CO2", "1-3/8 (φ35)", "80"],
        ["QF42-CO2", "1-5/8 (φ42)", "121"],
        ["QF54-CO2", "2-1/8 (φ54)", "200"]
      ] }, specs: [
        { "label": "Series Code", "value": "QF-CO2" },
        { "label": "MWP (Maximum Working Pressure)", "value": "120 bar (12 MPa)" },
        { "label": "Connection Type", "value": "Brazed (ODF)" },
        { "label": "Bore Type", "value": "Full Bore" },
        { "label": "Refrigerant Compatibility", "value": "CO₂ (R744)" },
        { "label": "Medium Temperature Range", "value": "−50 °C ~ +150 °C" },
        { "label": "Handle Type", "value": "Manual Lever" },
        { "label": "Valve Body Material", "value": "Copper + Stainless Steel (Precision Cast)" },
        { "label": "Sealing Material", "value": "CO₂-compatible seals" },
        { "label": "Mounting Direction", "value": "Bidirectional flow, any direction" },
        { "label": "Panel Mounting", "value": "Yes" }
      ], applications: 'Transcritical CO₂ refrigeration systems, commercial and industrial CO₂ applications' },
      { id: 'bv-5', categoryId: 'valves', subCategoryId: 'ball-valves', thirdCategoryId: 'threaded-ball-valve-npt', images: ['/images/gfm-s-01.jpg', '/images/gfm-s-02.jpg'], metaTitle: "Threaded Ball Valve (NPT Connection) | Refrigeration", metaDescription: "NPT threaded ball valve for refrigeration, 1/4\"–1\", MWP 120 bar, forged copper body, bidirectional flow, tool-free installation. 5 models. MOQ 1 pc.", name: "Threaded Ball Valve — NPT Connection, Forged Copper (GFM-S Series)", shortDesc: "The only NPT threaded ball valve in this range, the GFM-S Series features a precision-forged copper body with NPT threaded connections that enable tool-free installation and removal without welding. With 5 models covering NPT 1/4\" to 1\" and bidirectional flow capability, it is compatible with most common refrigerants and suitable for applications where brazed connections are impractical.", description: "• Threaded ball valve with NPT connection for shut-off control in refrigeration and air conditioning systems.\n• Suitable for installation on liquid lines, suction lines, and discharge lines.\n• NPT threaded connection enables easy installation and removal using only a wrench — no welding required, making it ideal for field service and maintenance.\n• Precision forged high-quality copper valve body ensures structural integrity and corrosion resistance.\n• Bidirectional flow design allows installation in any direction.\n• Compatible with most common refrigerants.", features: [
        "Bidirectional flow — can be installed in any direction",
        "Precision forged high-quality copper valve body",
        "Anti-blowout valve stem design for operational safety",
        "Rotation limiters at both full open and full close positions",
        "Secondary reliable sealing structure at valve stem for enhanced leak prevention",
        "Compatible with most common refrigerants",
        "NPT threaded connection — no welding required, tool-free installation and removal"
      ], availableModels: { headers: ["Model", "Port Size (NPT)", "Overall Size L×H (mm)"], rows: [
        ["GFM-S-NPT 1/4", "NPT 1/4", "64.5 × 43"],
        ["GFM-S-NPT 3/8", "NPT 3/8", "64.5 × 43"],
        ["GFM-S-NPT 1/2", "NPT 1/2", "77.5 × 53"],
        ["GFM-S-NPT 3/4", "NPT 3/4", "86.5 × 57"],
        ["GFM-S-NPT 1", "NPT 1", "96 × 61"]
      ] }, specs: [
        { "label": "Series Code", "value": "GFM-S" },
        { "label": "MWP (Maximum Working Pressure)", "value": "120 bar (12 MPa)" },
        { "label": "Connection Type", "value": "NPT Threaded" },
        { "label": "Bore Type", "value": "N/A" },
        { "label": "Refrigerant Compatibility", "value": "R22, R134a, R404A, R407C, R410A" },
        { "label": "Medium Temperature Range", "value": "−40 °C ~ +120 °C" },
        { "label": "Handle Type", "value": "Manual Lever" },
        { "label": "Valve Body Material", "value": "Copper (Precision Forged)" },
        { "label": "Sealing Material", "value": "Secondary reliable sealing structure at valve stem" },
        { "label": "Mounting Direction", "value": "Bidirectional flow, any direction" }
      ], applications: 'Refrigeration and air conditioning systems where brazed connections are impractical, field service and maintenance' },
      // Sight Glasses - Moisture Indicator & Oil Level
      { id: 'sg-1', categoryId: 'valves', subCategoryId: 'sight-glasses', thirdCategoryId: 'moisture-indicator-brazed-odf', images: ['/images/sight-glass-brazed-odf.jpg'], metaTitle: "Moisture Indicator Sight Glass, Brazed ODF | Refrigeration", metaDescription: "Brazed ODF moisture indicator sight glass for refrigeration liquid lines. Color-changing element detects water content. 7 models, 1/4\"–1-1/8\". 45 bar. MOQ 1 pc.", name: "Moisture Indicator Sight Glass — Brazed ODF Connection (SGN Series)", shortDesc: "Brazed ODF moisture indicator sight glass for permanent installation on refrigeration liquid lines. Color-changing element provides instant visual diagnosis of refrigerant water content. Available in 7 sizes from 1/4\" to 1-1/8\".", description: "• Moisture indicator sight glass designed for installation on refrigeration liquid lines\n• Brazed ODF (solder cup) connection provides a permanent, leak-free joint\n• Visual indicator shows refrigerant flow status, water content, and lubricant oil flow\n• Color-changing moisture indicator: green = dry (safe), yellow = wet (moisture alert)\n• Also detects refrigerant subcooling and insufficient system charging\n• Explosion-proof press-fit structure with a clear, safe observation window\n• Forged copper bar body for strength and corrosion resistance; modified PTFE seal\n• Bidirectional flow — install in either direction; compatible with HCFC and HFC", features: [
        "Moisture indicator for refrigeration liquid lines",
        "Brazed ODF connection for permanent, leak-free joint",
        "Visual indicator shows flow status, water content, and oil flow",
        "Color-changing element: green = dry, yellow = wet",
        "Detects subcooling and insufficient charging",
        "Explosion-proof press-fit structure",
        "Forged copper bar body with modified PTFE seal",
        "Bidirectional flow, compatible with HCFC/HFC"
      ], availableModels: { headers: ["Model", "Port Size (inch)", "Overall Size L×H (mm)"], rows: [
        ["SGN-1/4 ODF", "1/4", "102×21.5"],
        ["SGN-3/8 ODF", "3/8", "119×22.5"],
        ["SGN-1/2 ODF", "1/2", "146×26.5"],
        ["SGN-5/8 ODF", "5/8", "152×29.5"],
        ["SGN-3/4 ODF", "3/4", "167×35"],
        ["SGN-7/8 ODF", "7/8", "173×39"],
        ["SGN-1-1/8 ODF", "1-1/8", "216×44.5"]
      ] }, specs: [
        { label: "Series", value: "SGN" },
        { label: "Moisture Indicator", value: "Yes" },
        { label: "Connection", value: "Brazed (ODF)" },
        { label: "MWP", value: "4.5 MPa (45 bar)" },
        { label: "Burst Pressure", value: "6.8 MPa (68 bar)" },
        { label: "Temperature Range", value: "-40°C ~ +80°C" },
        { label: "Seal", value: "Modified PTFE" },
        { label: "Body", value: "Forged Copper Bar" },
        { label: "Leakage", value: "≤2g/a" },
        { label: "Mounting", value: "Refrigerant liquid line" },
        { label: "Refrigerant Compatibility", value: "HCFC, HFC" }
      ], applications: 'Refrigeration liquid lines for monitoring moisture content, refrigerant flow, and lubricant oil return' },
      { id: 'sg-2', categoryId: 'valves', subCategoryId: 'sight-glasses', thirdCategoryId: 'moisture-indicator-sae-flare', images: ['/images/sight-glass-sae-flare.jpg'], metaTitle: "Moisture Indicator Sight Glass, SAE Flare | Refrigeration", metaDescription: "SAE flare moisture indicator sight glass for refrigeration. UNF threaded connection. Color-changing moisture element. 5 models, 1/4\"–3/4\". 45 bar. MOQ 1 pc.", name: "Moisture Indicator Sight Glass — SAE Flare Connection (SGN Series)", shortDesc: "SAE flare moisture indicator sight glass with UNF threaded connection for serviceable installation on refrigeration liquid lines. Color-changing element detects moisture in HCFC/HFC systems. Available in 5 sizes from 1/4\" to 3/4\".", description: "• Moisture indicator sight glass for refrigeration liquid lines with SAE flare connection\n• SAE flare (UNF threaded) connection allows disassembly for service and maintenance\n• Visual indicator shows refrigerant flow, water content, and oil return status\n• Color-changing element: green = dry, yellow = wet\n• Detects excessive moisture, subcooling conditions, and undercharging\n• Explosion-proof press-fit window; forged copper bar body; modified PTFE seal\n• Compatible with HCFC and HFC systems\n• Note: Sight glass body ships with dual male flare; flare nuts included", features: [
        "Moisture indicator for refrigeration liquid lines",
        "SAE flare (UNF) connection for serviceable installation",
        "Visual indicator shows flow, water content, and oil return",
        "Color-changing element: green = dry, yellow = wet",
        "Detects moisture, subcooling, and undercharging",
        "Explosion-proof press-fit window",
        "Forged copper bar body with modified PTFE seal",
        "Compatible with HCFC/HFC systems"
      ], availableModels: { headers: ["Model", "Port Size (inch)", "Thread Spec", "Overall Size L×H (mm)"], rows: [
        ["SGN-1/4 SAE", "1/4", "7/16-20UNF", "64×21.5"],
        ["SGN-3/8 SAE", "3/8", "5/8-18UNF", "70×25"],
        ["SGN-1/2 SAE", "1/2", "3/4-16UNF", "75×26.5"],
        ["SGN-5/8 SAE", "5/8", "7/8-14UNF", "80×29.5"],
        ["SGN-3/4 SAE", "3/4", "1-1/16-14UNS", "90×35"]
      ] }, specs: [
        { label: "Series", value: "SGN" },
        { label: "Moisture Indicator", value: "Yes" },
        { label: "Connection", value: "SAE Flare (UNF)" },
        { label: "MWP", value: "4.5 MPa (45 bar)" },
        { label: "Burst Pressure", value: "6.8 MPa (68 bar)" },
        { label: "Temperature Range", value: "-40°C ~ +80°C" },
        { label: "Seal", value: "Modified PTFE" },
        { label: "Body", value: "Forged Copper Bar" },
        { label: "Leakage", value: "≤2g/a" },
        { label: "Mounting", value: "Refrigerant liquid line" },
        { label: "Refrigerant Compatibility", value: "HCFC, HFC" }
      ], applications: 'Refrigeration liquid lines for monitoring moisture content, refrigerant flow, and lubricant oil return' },
      { id: 'sg-3', categoryId: 'valves', subCategoryId: 'sight-glasses', thirdCategoryId: 'moisture-indicator-sae-flare-mf', images: ['/images/sight-glass-sae-flare-mf.jpg'], metaTitle: "Moisture Indicator Sight Glass, SAE Flare M/F | Refrigeration", metaDescription: "Male/female SAE flare sight glass with moisture indicator. Dual-end flare for direct tube connection. 4 models, 1/4\"–5/8\". UNF threads. 45 bar. MOQ 1 pc.", name: "Moisture Indicator Sight Glass — SAE Flare, Male/Female (SGN-MF Series)", shortDesc: "Male/female dual-end SAE flare sight glass with built-in moisture indicator. One male and one female flare end enable direct tube-to-tube connection without additional fittings. Available in 4 sizes from 1/4\" to 5/8\".", description: "• Male/female dual-end SAE flare sight glass for refrigeration liquid lines\n• One male flare end and one female flare end enable direct tube-to-tube connection without additional fittings\n• Color-changing moisture indicator: green = dry, yellow = wet\n• Visual monitoring of refrigerant flow, water content, and oil circulation\n• Explosion-proof press-fit window; forged copper bar body; modified PTFE seal\n• Detects excessive moisture, refrigerant subcooling, and insufficient charging\n• Compatible with HCFC and HFC systems\n• Structure: One end SAE male, one end SAE female", features: [
        "Male/female dual-end SAE flare for direct tube connection",
        "Moisture indicator with color-changing element",
        "Visual monitoring of flow, water content, and oil circulation",
        "Color-changing element: green = dry, yellow = wet",
        "Detects moisture, subcooling, and undercharging",
        "Explosion-proof press-fit window",
        "Forged copper bar body with modified PTFE seal",
        "Compatible with HCFC/HFC systems"
      ], availableModels: { headers: ["Model", "Port Size (inch)", "Thread Spec", "Overall Size L×H (mm)"], rows: [
        ["SGN-MF-04", "1/4", "7/16-20UNF", "76×21.5"],
        ["SGN-MF-06", "3/8", "5/8-18UNF", "82×25"],
        ["SGN-MF-08", "1/2", "3/4-16UNF", "87×26.5"],
        ["SGN-MF-10", "5/8", "7/8-14UNF", "92×29.5"]
      ] }, specs: [
        { label: "Series", value: "SGN-MF" },
        { label: "Moisture Indicator", value: "Yes" },
        { label: "Connection", value: "SAE Flare Male/Female" },
        { label: "MWP", value: "4.5 MPa (45 bar)" },
        { label: "Burst Pressure", value: "6.8 MPa (68 bar)" },
        { label: "Temperature Range", value: "-40°C ~ +80°C" },
        { label: "Seal", value: "Modified PTFE" },
        { label: "Body", value: "Forged Copper Bar" },
        { label: "Leakage", value: "≤2g/a" },
        { label: "Mounting", value: "Refrigerant liquid line" },
        { label: "Refrigerant Compatibility", value: "HCFC, HFC" }
      ], applications: 'Refrigeration liquid lines for direct tube-to-tube connection with moisture monitoring' },
      // Product 4 & 5: Placeholder - pending confirmation from supplier
      { id: 'sg-4', categoryId: 'valves', subCategoryId: 'sight-glasses', thirdCategoryId: 'moisture-indicator-npt', published: false, images: [], metaTitle: "Moisture Indicator Sight Glass, NPT Threaded | Refrigeration", metaDescription: "NPT threaded moisture indicator sight glass for refrigeration. Content pending supplier confirmation.", name: "Moisture Indicator Sight Glass — NPT Threaded (SGN-NPT Series)", shortDesc: "NPT threaded moisture indicator sight glass. Content pending supplier confirmation.", description: "Pending supplier confirmation.", features: [], availableModels: { headers: ["Model", "Port Size", "Overall Size"], rows: [] }, specs: [], applications: 'Pending supplier confirmation.' },
      { id: 'sg-5', categoryId: 'valves', subCategoryId: 'sight-glasses', thirdCategoryId: 'oil-level-g-thread', published: false, images: [], metaTitle: "Oil Level Sight Glass, G Thread | Refrigeration", metaDescription: "Oil level sight glass with G thread connection. Content pending supplier confirmation.", name: "Oil Level Sight Glass — G Thread Connection (SGR Series)", shortDesc: "Oil level sight glass with G thread connection. Content pending supplier confirmation.", description: "Pending supplier confirmation.", features: [], availableModels: { headers: ["Model", "Port Size", "Overall Size"], rows: [] }, specs: [], applications: 'Pending supplier confirmation.' },
    ],
  },
  {
    id: 'filter-driers',
    name: 'Filter Driers',
    icon: 'Filter',
    subCategories: [
      { id: 'filter-driers-overview', name: 'Category Overview', isOverview: true },
      { id: 'bidirectional-sae-flare', name: 'Bidirectional Filter Drier — SAE Flare (BFK)' },
      { id: 'bidirectional-brazed-odf', name: 'Bidirectional Filter Drier — Brazed ODF (BFK)' },
      { id: 'unidirectional-sae-flare', name: 'Unidirectional Filter Drier — SAE Flare (DFS)' },
      { id: 'unidirectional-brazed-odf', name: 'Unidirectional Filter Drier — Brazed ODF (DFS)' },
      { id: 'replaceable-core-filter-drier', name: 'Replaceable Core Filter Drier — Brazed ODF (DFS)' },
    ],
    products: [
      { id: 'fd-1', categoryId: 'filter-driers', subCategoryId: 'bidirectional-sae-flare', images: ['/images/bfk-sae-01.jpg'], metaTitle: "BFK Bidirectional Filter Drier, SAE Flare | Refrigeration", metaDescription: "BFK bidirectional solid core filter drier with SAE flare, 80% molecular sieve + 20% alumina, 3/8\"-3/4\", MWP 45 bar. 10 models. MOQ 1 pc.", name: "BFK Bidirectional Filter Drier — SAE Flare, Solid Core", shortDesc: "The BFK Series bidirectional filter drier with SAE flare connection features a solid core of 80% 3A molecular sieve and 20% activated alumina. Covering port sizes from 3/8\" to 3/4\", it provides effective moisture and contaminant removal for HCFC and HFC refrigeration systems.", description: "• Bidirectional solid core filter drier designed for moisture and contaminant removal in refrigeration systems.\n• Filter media: 80% 3A molecular sieve + 20% activated alumina for superior moisture and acid adsorption.\n• 25μm filter fineness ensures clean refrigerant flow.\n• SAE flare connection for easy installation and maintenance.\n• Corrosion-resistant powder coating for extended service life.\n• Can be mounted in any direction for flexible system integration.", features: [
      "Bidirectional flow design allows installation in any orientation",
      "Solid core with 80% 3A molecular sieve + 20% activated alumina",
      "25μm filter fineness for effective contaminant removal",
      "SAE flare connection for easy installation",
      "Corrosion-resistant powder coating",
      "Compatible with HCFC and HFC refrigerants",
      "Wide temperature range: −40 °C to +120 °C",
      "MWP 45 bar (4.5 MPa) for high-pressure applications"
    ], availableModels: { headers: ["Model", "Port Size", "Thread M", "Overall Size L×D (mm)"], rows: [
      ["BFK-083", "3/8\"", "5/8-18UNF", "158 × 66.5"],
      ["BFK-084", "1/2\"", "3/4-16UNF", "165 × 66.5"],
      ["BFK-085", "5/8\"", "7/8-14UNF", "176 × 66.5"],
      ["BFK-163", "3/8\"", "5/8-18UNF", "170 × 79"],
      ["BFK-164", "1/2\"", "3/4-16UNF", "179 × 79"],
      ["BFK-165", "5/8\"", "7/8-14UNF", "186 × 79"],
      ["BFK-303", "3/8\"", "5/8-18UNF", "245 × 79"],
      ["BFK-304", "1/2\"", "3/4-16UNF", "254 × 79"],
      ["BFK-305", "5/8\"", "7/8-14UNF", "261 × 79"],
      ["BFK-306", "3/4\"", "1-1/16-14UNS", "265 × 79"]
    ] }, specs: [
      { label: "Series Code", value: "BFK" },
      { label: "Filter Core Type", value: "Solid Core" },
      { label: "Filter Media", value: "80% 3A Molecular Sieve + 20% Activated Alumina" },
      { label: "Filter Fineness", value: "25μm" },
      { label: "Flow Direction", value: "Bidirectional" },
      { label: "Refrigerant Compatibility", value: "HCFC, HFC" },
      { label: "Medium Temperature Range", value: "−40 °C ~ +120 °C" },
      { label: "MWP", value: "4.5 MPa (45 bar)" },
      { label: "Maximum Test Pressure", value: "6.75 MPa" },
      { label: "Connection Type", value: "SAE Flare" },
      { label: "Surface Coating", value: "Corrosion-resistant powder coating" },
      { label: "Mounting Direction", value: "Any direction" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'fd-2', categoryId: 'filter-driers', subCategoryId: 'bidirectional-brazed-odf', images: ['/images/bfk-odf-01.png'], metaTitle: "BFK Bidirectional Filter Drier, Brazed ODF | Refrigeration", metaDescription: "BFK bidirectional solid core filter drier with brazed ODF, 80% molecular sieve + 20% alumina, 3/8\"-1-1/8\", MWP 45 bar. 12 models. MOQ 1 pc.", name: "BFK Bidirectional Filter Drier — Brazed ODF, Solid Core", shortDesc: "The BFK Series bidirectional filter drier with brazed ODF connection features a solid core of 80% 3A molecular sieve and 20% activated alumina. Covering port sizes from 3/8\" to 1-1/8\", it provides effective moisture and contaminant removal for HCFC and HFC refrigeration systems.", description: "• Bidirectional solid core filter drier designed for moisture and contaminant removal in refrigeration systems.\n• Filter media: 80% 3A molecular sieve + 20% activated alumina for superior moisture and acid adsorption.\n• 25μm filter fineness ensures clean refrigerant flow.\n• Brazed ODF connection for permanent, leak-free installation.\n• Corrosion-resistant powder coating for extended service life.\n• Can be mounted in any direction for flexible system integration.", features: [
      "Bidirectional flow design allows installation in any orientation",
      "Solid core with 80% 3A molecular sieve + 20% activated alumina",
      "25μm filter fineness for effective contaminant removal",
      "Brazed ODF connection for permanent, leak-free installation",
      "Corrosion-resistant powder coating",
      "Compatible with HCFC and HFC refrigerants",
      "Wide temperature range: −40 °C to +120 °C",
      "MWP 45 bar (4.5 MPa) for high-pressure applications"
    ], availableModels: { headers: ["Model", "Port Size", "Overall Size L×D (mm)"], rows: [
      ["BFK-083S", "3/8\"", "141 × 66.5"],
      ["BFK-084S", "1/2\"", "149 × 66.5"],
      ["BFK-085S", "5/8\"", "149 × 66.5"],
      ["BFK-163S", "3/8\"", "153 × 79"],
      ["BFK-164S", "1/2\"", "161 × 79"],
      ["BFK-165S", "5/8\"", "161 × 79"],
      ["BFK-303S", "3/8\"", "228 × 79"],
      ["BFK-304S", "1/2\"", "236 × 79"],
      ["BFK-305S", "5/8\"", "236 × 79"],
      ["BFK-306S", "3/4\"", "241 × 79"],
      ["BFK-307S", "7/8\"", "247 × 79"],
      ["BFK-309S", "1-1/8\"", "256 × 79"]
    ] }, specs: [
      { label: "Series Code", value: "BFK" },
      { label: "Filter Core Type", value: "Solid Core" },
      { label: "Filter Media", value: "80% 3A Molecular Sieve + 20% Activated Alumina" },
      { label: "Filter Fineness", value: "25μm" },
      { label: "Flow Direction", value: "Bidirectional" },
      { label: "Refrigerant Compatibility", value: "HCFC, HFC" },
      { label: "Medium Temperature Range", value: "−40 °C ~ +120 °C" },
      { label: "MWP", value: "4.5 MPa (45 bar)" },
      { label: "Maximum Test Pressure", value: "6.75 MPa" },
      { label: "Connection Type", value: "Brazed (ODF)" },
      { label: "Surface Coating", value: "Corrosion-resistant powder coating" },
      { label: "Mounting Direction", value: "Any direction" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'fd-3', categoryId: 'filter-driers', subCategoryId: 'unidirectional-sae-flare', images: ['/images/dfs-sae-01.png'], metaTitle: "DFS Unidirectional Filter Drier, SAE Flare | Refrigeration", metaDescription: "DFS unidirectional solid core filter drier with SAE flare, 100% 3A molecular sieve, 1/4\"-3/4\", MWP 45 bar. 13 models. MOQ 1 pc.", name: "DFS Unidirectional Filter Drier — SAE Flare, Solid Core", shortDesc: "The DFS Series unidirectional filter drier with SAE flare connection features a solid core of 100% 3A molecular sieve. Covering port sizes from 1/4\" to 3/4\", it provides superior moisture removal for HCFC and HFC refrigeration systems.", description: "• Unidirectional solid core filter drier designed for moisture removal in refrigeration systems.\n• Filter media: 100% 3A molecular sieve for superior moisture adsorption.\n• 25μm filter fineness ensures clean refrigerant flow.\n• SAE flare connection for easy installation and maintenance.\n• Corrosion-resistant powder coating for extended service life.\n• Can be mounted in any direction for flexible system integration.", features: [
      "Unidirectional flow design for optimal filtration performance",
      "Solid core with 100% 3A molecular sieve",
      "25μm filter fineness for effective contaminant removal",
      "SAE flare connection for easy installation",
      "Corrosion-resistant powder coating",
      "Compatible with HCFC and HFC refrigerants",
      "Wide temperature range: −40 °C to +120 °C",
      "MWP 45 bar (4.5 MPa) for high-pressure applications"
    ], availableModels: { headers: ["Model", "Port Size", "Thread M", "Overall Size L×D (mm)"], rows: [
      ["DFS-032", "1/4\"", "7/16-20UNF", "110 × 43"],
      ["DFS-033", "3/8\"", "5/8-18UNF", "119 × 43"],
      ["DFS-052", "1/4\"", "7/16-20UNF", "118 × 54"],
      ["DFS-053", "3/8\"", "5/8-18UNF", "127 × 54"],
      ["DFS-083", "3/8\"", "5/8-18UNF", "152 × 54"],
      ["DFS-084", "1/2\"", "3/4-16UNF", "159 × 54"],
      ["DFS-085", "5/8\"", "7/8-14UNF", "170 × 54"],
      ["DFS-163", "3/8\"", "5/8-18UNF", "159 × 75"],
      ["DFS-164", "1/2\"", "3/4-16UNF", "166 × 75"],
      ["DFS-165", "5/8\"", "7/8-14UNF", "177 × 75"],
      ["DFS-304", "1/2\"", "3/4-16UNF", "256 × 79"],
      ["DFS-305", "5/8\"", "7/8-14UNF", "267 × 79"],
      ["DFS-306", "3/4\"", "1-1/16-14UNS", "268 × 79"]
    ] }, specs: [
      { label: "Series Code", value: "DFS" },
      { label: "Filter Core Type", value: "Solid Core" },
      { label: "Filter Media", value: "100% 3A Molecular Sieve" },
      { label: "Filter Fineness", value: "25μm" },
      { label: "Flow Direction", value: "Unidirectional" },
      { label: "Refrigerant Compatibility", value: "HCFC, HFC" },
      { label: "Medium Temperature Range", value: "−40 °C ~ +120 °C" },
      { label: "MWP", value: "4.5 MPa (45 bar)" },
      { label: "Maximum Test Pressure", value: "6.75 MPa" },
      { label: "Connection Type", value: "SAE Flare" },
      { label: "Surface Coating", value: "Corrosion-resistant powder coating" },
      { label: "Mounting Direction", value: "Any direction" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'fd-4', categoryId: 'filter-driers', subCategoryId: 'unidirectional-brazed-odf', images: ['/images/dfs-odf-01.png'], metaTitle: "DFS Unidirectional Filter Drier, Brazed ODF | Refrigeration", metaDescription: "DFS unidirectional solid core filter drier with brazed ODF, 100% 3A molecular sieve, 1/4\"-1-1/8\", MWP 45 bar. 15 models. MOQ 1 pc.", name: "DFS Unidirectional Filter Drier — Brazed ODF, Solid Core", shortDesc: "The DFS Series unidirectional filter drier with brazed ODF connection features a solid core of 100% 3A molecular sieve. Covering port sizes from 1/4\" to 1-1/8\", it provides superior moisture removal for HCFC and HFC refrigeration systems.", description: "• Unidirectional solid core filter drier designed for moisture removal in refrigeration systems.\n• Filter media: 100% 3A molecular sieve for superior moisture adsorption.\n• 25μm filter fineness ensures clean refrigerant flow.\n• Brazed ODF connection for permanent, leak-free installation.\n• Corrosion-resistant powder coating for extended service life.\n• Can be mounted in any direction for flexible system integration.", features: [
      "Unidirectional flow design for optimal filtration performance",
      "Solid core with 100% 3A molecular sieve",
      "25μm filter fineness for effective contaminant removal",
      "Brazed ODF connection for permanent, leak-free installation",
      "Corrosion-resistant powder coating",
      "Compatible with HCFC and HFC refrigerants",
      "Wide temperature range: −40 °C to +120 °C",
      "MWP 45 bar (4.5 MPa) for high-pressure applications"
    ], availableModels: { headers: ["Model", "Port Size", "Overall Size L×D (mm)"], rows: [
      ["DFS-032S", "1/4\"", "99 × 43"],
      ["DFS-033S", "3/8\"", "101 × 43"],
      ["DFS-052S", "1/4\"", "107 × 54"],
      ["DFS-053S", "3/8\"", "109 × 54"],
      ["DFS-083S", "3/8\"", "134 × 54"],
      ["DFS-084S", "1/2\"", "142 × 54"],
      ["DFS-085S", "5/8\"", "142 × 54"],
      ["DFS-163S", "3/8\"", "142 × 75"],
      ["DFS-164S", "1/2\"", "150 × 75"],
      ["DFS-165S", "5/8\"", "150 × 75"],
      ["DFS-304S", "1/2\"", "239 × 79"],
      ["DFS-305S", "5/8\"", "239 × 79"],
      ["DFS-306S", "3/4\"", "244 × 79"],
      ["DFS-307S", "7/8\"", "250 × 79"],
      ["DFS-309S", "1-1/8\"", "259 × 79"]
    ] }, specs: [
      { label: "Series Code", value: "DFS" },
      { label: "Filter Core Type", value: "Solid Core" },
      { label: "Filter Media", value: "100% 3A Molecular Sieve" },
      { label: "Filter Fineness", value: "25μm" },
      { label: "Flow Direction", value: "Unidirectional" },
      { label: "Refrigerant Compatibility", value: "HCFC, HFC" },
      { label: "Medium Temperature Range", value: "−40 °C ~ +120 °C" },
      { label: "MWP", value: "4.5 MPa (45 bar)" },
      { label: "Maximum Test Pressure", value: "6.75 MPa" },
      { label: "Connection Type", value: "Brazed (ODF)" },
      { label: "Surface Coating", value: "Corrosion-resistant powder coating" },
      { label: "Mounting Direction", value: "Any direction" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
      { id: 'fd-5', categoryId: 'filter-driers', subCategoryId: 'replaceable-core-filter-drier', images: ['/images/dfs-replaceable-01.png'], metaTitle: "DFS Replaceable Core Filter Drier | Large Capacity", metaDescription: "DFS replaceable core filter drier, 100% 3A molecular sieve, 5/8\"-2-5/8\", MWP 42 bar. 1-3 cores, 420-1260 m² surface. 19 models. MOQ 1 pc.", name: "DFS Replaceable Core Filter Drier — Large Capacity, Brazed ODF", shortDesc: "The DFS Replaceable Core Series features a large-capacity design with 1 to 3 replaceable filter cores, providing 420 to 1260 m² of filtering surface area. Covering port sizes from 5/8\" to 2-5/8\", it is ideal for large commercial and industrial refrigeration systems.", description: "• Replaceable core filter drier designed for large-capacity moisture and contaminant removal.\n• Filter media: 100% 3A molecular sieve with 25μm filter pad.\n• 1 to 3 cores configuration provides 420 to 1260 m² of filtering surface area.\n• Brazed ODF connection for permanent, leak-free installation.\n• Epoxy resin electrostatic coating for corrosion resistance.\n• Can be mounted in any direction for flexible system integration.", features: [
      "Replaceable core design for easy maintenance and cost savings",
      "1 to 3 cores configuration (420/840/1260 m² filtering surface)",
      "100% 3A molecular sieve + 25μm filter pad",
      "Brazed ODF connection for permanent installation",
      "Epoxy resin electrostatic coating",
      "Compatible with HCFC, HFC, and CFC refrigerants",
      "Temperature range: −35 °C to +70 °C",
      "MWP 42 bar (4.2 MPa) for high-pressure applications"
    ], availableModels: { headers: ["Model", "Port Size", "Cores", "Filtering Surface (m²)", "Overall Size L×D (mm)"], rows: [
      ["DFS-485S", "5/8\"", "1", "420", "234 × 114"],
      ["DFS-486S", "3/4\"", "1", "420", "234 × 114"],
      ["DFS-487S", "7/8\"", "1", "420", "234 × 114"],
      ["DFS-489S", "1-1/8\"", "1", "420", "236 × 114"],
      ["DFS-4811S", "1-3/8\"", "1", "420", "240 × 114"],
      ["DFS-4813S", "1-5/8\"", "1", "420", "242 × 114"],
      ["DFS-4817S", "2-1/8\"", "1", "420", "246 × 114"],
      ["DFS-4821S", "2-5/8\"", "1", "420", "244 × 114"],
      ["DFS-967S", "7/8\"", "2", "840", "376 × 114"],
      ["DFS-969S", "1-1/8\"", "2", "840", "378 × 114"],
      ["DFS-9611S", "1-3/8\"", "2", "840", "382 × 114"],
      ["DFS-9613S", "1-5/8\"", "2", "840", "384 × 114"],
      ["DFS-9617S", "2-1/8\"", "2", "840", "388 × 114"],
      ["DFS-9621S", "2-5/8\"", "2", "840", "386 × 114"],
      ["DFS-1449S", "1-1/8\"", "3", "1260", "520 × 114"],
      ["DFS-14411S", "1-3/8\"", "3", "1260", "524 × 114"],
      ["DFS-14413S", "1-5/8\"", "3", "1260", "526 × 114"],
      ["DFS-14417S", "2-1/8\"", "3", "1260", "530 × 114"],
      ["DFS-14421S", "2-5/8\"", "3", "1260", "528 × 114"]
    ] }, specs: [
      { label: "Series Code", value: "DFS (Replaceable)" },
      { label: "Filter Core Type", value: "Replaceable Core" },
      { label: "Filter Media", value: "100% 3A Molecular Sieve + 25μm Filter Pad" },
      { label: "Filter Fineness", value: "25μm (filter pad) / 100 mesh (outlet screen)" },
      { label: "Flow Direction", value: "Unidirectional" },
      { label: "Refrigerant Compatibility", value: "HCFC, HFC, CFC" },
      { label: "Medium Temperature Range", value: "−35 °C ~ +70 °C" },
      { label: "MWP", value: "4.2 MPa (42 bar)" },
      { label: "Maximum Test Pressure", value: "6.3 MPa" },
      { label: "Connection Type", value: "Brazed (ODF)" },
      { label: "Surface Coating", value: "Epoxy resin electrostatic coating" },
      { label: "Mounting Direction", value: "Any direction" },
      { label: "Number of Cores", value: "1, 2, or 3" },
      { label: "Filtering Surface Area", value: "420 m² (1 core) / 840 m² (2 cores) / 1260 m² (3 cores)" }
    ], applications: 'Refrigeration, cold storage, air conditioning, heat pump systems' },
    ],
  },

  {
    id: 'capacitors',
    name: 'Capacitors',
    icon: 'Battery',
    subCategories: [
      { id: 'run-capacitors', name: 'Run Capacitors' },
      { id: 'start-capacitors', name: 'Start Capacitors' },
      { id: 'dual-run-capacitors', name: 'Dual Run Capacitors' },
      { id: 'hard-start-kits', name: 'Hard Start Kits' },
    ],
    products: [
      { id: 'cap-1', categoryId: 'capacitors', subCategoryId: 'run-capacitors', name: 'Run Capacitor', shortDesc: 'Film capacitors for motor running applications.', description: 'High-quality metallized polypropylene film run capacitors for compressor and fan motor operation.', specs: [{ label: 'Capacitance', value: '1μF - 100μF' }, { label: 'Voltage', value: '250V / 370V / 440V / 450V' }, { label: 'Tolerance', value: '±5%' }], applications: 'Compressor motor, fan motor' },
      { id: 'cap-2', categoryId: 'capacitors', subCategoryId: 'start-capacitors', name: 'Start Capacitor', shortDesc: 'Electrolytic capacitors for motor starting torque.', description: 'High-capacity electrolytic start capacitors providing the initial torque boost for motor starting.', specs: [{ label: 'Capacitance', value: '50μF - 500μF' }, { label: 'Voltage', value: '125V / 165V / 250V / 330V' }], applications: 'Compressor starting, motor starting' },
      { id: 'cap-3', categoryId: 'capacitors', subCategoryId: 'dual-run-capacitors', name: 'Dual Run Capacitor', shortDesc: 'Combined run capacitors for compressor + fan.', description: '3-terminal dual run capacitors combining compressor and fan motor capacitance in one unit.', specs: [{ label: 'Configuration', value: 'e.g., 30+5μF, 35+5μF, 40+5μF' }, { label: 'Voltage', value: '370V / 440V / 450V' }], applications: 'Heat pump, packaged AC units' },
      { id: 'cap-4', categoryId: 'capacitors', subCategoryId: 'hard-start-kits', name: 'Hard Start Kit', shortDesc: 'Boost starting torque for struggling compressors.', description: 'Complete hard start kits with start capacitor and potential relay for difficult-starting compressors.', specs: [{ label: 'Range', value: '1/6 - 5 HP' }], applications: 'Aging compressors, low-voltage conditions' },
    ],
  },
  {
    id: 'pressure-gauges',
    name: 'Pressure Gauges',
    icon: 'Gauge',
    subCategories: [
      { id: 'manifold-gauges', name: 'Manifold Gauges' },
      { id: 'digital-gauges', name: 'Digital Gauges' },
    ],
    products: [
      { id: 'pg-1', categoryId: 'pressure-gauges', subCategoryId: 'manifold-gauges', name: 'HVAC Manifold Gauge Set', shortDesc: 'Professional gauge sets for system charging and diagnostics.', description: 'Professional manifold gauge sets with R410A/R32 compatibility for system charging, evacuation, and diagnostics.', specs: [{ label: 'Range', value: 'Compound: -30~120psi / High: 0~800psi' }, { label: 'Refrigerant', value: 'R22 / R134a / R410A / R32' }], applications: 'AC installation, maintenance, troubleshooting' },
      { id: 'pg-2', categoryId: 'pressure-gauges', subCategoryId: 'digital-gauges', name: 'Digital Pressure Gauge', shortDesc: 'Digital gauges for precise pressure readings.', description: 'High-accuracy digital pressure gauges with backlight display for precise readings in all lighting conditions.', specs: [{ label: 'Accuracy', value: '±0.5% FS' }, { label: 'Range', value: '0~600psi' }], applications: 'Precision diagnostics, system commissioning' },
    ],
  },
  {
    id: 'tools',
    name: 'Tools',
    icon: 'Hammer',
    subCategories: [
      { id: 'refrigeration-tools', name: 'Refrigeration Tools' },
    ],
    products: [
      { id: 't-1', categoryId: 'tools', subCategoryId: 'refrigeration-tools', name: 'Tube Cutter', shortDesc: 'Precision copper tube cutters.', description: 'Ratcheting and rotary tube cutters for clean, burr-free cuts on copper tubes.', specs: [{ label: 'Range', value: '3-35mm / 3-42mm' }], applications: 'AC installation, pipe fitting' },
      { id: 't-2', categoryId: 'tools', subCategoryId: 'refrigeration-tools', name: 'Flaring Tool', shortDesc: 'Flare tools for creating pipe flare connections.', description: 'Precision flaring tool sets for creating proper flare connections on copper tubes.', specs: [{ label: 'Range', value: '1/4" - 1-1/8"' }, { label: 'Type', value: 'Eccentric / Concentric' }], applications: 'AC installation, flare fitting preparation' },
      { id: 't-3', categoryId: 'tools', subCategoryId: 'refrigeration-tools', name: 'Vacuum Pump', shortDesc: 'Vacuum pumps for system evacuation.', description: 'Two-stage rotary vane vacuum pumps for efficient system evacuation before charging.', specs: [{ label: 'CFM', value: '3 / 6 / 12 CFM' }, { label: 'Vacuum', value: '25 micron' }], applications: 'System evacuation, dehydration' },
    ],
  },
  {
    id: 'compressors',
    name: 'Compressors',
    icon: 'Engine',
    subCategories: [
      { id: 'rotary-compressors', name: 'Rotary Compressors' },
      { id: 'scroll-compressors', name: 'Scroll Compressors' },
      { id: 'reciprocating-compressors', name: 'Reciprocating Compressors' },
    ],
    products: [
      { id: 'comp-1', categoryId: 'compressors', subCategoryId: 'rotary-compressors', name: 'Rotary Compressor', shortDesc: 'Efficient rotary compressors for residential AC.', description: 'High-efficiency rotary compressors for residential and light commercial air conditioning systems.', specs: [{ label: 'Capacity', value: '0.5 - 5 HP' }, { label: 'Refrigerant', value: 'R22 / R410A / R32' }, { label: 'Voltage', value: '220V/1Ph/50Hz or 60Hz' }], applications: 'Split AC, window AC, portable AC' },
      { id: 'comp-2', categoryId: 'compressors', subCategoryId: 'scroll-compressors', name: 'Scroll Compressor', shortDesc: 'Scroll compressors for commercial applications.', description: 'Reliable scroll compressors for commercial air conditioning and heat pump applications.', specs: [{ label: 'Capacity', value: '3 - 15 HP' }, { label: 'Refrigerant', value: 'R410A / R32 / R407C' }], applications: 'Commercial AC, VRF systems, heat pumps' },
      { id: 'comp-3', categoryId: 'compressors', subCategoryId: 'reciprocating-compressors', name: 'Reciprocating Compressor', shortDesc: 'Reciprocating compressors for industrial refrigeration.', description: 'Heavy-duty reciprocating compressors for industrial refrigeration and cold storage applications.', specs: [{ label: 'Capacity', value: '2 - 30 HP' }, { label: 'Refrigerant', value: 'R22 / R134a / R404A' }], applications: 'Cold storage, industrial refrigeration, ice machines' },
    ],
  },
]

// Solenoid Valves Comparison Table Data
export const solenoidValvesComparison = {
  title: 'Refrigeration Solenoid Valves',
  subtitle: '15 solenoid valve variants across 10 series, covering port sizes 1/4" to 2-1/8" (up to 60 mm for industrial models). Configurations include NC/NO, direct/servo-operated, piston and diaphragm structures.',
  headers: ['#', 'Product', 'Series', 'Structure', 'NO/NC', 'Opening', 'Connection', 'Port Range', 'Kv (m³/h)', 'MWP (bar)', 'Voltage', 'Models'],
  rows: [
    ['1', 'Standard Solenoid Valve (ODF, NC)', 'HVD', 'Piston', 'NC', 'Servo', 'Brazed (ODF)', '3/8"~1-5/8"', '0.8~25', '45', 'AC380/220V', '8'],
    ['2', 'High Flow Solenoid Valve, Flanged ODF', 'HVP', 'Piston', 'NC', 'Servo', 'ODF (flanged)', '1-1/8"~2-1/8"', '10~28', '45', 'AC380/220V', '4'],
    ['3', 'Clamping Type Solenoid Valve, Small Port', 'HV-S', 'Diaphragm', 'NC', 'Servo', 'SAE/ODF', '1/4"~3/8"', '0.2~0.27', '45', 'AC380/220/110/24V, DC12V', '4'],
    ['4', 'Clamping Type Solenoid Valve, Large Port', 'HV-L', 'Diaphragm', 'NC', 'Servo', 'SAE/ODF', '3/8"~1-1/8"', '0.8~10', '45', 'AC380/220/110/24V, DC12V', '14'],
    ['5', 'IP65 Sealed Solenoid Valve, Direct Operated', 'SV-D', 'Diaphragm', 'NC', 'Direct', 'SAE/ODF', '1/4"~3/8"', '0.2~0.27', '45', 'AC380/220/110/24V, DC12V', '4'],
    ['6', 'IP65 Sealed Solenoid Valve, Servo Operated', 'SV-S', 'Diaphragm', 'NC', 'Servo', 'SAE/ODF', '3/8"~7/8"', '0.8~5.7', '45', 'AC380/220/110/24V, DC12V', '9'],
    ['7', 'Low Power Solenoid Valve 8W, Direct Operated', '10-D', 'Diaphragm', 'NC', 'Direct', 'SAE/ODF', '1/4"~3/8"', '0.2~0.27', '45', 'AC380/220/110/24V, DC12V', '4'],
    ['8', 'Low Power Solenoid Valve 8W, Servo Operated', '10-S', 'Diaphragm', 'NC', 'Servo', 'SAE/ODF', '3/8"~3/4"', '0.8~2.6', '45', 'AC380/220/110/24V, DC12V', '8'],
    ['9', 'Normally Open Solenoid Valve, Small Port', 'HVK-S', 'Diaphragm', 'NO', 'Servo', 'SAE/ODF', '1/4"~3/8"', '0.2~0.8', '45', 'AC380/220/110/24V, DC12V', '6'],
    ['10', 'Normally Open Solenoid Valve, Large Port', 'HVK-L', 'Diaphragm', 'NO', 'Servo', 'SAE/ODF', '1/2"~1-1/8"', '0.8~10', '45', 'AC380/220/110/24V, DC12V', '12'],
    ['11', 'Compressor Unloading Solenoid Valve, Flanged', 'HV-U(F)', 'Piston', 'NC', 'Direct', 'Flanged', 'Flange mount', '0.27', '45', 'AC220V', '1'],
    ['12', 'Compressor Unloading Solenoid Valve, ODF', 'HV-U(O)', 'Piston', 'NC', 'Direct', 'Brazed (ODF)', '3/8"', '0.2', '45', 'AC220V', '1'],
    ['13', 'Hot Gas Defrost Solenoid Valve, 3-Way', 'HVS(R)', 'Piston (3-way)', 'NC', 'Servo (3-way)', 'Special', '22~42 mm', '7.1~20.2', '30', 'AC220V', '4'],
    ['14', 'High Flow Piston Solenoid Valve, ODF', 'HVDF', 'Piston', 'NC', 'Servo', 'Brazed (ODF)', '28.2~59.3 mm', '10~28', '45', 'AC380/220V', '5'],
    ['15', 'High Flow Piston Solenoid Valve, Flanged', 'HVPF', 'Piston', 'NC', 'Servo', 'ODF (flanged)', '35~60.3 mm', '10~30', '45', 'AC380/220V', '5'],
  ],
};

// Filter Driers Comparison Table Data
export const filterDriersComparison = {
  title: 'Refrigeration Filter Driers',
  subtitle: '5 filter drier variants across 2 series (BFK bidirectional, DFS unidirectional), covering port sizes 1/4" to 2-5/8". Configurations include solid core and replaceable core, SAE flare and brazed ODF connections.',
  headers: ['#', 'Product', 'Series', 'Core Type', 'Filter Media', 'Flow', 'Connection', 'Port Size', 'MWP (bar)', 'Temp Range', 'Models'],
  rows: [
    ['1', 'Bidirectional Filter Drier, SAE Flare', 'BFK', 'Solid Core', '80% Mol. Sieve + 20% Alumina', 'Bidirectional', 'SAE Flare', '3/8"~3/4"', '45', '−40~+120°C', '10'],
    ['2', 'Bidirectional Filter Drier, Brazed ODF', 'BFK', 'Solid Core', '80% Mol. Sieve + 20% Alumina', 'Bidirectional', 'Brazed ODF', '3/8"~1-1/8"', '45', '−40~+120°C', '12'],
    ['3', 'Unidirectional Filter Drier, SAE Flare', 'DFS', 'Solid Core', '100% 3A Mol. Sieve', 'Unidirectional', 'SAE Flare', '1/4"~3/4"', '45', '−40~+120°C', '13'],
    ['4', 'Unidirectional Filter Drier, Brazed ODF', 'DFS', 'Solid Core', '100% 3A Mol. Sieve', 'Unidirectional', 'Brazed ODF', '1/4"~1-1/8"', '45', '−40~+120°C', '15'],
    ['5', 'Replaceable Core Filter Drier, Brazed ODF', 'DFS-R', 'Replaceable', '100% 3A Mol. Sieve', 'Unidirectional', 'Brazed ODF', '5/8"~2-5/8"', '42', '−35~+70°C', '19'],
  ],
};

// Ball Valves Comparison Table Data
export const ballValvesComparison = {
  title: 'Refrigeration Ball Valves',
  subtitle: 'Five ball valve series for refrigeration and HVAC systems — from standard manual ODF valves to 120 bar CO₂-rated and electrically actuated models.',
  headers: ['#', 'Product', 'Series', 'Drive', 'Bore', 'Connection', 'Port Range', 'Kv (m³/h)', 'MWP (bar)', 'Refrigerant', 'Temp Range', 'Models'],
  rows: [
    ['1', 'Electric Ball Valve (Full Bore)', 'DQF', 'Electric', 'Full', 'Brazed (ODF)', '3/8"~3-1/8"', '5.7~200', '45', 'HCFC, HFC', '−40~+120°C', '11'],
    ['2', 'Manual Ball Valve (Full Bore)', 'HBC', 'Manual', 'Full', 'Brazed (ODF)', '1/4"~3-1/8"', '2~700', '45', 'HCFC, HFC', '−40~+120°C', '16'],
    ['3', 'Manual Ball Valve (Reduced Bore)', 'QFT', 'Manual', 'Reduced', 'Brazed (ODF)', '1/4"~2-1/8"', 'N/A', '45', 'R22, R134a, R404A, R407C, R410A', '−40~+120°C', '10'],
    ['4', 'CO₂ Ball Valve (Full Bore)', 'QF-CO2', 'Manual', 'Full', 'Brazed (ODF)', '1/2"~2-1/8"', '10~200', '120', 'CO₂ (R744)', '−50~+150°C', '8'],
    ['5', 'Threaded Ball Valve (NPT)', 'GFM-S', 'Manual', 'N/A', 'NPT Threaded', 'NPT 1/4~1', 'N/A', '120', 'R22, R134a, R404A, R407C, R410A', '−40~+120°C', '5'],
  ],
};

// Category Landing Page Content
export interface CategoryLandingContent {
  categoryId: string;
  subCategoryId?: string;
  h1: string;
  introduction: string;
  howToChoose: { title: string; content: string }[];
  faq: { question: string; answer: string }[];
  relatedCategories: { name: string; slug: string }[];
}

export const categoryLandingContent: CategoryLandingContent[] = [
  {
    categoryId: 'valves',
    subCategoryId: 'solenoid-valves',
    h1: 'Refrigeration Solenoid Valves for HVAC & Refrigeration — Types & Selection Guide',
    introduction: `Refrigeration solenoid valves are electrically actuated shut-off valves used to control the flow of refrigerant in air conditioning, cold storage, commercial refrigeration, and heat pump systems. They serve as the on/off control point in liquid lines, hot gas defrost circuits, compressor unloading systems, and pump-down configurations. HVACR NET supplies 15 solenoid valve variants across 10 series from Ningbo, China's HVAC/R manufacturing hub — covering port sizes from 1/4" to 2-1/8" (up to 60 mm for industrial models), with configurations including NC/NO, direct/servo-operated, piston and diaphragm structures, and brazed ODF, SAE flare, and flanged connections. All valves are 100% leak-tested before shipment. We supply contractors, wholesalers, and service companies worldwide with MOQ starting from 1 piece, competitive pricing, and ready stock on popular models.`,
    howToChoose: [
      { title: 'Direct Operated vs Servo (Pilot) Operated', content: 'Direct operated valves open at zero pressure differential and are ideal for small ports (1/4"–3/8") and low-pressure applications. Servo-operated valves use system pressure to assist opening, offering higher flow capacity (Kv) for larger ports (3/8"–2-1/8"). Choose direct operated for tight shutoff at low pressure; choose servo for larger lines and higher Cv requirements.' },
      { title: 'Piston vs Diaphragm Structure', content: 'Piston-type solenoid valves (HVD, HVP, HVDF series) handle higher pressures (MWP 45 bar) and larger port sizes, making them suitable for industrial refrigeration and heat pump systems. Diaphragm-type valves (HV-S, HV-L, SV-D, SV-S series) are compact, cost-effective, and ideal for commercial refrigeration and residential AC systems with moderate pressure requirements.' },
      { title: 'NC (Normally Closed) vs NO (Normally Open)', content: 'NC valves are the default choice for most applications — they close when de-energized, preventing refrigerant flow. NO valves (HVK-S, HVK-L series) remain open when de-energized and are used for hot gas bypass, compressor cooling, or ventilation circuits that must remain open during power failure.' },
      { title: 'Connection Type: ODF vs Flare vs Flanged', content: 'Brazed ODF connections provide the most reliable, leak-free seal for permanent installations. SAE flare connections allow for serviceable joints that can be disconnected for maintenance. Flanged connections (HVP, HV-U(F) series) are used for large-port industrial valves where field serviceability is required.' },
      { title: 'Voltage & Coil Protection', content: 'Standard coils operate at AC220V or AC380V for industrial applications. Multi-voltage coils (AC380/220/110/24V, DC12V) offer flexibility for global installations. For outdoor or high-humidity environments, choose IP65-sealed models (SV-D, SV-S series) or low-power 8W coils that generate less heat.' },
    ],
    faq: [
      { question: 'Which solenoid valve is best for heat pump defrost?', answer: 'The HVS(R) 3-way hot gas defrost solenoid valve is specifically designed for heat pump defrost cycles. It reverses refrigerant flow to melt ice on the outdoor coil. For standard defrost on/off control, the HVD or HVDF piston-type valves are also suitable due to their high MWP (45 bar) and large port capacity.' },
      { question: 'Can I use a 24V DC solenoid valve on a 220V AC system?', answer: 'No. Solenoid valves are designed for specific voltage ratings. Using the wrong voltage will either fail to open the valve (under-voltage) or burn out the coil (over-voltage). Our multi-voltage coils (AC380/220/110/24V, DC12V) can handle multiple voltages, but you must select the correct tap setting.' },
      { question: 'What is the difference between Kv and Cv?', answer: 'Kv is the flow coefficient in metric units (m³/h), while Cv is in imperial units (US gal/min). Kv ≈ 0.865 × Cv. Our comparison table uses Kv values. For example, a valve with Kv = 10 m³/h has approximately Cv = 11.6.' },
      { question: 'Do you have solenoid valves for CO₂ (R744) systems?', answer: 'Standard solenoid valves are rated for HCFC/HFC refrigerants at MWP 45 bar. CO₂ systems operate at much higher pressures (up to 120 bar). For CO₂ applications, we recommend our high-pressure piston valves or custom-configured models. Contact us with your specific requirements.' },
      { question: 'What is the minimum order quantity (MOQ)?', answer: 'MOQ starts from 1 piece for sample orders. We welcome trial orders for quality evaluation before committing to larger quantities. Bulk orders receive volume discounts. Ready stock is available on popular models (HVD, HV-S, SV-S series) for fast dispatch from Ningbo.' },
    ],
    relatedCategories: [
      { name: 'Ball Valves', slug: 'ball-valves' },
      { name: 'Filter Driers', slug: 'filter-driers' },
      { name: 'Sight Glasses', slug: 'sight-glasses' },
    ],
  },
  {
    categoryId: 'valves',
    subCategoryId: 'ball-valves',
    h1: 'Refrigeration Ball Valves for HVAC & Refrigeration — Types & Selection Guide',
    introduction: `Refrigeration ball valves are manual or electrically actuated quarter-turn valves used for isolation, flow control, and system service access in HVAC and refrigeration piping systems. They provide reliable shut-off for refrigerant lines, liquid receivers, and service ports. HVACR NET supplies 5 ball valve series from Ningbo, China — including standard manual ODF valves (HBC, QFT), full-bore electric actuated valves (DQF), high-pressure CO₂-rated valves (QF-CO2, 120 bar), and NPT threaded models (GFM-S). Port sizes range from 1/4" to 3-1/8", with full-bore designs for minimal pressure drop and reduced-bore models for cost-effective installations. All valves are forged from high-grade brass, 100% leak-tested, and compatible with R22, R134a, R404A, R407C, R410A, and CO₂ refrigerants. MOQ from 1 piece, ready stock on popular models.`,
    howToChoose: [
      { title: 'Manual vs Electric Actuation', content: 'Manual ball valves (HBC, QFT, QF-CO2, GFM-S) are the standard choice for isolation and service access — simple, reliable, and cost-effective. Electric ball valves (DQF series) are used for automated flow control, remote operation, or integration with building management systems. Choose electric when you need programmable or remote-controlled operation.' },
      { title: 'Full Bore vs Reduced Bore', content: 'Full-bore valves (DQF, HBC, QF-CO2) have an internal diameter matching the pipe size, minimizing pressure drop — essential for liquid lines, suction lines, and systems where flow capacity is critical. Reduced-bore valves (QFT) are more compact and economical, suitable for service ports, gauge connections, and applications where some pressure drop is acceptable.' },
      { title: 'Standard vs CO₂-Rated Pressure', content: 'Standard ball valves (DQF, HBC, QFT, GFM-S) are rated at MWP 45 bar, suitable for HCFC/HFC refrigerant systems (R22, R134a, R404A, R410A). CO₂ ball valves (QF-CO2) are rated at 120 bar and operate from −50°C to +150°C, designed specifically for transcritical and subcritical CO₂ (R744) systems. Never use standard valves in CO₂ service.' },
      { title: 'Brazed ODF vs NPT Threaded', content: 'Brazed ODF connections (DQF, HBC, QFT, QF-CO2) provide permanent, leak-free joints for copper piping systems — the standard for refrigeration installations. NPT threaded connections (GFM-S) are used for steel piping, service ports, or applications where disassembly is required. Choose brazed for permanent installations; choose threaded for serviceable connections.' },
    ],
    faq: [
      { question: 'Can I use a standard ball valve in a CO₂ (R744) system?', answer: 'No. CO₂ systems operate at pressures up to 120 bar, far exceeding the 45 bar rating of standard ball valves. Using standard valves in CO₂ service creates a serious safety hazard. Use only QF-CO2 series valves rated for 120 bar and −50°C to +150°C.' },
      { question: 'What is the difference between full-bore and reduced-bore ball valves?', answer: 'Full-bore valves have an internal diameter matching the pipe size, minimizing pressure drop — ideal for liquid lines and suction lines. Reduced-bore valves have a smaller internal passage, which creates some pressure drop but is more compact and economical. Use full-bore for critical flow paths; reduced-bore is fine for service ports and isolation.' },
      { question: 'Do you offer electric actuated ball valves?', answer: 'Yes, the DQF series offers full-bore electric ball valves with brazed ODF connections, port sizes 3/8" to 3-1/8", Kv up to 200 m³/h, and MWP 45 bar. They are suitable for automated flow control and BMS integration. Contact us for voltage and control signal options.' },
      { question: 'What refrigerants are compatible with your ball valves?', answer: 'Standard ball valves (DQF, HBC, QFT, GFM-S) are compatible with R22, R134a, R404A, R407C, R410A, and other HCFC/HFC refrigerants. The QF-CO2 series is specifically designed for CO₂ (R744) systems. All valves use PTFE seats and seals compatible with common refrigerants and POE oils.' },
      { question: 'What is the MOQ and lead time?', answer: 'MOQ starts from 1 piece. Ready stock is available on popular models (HBC, QFT) for fast dispatch from Ningbo. Custom configurations or large orders typically ship within 7–15 days. We support mixed container orders across multiple product categories.' },
    ],
    relatedCategories: [
      { name: 'Solenoid Valves', slug: 'solenoid-valves' },
      { name: 'Filter Driers', slug: 'filter-driers' },
      { name: 'Sight Glasses', slug: 'sight-glasses' },
    ],
  },
  {
    categoryId: 'filter-driers',
    h1: 'HVAC & Refrigeration Filter Driers — Types & Selection Guide',
    introduction: `Refrigeration filter driers protect HVAC and refrigeration systems from moisture, acid, and solid contaminants that can damage compressors, expansion valves, and other components. They contain molecular sieve and activated alumina to adsorb water and neutralize acid, while their filter element captures particles and debris. HVACR NET supplies 5 filter drier variants across 2 series from Ningbo, China — BFK bidirectional (10 models) and DFS unidirectional (13 models in solid core, plus 19 replaceable-core models in DFS-R series). Port sizes range from 1/4" to 2-5/8", with SAE flare and brazed ODF connections. All filter driers are built with high-capacity molecular sieve for effective moisture removal and are compatible with R22, R134a, R404A, R410A, and other common refrigerants. MOQ from 1 piece, ready stock on popular sizes.`,
    howToChoose: [
      { title: 'Bidirectional vs Unidirectional', content: 'Bidirectional filter driers (BFK series) can be installed in either flow direction, making them versatile for heat pump systems where refrigerant flow reverses between heating and cooling modes. Unidirectional filter driers (DFS series) are optimized for one-way flow, offering higher moisture removal capacity in a more compact body. Use bidirectional for heat pumps; use unidirectional for cooling-only systems.' },
      { title: 'Solid Core vs Replaceable Core', content: 'Solid core filter driers (BFK, DFS) contain a fixed desiccant core that is replaced as a unit when saturated — simple, reliable, and cost-effective for most applications. Replaceable core filter driers (DFS-R series) allow the desiccant cartridge to be swapped without cutting the shell, reducing maintenance time and waste for large commercial systems. Choose solid core for standard installations; choose replaceable core for large systems where service cost matters.' },
      { title: 'SAE Flare vs Brazed ODF Connection', content: 'SAE flare connections (BFK flare, DFS flare) allow for serviceable joints that can be disconnected for filter replacement — suitable for small systems and field service. Brazed ODF connections (BFK ODF, DFS ODF) provide permanent, leak-free joints for copper piping — the standard for production installations and systems where vibration resistance is critical.' },
      { title: 'Molecular Sieve vs Activated Alumina', content: 'Our BFK series uses a blend of 80% molecular sieve + 20% activated alumina, providing both moisture adsorption and acid neutralization — ideal for systems with mixed contaminants. Our DFS series uses 100% 3A molecular sieve, optimized for maximum moisture removal in systems where acid is not a primary concern. Choose the blend for burnout cleanup; choose pure molecular sieve for standard moisture protection.' },
    ],
    faq: [
      { question: 'Can bidirectional filter driers be installed backwards?', answer: 'Yes, BFK bidirectional filter driers are designed to work in either flow direction. They are specifically intended for heat pump systems where refrigerant flow reverses between heating and cooling modes. The internal structure ensures effective filtration regardless of flow direction.' },
      { question: 'How do I know when to replace a filter drier?', answer: 'Replace the filter drier when: (1) the sight glass shows moisture (color change from green to yellow), (2) system superheat or subcooling is abnormal, (3) the compressor shows signs of acid (burned windings), or (4) as preventive maintenance during compressor replacement. In general, replace every 2–3 years or at each compressor changeout.' },
      { question: 'What is the difference between 3A and 4A molecular sieve?', answer: '3A molecular sieve has a 3-angstrom pore size, which adsorbs water molecules but excludes larger refrigerant molecules — ideal for refrigeration systems to prevent refrigerant loss. 4A sieve has a 4-angstrom pore and can adsorb both water and some refrigerants. We use 3A sieve in our DFS series to ensure no refrigerant is trapped.' },
      { question: 'Can I use a unidirectional filter drier in a heat pump?', answer: 'Technically yes, but it is not recommended. Unidirectional driers (DFS) are optimized for one-way flow and may not filter effectively when flow reverses. For heat pump systems, use bidirectional driers (BFK series) which are designed to handle reverse flow without performance loss.' },
      { question: 'What port size filter drier do I need?', answer: 'Match the filter drier port size to the liquid line pipe size. For example, a 3/8" liquid line needs a 3/8" filter drier. Oversizing is acceptable (a 1/2" drier on a 3/8" line with reducers), but never undersize — this creates a pressure drop restriction. Our range covers 1/4" to 2-5/8" to match all common pipe sizes.' },
    ],
    relatedCategories: [
      { name: 'Solenoid Valves', slug: 'solenoid-valves' },
      { name: 'Ball Valves', slug: 'ball-valves' },
      { name: 'Sight Glasses', slug: 'sight-glasses' },
    ],
  },
  {
    categoryId: 'valves',
    subCategoryId: 'sight-glasses',
    h1: 'Refrigeration Sight Glasses for HVAC & Refrigeration — Types & Selection Guide',
    introduction: `Refrigeration sight glasses are visual monitoring devices installed in HVAC and refrigeration systems to indicate refrigerant condition, moisture content, and flow status. Moisture indicator sight glasses (SGN series) mount on liquid lines to show moisture content (green = dry, yellow = wet) and refrigerant flow — helping technicians diagnose dehydration problems before they cause compressor damage. Oil level sight glasses (SGR series) mount on compressor crankcases or liquid receivers to show oil or liquid level. Choosing the wrong connection type or confusing an oil level sight glass with a moisture indicator can lead to incorrect installation and system failure. This guide covers 4 moisture indicator models (brazed ODF, SAE flare, SAE flare M/F, NPT threaded) and 1 oil level model (G thread), all rated at 45 bar with forged copper bar bodies and modified PTFE seals.`,
    howToChoose: [
      { title: 'Step 1: Choose Function — Moisture Indicator vs Oil Level', content: 'Moisture indicator sight glasses (SGN series) mount on the refrigerant liquid line and show moisture content (green = dry, yellow = wet) and refrigerant flow. Oil level sight glasses (SGR series) mount on the compressor crankcase or liquid receiver and show oil/liquid level only — they have no moisture indicator. These two types are NOT interchangeable.' },
      { title: 'Step 2: Choose Connection Type', content: 'Brazed ODF for permanent copper tube soldered installation; SAE flare (UNF threaded) for removable service connections with flare nuts; SAE flare M/F for direct tube-to-tube flare joints (one male, one female end); NPT threaded for steel pipe or container ports with tapered threads; G thread (BSPP) for oil level sight glasses on compressor crankcases.' },
      { title: 'Step 3: Choose Size', content: 'Match the sight glass port size to your liquid line outer diameter or connection port size. Moisture indicator sight glasses range from 1/4" to 1-1/8" (SGN series). Oil level sight glasses are typically 3/4" (SGR series). Oversizing is acceptable with reducers, but never undersize.' },
      { title: 'Step 4: Refrigerant Compatibility', content: 'All sight glasses are compatible with HCFC and HFC refrigerants (R22, R134a, R404A, R410A, etc.). Color indication: green = dry (safe), yellow = wet (moisture alert).' },
    ],
    faq: [
      { question: 'Which sight glass do I need — a moisture indicator for the liquid line or an oil level sight glass?', answer: 'Moisture indicator sight glasses (SGN series, brazed ODF or SAE flare) mount on the refrigerant liquid line and show moisture content (green = dry, yellow = wet) and refrigerant flow. Oil level sight glasses (SGR series) mount on the compressor crankcase or liquid receiver and show oil/liquid level only — they have no moisture indicator. Choose brazed ODF for permanent soldered installation, SAE flare for removable service connections, or M/F for direct tube-to-tube flare joints.' },
    ],
    relatedCategories: [
      { name: 'Solenoid Valves', slug: 'solenoid-valves' },
      { name: 'Ball Valves', slug: 'ball-valves' },
      { name: 'Filter Driers', slug: 'filter-driers' },
    ],
  },
];
