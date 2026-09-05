export interface FAQItem {
  question: string
  answer: string
}

// 3 universal FAQs shown on every product page
export const UNIVERSAL_FAQS: FAQItem[] = [
  {
    question: 'What is your MOQ and lead time?',
    answer:
      'MOQ is 1 piece for most standard items. Ready-stock products ship within 3\u20137 working days; custom specifications or made-to-order items typically take 15\u201330 days. Contact us for current stock status.',
  },
  {
    question: 'Do you provide quality certificates with orders?',
    answer:
      'Yes. Mill Test Certificates (EN 10204 3.1) are provided per batch for copper products, and CE, RoHS and test reports are available for electrical and refrigeration components on request. Every order is inspected before shipment.',
  },
  {
    question: 'Can your parts replace major-brand components?',
    answer:
      'Many of our products are dimensionally and functionally interchangeable with major brands including Danfoss, Sporlan, Castel, Emerson, Copeland and Sanhua. Send us the brand and model you need to replace, and our team will confirm the cross-reference before you order.',
  },
]

// Category-specific selection FAQs (matched by category ID)
export const CATEGORY_SELECTION_FAQS: Record<string, FAQItem> = {
  'copper-tubes': {
    question: 'Which copper tube type do I need \u2014 pancake coil, mini jumbo, jumbo or straight tube?',
    answer:
      'Choose pancake coils (15M/30M) for mini-split field installation, mini jumbo (~50kg) for longer continuous runs that two technicians can handle, jumbo coils (~110kg on reel) for high-volume projects, and hard straight tubes (3M) for central AC, VRF and rigid piping. All are C12200/TP2 to ASTM B280 / EN 12735-1.',
  },
  'copper-fittings': {
    question: 'Which copper tube type do I need \u2014 pancake coil, mini jumbo, jumbo or straight tube?',
    answer:
      'Choose pancake coils (15M/30M) for mini-split field installation, mini jumbo (~50kg) for longer continuous runs that two technicians can handle, jumbo coils (~110kg on reel) for high-volume projects, and hard straight tubes (3M) for central AC, VRF and rigid piping. All are C12200/TP2 to ASTM B280 / EN 12735-1.',
  },
  'insulation-tubes': {
    question: 'Which insulation grade should I choose?',
    answer:
      'Standard NBR/PVC B1 (55\u201365 kg/m\u00B3) suits most AC and refrigeration lines; Class 0 fire-rated for projects with strict fire codes; extended-temperature grade for lines below \u221240\u00B0C or above 105\u00B0C; premium multi-certified (blue) for marine or export projects requiring UL/ASTM compliance.',
  },
  'insulation-materials': {
    question: 'Which insulation grade should I choose?',
    answer:
      'Standard NBR/PVC B1 (55\u201365 kg/m\u00B3) suits most AC and refrigeration lines; Class 0 fire-rated for projects with strict fire codes; extended-temperature grade for lines below \u221240\u00B0C or above 105\u00B0C; premium multi-certified (blue) for marine or export projects requiring UL/ASTM compliance.',
  },
  'solenoid-valves': {
    question: 'How do I choose \u2014 NC or NO, direct or servo operated?',
    answer:
      'Most liquid/suction line shut-off uses normally closed (NC) servo-operated piston valves; choose direct-operated (zero minimum pressure differential) for low-pressure or gravity-feed lines; normally open (NO) for unloading applications; IP65 sealed coils for outdoor or washdown environments. Always match port size, Kv and coil voltage to your system.',
  },
  'filter-driers': {
    question: 'Which filter drier type do I need?',
    answer:
      'Use bidirectional (BFK) driers on heat pump lines where refrigerant flows both ways; unidirectional (DFS) for standard AC and refrigeration liquid lines; SAE flare for field service, brazed ODF for permanent OEM installation; replaceable-core types for large industrial systems 5/8" and above.',
  },
  'ball-valves': {
    question: 'Which ball valve do I need \u2014 manual, electric or CO\u2082 rated?',
    answer:
      'Manual full-bore HBC valves cover standard HCFC/HFC systems (MWP 45 bar); electric DQF valves for automatic or remote shut-off; QF-CO2 valves (120 bar) are required for CO\u2082/R744 transcritical systems; NPT threaded valves for pipe-thread installations.',
  },
  'sight-glasses': {
    question: 'Which sight glass do I need?',
    answer:
      'Moisture indicator sight glasses mount on liquid lines to show moisture content and refrigerant flow \u2014 choose brazed ODF for permanent installation, SAE flare for easy service removal; oil level sight glasses mount on compressor crankcases for oil-level monitoring.',
  },
}

// Map subcategory IDs to their parent category FAQ
const SUBCATEGORY_TO_FAQ_KEY: Record<string, string> = {
  // Copper tubes subcategories
  'pancake-coils': 'copper-tubes',
  'mini-jumbo-coils': 'copper-tubes',
  'jumbo-coils': 'copper-tubes',
  'straight-tubes': 'copper-tubes',
  // Copper fittings subcategories
  'elbows': 'copper-fittings',
  'tees': 'copper-fittings',
  'reducers': 'copper-fittings',
  'couplings': 'copper-fittings',
  // Insulation subcategories
  'b1-economy': 'insulation-tubes',
  'b1-high-density': 'insulation-tubes',
  'b1-high-temp': 'insulation-tubes',
  'b1-low-temp': 'insulation-tubes',
  'nbr-lightweight': 'insulation-tubes',
  'nbr-premium': 'insulation-tubes',
  'insulation-sheets': 'insulation-tubes',
  // Valves subcategories
  'solenoid-valves': 'solenoid-valves',
  'ball-valves': 'ball-valves',
  'sight-glasses': 'sight-glasses',
  // Filter driers subcategories
  'filter-driers': 'filter-driers',
}

/**
 * Get the category-specific selection FAQ for a product.
 * Priority: product.faqSelection > subcategory match > category match
 */
export function getCategoryFAQ(
  categoryId: string,
  subCategoryId?: string,
  faqSelection?: FAQItem
): FAQItem | null {
  // Priority 1: product-level override
  if (faqSelection) return faqSelection

  // Priority 2: subcategory match
  if (subCategoryId && SUBCATEGORY_TO_FAQ_KEY[subCategoryId]) {
    const key = SUBCATEGORY_TO_FAQ_KEY[subCategoryId]
    return CATEGORY_SELECTION_FAQS[key] || null
  }

  // Priority 3: direct category match
  return CATEGORY_SELECTION_FAQS[categoryId] || null
}

/**
 * Get all FAQs for a product page (universal + category selection).
 */
export function getProductFAQs(
  categoryId: string,
  subCategoryId?: string,
  faqSelection?: FAQItem
): FAQItem[] {
  const categoryFAQ = getCategoryFAQ(categoryId, subCategoryId, faqSelection)
  if (categoryFAQ) {
    return [categoryFAQ, ...UNIVERSAL_FAQS]
  }
  return [...UNIVERSAL_FAQS]
}
