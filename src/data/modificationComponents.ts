import { ExtendedModificationComponent } from '../types/modification';

export const MODIFICATION_COMPONENTS: ExtendedModificationComponent[] = [
  // ==========================================
  // 1. EXTERIOR & AERO
  // ==========================================
  {
    id: 'mod-ext-weissach-wing',
    name: 'Manthey-Spec Carbon Swan-Neck GT Rear Wing',
    category: 'aerodynamics',
    subCategory: 'Rear Wing',
    brand: 'Manthey Racing',
    partNumber: 'MTH-992-AERO-01',
    priceUSD: 9800,
    installHours: 4.5,
    powerGainHp: 0,
    weightDeltaKg: -4.2,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Direct mount to factory rear decklid uprights. Includes 4-way angle of attack adjustment shims.',
    description: 'Dry autoclave carbon fiber swan-neck airfoil engineered in the Weissach wind tunnel to generate up to 280 kg of rear axle downforce at 200 km/h.',
    specifications: {
      'Material': 'Pre-Preg Dry Carbon Fiber (2x2 Twill)',
      'Mounting': 'Billet Aluminum Swan-Neck Pylons',
      'Downforce Delta': '+280 kg @ 200 km/h',
      'Adjustability': '4 manual angle-of-attack increments (-2° to +12°)'
    },
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Stabilizes the rear axle under high-speed cornering and threshold braking, reducing lap times and increasing corner entry speed.',
    supportedVehicles: {
      makes: ['Porsche', 'BMW', 'Toyota', 'Chevrolet'],
      models: ['911 GT3 RS', '718 Cayman GT4 RS', 'M3 Competition', 'M4 Competition', 'GR Supra', 'Corvette Z06'],
      generations: ['992.1', '982-RS', 'G80', 'G82', 'A90', 'C8']
    },
    compatibilityRules: 'Requires factory mounting points or reinforced composite decklid.',
    material: 'Dry Autoclave Carbon Fiber & 7075-T6 Billet Aluminum',
    dimensions: '1780mm Span x 320mm Chord',
    weight: '3.8 kg complete assembly',
    estimatedPrice: {
      minUSD: 9200,
      maxUSD: 10400,
      displayUSD: '$9,200 – $10,400'
    },
    installationEstimate: {
      hours: 4.5,
      estimatedLaborUSD: 675,
      difficulty: 'moderate',
      difficultyLabel: 'Moderate (Alignment & Seal Test)'
    },
    installationDifficulty: 'moderate',
    performanceImpact: 'Generates up to 280 kg downforce at 200 km/h for relentless rear grip.',
    handlingImpact: 'Massively eliminates high-speed rear instability over curbs and off-camber sweepers.',
    weightImpact: 'Saves 4.2 kg over heavier cast-alloy OEM spoiler mechanisms.',
    visualAsset: {
      type: 'spoiler',
      supported: true,
      spoilerType: 'gt_wing',
      assetNotice: '3D Preview Active: Swan-Neck GT Airfoil'
    },
    cameraTarget: 'rear',
    verificationStatus: 'verified',
    beginnerExplanation: 'A large racing wing mounted on top of the car that uses air pressure to push the rear tires hard into the ground, keeping the car glued to the road around fast curves.',
    expertExplanation: 'Swan-neck top-mount brackets leave the bottom surface of the airfoil completely uninterrupted, maximizing low-pressure suction and achieving a superior L/D (Lift-to-Drag) ratio of 4.8:1.',
    whyUsersInstall: 'Essential for eliminating high-speed rear float on tracks like the Nürburgring Nordschleife, Road Atlanta, or Spa-Francorchamps.',
    tradeoffs: 'Increases aerodynamic drag at top speed (approx. 5-8 km/h reduction in absolute V-Max); requires careful front splitter balancing.',
    featured: true
  },
  {
    id: 'mod-ext-carbon-ducktail',
    name: 'CSL-Style Carbon Fiber Low-Drag Ducktail Spoiler',
    category: 'aerodynamics',
    subCategory: 'Spoiler',
    brand: 'Vorsteiner',
    partNumber: 'VRS-CSL-DT02',
    priceUSD: 2450,
    installHours: 2.0,
    powerGainHp: 0,
    weightDeltaKg: -2.8,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Uses OEM structural body adhesive and 4 factory bolt holes. No drilling required.',
    description: 'Iconic upswept ducktail spoiler sculpted from 100% pre-preg carbon fiber. Delivers balanced aerodynamic separation without excessive frontal drag.',
    specifications: {
      'Material': 'High-Gloss Pre-Preg Carbon Fiber',
      'Downforce Delta': '+45 kg @ 180 km/h',
      'Finish': 'UV-Resistant Clear Coat',
      'Attachment': 'Automotive Structural Urethane + OEM Bolts'
    },
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Cleans up aerodynamic turbulence peeling off the roof line, creating moderate downforce while maintaining daily driver usability.',
    supportedVehicles: {
      makes: ['Porsche', 'BMW', 'Toyota'],
      models: ['911 GT3 RS', 'M3 Competition', 'M4 Competition', 'GR Supra', 'GR86'],
      generations: ['992.1', 'G80', 'G82', 'A90', 'ZN8']
    },
    compatibilityRules: 'Direct bolt-on replacement for factory active aero lip.',
    material: 'Pre-Preg 2x2 Carbon Fiber',
    estimatedPrice: {
      minUSD: 2200,
      maxUSD: 2700,
      displayUSD: '$2,200 – $2,700'
    },
    installationEstimate: {
      hours: 2.0,
      estimatedLaborUSD: 300,
      difficulty: 'bolt_on',
      difficultyLabel: 'Direct Bolt-On (1–2 Hours)'
    },
    installationDifficulty: 'bolt_on',
    performanceImpact: 'Reduces rear lift by 45 kg with minimal drag coefficient penalty.',
    handlingImpact: 'Sharper high-speed highway tracking and planted rear end.',
    visualAsset: {
      type: 'spoiler',
      supported: true,
      spoilerType: 'ducktail',
      assetNotice: '3D Preview Active: Upswept Ducktail Profile'
    },
    cameraTarget: 'rear',
    verificationStatus: 'verified',
    beginnerExplanation: 'An aggressive raised lip on the rear trunk that improves airflow and gives the car a classic, muscular motorsport silhouette.',
    expertExplanation: 'Forces early vortex shedding at the trunk trailing edge, preventing boundary layer detachment and minimizing turbulent low-pressure wake behind the rear windshield.',
    whyUsersInstall: 'Provides timeless OEM+ styling and clean aero separation without looking like a dedicated race car.',
    tradeoffs: 'Produces significantly less total downforce than a tall GT wing; best suited for fast road and intermediate track use.'
  },
  {
    id: 'mod-ext-carbon-front-splitter',
    name: 'Aeromotion Carbon Front Splitter with Canards',
    category: 'aerodynamics',
    subCategory: 'Front Splitter',
    brand: 'Aeromotion',
    partNumber: 'AERO-SPLIT-G80',
    priceUSD: 3850,
    installHours: 3.5,
    powerGainHp: 0,
    weightDeltaKg: -1.5,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Includes titanium chassis tie-rods and undertray ducting channels.',
    description: 'Chassis-mounted autoclave carbon front splitter featuring integrated tire squirt dams and dive-plane canards to direct high-pressure air around front wheels.',
    specifications: {
      'Downforce Front': '+110 kg @ 180 km/h',
      'Construction': 'Honeycomb Nomex Core Carbon Fiber Sandwich',
      'Mounting Brackets': 'CNC 6061-T6 Aluminum to Subframe'
    },
    image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Eliminates high-speed understeer by pinning the front axle to the track surface under steering lock.',
    supportedVehicles: {
      makes: ['Porsche', 'BMW', 'Audi', 'Toyota'],
      models: ['911 GT3 RS', 'M3 Competition', 'M4 Competition', 'RS6 Avant', 'GR Supra'],
      generations: ['992.1', 'G80', 'G82', 'C8', 'A90']
    },
    compatibilityRules: 'Requires mounting directly to aluminum front crash bar or subframe rails.',
    material: 'Honeycomb Core Carbon Fiber',
    estimatedPrice: {
      minUSD: 3500,
      maxUSD: 4200,
      displayUSD: '$3,500 – $4,200'
    },
    installationEstimate: {
      hours: 3.5,
      estimatedLaborUSD: 525,
      difficulty: 'moderate',
      difficultyLabel: 'Moderate (Subframe Tie-Rods)'
    },
    installationDifficulty: 'moderate',
    performanceImpact: '+110 kg front downforce; dramatically sharper turn-in grip.',
    visualAsset: {
      type: 'splitter',
      supported: true,
      hasRaceSplitter: true,
      assetNotice: '3D Preview Active: Race Carbon Splitter'
    },
    cameraTarget: 'front',
    verificationStatus: 'verified',
    beginnerExplanation: 'A wide carbon wing underneath the front bumper that scoops air down to prevent the front of the car from lifting up at high speeds.',
    expertExplanation: 'Creates a high-pressure stagnation zone on the top surface while speeding air beneath the smooth undertray, generating intense Venturi suction right under the front tires.',
    whyUsersInstall: 'Cures factory push (understeer) on corner apex and balances out rear wings.'
  },

  // ==========================================
  // 2. WHEELS & TYRES
  // ==========================================
  {
    id: 'mod-whl-bbs-fir',
    name: 'BBS FI-R Forged Center-Lock Monoblock Wheel Set',
    category: 'wheels_tires',
    subCategory: 'Forged Wheels',
    brand: 'BBS Motorsport',
    partNumber: 'FIR-CL-2021',
    priceUSD: 11400,
    installHours: 1.5,
    powerGainHp: 0,
    weightDeltaKg: -14.8,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Center-lock hub fitment. Relief cutouts in each spoke eliminate unsprung rotational inertia.',
    description: 'The pinnacle of road-legal motorsport wheel engineering. Machined from a single billet of aerospace-grade forged aluminum with mass-relief windows carved directly inside the spokes.',
    specifications: {
      'Front Wheel Spec': '20" x 9.5J ET45 (7.7 kg)',
      'Rear Wheel Spec': '21" x 12.5J ET48 (9.3 kg)',
      'Construction': '1-Piece Forged 6061-T6 Aerospace Aluminum',
      'Retention Type': 'Centerlock / Spline Nut'
    },
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Drastically cuts unsprung rotational mass, allowing suspension dampers to react quicker and the engine to accelerate wheels with less resistance.',
    supportedVehicles: {
      makes: ['Porsche', 'BMW', 'Chevrolet'],
      models: ['911 GT3 RS', '718 Cayman GT4 RS', 'M3 Competition', 'Corvette Z06'],
      generations: ['992.1', '982-RS', 'G80', 'C8']
    },
    compatibilityRules: 'Requires center-lock hub mechanism or certified hub adapter kit for 5-lug chassis.',
    material: 'Aerospace Forged 6061-T6 Aluminum',
    dimensions: '20" Front / 21" Rear',
    weight: '7.7 kg front / 9.3 kg rear',
    estimatedPrice: {
      minUSD: 10800,
      maxUSD: 12200,
      displayUSD: '$10,800 – $12,200'
    },
    installationEstimate: {
      hours: 1.5,
      estimatedLaborUSD: 225,
      difficulty: 'bolt_on',
      difficultyLabel: 'Direct Bolt-On (1–2 Hours)'
    },
    installationDifficulty: 'bolt_on',
    performanceImpact: 'Cuts 14.8 kg rotational unsprung weight; feels like a 75 kg static vehicle diet.',
    handlingImpact: 'Instant steering direction changes; noticeably plusher damping over road bumps.',
    visualAsset: {
      type: 'wheel',
      supported: true,
      rimColor: '#D1D5DB',
      assetNotice: '3D Preview Active: BBS Forged Monoblocks (Light Alloy)'
    },
    cameraTarget: 'wheel',
    verificationStatus: 'verified',
    beginnerExplanation: 'Super lightweight racing wheels forged under thousands of tons of hydraulic pressure, making the car accelerate, turn, and brake much faster.',
    expertExplanation: 'Reduces moment of inertia by 22% compared to cast OEM wheels. Every 1 kg saved in rotating wheel mass has approximately double the dynamic impact of static chassis weight savings.',
    whyUsersInstall: 'The single most effective hardware upgrade for sharpening steering response, ride comfort, and wheel breakaway progression.',
    featured: true
  },
  {
    id: 'mod-whl-hre-bronze',
    name: 'HRE Classic 300 Satin Bronze Forged Wheels',
    category: 'wheels_tires',
    subCategory: 'Alloy Wheels',
    brand: 'HRE Performance Wheels',
    partNumber: 'HRE-C300-BRZ',
    priceUSD: 9600,
    installHours: 1.5,
    powerGainHp: 0,
    weightDeltaKg: -8.5,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Available in 5x112, 5x120, and 5x130 PCD bolt patterns with custom concave profiles.',
    description: 'Timeless multi-spoke modular forged wheel finished in hand-brushed satin bronze with titanium assembly bolts.',
    specifications: {
      'Diameter': '20" Front / 21" Rear',
      'PCD': '5x112 / 5x120 / 5x130 Custom CNC Machined',
      'Finish': 'Satin Brushed Motorsport Bronze',
      'Hardware': 'ARP Titanium Assembly Bolts'
    },
    image: 'https://images.unsplash.com/photo-1589148938909-4d241c91ee52?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Offers high-strength forged reliability and timeless classic design with personalized custom offsets.',
    supportedVehicles: {
      universal: true
    },
    compatibilityRules: 'Universal custom CNC bolt pattern matched to vehicle hub specifications.',
    material: 'Forged 6061-T6 Aluminum',
    estimatedPrice: {
      minUSD: 9200,
      maxUSD: 10400,
      displayUSD: '$9,200 – $10,400'
    },
    installationEstimate: {
      hours: 1.5,
      estimatedLaborUSD: 225,
      difficulty: 'bolt_on',
      difficultyLabel: 'Direct Bolt-On (1–2 Hours)'
    },
    installationDifficulty: 'bolt_on',
    performanceImpact: 'Weight reduction and heat dissipation for heavy track duty.',
    visualAsset: {
      type: 'wheel',
      supported: true,
      rimColor: '#D97706',
      assetNotice: '3D Preview Active: Satin Bronze Forged Wheels'
    },
    cameraTarget: 'wheel',
    verificationStatus: 'verified',
    beginnerExplanation: 'Custom bronze luxury-performance wheels that are significantly stronger and lighter than standard factory wheels.',
    expertExplanation: 'CNC-profiled rim halves ensure radial runout under 0.005", guaranteeing buttery smooth balance up to 340 km/h.',
    whyUsersInstall: 'Striking visual stance and uncompromising strength for both track days and cars & coffee.'
  },
  {
    id: 'mod-whl-cup2r-tyres',
    name: 'Michelin Pilot Sport Cup 2 R Semi-Slick Tyres',
    category: 'wheels_tires',
    subCategory: 'Performance Tyres',
    brand: 'Michelin',
    partNumber: 'MICH-CUP2R-2021',
    priceUSD: 2600,
    installHours: 1.0,
    powerGainHp: 0,
    weightDeltaKg: -1.2,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Road legal semi-slick track tire. Extreme dry grip compound; not recommended in standing water or below 7°C.',
    description: 'Homologated motorsport semi-slick tyre compound derived directly from Le Mans endurance racing, delivering up to 1.5g lateral grip.',
    specifications: {
      'Treadwear Rating': '140 UTQG',
      'Lateral Grip': 'Up to 1.55G in dry optimal window',
      'Compound': 'Bicomponent Motorsport Rubber Formulation',
      'Operating Window': '70°C to 105°C'
    },
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Provides maximum possible dry mechanical grip and braking traction for setting benchmark track lap times.',
    supportedVehicles: {
      universal: true
    },
    compatibilityRules: 'Must match rim diameter (19", 20", or 21").',
    estimatedPrice: {
      minUSD: 2400,
      maxUSD: 2900,
      displayUSD: '$2,400 – $2,900'
    },
    installationEstimate: {
      hours: 1.0,
      estimatedLaborUSD: 150,
      difficulty: 'bolt_on',
      difficultyLabel: 'Mount & Road-Force Balance'
    },
    installationDifficulty: 'bolt_on',
    performanceImpact: 'Shaves 1.5 to 2.5 seconds per minute of track lap time over standard sport tires.',
    visualAsset: {
      type: 'wheel',
      supported: true,
      assetNotice: '3D Preview Active: Competition Tire Fitment'
    },
    cameraTarget: 'wheel',
    verificationStatus: 'verified',
    beginnerExplanation: 'The stickiest street-legal racing tires in the world, designed to help your car corner at incredible speeds without slipping.',
    expertExplanation: 'Features high-density aramid polyamide belts underneath the tread that resist centrifugal distortion at 300+ km/h, keeping the contact patch flat.',
    whyUsersInstall: 'The fastest lap-time-per-dollar modification available on any performance car.'
  },

  // ==========================================
  // 3. BRAKES & HYDRAULICS
  // ==========================================
  {
    id: 'mod-brk-brembo-gts',
    name: 'Brembo GT-S 6-Piston 380mm Monobloc Brake System',
    category: 'brakes',
    subCategory: 'Big Brake Kit',
    brand: 'Brembo',
    partNumber: '1N1.9038A-GTS',
    priceUSD: 5400,
    installHours: 4.0,
    powerGainHp: 0,
    weightDeltaKg: -5.4,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Requires 19" wheel barrel clearance. Comes with stainless steel braided hydraulic lines.',
    description: 'Hard-anodized billet aluminum 6-piston monobloc caliper kit paired with Type-3 bi-directional slotted two-piece floating rotors.',
    specifications: {
      'Caliper Type': '6-Piston Billet Monobloc with Dual Seals',
      'Disc Spec': '380mm x 34mm Curved Vane Slotted Rotor',
      'Finish': 'Hard-Anodized Motorsport Black / Brembo Racing Red',
      'Max Operating Temp': '850°C'
    },
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Eliminates brake fade during consecutive high-speed track sessions and provides laser-precise pedal modulation.',
    supportedVehicles: {
      makes: ['Porsche', 'BMW', 'Audi', 'Toyota', 'Chevrolet'],
      models: ['911 GT3 RS', '718 Cayman GT4 RS', 'M3 Competition', 'M4 Competition', 'RS6 Avant', 'GR Supra', 'Corvette Z06'],
      minWheelSizeInches: 19
    },
    compatibilityRules: 'Requires minimum 19-inch inner wheel barrel diameter to clear caliper bridge.',
    material: 'Forged Aluminum Caliper & High-Carbon Cast Iron Friction Ring',
    estimatedPrice: {
      minUSD: 5100,
      maxUSD: 5800,
      displayUSD: '$5,100 – $5,800'
    },
    installationEstimate: {
      hours: 4.0,
      estimatedLaborUSD: 600,
      difficulty: 'moderate',
      difficultyLabel: 'Moderate (Brake Bleed & Bedding)'
    },
    installationDifficulty: 'moderate',
    performanceImpact: 'Zero pedal fade after 20+ continuous threshold stops from 250 km/h.',
    handlingImpact: 'Reduces unsprung wheel corner weight by 2.7 kg per front corner.',
    visualAsset: {
      type: 'brake',
      supported: true,
      caliperColor: '#EF4444',
      assetNotice: '3D Preview Active: Brembo Red Monobloc Calipers'
    },
    cameraTarget: 'brake',
    verificationStatus: 'verified',
    beginnerExplanation: 'Heavy-duty racing brakes with massive red calipers and slotted discs that stop your car repeatedly from high speeds without getting tired or soft.',
    expertExplanation: 'Floating bobbins allow radial expansion of the friction ring without warping under 800°C thermal shock, maintaining dead-flat pad-to-rotor contact.',
    whyUsersInstall: 'Provides absolute confidence braking deep into turn 1 without worrying about spongy pedal travel.',
    featured: true
  },
  {
    id: 'mod-brk-acid-green-carbon',
    name: 'Acid Green Carbon Ceramic Rotor Upgrade Kit',
    category: 'brakes',
    subCategory: 'Brake Rotors',
    brand: 'Surface Transforms',
    partNumber: 'ST-CCM-410',
    priceUSD: 14200,
    installHours: 3.5,
    powerGainHp: 0,
    weightDeltaKg: -19.4,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Direct replacement for factory iron or ceramic brake discs. Uses continuous 3D woven carbon fibers.',
    description: 'Next-generation continuous carbon ceramic matrix rotors with Acid Green billet calipers. Capable of being refurbished up to 5 times.',
    specifications: {
      'Rotor Diameter': '410mm Front / 390mm Rear',
      'Material': 'Continuous Pitch-Based 3D Carbon Fiber Matrix',
      'Weight Savings': '19.4 kg total rotating unsprung mass (-65% vs Iron)',
      'Lifespan': '3x longer track life than standard chopped-fiber carbon ceramic'
    },
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Drastic unsprung weight elimination with virtually zero brake dust and immense fade resistance.',
    supportedVehicles: {
      makes: ['Porsche', 'BMW', 'Audi'],
      models: ['911 GT3 RS', '718 Cayman GT4 RS', 'Taycan Turbo S', 'M3 Competition', 'M4 Competition', 'RS6 Avant'],
      minWheelSizeInches: 20
    },
    compatibilityRules: 'Requires minimum 20-inch wheels to accommodate 410mm diameter rotors.',
    material: 'Continuous Silicon Carbide Carbon Composite',
    estimatedPrice: {
      minUSD: 13500,
      maxUSD: 15200,
      displayUSD: '$13,500 – $15,200'
    },
    installationEstimate: {
      hours: 3.5,
      estimatedLaborUSD: 525,
      difficulty: 'moderate',
      difficultyLabel: 'Moderate (Precision Torque & Flush)'
    },
    installationDifficulty: 'moderate',
    performanceImpact: 'Instantaneous bite, 19.4 kg weight reduction, zero brake fade at 1,000°C.',
    visualAsset: {
      type: 'brake',
      supported: true,
      caliperColor: '#10B981',
      assetNotice: '3D Preview Active: Acid Green High-Tech Calipers'
    },
    cameraTarget: 'brake',
    verificationStatus: 'verified',
    beginnerExplanation: 'Exotic carbon ceramic brakes that never produce ugly brake dust on your wheels and shave massive weight from the car.',
    expertExplanation: 'Continuous 3D woven fiber structure conducts heat 300% faster across the disc surface than chopped-strand carbon discs, preventing thermal surface crystallization.',
    whyUsersInstall: 'The ultimate braking package for extreme track performance, zero dust, and eye-catching Acid Green styling.'
  },

  // ==========================================
  // 4. SUSPENSION & STANCE
  // ==========================================
  {
    id: 'mod-sus-ohlins-dfv',
    name: 'Öhlins Road & Track Dual Flow Valve (DFV) Coilovers',
    category: 'suspension',
    subCategory: 'Coilovers',
    brand: 'Öhlins',
    partNumber: 'POS-5S00-DFV',
    priceUSD: 3950,
    installHours: 5.0,
    powerGainHp: 0,
    weightDeltaKg: -3.8,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Includes threaded aluminum shock bodies, helper springs, and 20-click combined rebound/compression adjusters.',
    description: 'Legendary Swedish suspension technology featuring patented Dual Flow Valve oil pathways that provide supple road compliance while keeping the chassis totally level under high G-forces.',
    specifications: {
      'Technology': 'Dual Flow Valve (DFV) Monotube Inverted Damper',
      'Height Adjustment': '-10mm to -35mm below factory ride height',
      'Damping Adjustability': '20 clicks calibrated micro-click rebound & compression',
      'Spring Spec': 'Linear Cold-Wound High-Silicon Chrome Steel'
    },
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Transforms vehicle agility, eliminates body roll, allows custom ride height stance, and maintains daily driver ride quality over sharp bumps.',
    supportedVehicles: {
      makes: ['Porsche', 'BMW', 'Toyota', 'Audi'],
      models: ['911 GT3 RS', '718 Cayman GT4 RS', 'M3 Competition', 'M4 Competition', 'GR Supra', 'GR86'],
      requiresTrackAlignment: true
    },
    compatibilityRules: 'Requires professional wheel alignment and electronic damper PASM/EDC canceler modules if equipped with active dampers.',
    material: 'Hard Anodized Forged Aluminum Body & Chrome Piston Shaft',
    estimatedPrice: {
      minUSD: 3800,
      maxUSD: 4300,
      displayUSD: '$3,800 – $4,300'
    },
    installationEstimate: {
      hours: 5.0,
      estimatedLaborUSD: 750,
      difficulty: 'professional_required',
      difficultyLabel: 'Professional (Spring Compressor & Alignment)'
    },
    installationDifficulty: 'professional_required',
    performanceImpact: 'Lowers center of gravity by up to 35mm; preserves optimal tire contact patch over curbs.',
    handlingImpact: 'Completely eliminates cornering body lean and dive during emergency braking.',
    visualAsset: {
      type: 'suspension_stance',
      supported: true,
      rideHeightDrop: 0.28,
      camberDelta: -1.2,
      assetNotice: '3D Preview Active: -30mm Track Stance & -3.2° Camber'
    },
    cameraTarget: 'suspension',
    verificationStatus: 'verified',
    beginnerExplanation: 'High-end adjustable racing shock absorbers and springs that lower the car closer to the ground for great looks and sports-car handling without a harsh or bouncy ride.',
    expertExplanation: 'When hitting a sudden sharp curb or expansion joint, the secondary internal DFV shim stack instantly unlocks, allowing fluid to bypass the main piston and preventing tire deflection.',
    whyUsersInstall: 'Widely recognized by racers as the single finest suspension upgrade balancing everyday street comfort with track record pace.',
    featured: true
  },
  {
    id: 'mod-sus-airlift-3h',
    name: 'Air Lift Performance 3H Digital Air Suspension System',
    category: 'suspension',
    subCategory: 'Air Suspension',
    brand: 'Air Lift Performance',
    partNumber: 'ALP-3H-DUAL',
    priceUSD: 4800,
    installHours: 8.5,
    powerGainHp: 0,
    weightDeltaKg: 12.5,
    compatibilityRating: 'verificationRequired',
    compatibilityNotes: 'Features height and pressure sensor manifold, aluminum air tank, and dual silent compressors.',
    description: 'Digital height-sensing air suspension system capable of slamming the chassis to zero ground clearance at shows while instantly raising up over speed bumps with the touch of a button.',
    specifications: {
      'Control System': '32-bit ECU with Bluetooth Mobile App Control',
      'Presets': '5 User-programmable ride heights with automatic calibration',
      'Tank Spec': '4-Gallon Seamless Spun Aluminum Tank (Raw or Polished)',
      'Compressor': 'Dual Viair 444C Stealth Black Air Compressors'
    },
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Complete ride height versatility: show-floor slammed stance, lowered cruising height, and clearance for driveways and trailers.',
    supportedVehicles: {
      universal: true
    },
    compatibilityRules: 'Requires custom trunk tank mounting and air line routing away from hot exhaust pipes.',
    material: 'Billet Aluminum Endcaps & Reinforced Synthetic Rubber Bellows',
    estimatedPrice: {
      minUSD: 4500,
      maxUSD: 5300,
      displayUSD: '$4,500 – $5,300'
    },
    installationEstimate: {
      hours: 8.5,
      estimatedLaborUSD: 1275,
      difficulty: 'professional_required',
      difficultyLabel: 'Professional (Custom Trunk & Plumbing)'
    },
    installationDifficulty: 'professional_required',
    performanceImpact: 'Instant height adjustability from slammed (0mm) to off-road clearance (+50mm).',
    visualAsset: {
      type: 'suspension_stance',
      supported: true,
      rideHeightDrop: 0.05,
      camberDelta: -2.0,
      assetNotice: '3D Preview Active: Slammed Show Stance'
    },
    cameraTarget: 'suspension',
    verificationStatus: 'verification_required',
    beginnerExplanation: 'An air-powered suspension that lets you lower your car all the way to the floor with your smartphone and raise it up at any time to clear steep speed bumps.',
    expertExplanation: 'Combines digital pressure sensors with physical height potentiometers on each lower control arm to dynamically counter passenger weight and cornering roll in real-time.',
    whyUsersInstall: 'Perfect for show builds who refuse to scrape front splitters on steep driveways or parking curbs.'
  },

  // ==========================================
  // 5. PERFORMANCE & POWERTRAIN
  // ==========================================
  {
    id: 'mod-pwr-akrapovic-exhaust',
    name: 'Akrapovič Evolution Titanium Valved Exhaust System',
    category: 'exhaust',
    subCategory: 'Exhaust System',
    brand: 'Akrapovič',
    partNumber: 'S-PO/TI/15H',
    priceUSD: 8650,
    installHours: 3.5,
    powerGainHp: 18,
    weightDeltaKg: -11.4,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Direct bolt-on replacement for factory exhaust headers. Retains factory valve control electronics.',
    description: 'Hand-welded proprietary titanium alloy system featuring integrated sound-valves and lightweight carbon fiber tailpipes with burnt-blue titanium inner sleeves.',
    specifications: {
      'Material': 'Proprietary High-Temperature Titanium Alloy',
      'Weight Savings': '11.4 kg (-44% vs OEM stainless steel)',
      'Power Gain': '+18.2 HP @ 6,800 RPM',
      'Sound Level': 'Valve Closed: 88 dB (Street) / Valve Open: 106 dB (Race)'
    },
    image: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Unlocks a spine-tingling acoustic soundtrack, reduces backpressure for horsepower gains, and trims significant weight from behind the rear axle.',
    supportedVehicles: {
      makes: ['Porsche', 'BMW', 'Audi', 'Toyota'],
      models: ['911 GT3 RS', '718 Cayman GT4 RS', 'M3 Competition', 'M4 Competition', 'RS6 Avant', 'GR Supra'],
      excludedModels: ['Taycan Turbo S']
    },
    compatibilityRules: 'Electric vehicles cannot utilize combustion exhaust systems. Retains factory valve electronic plugs on ICE vehicles.',
    material: 'Aerospace-Grade Titanium & Pre-Preg Matte Carbon Fiber',
    estimatedPrice: {
      minUSD: 8200,
      maxUSD: 9100,
      displayUSD: '$8,200 – $9,100'
    },
    installationEstimate: {
      hours: 3.5,
      estimatedLaborUSD: 525,
      difficulty: 'moderate',
      difficultyLabel: 'Moderate (Valve Actuator Calibration)'
    },
    installationDifficulty: 'moderate',
    performanceImpact: '+18 HP & +22 Nm torque; saves 11.4 kg over rear axle for improved weight distribution.',
    visualAsset: {
      type: 'exhaust',
      supported: true,
      exhaustColor: '#38BDF8',
      exhaustType: 'dual_titanium',
      assetNotice: '3D Preview Active: Titanium Burnt Blue Exhaust Tips'
    },
    cameraTarget: 'exhaust',
    verificationStatus: 'verified',
    beginnerExplanation: 'An ultra-lightweight titanium exhaust that makes the engine sound like a real racing car, with quiet mode for neighborhood cruising and loud mode for track day thrills.',
    expertExplanation: 'Resonator-tuned cross-pipe balances exhaust gas pulses between cylinder banks, optimizing scavenging efficiency and creating an intoxicating high-frequency acoustic howl at 9,000 RPM.',
    whyUsersInstall: 'Unrivaled acoustic signature and substantial weight savings right at the vehicle tail where it benefits inertia the most.',
    featured: true
  },
  {
    id: 'mod-pwr-eventuri-intake',
    name: 'Eventuri Sealed Carbon Fiber Intake System',
    category: 'powertrain',
    subCategory: 'Cold Air Intake',
    brand: 'Eventuri',
    partNumber: 'EVE-CF-INT-V2',
    priceUSD: 2950,
    installHours: 2.0,
    powerGainHp: 24,
    weightDeltaKg: -2.3,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Patented inverted cone venturi housing. Drops intake air temperatures by up to 12°C.',
    description: 'Patent-pending aerodynamic intake housing that acts as a physical venturi funnel, replacing corrugated factory plastic ducting with mirror-finish carbon fiber.',
    specifications: {
      'Airflow Improvement': '+36% CFM over factory airbox',
      'Air Intake Temp': 'Up to 12°C reduction in IAT under continuous load',
      'Filter Element': 'Dry Synthetic High-Flow Cone with Custom Velocity Stack'
    },
    image: 'https://images.unsplash.com/photo-1489824904134-891ab64532f1?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Delivers denser, colder air into the turbochargers/throttle bodies, enhancing throttle response and intake induction sound.',
    supportedVehicles: {
      makes: ['Porsche', 'BMW', 'Audi', 'Toyota'],
      models: ['911 GT3 RS', '718 Cayman GT4 RS', 'M3 Competition', 'M4 Competition', 'RS6 Avant', 'GR Supra'],
      excludedModels: ['Taycan Turbo S']
    },
    compatibilityRules: 'Direct bolt-on into OEM airbox brackets. Incompatible with EV models.',
    material: '100% Pre-Preg Autoclave Carbon Fiber',
    estimatedPrice: {
      minUSD: 2800,
      maxUSD: 3200,
      displayUSD: '$2,800 – $3,200'
    },
    installationEstimate: {
      hours: 2.0,
      estimatedLaborUSD: 300,
      difficulty: 'bolt_on',
      difficultyLabel: 'Direct Bolt-On (1–2 Hours)'
    },
    installationDifficulty: 'bolt_on',
    performanceImpact: '+24 WHP peak power gain with crisper off-idle throttle response.',
    visualAsset: {
      type: 'interior',
      supported: true,
      hasCarbonHood: true,
      assetNotice: '3D Preview Active: Engine Bay Open & Carbon Ducting'
    },
    cameraTarget: 'engine',
    verificationStatus: 'verified',
    beginnerExplanation: 'A beautiful carbon fiber airbox under the hood that feeds cool outside air into the engine, making the car accelerate faster with an awesome induction growl.',
    expertExplanation: 'Eliminates internal turbulence through a reverse-mounted cone filter that transitions laminar airflow smoothly into the turbo compressor inlets.',
    whyUsersInstall: 'Transforms engine bay aesthetics while reliably lowering intake air temperatures.'
  },
  {
    id: 'mod-pwr-pure800-turbo',
    name: 'Pure Turbos Pure800 Stage 2 Hybrid Turbocharger',
    category: 'powertrain',
    subCategory: 'Turbocharger',
    brand: 'Pure Turbos',
    partNumber: 'PT-S58-PURE800',
    priceUSD: 4400,
    installHours: 8.0,
    powerGainHp: 185,
    weightDeltaKg: 0.5,
    compatibilityRating: 'verificationRequired',
    compatibilityNotes: 'Requires ECU tune, upgraded downpipes, and high-flow fuel pump. Compatible only with turbo ICE platforms.',
    description: 'Dual ceramic ball-bearing hybrid turbochargers featuring point-milled billet compressor wheels capable of supporting up to 850 wheel horsepower.',
    specifications: {
      'Compressor Wheel': 'Forged Billet 7+7 Blade Extended Tip Geometry',
      'Turbine Wheel': 'High-Flow Inconel 9-Blade Turbine Wheel',
      'Bearing Type': 'Dual Ceramic Ball Bearing with Water-Cooled CHRA',
      'Max Power Support': '850+ WHP on E85 flex-fuel blends'
    },
    image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Massive power multiplier for enthusiasts seeking supercar-slaying straight line acceleration and drag strip dominance.',
    supportedVehicles: {
      makes: ['BMW', 'Toyota', 'Audi'],
      models: ['M3 Competition', 'M4 Competition', 'GR Supra', 'RS6 Avant'],
      generations: ['G80', 'G82', 'A90', 'C8'],
      excludedModels: ['911 GT3 RS', '718 Cayman GT4 RS', 'Taycan Turbo S'],
      requiresECUReflash: true
    },
    compatibilityRules: 'Requires turbocharged engine platform. Incompatible with naturally aspirated GT3 RS and electric Taycan.',
    material: 'Billet Aluminum Compressor & Stainless Steel Hot-Side Housing',
    estimatedPrice: {
      minUSD: 4200,
      maxUSD: 4800,
      displayUSD: '$4,200 – $4,800'
    },
    installationEstimate: {
      hours: 8.0,
      estimatedLaborUSD: 1200,
      difficulty: 'professional_required',
      difficultyLabel: 'Professional (Engine Bay Disassembly & Dyno Tune)'
    },
    installationDifficulty: 'professional_required',
    performanceImpact: '+185 HP to +250 HP on ethanol blends; 100-200 km/h acceleration dropped by 2.2 seconds.',
    visualAsset: {
      type: 'interior',
      supported: true,
      assetNotice: '3D Preview Active: Engine Bay Inspection View'
    },
    cameraTarget: 'engine',
    verificationStatus: 'requires_dyno',
    beginnerExplanation: 'A high-performance racing turbocharger that forces massive amounts of compressed air into the engine to double its passing power.',
    expertExplanation: 'Reduces exhaust manifold backpressure (P2/P1 ratio) at high RPMs, allowing the engine to maintain 28+ PSI of boost without detonating or dropping off power at redline.',
    whyUsersInstall: 'The definitive upgrade for turning sports cars into 800+ horsepower highway rockets.'
  },

  // ==========================================
  // 6. INTERIOR & COCKPIT
  // ==========================================
  {
    id: 'mod-int-recaro-podium',
    name: 'Recaro Podium CF Ultra-Lightweight Bucket Seats',
    category: 'chassis',
    subCategory: 'Performance Seats',
    brand: 'Recaro Automotive',
    partNumber: 'REC-PODIUM-CF',
    priceUSD: 5900,
    installHours: 2.5,
    powerGainHp: 0,
    weightDeltaKg: -24.5,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'FIA 8855-1999 certified and German ABE road-legal. Includes side-mount brackets.',
    description: 'The only carbon fiber monocoque racing bucket seat on the market with combined FIA motorsport certification and street-legal certification.',
    specifications: {
      'Shell Construction': '100% Pre-Preg Carbon Fiber Monocoque',
      'Weight Per Seat': '4.3 kg (bare shell) / 5.9 kg (with upholstery pads)',
      'Certification': 'FIA 8855-1999 & German TÜV / ABE Road Approved',
      'Upholstery': 'Fire-Retardant Breathable Alcantara with Perforated Leather Inserts'
    },
    image: 'https://images.unsplash.com/photo-1541348263662-e0c8de4259ba?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Holds driver firmly in place during 1.5G cornering loads while saving massive weight from heavy electric factory seats.',
    supportedVehicles: {
      universal: true
    },
    compatibilityRules: 'Universal seat shell with vehicle-specific floor rail brackets.',
    material: 'Autoclave Pre-Preg Carbon Fiber & Alcantara',
    estimatedPrice: {
      minUSD: 5600,
      maxUSD: 6400,
      displayUSD: '$5,600 – $6,400'
    },
    installationEstimate: {
      hours: 2.5,
      estimatedLaborUSD: 375,
      difficulty: 'moderate',
      difficultyLabel: 'Moderate (Seat Rail Alignment & Airbag Resistor)'
    },
    installationDifficulty: 'moderate',
    performanceImpact: 'Shaves 24.5 kg total vehicle weight; dramatically lowers driver seated center of mass.',
    handlingImpact: 'Driver feels every micro-slip of the rear tires directly through the carbon seat base.',
    visualAsset: {
      type: 'interior',
      supported: true,
      assetNotice: '3D Preview Active: Cockpit Doors Open & Carbon Buckets'
    },
    cameraTarget: 'interior',
    verificationStatus: 'verified',
    beginnerExplanation: 'Featherweight racing seats made of pure carbon fiber that keep you from sliding around when taking sharp corners.',
    expertExplanation: 'Direct mechanical coupling to the floor pan eliminates polyurethane cushion lag, transmitting chassis yaw and slip angle cues directly to the driver pelvis with zero latency.',
    whyUsersInstall: 'Eliminates fatigue from bracing with knees against the door panel during fast track sessions.'
  },
  {
    id: 'mod-int-omp-alcantara-wheel',
    name: 'OMP Superquadro Motorsport Alcantara Steering Wheel',
    category: 'chassis',
    subCategory: 'Steering Wheel',
    brand: 'OMP Racing',
    partNumber: 'OMP-OD-1990',
    priceUSD: 1450,
    installHours: 2.0,
    powerGainHp: 0,
    weightDeltaKg: -1.8,
    compatibilityRating: 'compatible',
    compatibilityNotes: 'Includes billet quick-release hub and wireless steering button integration for horn and drive modes.',
    description: 'Flat-bottom ergonomic racing wheel wrapped in genuine high-friction Italian Alcantara with a yellow 12 o’clock center reference stripe.',
    specifications: {
      'Diameter': '320mm Flat-Bottom Compact D-Shape',
      'Grip Material': 'Genuine Italian Suede Alcantara with Hand-Stitched Cross-Seams',
      'Core Structure': 'High-Tensile Black Anodized Spoke Framework'
    },
    image: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?auto=format&fit=crop&w=1000&q=80',
    purpose: 'Provides maximum grip with or without racing gloves, smaller diameter for faster steering wheel rotation.',
    supportedVehicles: {
      universal: true
    },
    compatibilityRules: 'Requires vehicle-specific steering boss kit hub adapter.',
    material: 'Anodized Aluminum & Alcantara',
    estimatedPrice: {
      minUSD: 1300,
      maxUSD: 1650,
      displayUSD: '$1,300 – $1,650'
    },
    installationEstimate: {
      hours: 2.0,
      estimatedLaborUSD: 300,
      difficulty: 'moderate',
      difficultyLabel: 'Moderate (Hub Adapter & Wiring)'
    },
    installationDifficulty: 'moderate',
    performanceImpact: '320mm diameter quickens steering ratio feeling by approx. 10%.',
    visualAsset: {
      type: 'interior',
      supported: true,
      assetNotice: '3D Preview Active: Cockpit View'
    },
    cameraTarget: 'interior',
    verificationStatus: 'verified',
    beginnerExplanation: 'A motorsport steering wheel covered in suede with a yellow stripe at the top so you always know where straight-ahead is.',
    expertExplanation: 'High-friction Alcantara prevents glove slippage under high steering torque without requiring death-grip muscle tension, reducing forearm fatigue.',
    whyUsersInstall: 'Provides immediate tactile connection with front wheel steering feedback.'
  }
];
