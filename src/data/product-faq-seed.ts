// AUTO-GENERATED product-level FAQ seed, keyed by product id (products.ts).
// Source: per-product SEO docs (safety/check/insulation/welding) + drafted Q&A verified against product specs.
// Loaded into each product's faq: ProductFAQ[] field. Do not hand-edit; regenerate from SEO source docs.
import type { ProductFAQ } from './products'

export const PRODUCT_FAQ_SEED: Record<string, ProductFAQ[]> = {
  'sv-1': [
    {
      question: 'What does an NPT safety valve do in a refrigeration system?',
      answer: 'It protects pressure vessels and components from overpressure. When internal pressure reaches the set value, the spring-loaded closure opens and discharges refrigerant; once pressure falls, spring force re-seats the valve. The NPT/NPT inline design is made for larger vessels (DN20–DN25).',
    },
    {
      question: 'How do I choose the set pressure?',
      answer: 'Select a set pressure above the normal operating pressure but at or below the design pressure of the protected equipment. Five standard settings from 2.0 to 3.4 MPa are available, and the valve can be factory-customized to your required value.',
    },
    {
      question: 'How are the NPT connections sealed?',
      answer: 'NPT is a tapered pipe thread that seals on the threads themselves. Apply PTFE tape or approved thread sealant to the male NPT threads before tightening to ensure a leak-free joint.',
    },
    {
      question: 'Which connection size fits my vessel volume?',
      answer: 'Per the Hongsen standard, vessels under 50 L use 3/8"–1/8" NPT, 50–500 L use 1/2"–1/4" NPT, 500–1,000 L use 3/4"–1/4" NPT, and vessels of 1,000 L and above use 1"–11.5 NPT. This series covers the 3/4" and 1" end of that range.',
    },
  ],
  'sv-2': [
    {
      question: 'Why choose an SAE flare outlet instead of NPT?',
      answer: 'An SAE 45° flare seals on a metal cone and can be disconnected and reconnected repeatedly with a wrench, making field service easier. NPT seals on tapered threads and is better suited to a permanent joint. This valve gives you both — an NPT inlet and a flare outlet.',
    },
    {
      question: 'How do I read the model code FS-A4B5?',
      answer: '"A4" indicates a 1/2" NPT inlet and "B5" indicates a 5/8" SAE flare outlet. A = NPT inlet, B = SAE flare outlet, with the number encoding the size.',
    },
    {
      question: 'Can the set pressure be customized?',
      answer: 'Yes. Five standard settings — 2.0, 2.4, 2.8, 3.1 and 3.4 MPa — are available, and the valve can be factory-set to a customer-specified pressure. Every valve is lead-sealed after setting.',
    },
    {
      question: 'Which refrigerants is this safety valve compatible with?',
      answer: 'The FS series is rated for CFC, HCFC and HFC refrigerants and operates at medium temperatures from −50 °C to +150 °C, covering standard air-conditioning and commercial refrigeration duties.',
    },
  ],
  'sv-3': [
    {
      question: 'When should I use an angle safety valve instead of an inline one?',
      answer: 'Use the angle (FL) design where vertical space is limited or the discharge pipe runs to the side. The 90° body turns the outlet sideways, making piping simpler on packaged units and compact chillers; the valve action and set-pressure options are the same as the inline FS.',
    },
    {
      question: 'How does the SAE flare outlet seal?',
      answer: 'The flare nut squeezes a 45° male cone against a matching seat, creating a metal-to-metal seal. The threads only provide clamping force — they do not carry the seal — so no PTFE tape is used on a flare joint.',
    },
    {
      question: 'What set pressures are available?',
      answer: 'Five standard settings — 2.0, 2.4, 2.8, 3.1 and 3.4 MPa — are listed in the catalog, and custom set pressure can be produced against your equipment requirements. The valve is lead-sealed after setting.',
    },
    {
      question: 'Where is this valve installed?',
      answer: 'On the pressure side of protected refrigeration equipment — receivers, condensers, compressors and other vessels — with the NPT inlet connected to the vessel and the SAE side outlet running to the discharge line.',
    },
  ],
  'sv-4': [
    {
      question: 'What is a G-thread outlet?',
      answer: 'G denotes a parallel (straight) BSPP pipe thread common on European and export equipment, such as G1/2. Unlike tapered NPT, a parallel thread does not seal on the threads — it normally seals against a gasket or bonded washer at the fitting face.',
    },
    {
      question: 'What is the difference between G-thread and NPT?',
      answer: 'NPT is a tapered thread that seals as the threads wedge together; G (BSPP) is parallel and seals on a gasket face. The two threads also differ in pitch and flank angle, so they are not interchangeable — this valve bridges them with an NPT inlet and a G1/2 outlet.',
    },
    {
      question: 'Can the set pressure be ordered to a custom value?',
      answer: 'Yes. The catalog lists 2.0, 2.4, 2.8, 3.1 and 3.4 MPa standard settings, and the factory can set a customer-specified pressure. Each valve is lead-sealed after setting to prevent accidental adjustment.',
    },
    {
      question: 'What does the model code FL-A3G4 mean?',
      answer: '"FL" is the angle body, "A3" is a 3/8" NPT inlet, and "G4" is a G1/2 parallel-thread outlet. A = NPT inlet and G = G-thread outlet in the Hongsen coding.',
    },
  ],
  'sv-5': [
    {
      question: 'What is the difference between a pressure relief valve and a safety valve in HVAC?',
      answer: 'Both protect equipment from overpressure. A spring-loaded safety valve typically opens rapidly to full lift for gas or refrigerant discharge, while a relief valve tends to open in proportion to the pressure rise. In practice the terms overlap; the HS-2F is cataloged as a two-outlet pressure relief valve within the safety valve family.',
    },
    {
      question: 'Why does this valve have two outlets?',
      answer: 'The manifold body splits the discharge flow across two parallel ports, which suits larger vessels and receiver installations that vent through twin lines. Only one inlet connection to the vessel is needed, keeping mounting simple.',
    },
    {
      question: 'What pressure ratings apply to the HS-2F?',
      answer: 'Maximum working pressure is 4.2 MPa (42 bar) and maximum compression pressure is 6.3 MPa (63 bar). Select the valve so the equipment\'s normal operating pressure stays below its relief setting and within these ratings.',
    },
    {
      question: 'Which refrigerants and temperatures is it rated for?',
      answer: 'It covers R22, R134a, R410A, R507A, R448A, R449A and R404A at medium temperatures from −40 °C to +150 °C, spanning legacy HCFC systems and common HFC/HFO refrigerants.',
    },
  ],
  'cv-1': [
    {
      question: 'What does a refrigeration check valve do?',
      answer: 'It allows refrigerant to flow in only one direction and closes automatically on reverse flow, preventing back flow and migration between evaporators or into the compressor.',
    },
    {
      question: 'How do I know which way to install the flare check valve?',
      answer: 'Install it in the direction of the arrow stamped on the brass body. The arrow points along the permitted flow direction, so the valve opens with forward flow and seals against reverse flow.',
    },
    {
      question: 'SAE flare vs brazed ODF check valve — which should I choose?',
      answer: 'Choose the SAE flare model where you want easy, no-brazing removal for service. Choose the brazed ODF model for a permanent, leak-free joint in new installations or high-vibration lines.',
    },
  ],
  'cv-2': [
    {
      question: 'How do I install a brazed ODF check valve?',
      answer: 'Braze the valve into the line with the body arrow pointing in the direction of flow. Use proper heat-sinking and purge the system with inert gas to protect internal seals during brazing.',
    },
    {
      question: 'What does the "GT" in CV-10GT mean?',
      answer: 'The CV-10GT is a straight-through brazed model supplied with a φ10 mm ODF tube — a separate 10 mm connection rather than the standard 3/8" ODF (9.5 mm).',
    },
    {
      question: 'When should I use a brazed check valve instead of a flare one?',
      answer: 'Use brazed ODF for permanent installations and high-vibration lines where the highest leak integrity is required. Use flare where future disassembly for service is more important.',
    },
  ],
  'cv-3': [
    {
      question: 'When should I use a right-angle check valve instead of an inline one?',
      answer: 'Use a right-angle (CVR / CVRH) valve when the pipe changes direction by 90° or space is too tight for an inline valve. It turns the flow at the corner while still preventing reverse flow.',
    },
    {
      question: 'What is the reinforced spring on the CVRH for?',
      answer: 'The CVRH reinforced spring gives a 0.3 bar cracking pressure and is intended for refrigeration units with parallel compressors, helping to maintain correct flow direction under those operating conditions.',
    },
    {
      question: 'Does the 0.3 bar cracking pressure affect the system?',
      answer: 'It is a slightly higher opening pressure than a standard spring, chosen for reliable operation in parallel-compressor circuits. The associated pressure drop remains small relative to the valve\'s Kv and the system design.',
    },
  ],
  'cv-4': [
    {
      question: 'What is the advantage of a diaphragm check valve?',
      answer: 'The magnetic diaphragm provides metal-to-metal sealing with very low reverse leakage, opens at an ultra-low 0.02 bar cracking pressure, and closes automatically regardless of mounting angle or reverse pressure.',
    },
    {
      question: 'Can the CVS be installed at any angle?',
      answer: 'Yes. Its internal guide and self-sealing design mean the valve closes correctly independent of installation angle, unlike gravity- or orientation-dependent check valves.',
    },
    {
      question: 'Why is the connection size given as a Φ mm value?',
      answer: 'The CVS table specifies the measured outside diameter of the brazed copper tube (ΦA), e.g. Φ6.4 or Φ79.5 mm. Matching the measured tube diameter ensures the correct joint rather than relying on a nominal inch label.',
    },
    {
      question: 'Does the CVS include filtration?',
      answer: 'Yes. A filter screen is built into the body, so the valve performs both a check-valve function and a filter function, with low flow resistance.',
    },
  ],
  'im-1': [
    {
      question: 'What is the MOQ for standard B1 rubber foam insulation tube?',
      answer: 'MOQ is 1 pc. We support sample orders and small batch purchases for testing or maintenance projects.',
    },
    {
      question: 'Can I choose between black and blue color?',
      answer: 'Yes. Black is the standard color at base price. Blue is available as an optional color with the same specifications and a slight price premium for color customization.',
    },
    {
      question: 'Is this insulation tube compatible with copper pipes?',
      answer: 'Yes. The inner diameter is designed to fit standard copper tube OD sizes from 6 mm to 48 mm (1/4" to 1-7/8"). Refer to the specification table for exact model matching.',
    },
    {
      question: 'Do you provide test reports or certificates?',
      answer: 'Yes. We provide B1 fire rating test reports, material test certificates (MTC), and can supply RoHS/REACH compliance documents upon request.',
    },
  ],
  'im-2': [
    {
      question: 'What makes high-density rubber foam different from standard density?',
      answer: 'High-density foam (65 kg/m³) offers better structural rigidity and compression resistance than standard 55 kg/m³ foam. It maintains shape longer under mechanical stress and is ideal for critical applications.',
    },
    {
      question: 'Is this insulation safe for indoor use in hospitals or clean rooms?',
      answer: 'Yes. The ultra-low TVOC emission (≤0.02 mg/m³) and RoHS compliance make it suitable for environments with strict indoor air quality requirements.',
    },
    {
      question: 'Can I use blue and red tubes for color-coding?',
      answer: 'Yes. Blue is typically used for cold water and chilled water lines, while red is used for hot water and heating systems. Both colors have identical performance specifications.',
    },
    {
      question: 'What certifications does this product have?',
      answer: 'B1 fire rating test report, RoHS compliance, and China Green Building 3-Star certification. Additional test reports available upon request.',
    },
  ],
  'v-1': [
    {
      question: 'What is the function of the HVD series solenoid valve in a refrigeration system?',
      answer: 'It provides one-way flow control on liquid, suction, and hot gas lines. The servo-operated piston design opens under coil energization to allow refrigerant flow and closes when de-energized, isolating sections of the system for maintenance or cycle control.',
    },
    {
      question: 'Why does the HVD series use ODF brazed connections instead of flare?',
      answer: 'ODF brazed connections create a permanent, vibration-proof joint suitable for high-pressure refrigeration lines. The welded connection eliminates leak points and is ideal for new installations where the valve will not require frequent removal. Port sizes range from 3/8 inch to 1-5/8 inch.',
    },
    {
      question: 'What is the IP65 rating on the HVD coil and why does it matter?',
      answer: 'IP65 means the coil is dust-tight and protected against water jets from any direction. This allows installation in outdoor condensers, washdown areas, or humid cold rooms where moisture exposure would damage standard coils. The 24W high-power coil delivers strong opening force across the full port range.',
    },
  ],
  'v-2': [
    {
      question: 'When should I choose the HVP high-flow solenoid valve over the standard HVD series?',
      answer: 'Choose the HVP when your system requires flow capacity beyond the standard piston valve range. The flanged-edge design covers ports from 1-1/8 inch to 2-1/8 inch with Kv 28 m³/h maximum, serving industrial and large commercial refrigeration systems where pressure drop must be minimized.',
    },
    {
      question: 'Why does the HVP series use a flanged connection instead of brazed ODF?',
      answer: 'Flanged connections allow bolted installation on large-diameter pipelines where field brazing is impractical or where the valve may need periodic removal for maintenance. The flange design ensures secure, leak-free operation at high flow rates up to 28 m³/h.',
    },
    {
      question: 'What coil options are available for the HVP series?',
      answer: 'The universal valve body accepts various AC and DC coils. The standard 24W high-power coil provides strong opening capability for the large piston stroke. Coils can be ordered separately for flexible installation and maintenance, and the IP65 rating ensures reliability in harsh environments.',
    },
  ],
  'v-3': [
    {
      question: 'What makes the HV small-port clamping solenoid valve different from the standard HVD series?',
      answer: 'The HV series uses a diaphragm structure instead of a piston, and features a clamping coil design that allows tool-free removal with only a screwdriver. It covers smaller ports from 1/4 inch to 3/8 inch and offers the widest voltage range in the lineup, including AC380V/220V/110V/24V and DC12V.',
    },
    {
      question: 'What is the advantage of the clamping-type coil design on the HV series?',
      answer: 'The clamping design allows you to remove and replace the coil without disconnecting the valve body from the pipeline. This reduces maintenance time and cost, especially in installations where the valve is welded or brazed into place. The sealed coil provides extended service life in harsh environments.',
    },
    {
      question: 'What is the MOPD rating for the HV small-port solenoid valve?',
      answer: 'The 9W solenoid coil has a maximum opening pressure differential (MOPD) of up to 3.1 MPa, ensuring reliable valve opening even in high-pressure refrigeration systems. This makes it suitable for R410A and other high-pressure refrigerants in compact air conditioning and refrigeration units.',
    },
  ],
  'v-4': [
    {
      question: 'When should I choose the HV large-port clamping solenoid valve instead of the small-port version?',
      answer: 'Choose the large-port version when your system requires ports from 1/2 inch to 1-1/8 inch with Kv values up to 4.5 m³/h. It shares the same tool-free clamping coil design as the small-port version, making it ideal for medium-capacity refrigeration and air conditioning systems.',
    },
    {
      question: 'What is the difference between the HV large-port and the standard HVD series?',
      answer: 'The HV large-port uses a diaphragm structure with a clamping coil design for tool-free maintenance, while the HVD uses a piston structure with ODF brazed connections. The HV covers ports 1/2 inch to 1-1/8 inch, while the HVD covers 3/8 inch to 1-5/8 inch. Both are NC (normally closed) and suitable for liquid, suction, and hot gas lines.',
    },
    {
      question: 'What certifications does the HV clamping solenoid valve have?',
      answer: 'The HV series is certified to ISO 9001, CE, and UL standards, ensuring compliance with international quality and safety requirements. The sealed coil design provides extended service life and reliable operation in harsh refrigeration environments.',
    },
  ],
  'v-5': [
    {
      question: 'What is the difference between direct-acting and servo-operated solenoid valves?',
      answer: 'Direct-acting valves like the SV series open directly by electromagnetic force and work at zero pressure differential, making them suitable for low-pressure or gravity-feed lines. Servo-operated valves use system pressure to assist opening and require a minimum pressure differential but offer higher flow capacity.',
    },
    {
      question: 'Why is the IP65 rating important for the SV series solenoid valve?',
      answer: 'IP65 means the valve is dust-tight and protected against water jets, allowing installation in outdoor units, washdown areas, or humid cold rooms where moisture and dust would damage standard coils. This makes the SV series ideal for harsh environment applications in commercial refrigeration.',
    },
    {
      question: 'What port sizes and flow capacity does the SV direct-acting solenoid valve cover?',
      answer: 'The SV series covers port sizes from 1/4 inch to 3/8 inch with a 9W coil rated for MOPD up to 3.1 MPa. The compact diaphragm structure provides reliable sealing, and various AC and DC voltage options are available to match your control system requirements.',
    },
  ],
  'v-6': [
    {
      question: 'When should I choose the SV servo-operated solenoid valve instead of the direct-acting version?',
      answer: 'Choose the servo-operated version when your system requires higher flow capacity in medium-port applications. The SV servo covers ports from 1/2 inch to 1-1/8 inch with Kv values up to 4.5 m³/h, while maintaining the same IP65 protection rating for harsh environment operation.',
    },
    {
      question: 'What is the advantage of servo operation in the SV series?',
      answer: 'Servo operation uses system pressure to assist valve opening, allowing higher flow capacity than direct-acting designs of the same port size. The SV servo maintains IP65 protection and 9W coil with MOPD up to 3.1 MPa, suitable for medium-capacity refrigeration systems requiring reliable shut-off.',
    },
    {
      question: 'What voltage options are available for the SV servo-operated solenoid valve?',
      answer: 'Various AC and DC voltage options are available through the universal valve body design. Coils can be supplied separately for flexible installation and maintenance. The IP65 rating ensures reliable operation in humid and dusty environments, and the compact diaphragm structure provides reliable sealing.',
    },
  ],
  'v-7': [
    {
      question: 'What is the advantage of the 8W low-power solenoid valve?',
      answer: 'The ultra-low 8W power consumption cuts energy use and coil heat generation, extending coil service life in systems that stay energised for long periods. This makes the 10 series ideal for continuous-operation refrigeration, cold storage, and display cases where energy efficiency and long-term reliability are priorities.',
    },
    {
      question: 'What is the difference between the 10 series direct-acting and servo-operated solenoid valves?',
      answer: 'The direct-acting 10 series covers smaller ports (1/4 to 3/8 inch) and opens at zero pressure differential, so it works even when the system is not pressurised. The servo-operated version handles larger ports (1/2 to 1-1/8 inch) and offers higher flow capacity for medium-capacity systems. Both share the same energy-saving 8W coil.',
    },
    {
      question: 'What applications benefit most from the 8W low-power solenoid valve?',
      answer: 'Continuous-operation systems like cold storage, display cases, and process cooling benefit from reduced energy consumption and lower heat generation. The direct-acting design works at zero pressure differential, and the compact diaphragm structure provides reliable sealing across various AC and DC voltage options.',
    },
  ],
  'v-8': [
    {
      question: 'What is the difference between the 10 series low-power direct-acting and servo-operated versions?',
      answer: 'The direct-acting version covers ports 1/4 inch to 3/8 inch and works at zero pressure differential, while the servo-operated version covers larger ports from 1/2 inch to 1-1/8 inch with Kv values up to 4.5 m³/h. Both share the 8W low-power coil for energy efficiency and reduced heat generation.',
    },
    {
      question: 'Why choose the 10 series servo-operated solenoid valve for medium-capacity systems?',
      answer: 'The servo design provides higher flow capacity than direct-acting valves of the same port size, while the 8W coil reduces energy consumption and heat generation. This combination is ideal for medium-capacity refrigeration systems requiring both efficiency and reliable shut-off.',
    },
    {
      question: 'How is the 10 series servo-operated solenoid valve supplied, and what voltage coils are available?',
      answer: 'It is available either as a complete valve-and-coil assembly or as split supply, with the valve body and coil ordered separately for flexible stocking. The universal body accepts various AC and DC voltage coils, and it is certified to ISO 9001, CE, and UL for use on liquid, suction, and hot gas lines.',
    },
  ],
  'v-9': [
    {
      question: 'What is a normally open solenoid valve and when should I use it?',
      answer: 'A normally open (NO) valve remains open when de-energized and closes when powered. Use it in safety-critical applications where refrigerant flow must continue during power failure, such as emergency cooling or process protection systems. The HVK small-port covers 1/4 inch to 3/8 inch.',
    },
    {
      question: 'What is the difference between the HVK normally open and the HV normally closed clamping valves?',
      answer: 'The HVK is normally open (flow passes when de-energized) while the HV is normally closed (flow blocked when de-energized). Both use the same clamping coil design for tool-free maintenance and cover the same port ranges. Choose based on your system\'s fail-safe requirements.',
    },
    {
      question: 'What is the MOPD rating for the HVK normally open solenoid valve?',
      answer: 'The 9W solenoid coil has a maximum opening pressure differential (MOPD) of up to 3.1 MPa, ensuring reliable valve closing even in high-pressure systems. The clamping-type design allows tool-free disassembly, and the sealed coil provides extended service life in harsh environments.',
    },
  ],
  'v-10': [
    {
      question: 'When should I choose the HVK large-port normally open solenoid valve?',
      answer: 'Choose the large-port version when your system requires ports from 1/2 inch to 1-1/8 inch with Kv values up to 4.5 m³/h and fail-open safety configuration. It shares the same clamping coil design as the small-port version for easy maintenance in medium-capacity refrigeration systems.',
    },
    {
      question: 'What applications require a normally open solenoid valve in refrigeration?',
      answer: 'Normally open valves are used where flow must continue during power failure, such as emergency cooling circuits, process protection systems, or safety interlocks. The HVK large-port covers 1/2 inch to 1-1/8 inch and provides fail-open operation with 9W coil rated for MOPD up to 3.1 MPa.',
    },
    {
      question: 'Can the HVK normally open valve be used as a normally closed valve?',
      answer: 'No. The HVK is specifically designed as normally open and cannot be converted to normally closed operation. If you need normally closed operation, use the HV series clamping valve instead. Both share the same tool-free clamping coil design but have different internal configurations.',
    },
  ],
  'v-11': [
    {
      question: 'What is an unloading solenoid valve and how does it differ from a standard shut-off valve?',
      answer: 'An unloading valve is designed for compressor unloading and capacity control in large refrigeration systems. The HV unloading series covers ports from 1-1/8 inch to 2-1/8 inch with Kv values up to 28 m³/h, using a high-capacity piston design and flanged connection for secure installation on large-diameter pipelines.',
    },
    {
      question: 'Why does the HV unloading solenoid valve use a flanged connection?',
      answer: 'Flanged connections allow bolted installation on large-diameter pipelines where field brazing is impractical. The flange design ensures secure, leak-free operation at high flow rates and allows periodic removal for maintenance. The 24W high-power coil delivers strong opening capability for the large piston.',
    },
    {
      question: 'What is the flow capacity of the HV flanged unloading solenoid valve?',
      answer: 'The HV unloading series delivers Kv values up to 28 m³/h across four models covering ports from 1-1/8 inch to 2-1/8 inch. This high-capacity design is suitable for hot gas bypass and compressor unloading applications in industrial refrigeration systems.',
    },
  ],
  'v-12': [
    {
      question: 'What is the difference between the HV unloading flanged and brazed ODF versions?',
      answer: 'Both cover the same port range (1-1/8 inch to 2-1/8 inch) and flow capacity (up to 28 m³/h). The flanged version uses bolted connections for easy removal, while the ODF brazed version uses welded connections for permanent, leak-free installation. Choose based on your maintenance and installation requirements.',
    },
    {
      question: 'Why choose the brazed ODF unloading solenoid valve instead of flanged?',
      answer: 'Brazed ODF connections provide a permanent, vibration-proof joint ideal for new installations or high-vibration lines where leak integrity is critical. The HV unloading ODF series covers 1-1/8 inch to 2-1/8 inch with Kv up to 28 m³/h, using a 24W high-power coil for strong opening capability.',
    },
    {
      question: 'What applications use the HV unloading solenoid valve?',
      answer: 'The HV unloading series is designed for compressor unloading and capacity control in large industrial refrigeration systems. It is suitable for hot gas bypass applications and can be installed on liquid lines, suction lines, or hot gas lines to modulate system capacity.',
    },
  ],
  'v-13': [
    {
      question: 'What is a hot gas defrost solenoid valve and how does it work?',
      answer: 'A hot gas defrost valve redirects hot discharge gas from the compressor to the evaporator during defrost cycles. The HVS series uses a piston structure and brazed ODF connection, covering ports from 1/2 inch to 1-5/8 inch for efficient defrost in cold storage and commercial refrigeration systems.',
    },
    {
      question: 'Why is the HVS hot gas defrost valve designed differently from standard solenoid valves?',
      answer: 'The HVS series is specifically engineered for hot gas defrost applications, where high-temperature discharge gas flows through the valve. The piston structure handles high-pressure operation, and the 24W high-power coil delivers strong opening capability for reliable defrost cycle performance.',
    },
    {
      question: 'What port sizes are available for the HVS hot gas defrost solenoid valve?',
      answer: 'The HVS series covers port sizes from 1/2 inch to 1-5/8 inch with brazed ODF connections for secure, leak-free installation. Various AC and DC solenoid coil options are available, and the valve can be supplied as a complete assembly or with valve body and coil separate for flexible installation.',
    },
  ],
  'v-14': [
    {
      question: 'What is the difference between the HVDF high-flow and the HVP high-flow solenoid valves?',
      answer: 'Both deliver Kv values up to 28 m³/h and cover ports from 1-1/8 inch to 2-1/8 inch. The HVDF uses ODF brazed connections for permanent installation, while the HVP uses flanged connections for bolted installation. Choose based on your pipeline connection requirements.',
    },
    {
      question: 'Why choose the HVDF brazed ODF high-flow solenoid valve?',
      answer: 'The HVDF series provides high flow capacity (Kv up to 28 m³/h) with brazed ODF connections for permanent, leak-free installation. This is ideal for large-capacity refrigeration systems where vibration resistance and long-term leak integrity are priorities over serviceability.',
    },
    {
      question: 'What is the maximum connection size for the HVDF high-flow solenoid valve?',
      answer: 'The HVDF series covers ports from 1-1/8 inch to 2-1/8 inch with a maximum connection size of 2-1/8 inch. The high-capacity piston design and 24W high-power coil deliver strong valve opening capability for large-diameter refrigeration pipelines.',
    },
  ],
  'v-15': [
    {
      question: 'What is the difference between the HVPF flanged and the HVDF brazed high-flow solenoid valves?',
      answer: 'Both deliver Kv values up to 28 m³/h and cover ports from 1-1/8 inch to 2-1/8 inch. The HVPF uses flanged connections for bolted installation, while the HVDF uses brazed ODF connections. The HVPF is ideal where periodic removal is needed; the HVDF is ideal for permanent, vibration-proof joints.',
    },
    {
      question: 'When should I choose the HVPF flanged high-flow solenoid valve?',
      answer: 'Choose the HVPF when your system requires high flow capacity (up to 28 m³/h) with bolted flanged connections for easy removal and maintenance. It covers ports from 1-1/8 inch to 2-1/8 inch and is suitable for large-capacity industrial refrigeration systems.',
    },
    {
      question: 'What coil options are available for the HVPF flanged high-flow solenoid valve?',
      answer: 'The HVPF series accepts various AC and DC solenoid coils through the universal valve body design. The standard 24W high-power coil delivers strong opening capability for the large piston stroke. Coils can be supplied separately for flexible installation and maintenance.',
    },
  ],
  'bv-1': [
    {
      question: 'What is the function of the DQF electric ball valve in a refrigeration system?',
      answer: 'The DQF series provides automatic shut-off control with 90° electric actuator rotation. It covers ports from 3/8 inch to 3-1/8 inch with Kv values from 5.7 to 200 m³/h, enabling remote or automated flow control on liquid, suction, and discharge lines in commercial and industrial refrigeration.',
    },
    {
      question: 'What happens if power fails on the DQF electric ball valve?',
      answer: 'The DQF series includes a manual override that allows you to operate the valve during power failure for emergency maintenance. The electric actuator provides automatic full-open and full-close operation, and the full bore design ensures flow without pressure drop.',
    },
    {
      question: 'What is the operating noise level of the DQF electric ball valve?',
      answer: 'The DQF series operates at ultra-low noise (55 dB), making it suitable for noise-sensitive environments like retail display cases, hospitals, and office buildings. The TIG welded copper body ensures high structural strength, and the anti-blowout valve stem provides operational safety.',
    },
  ],
  'bv-2': [
    {
      question: 'What is the advantage of full bore design in the HBC manual ball valve?',
      answer: 'Full bore design matches the pipe internal diameter, allowing refrigerant to flow without pressure drop. The HBC series covers the widest port range from 1/4 inch to 3-1/8 inch with Kv values up to 700 m³/h, making it suitable for applications where system efficiency is critical.',
    },
    {
      question: 'What is the difference between the HBC valve with and without a charging port?',
      answer: 'Models with a charging port include an integrated service access point for system charging and gauge connection. Models without a charging port are standard shut-off valves. Both feature full bore design, bidirectional flow, and TIG welded copper construction for reliable performance.',
    },
    {
      question: 'How do I know when the HBC manual ball valve is fully open or closed?',
      answer: 'The valve stem has a top mark that indicates full open and full close positions. The handwheel requires only 1/4 turn (90°) from full open to full close, with rotation limiters at both positions to prevent over-rotation and ensure positive shut-off.',
    },
  ],
  'bv-3': [
    {
      question: 'What is the difference between full bore and reduced bore ball valves?',
      answer: 'Full bore valves match the pipe internal diameter for flow without pressure drop, while reduced bore valves have a smaller throat that creates minimal pressure drop but reduces flow capacity. The QFT series uses reduced bore design for precision flow control in ports from 1/4 inch to 2-1/8 inch.',
    },
    {
      question: 'What is the advantage of the QFT reduced bore ball valve?',
      answer: 'The QFT series uses precision forged copper construction with reduced bore design for compact, cost-effective flow control. It covers ports from 1/4 inch to 2-1/8 inch and is available with or without a charging port (V suffix models) for flexible system integration.',
    },
    {
      question: 'What seals are used in the QFT reduced bore ball valve?',
      answer: 'The QFT series uses specially selected seals compatible with common refrigerant operating environments, including R22, R404A, R134a, and R410A. A secondary reliable sealing structure at the valve stem provides enhanced leak prevention, and the anti-blowout design ensures operational safety.',
    },
  ],
  'bv-4': [
    {
      question: 'What makes the QF-CO2 ball valve different from standard refrigeration ball valves?',
      answer: 'The QF-CO2 series is engineered specifically for transcritical CO₂ systems operating at 120 bar maximum working pressure. It uses a precision-cast valve body with integrated stainless steel tube and CO₂-compatible seals to handle the extreme pressures and temperatures of R744 refrigerant.',
    },
    {
      question: 'Why does the QF-CO2 ball valve use a stainless steel tube?',
      answer: 'CO₂ operates at much higher pressures than HCFC/HFC refrigerants, requiring enhanced structural integrity. The precision-cast body with integrated stainless steel tube ensures compatibility and strength at 120 bar MWP. The full bore design maintains flow efficiency in transcritical CO₂ systems.',
    },
    {
      question: 'What port sizes are available for the QF-CO2 transcritical ball valve?',
      answer: 'The QF-CO2 series covers eight models from 1/2 inch to 2-1/8 inch port sizes, all with full bore design for flow without pressure drop. The TIG welded connections, anti-blowout valve stem, and modified PTFE seals ensure reliable operation at 120 bar in CO₂ refrigeration systems.',
    },
  ],
  'bv-5': [
    {
      question: 'Why choose NPT threaded connections instead of brazed ODF for ball valves?',
      answer: 'NPT threaded connections allow tool-free installation and removal with a wrench, making them ideal for field service and maintenance where brazing or welding is impractical — no welding required. The GFM-S series covers NPT 1/4 inch to 1 inch and is compatible with most common refrigerants.',
    },
    {
      question: 'What is the advantage of the GFM-S threaded ball valve?',
      answer: 'The GFM-S series is the only NPT threaded ball valve in the range, offering easy installation with no welding needed. It uses precision-forged copper construction with bidirectional flow capability, rotation limiters, and a secondary sealing structure at the valve stem for enhanced leak prevention.',
    },
    {
      question: 'What refrigerants are compatible with the GFM-S threaded ball valve?',
      answer: 'The GFM-S series is compatible with most common refrigerants including R22, R404A, R134a, and R410A. The precision-forged copper body and specially selected seals ensure reliable performance across HCFC and HFC refrigeration and air conditioning applications.',
    },
  ],
  'fd-1': [
    {
      question: 'What is the function of the BFK bidirectional filter drier in a refrigeration system?',
      answer: 'The BFK series removes moisture and contaminants from refrigerant using a solid core of 80% 3A molecular sieve and 20% activated alumina. The bidirectional design allows installation in any orientation, covering ports from 3/8 inch to 3/4 inch for HCFC and HFC systems.',
    },
    {
      question: 'Why choose SAE flare connections for the BFK filter drier?',
      answer: 'SAE flare connections allow easy installation and maintenance without brazing. The BFK series with SAE flare is ideal for field service applications where the filter drier may need periodic replacement. The 25μm filter fineness ensures clean refrigerant flow.',
    },
    {
      question: 'What is the maximum working pressure for the BFK bidirectional filter drier?',
      answer: 'The BFK series is rated for MWP 45 bar (4.5 MPa) and operates at temperatures from −40 °C to +120 °C. The corrosion-resistant powder coating extends service life, and the bidirectional flow design allows flexible installation in any orientation.',
    },
  ],
  'fd-2': [
    {
      question: 'What is the difference between BFK SAE flare and BFK brazed ODF filter driers?',
      answer: 'Both use the same solid core (80% 3A molecular sieve + 20% activated alumina) and 25μm filter fineness. The SAE flare version allows easy removal for service, while the ODF brazed version provides a permanent, leak-free joint for OEM installations. Both are bidirectional and cover HCFC/HFC systems.',
    },
    {
      question: 'Why choose brazed ODF connections for the BFK filter drier?',
      answer: 'Brazed ODF connections provide a permanent, leak-free installation ideal for new equipment or systems where the filter drier will not require frequent removal. The BFK ODF brazed series covers ports from 3/8 inch to 1-1/8 inch with MWP 45 bar and temperature range −40 °C to +120 °C.',
    },
    {
      question: 'What refrigerants are compatible with the BFK bidirectional filter drier?',
      answer: 'The BFK series is compatible with HCFC and HFC refrigerants including R22, R134a, R404A, R410A, and R507. The solid core of 80% 3A molecular sieve and 20% activated alumina provides effective moisture and acid adsorption across a wide temperature range.',
    },
  ],
  'fd-3': [
    {
      question: 'What is the difference between bidirectional and unidirectional filter driers?',
      answer: 'Bidirectional filter driers like the BFK series can be installed in any flow direction, making them suitable for heat pump systems where refrigerant flow reverses. Unidirectional filter driers like the DFS series are optimized for one-way flow and provide superior moisture removal in standard AC and refrigeration liquid lines.',
    },
    {
      question: 'Why does the DFS unidirectional filter drier use 100% 3A molecular sieve?',
      answer: 'The DFS series uses 100% 3A molecular sieve instead of a mixed core, providing superior moisture adsorption capacity for applications where water removal is the primary concern. It covers ports from 1/4 inch to 3/4 inch with SAE flare connections and 25μm filter fineness.',
    },
    {
      question: 'What is the maximum working pressure for the DFS unidirectional filter drier?',
      answer: 'The DFS series is rated for MWP 45 bar (4.5 MPa) and operates at temperatures from −40 °C to +120 °C. The unidirectional design with 100% 3A molecular sieve provides optimal moisture removal for HCFC and HFC refrigeration systems.',
    },
  ],
  'fd-4': [
    {
      question: 'What is the difference between DFS SAE flare and DFS brazed ODF filter driers?',
      answer: 'Both use 100% 3A molecular sieve with 25μm filter fineness for superior moisture removal. The SAE flare version allows easy removal for service, while the ODF brazed version provides a permanent, leak-free joint. Both are unidirectional and cover HCFC/HFC systems.',
    },
    {
      question: 'Why choose brazed ODF connections for the DFS unidirectional filter drier?',
      answer: 'Brazed ODF connections provide a permanent, leak-free installation for OEM applications or new systems where the filter drier will remain in place long-term. The DFS ODF brazed series covers ports from 1/4 inch to 1-1/8 inch with 100% 3A molecular sieve for superior moisture adsorption.',
    },
    {
      question: 'What temperature range does the DFS unidirectional filter drier support?',
      answer: 'The DFS series operates at temperatures from −40 °C to +120 °C with MWP 45 bar (4.5 MPa). The corrosion-resistant powder coating extends service life, and the unidirectional design with 100% 3A molecular sieve provides optimal moisture removal for HCFC and HFC systems.',
    },
  ],
  'fd-5': [
    {
      question: 'What is the advantage of a replaceable core filter drier?',
      answer: 'The replaceable core design allows you to replace only the filter media without replacing the entire valve body, reducing maintenance costs and waste. The DFS replaceable core series covers ports from 5/8 inch to 2-5/8 inch with 1 to 3 cores providing 420 to 1260 m² of filtering surface.',
    },
    {
      question: 'How many cores does the DFS replaceable core filter drier use?',
      answer: 'The DFS replaceable core series can be configured with 1, 2, or 3 cores, providing 420, 840, or 1260 m² of filtering surface area respectively. This large-capacity design is ideal for industrial refrigeration systems requiring extended service intervals.',
    },
    {
      question: 'What refrigerants are compatible with the DFS replaceable core filter drier?',
      answer: 'The DFS replaceable core series is compatible with HCFC, HFC, and CFC refrigerants including R22, R134a, R404A, R410A, and legacy CFCs. The 100% 3A molecular sieve with 25μm filter pad provides effective moisture and contaminant removal across a wide range of applications.',
    },
  ],
  'sg-1': [
    {
      question: 'What does the moisture indicator sight glass show?',
      answer: 'The SGN series provides visual indication of refrigerant flow status, water content, and lubricant oil flow. The color-changing element shows green for dry (safe) and yellow for wet (moisture alert), allowing instant diagnosis of system moisture levels on liquid lines.',
    },
    {
      question: 'Why choose brazed ODF connections for the moisture indicator sight glass?',
      answer: 'Brazed ODF connections provide a permanent, leak-free joint for long-term installation on liquid lines. The SGN brazed ODF series covers ports from 1/4 inch to 1-1/8 inch and is suitable for new installations where the sight glass will remain in place for the system\'s operational life.',
    },
    {
      question: 'What is the explosion-proof press-fit structure on the SGN sight glass?',
      answer: 'The explosion-proof press-fit structure secures the observation window against high-pressure refrigerant, ensuring safe operation even if the glass cracks. The forged copper bar body and modified PTFE seal provide strength and corrosion resistance for HCFC and HFC systems.',
    },
  ],
  'sg-2': [
    {
      question: 'What is the difference between SAE flare and brazed ODF sight glasses?',
      answer: 'SAE flare sight glasses like the SGN SAE series can be disconnected and removed for service or replacement, while brazed ODF sight glasses provide permanent installation. Both provide moisture indication with color-changing elements and are suitable for HCFC/HFC systems.',
    },
    {
      question: 'Why choose SAE flare connections for the moisture indicator sight glass?',
      answer: 'SAE flare connections allow disassembly for service and maintenance without cutting the pipeline. The SGN SAE flare series covers ports from 1/4 inch to 3/4 inch and is ideal for applications where the sight glass may need periodic inspection or replacement.',
    },
    {
      question: 'What does the sight glass body ship with?',
      answer: 'The SGN SAE flare sight glass ships with dual male flare ends, and flare nuts are included for connection to female flare fittings. The UNF threaded connection allows easy installation and removal, and the color-changing moisture indicator provides instant system diagnostics.',
    },
  ],
  'sg-3': [
    {
      question: 'What is the advantage of male/female dual-end sight glass?',
      answer: 'The SGN-MF series has one male flare end and one female flare end, enabling direct tube-to-tube connection without additional fittings. This simplifies installation on liquid lines where you need to connect two flare tubes in series with moisture indication.',
    },
    {
      question: 'What port sizes are available for the SGN-MF male/female sight glass?',
      answer: 'The SGN-MF series covers four models from 1/4 inch to 5/8 inch with male/female dual-end SAE flare connections. The color-changing moisture indicator shows green for dry and yellow for wet, providing instant diagnosis of system moisture content.',
    },
    {
      question: 'What refrigerants are compatible with the SGN-MF sight glass?',
      answer: 'The SGN-MF series is compatible with HCFC and HFC refrigerants including R22, R134a, R404A, and R410A. The forged copper bar body, modified PTFE seal, and explosion-proof press-fit window ensure reliable performance across standard refrigeration applications.',
    },
  ],
  'st-1': [
    {
      question: 'What is the advantage of twin-diaphragm design in the KM stop valve?',
      answer: 'The twin stainless-steel diaphragms fully isolate the media from the stem, eliminating packing and ensuring zero stem leakage over the valve\'s service life. The KM SAE flare series covers ports from 1/4 inch to 3/4 inch with Kv values from 0.28 to 3.65 m³/h.',
    },
    {
      question: 'Why choose SAE flare connections for the KM twin-diaphragm stop valve?',
      answer: 'SAE flare connections allow installation and removal without brazing, making the KM series ideal for serviceable liquid, suction, and hot-gas lines. The valve can be disconnected and reconnected for maintenance, and the special bonnet design prevents water and dust ingress around the stem.',
    },
    {
      question: 'How many turns does it take to fully open the KM stop valve?',
      answer: 'The red handwheel opens the valve fully or to half-open with just 1½ turns, providing tactile end-stop feedback. A mounting hole on the body allows direct installation on an instrument panel, and the elastic valve-seat sealing achieves tight shut-off with minimal torque.',
    },
  ],
  'st-2': [
    {
      question: 'What is the difference between KM SAE flare and KM ODF brazed stop valves?',
      answer: 'Both use twin stainless-steel diaphragms for zero stem leakage. The SAE flare version allows easy removal for service, while the ODF brazed version provides permanent, vibration-proof joints for OEM refrigeration and cold-room lines. Both cover similar port ranges with Kv values from 0.28 to 3.65 m³/h.',
    },
    {
      question: 'Why choose ODF brazed connections for the KM twin-diaphragm stop valve?',
      answer: 'ODF brazed copper tails provide a permanent, vibration-proof joint ideal for OEM installations where the valve will remain in place long-term. The KM ODF series covers ports from 1/4 inch to 7/8 inch copper tube sizes and is vacuum-rated to −0.1 MPa for system evacuation.',
    },
    {
      question: 'What refrigerants are compatible with the KM ODF brazed stop valve?',
      answer: 'The KM ODF series is compatible with HCFC and HFC refrigerants including R22, R134a, R404A, and R410A. The twin stainless-steel diaphragms ensure zero stem leakage, and the elastic seat seal provides tight shut-off with minimal torque across the full temperature range.',
    },
  ],
  'st-3': [
    {
      question: 'What is the advantage of a 90° angle stop valve?',
      answer: 'The HS-L 90° angle body installs in tight corners and directly bridges SAE flare copper tubing to male NPT equipment ports without adapters. It covers ports from 1/4 inch to 3/4 inch with Kv values from 0.4 to 3.5 m³/h, rated at 45 bar for receiver and oil-separator service.',
    },
    {
      question: 'Why does the HS-L angle stop valve have SAE flare and NPT connections?',
      answer: 'The upper port is SAE flare for copper tubing and the lower port is male NPT for threaded equipment outlets. This combination eliminates the need for adapter fittings when connecting flare lines to receivers, oil separators, or other equipment with NPT ports.',
    },
    {
      question: 'What is the temperature range for the HS-L angle stop valve?',
      answer: 'The HS-L series operates at temperatures from −40 °C to +150 °C with MWP 45 bar (4.5 MPa), covering low-temperature cold rooms and high-side discharge lines. The forged brass body and two-stage stem sealing with protective cap ensure reliable performance across HCFC/HFC refrigerants.',
    },
  ],
  'st-4': [
    {
      question: 'What is the HS-OL oil-line angle stop valve designed for?',
      answer: 'The HS-OL is a 90° angle stop valve with SAE flare connections on both ends, designed specifically for oil-separator and receiver service lines. It covers ports from 1/4 inch to 3/8 inch with Kv values from 0.4 to 0.5 m³/h, allowing you to isolate, drain, or replace components without cutting pipe.',
    },
    {
      question: 'Why choose SAE flare connections for the HS-OL oil-line angle stop valve?',
      answer: 'SAE flare connections on both ends make the HS-OL fully serviceable; the valve can be disconnected from the line without cutting or brazing. This is critical for oil-line maintenance where periodic removal for cleaning or replacement is required.',
    },
    {
      question: 'What is the maximum working pressure for the HS-OL angle stop valve?',
      answer: 'The HS-OL series is rated for MWP 45 bar (4.5 MPa) and operates at temperatures from −40 °C to +150 °C. The forged brass body provides strength and corrosion resistance, and the two-stage stem sealing with protective cap prevents leakage and tampering in oil-line applications.',
    },
  ],
  'st-5': [
    {
      question: 'What is the difference between the HS-OL and HS-OL-W angle stop valves?',
      answer: 'Both are 90° angle stop valves with SAE flare connections. The HS-OL-W features a reduced bore (minimum from ø3.5 mm) for low-flow oil-return and control lines, while the HS-OL has full bore for general service. Both cover ports from 1/4 inch to 3/8 inch and are rated at 45 bar.',
    },
    {
      question: 'Why choose a reduced-bore angle stop valve?',
      answer: 'The reduced bore (minimum from ø3.5 mm) throttles flow for low-volume oil-return and control applications where a smaller throat is preferred. The HS-OL-W series covers ports from 1/4 inch to 3/8 inch with Kv values from 0.3 to 0.5 m³/h, ideal for precision flow control.',
    },
    {
      question: 'What is the temperature range for the HS-OL-W reduced-bore angle stop valve?',
      answer: 'The HS-OL-W series operates at temperatures from −40 °C to +150 °C with MWP 45 bar (4.5 MPa). The forged brass body, two-stage stem sealing, and compact 90° angle design ensure reliable performance in tight spaces beside receivers, oil separators, and control panels.',
    },
  ],
  'tx-1': [
    {
      question: 'What is the function of the TRF heavy-duty thermostatic expansion valve?',
      answer: 'The TRF series regulates refrigerant flow into the evaporator by maintaining constant superheat. It is engineered for high-capacity commercial and industrial refrigeration, covering R22, R404A/R507, R134a, and R410A with capacity range from 1.5 TR to 52 TR.',
    },
    {
      question: 'What is external equalization and why does the TRF series use it?',
      answer: 'External equalization connects the TXV sensing element to the evaporator outlet, compensating for pressure drop across the evaporator. This ensures accurate superheat control in systems with significant pressure loss, making the TRF series suitable for large commercial and industrial applications.',
    },
    {
      question: 'What refrigerant variants are available for the TRF heavy-duty TXV?',
      answer: 'The TRF series offers four dedicated charge formulations: TRF22W for R22, TRF404W for R404A/R507, TRF134W for R134a, and TRF410W for R410A. Each variant is optimized for the specific refrigerant\'s pressure-temperature characteristics, with SAE flare connections and external equalization standard.',
    },
  ],
  'tx-2': [
    {
      question: 'What is the difference between TER and TERW thermostatic expansion valves?',
      answer: 'With dual configuration offering TER (ODF solder, internal equalization) and TERW (SAE flare, external equalization), the TER series  uses ODF solder connections with internal equalization for fixed installations, while the TERW series uses SAE flare connections with external equalization for serviceable applications. Both cover R22, R404A/R507, R134a, and R410A with capacity from 1.5 TR to 13 TR.',
    },
    {
      question: 'When should I choose internal vs external equalization for the TER series?',
      answer: 'Choose internal equalization (TER models) for single-circuit evaporators with minimal pressure drop. Choose external equalization (TERW models) for multi-circuit or high-pressure-drop evaporators where accurate superheat control requires compensation for evaporator pressure loss.',
    },
    {
      question: 'What is the default static superheat setting for the TER series?',
      answer: 'The TER series is factory-set to 4K static superheat, which is adjustable in the field. The max working pressure is 4.6 MPa for all variants, and charge types include N (standard), K, and MAH for extended temperature ranges up to 150 °C at the power element.',
    },
  ],
  'tx-3': [
    {
      question: 'What is the advantage of replaceable orifice in the TF series TXV?',
      answer: 'The replaceable orifice design allows you to adjust valve capacity without replacing the entire valve body. A single valve body serves multiple refrigerants with different orifice sizes (0# through 6#), reducing inventory costs and providing flexibility for service technicians and OEMs.',
    },
    {
      question: 'How many orifice sizes are available for the TF series thermostatic expansion valve?',
      answer: 'The TF series offers seven interchangeable orifice sizes from 0# to 6#, covering capacity range from 0.18 TR to 5.6 TR (R22 reference). Each orifice size is compatible with R22, R404A/R507, R134a, and R410A refrigerant variants.',
    },
    {
      question: 'What is the difference between TF and TFW thermostatic expansion valves?',
      answer: 'The TF series uses internal equalization and is available with SAE flare or ODF connections, while the TFW series uses external equalization with SAE flare connections for applications requiring compensation for evaporator pressure drop. Both share the same replaceable orifice design.',
    },
  ],
  'tx-4': [
    {
      question: 'What are the TF series replaceable TXV orifices used for?',
      answer: 'The replacement orifice assembly assemblies allow you to adjust the capacity of TF series TXV valve bodies in the field. Seven sizes (0# through 6#) provide precise capacity matching across R22, R404A/R507, R134a, and R410A refrigerants without replacing the entire valve.',
    },
    {
      question: 'How do I select the correct orifice size for my TF series TXV?',
      answer: 'Select the orifice size based on your system\'s required capacity and refrigerant type. The capacity varies by refrigerant and orifice size, ranging from 0.25 TR (0# orifice, R22) to 5.60 TR (6# orifice, R22). Consult the capacity tables for specific refrigerant corrections.',
    },
    {
      question: 'Are the TF series orifices compatible with all TF valve bodies?',
      answer: 'Yes. All seven orifice assembly sizes (0# through 6#) are universally compatible with TF22, TF134, TF404, and TF410 valve bodies. This universal compatibility reduces spare parts inventory and allows field capacity adjustment with standard tools.',
    },
  ],
  'ct-1': [
    {
      question: 'What is the advantage of level-wound jumbo coils over pancake coils?',
      answer: 'Level-wound jumbo coils provide longer continuous runs (30M or 50M) than pancake coils, reducing coupling joints and leak points in AC installation. The O60 soft annealed temper ensures easy field bending, and the level-wind format allows smooth, tangle-free dispensing.',
    },
    {
      question: 'What standards do the ACR copper jumbo coils comply with?',
      answer: 'The jumbo coils are produced from C12200 (TP2) phosphorus-deoxidized copper and comply with ASTM B280 and EN 12735-1 standards. Each coil is 100% eddy current tested and supplied with a Mill Test Certificate (EN 10204 3.1) for every batch.',
    },
    {
      question: 'What refrigerants are compatible with the ACR copper jumbo coils?',
      answer: 'The jumbo coils are compatible with R22, R410A, and R32 refrigerants. The bright, clean, oxidation-free inner surface ensures reliable performance, and optional nitrogen purging and end-sealing are available to maintain tube cleanliness during storage and installation.',
    },
  ],
  'ct-3': [
    {
      question: 'What is the difference between pancake coils and jumbo coils?',
      answer: 'Pancake coils (15M/30M) are compact and ideal for mini-split field installation, while jumbo coils (30M/50M) provide longer continuous runs for high-volume projects. Both use O60 soft annealed copper and comply with ASTM B280 and EN 12735-1 standards.',
    },
    {
      question: 'What is the copper purity of the ACR pancake coils?',
      answer: 'The pancake coils use phosphorus-deoxidized copper (C12200 / TP2) with Cu+Ag ≥ 99.90% purity. Each coil is 100% online eddy current tested and supplied with a Mill Test Certificate (EN 10204 3.1) to ensure wall integrity and compliance with refrigeration standards.',
    },
    {
      question: 'What sizes are available for the ACR copper pancake coils?',
      answer: 'The pancake coils cover OD sizes from 1/4 inch to 7/8 inch in 15M or 30M lengths. The O60 soft annealed temper allows easy field bending and flaring, making them the preferred choice for mini-split, VRF, and heat pump installations with R22, R410A, and R32 refrigerants.',
    },
  ],
  'ct-4': [
    {
      question: 'What is the difference between soft annealed and hard drawn copper tubes?',
      answer: 'Soft annealed (O60) tubes are flexible and easy to bend for field installation, while hard drawn (H80) tubes maintain structural rigidity for applications requiring straight, stable piping. The hard drawn series is supplied in 3M straight lengths for central AC, VRF, and rigid piping systems.',
    },
    {
      question: 'What standards do the ACR hard copper straight tubes comply with?',
      answer: 'The hard drawn tubes are produced from C12200 (TP2) phosphorus-deoxidized copper and comply with GB/T 1527, GB/T 17791, and ASTM B75 standards. Each tube is 100% eddy current tested and supplied with a Mill Test Certificate (EN 10204 3.1).',
    },
    {
      question: 'What sizes are available for the ACR hard copper straight tubes?',
      answer: 'The hard drawn straight tubes cover OD sizes from 1/4 inch to 2-1/8 inch in standard 3M lengths. The H80 temper maintains straightness during transport and installation, and the tubes are compatible with R22, R410A, and R32 refrigerants for HVAC and refrigeration applications.',
    },
  ],
  'ct-mjc-1': [
    {
      question: 'What is the difference between mini jumbo coils and standard jumbo coils?',
      answer: 'Mini jumbo coils weigh approximately 50 kg per roll and are wound without a wooden reel, while standard jumbo coils weigh approximately 110 kg on a wooden bobbin. Both share the same OD, wall thickness, and specifications; mini jumbo coils are manually portable and require without wooden reel and no forklift.',
    },
    {
      question: 'Why choose mini jumbo coils over pancake coils?',
      answer: 'Mini jumbo coils provide longer continuous runs than pancake coils, reducing coupling joints and leak points on mini-split, VRF, and light commercial jobs. The ~50 kg format can be handled by one or two technicians without a forklift, while still offering far more length per roll.',
    },
    {
      question: 'How is the mini jumbo coil sold and what length do I get?',
      answer: 'Mini jumbo coils are sold by net weight (~50 kg per roll). Because every size uses the same target roll weight, the tube length per roll varies with OD and wall thickness; smaller diameters yield more meters per roll. The coils are level-wound for smooth, tangle-free dispensing.',
    },
  ],
}