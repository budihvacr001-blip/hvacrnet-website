export interface SubCategory {
  id: string
  name: string
  description?: string
}

export interface Product {
  id: string
  categoryId: string
  subCategoryId?: string
  name: string
  shortDesc: string
  description: string
  specs?: { label: string; value: string }[]
  applications?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  subCategories: SubCategory[]
  products: Product[]
}

export const categories: Category[] = [
  {
    id: 'copper-tubes',
    name: 'Copper Tubes',
    icon: 'Circle',
    subCategories: [
      { id: 'jumbo-coils', name: 'Jumbo Coils' },
      { id: 'pancake-coils', name: 'Pancake Coils' },
      { id: 'straight-tubes', name: 'Straight Tubes' },
    ],
    products: [
      { id: 'ct-1', categoryId: 'copper-tubes', subCategoryId: 'jumbo-coils', name: 'ACR Copper Jumbo Coil', shortDesc: 'Seamless copper coils for HVAC systems, available in various diameters.', description: 'High-quality seamless copper jumbo coils designed for air conditioning and refrigeration systems. Manufactured to international standards with excellent thermal conductivity.', specs: [{ label: 'Outer Diameter', value: '6.35mm - 54mm' }, { label: 'Wall Thickness', value: '0.4mm - 2.5mm' }, { label: 'Length', value: 'Customizable up to 500m' }, { label: 'Material', value: 'C12200 (TP2)' }], applications: 'Air conditioning systems, refrigeration piping, heat exchangers' },
      { id: 'ct-3', categoryId: 'copper-tubes', subCategoryId: 'pancake-coils', name: 'Pancake Copper Coils', shortDesc: 'Pre-charged and ready-to-use coils for split AC installation.', description: 'Convenient pancake-style copper coils, pre-insulated and ready for split air conditioner installation.', specs: [{ label: 'Sizes', value: '1/4" - 7/8"' }, { label: 'Length', value: '3m / 5m standard' }, { label: 'Material', value: 'C12200 (TP2)' }], applications: 'Split air conditioner installation, mini-split systems' },
      { id: 'ct-4', categoryId: 'copper-tubes', subCategoryId: 'straight-tubes', name: 'Straight Copper Tubes', shortDesc: 'Rigid straight tubes for industrial piping applications.', description: 'Hard-drawn straight copper tubes for industrial HVAC and refrigeration piping systems.', specs: [{ label: 'Outer Diameter', value: '6.35mm - 108mm' }, { label: 'Length', value: '1m - 6m' }, { label: 'Temper', value: 'Hard / Half-hard' }], applications: 'Industrial refrigeration, commercial HVAC systems' },
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
    id: 'insulation-materials',
    name: 'Insulation Materials',
    icon: 'Shield',
    subCategories: [
      { id: 'insulation-tubes', name: 'Insulation Tubes' },
      { id: 'insulation-sheets', name: 'Insulation Sheets' },
    ],
    products: [
      { id: 'im-1', categoryId: 'insulation-materials', subCategoryId: 'insulation-tubes', name: 'NBR Rubber Insulation Tube', shortDesc: 'Flexible NBR foam tubes for pipe insulation.', description: 'High-performance NBR rubber insulation tubes with closed-cell structure for thermal and condensation control.', specs: [{ label: 'Inner Diameter', value: '6mm - 114mm' }, { label: 'Thickness', value: '9mm / 15mm / 20mm / 25mm' }, { label: 'Length', value: '1m / 2m' }, { label: 'Material', value: 'NBR/PVC blend' }], applications: 'AC pipe insulation, refrigeration pipe insulation' },
      { id: 'im-2', categoryId: 'insulation-materials', subCategoryId: 'insulation-tubes', name: 'PE Foam Insulation Tube', shortDesc: 'Polyethylene foam tubes for lightweight insulation.', description: 'Lightweight PE foam insulation tubes, cost-effective solution for pipe thermal insulation.', specs: [{ label: 'Inner Diameter', value: '6mm - 54mm' }, { label: 'Thickness', value: '5mm - 30mm' }], applications: 'Water pipe insulation, HVAC piping' },
      { id: 'im-3', categoryId: 'insulation-materials', subCategoryId: 'insulation-sheets', name: 'Insulation Sheet / Roll', shortDesc: 'Flexible insulation sheets for duct and equipment wrapping.', description: 'Flexible insulation sheets and rolls for large-area thermal insulation of ducts, tanks, and equipment.', specs: [{ label: 'Thickness', value: '5mm - 50mm' }, { label: 'Size', value: '1m x 2m / roll' }, { label: 'Material', value: 'NBR/PVC or PE' }], applications: 'Duct insulation, tank insulation, equipment wrapping' },
    ],
  },
  {
    id: 'cables-wires',
    name: 'Cables & Wires',
    icon: 'Zap',
    subCategories: [
      { id: 'ac-cables', name: 'AC Cables' },
      { id: 'power-cables', name: 'Power Cables' },
    ],
    products: [
      { id: 'cw-1', categoryId: 'cables-wires', subCategoryId: 'ac-cables', name: 'AC Connection Cable', shortDesc: 'Specialized cables for air conditioner connections.', description: 'Heat-resistant connection cables specifically designed for air conditioner installations.', specs: [{ label: 'Cores', value: '2 / 3 / 4 core' }, { label: 'Cross Section', value: '1.0mm² - 6.0mm²' }, { label: 'Voltage', value: '450/750V' }], applications: 'AC unit wiring, outdoor unit connection' },
      { id: 'cw-2', categoryId: 'cables-wires', subCategoryId: 'power-cables', name: 'Power Cable', shortDesc: 'Heavy-duty power cables for HVAC equipment.', description: 'Durable power cables for commercial and industrial HVAC equipment power supply.', specs: [{ label: 'Cross Section', value: '2.5mm² - 35mm²' }, { label: 'Voltage', value: '0.6/1kV' }], applications: 'Commercial HVAC, industrial refrigeration' },
    ],
  },
  {
    id: 'mounting-accessories',
    name: 'Mounting Accessories',
    icon: 'Wrench',
    subCategories: [
      { id: 'cable-ties', name: 'Cable Ties' },
      { id: 'brackets', name: 'Brackets' },
    ],
    products: [
      { id: 'ma-1', categoryId: 'mounting-accessories', subCategoryId: 'cable-ties', name: 'Nylon Cable Ties', shortDesc: 'UV-resistant cable ties for outdoor use.', description: 'High-quality nylon cable ties with UV resistance for outdoor HVAC installations.', specs: [{ label: 'Length', value: '100mm - 500mm' }, { label: 'Material', value: 'PA66 UV-stabilized' }], applications: 'Cable management, pipe bundling' },
      { id: 'ma-2', categoryId: 'mounting-accessories', subCategoryId: 'brackets', name: 'Pipe Bracket / Clamp', shortDesc: 'Metal brackets for secure pipe mounting.', description: 'Galvanized steel pipe brackets and clamps for secure mounting of copper and insulated pipes.', specs: [{ label: 'Sizes', value: 'For 1/4" - 2" pipes' }, { label: 'Material', value: 'Galvanized steel' }], applications: 'Pipe support, wall mounting' },
    ],
  },
  {
    id: 'valves',
    name: 'Valves',
    icon: 'Settings',
    subCategories: [
      { id: 'solenoid-valves', name: 'Solenoid Valves' },
      { id: 'thermal-expansion-valves', name: 'Thermal Expansion Valves' },
      { id: 'electronic-expansion-valves', name: 'Electronic Expansion Valves' },
      { id: 'ball-valves', name: 'Ball Valves' },
      { id: 'stop-check-valves', name: 'Stop Valves & Check Valves' },
      { id: 'safety-valves', name: 'Safety Valves' },
      { id: 'reversing-valves', name: 'Reversing Valves' },
    ],
    products: [
      { id: 'v-1', categoryId: 'valves', subCategoryId: 'solenoid-valves', name: 'Solenoid Valve', shortDesc: 'Electrically operated valves for refrigerant flow control.', description: 'Direct-acting and servo-operated solenoid valves for precise refrigerant flow control in HVAC systems.', specs: [{ label: 'Connection', value: 'Solder / Flare / Thread' }, { label: 'Voltage', value: 'AC220V / AC24V / DC12V' }, { label: 'Working Pressure', value: '0 - 40 bar' }], applications: 'Commercial refrigeration, cold rooms, AC systems' },
      { id: 'v-2', categoryId: 'valves', subCategoryId: 'thermal-expansion-valves', name: 'Thermal Expansion Valve (TXV)', shortDesc: 'Mechanical expansion valves for superheat control.', description: 'Thermostatic expansion valves for accurate superheat control in refrigeration and AC systems.', specs: [{ label: 'Capacity', value: '0.5 - 30 TR' }, { label: 'Refrigerant', value: 'R22 / R134a / R410A / R32' }], applications: 'AC systems, commercial refrigeration' },
      { id: 'v-3', categoryId: 'valves', subCategoryId: 'electronic-expansion-valves', name: 'Electronic Expansion Valve (EEV)', shortDesc: 'Stepper motor-driven valves for precision control.', description: 'Electronic expansion valves with stepper motor for precise, responsive refrigerant flow regulation.', specs: [{ label: 'Steps', value: '480 / 500 steps' }, { label: 'Connection', value: 'Solder' }], applications: 'Inverter AC, precision cooling systems' },
      { id: 'v-4', categoryId: 'valves', subCategoryId: 'ball-valves', name: 'Ball Valve', shortDesc: 'Quarter-turn valves for on/off flow control.', description: 'Full-port brass ball valves for reliable on/off control in HVAC piping.', specs: [{ label: 'Sizes', value: '1/4" - 2"' }, { label: 'Material', value: 'Forged brass' }, { label: 'Working Pressure', value: '600 WOG' }], applications: 'Service valves, isolation points' },
      { id: 'v-5', categoryId: 'valves', subCategoryId: 'stop-check-valves', name: 'Stop Valve & Check Valve', shortDesc: 'Backflow prevention and isolation valves.', description: 'Globe-style stop valves and spring-loaded check valves for system protection.', specs: [{ label: 'Sizes', value: '1/4" - 4"' }], applications: 'Compressor discharge, liquid line protection' },
      { id: 'v-6', categoryId: 'valves', subCategoryId: 'safety-valves', name: 'Safety Relief Valve', shortDesc: 'Pressure relief valves for system safety.', description: 'Spring-loaded safety relief valves to protect systems from overpressure conditions.', specs: [{ label: 'Set Pressure', value: 'Customizable' }, { label: 'Certification', value: 'ASME / CE' }], applications: 'Pressure vessel protection, system safety' },
      { id: 'v-7', categoryId: 'valves', subCategoryId: 'reversing-valves', name: 'Reversing Valve (4-Way)', shortDesc: 'Directional valves for heat pump cycle reversal.', description: '4-way reversing valves for heat pump systems, enabling seamless switching between heating and cooling modes.', specs: [{ label: 'Capacity', value: '1 - 5 HP' }, { label: 'Voltage', value: 'AC220V' }], applications: 'Heat pump systems, reversible AC units' },
    ],
  },
  {
    id: 'filter-driers',
    name: 'Filter Driers & Sight Glasses',
    icon: 'Filter',
    subCategories: [
      { id: 'dry-filters', name: 'Dry Filters / Filter Driers' },
      { id: 'sight-glasses', name: 'Sight Glasses' },
      { id: 'filter-cartridges', name: 'Filter Cartridges' },
    ],
    products: [
      { id: 'fd-1', categoryId: 'filter-driers', subCategoryId: 'dry-filters', name: 'Filter Drier', shortDesc: 'Moisture and contaminant removal for refrigerant systems.', description: 'Bi-flow filter driers with molecular sieve and activated alumina for effective moisture and acid removal.', specs: [{ label: 'Connection', value: 'Solder / ODS' }, { label: 'Core Type', value: 'Molecular sieve + Alumina' }], applications: 'AC and refrigeration system protection' },
      { id: 'fd-2', categoryId: 'filter-driers', subCategoryId: 'sight-glasses', name: 'Sight Glass / Indicator', shortDesc: 'Visual moisture and refrigerant flow indicators.', description: 'Sight glasses with moisture indicator for visual monitoring of refrigerant condition and flow.', specs: [{ label: 'Connection', value: 'Solder' }, { label: 'Indicator', value: 'Moisture sensitive' }], applications: 'Liquid line monitoring' },
      { id: 'fd-3', categoryId: 'filter-driers', subCategoryId: 'filter-cartridges', name: 'Filter Cartridge', shortDesc: 'Replaceable filter elements for large systems.', description: 'Replaceable filter cartridges for large-scale refrigeration system filtration.', specs: [{ label: 'Sizes', value: 'Various' }], applications: 'Industrial refrigeration, cold storage' },
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
