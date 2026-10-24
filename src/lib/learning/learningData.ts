import { LearningArticle } from '../../types/learning';

export const LEARNING_ARTICLES: LearningArticle[] = [
  {
    id: 'learn-wheel-offset',
    slug: 'wheel-offset-and-scrub-radius',
    title: 'Wheel Offset, Backspacing & Scrub Radius Explained',
    category: 'WHEELS & TYRES',
    difficulty: 'Beginner',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1578844251758-2f71da64c96f?auto=format&fit=crop&w=1000&q=80',
    summary: 'Wheel offset describes how far the wheel mounting pad sits relative to the true centerline. It dictates fender clearance, inner strut clearance, and steering scrub radius.',
    beginnerContent: {
      plainLanguageExplanation: 'Offset (measured as "ET" in millimeters) tells you whether a wheel pokes out towards the fender or tucks inward towards the brakes and suspension. A positive offset pushes the spokes outward and the wheel inward; a lower or negative offset pushes the wheel outward towards the street.',
      analogy: 'Imagine carrying two heavy grocery bags right next to your hips versus holding them with your arms spread wide. Changing offset changes the leverage point where your tire contacts the pavement.',
      whyItMatters: [
        'Preventing rubbing on fender liners or suspension coils during full steering lock',
        'Ensuring your tires remain tucked within legal bodywork guidelines',
        'Maintaining predictable steering feedback over bumps without nervous tramlining'
      ],
      thingsToWatch: [
        'Never choose offset based purely on aesthetics without measuring brake caliper clearance',
        'Aggressive low offset changes scrub radius, making the car pull under hard braking',
        'Wider wheels need carefully calculated offsets to avoid rubbing inner dampers'
      ]
    },
    enthusiastContent: {
      engineeringDynamics: 'Offset directly determines the scrub radius—the distance at ground level between the Kingpin Inclination Axis (KPI) and the center of the tire contact patch. OEM engineers typically tune for zero or slightly negative scrub radius on front-wheel/all-wheel-drive platforms to stabilize torque steer.',
      geometryAndDimensions: 'Formula: Backspacing = (Wheel Width + 1.0 inch) / 2 + (Offset / 25.4). When stepping up from an 8.5J ET45 to a 9.5J ET35, outer wheel face extends by 23mm, while inner clearance reduces by 3mm.',
      thermalAndMechanicalStresses: 'Drastic negative scrub adjustments increase hub bearing radial shear loads and amplify kickback forces through the steering rack under single-wheel curb strikes.',
      supportingModifications: ['Adjustable camber plates to tuck tire tops', 'Rolled inner fender lips', 'High-tensile extended wheel studs'],
      tuningParameters: ['Scrub Radius (target -2mm to +8mm)', 'Kingpin Inclination (KPI)', 'Caster trail angle']
    },
    relatedMarketplaceCategory: 'WHEELS',
    buildComponentTags: ['wheel', 'wheels', 'forged', 'rim', 'tire', 'tyre', 'offset']
  },
  {
    id: 'learn-coilovers-vs-springs',
    slug: 'coilovers-vs-lowering-springs',
    title: 'Dual-Flow Coilovers vs Lowering Springs: Damping & Pitch',
    category: 'SUSPENSION',
    difficulty: 'Enthusiast',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=1000&q=80',
    summary: 'Understanding how independent preload, height adjustment, and dual-flow valving control chassis pitch, body roll, and tire contact patch continuity.',
    beginnerContent: {
      plainLanguageExplanation: 'Lowering springs simply shorten the suspension stroke, often leaving the factory shock absorber working outside its optimal travel range. Coilovers are matched, integrated shock-and-spring units designed to lower the vehicle while retaining controlled damping and bump-stop clearance.',
      analogy: 'Installing lowering springs on factory shocks is like wearing running shoes that are two sizes too small—you are closer to the ground, but you lose your natural cushion on impact.',
      whyItMatters: [
        'Coilovers let you corner harder without bottoming out the chassis',
        'Adjustable ride height lets you eliminate unsightly wheel gap while preserving travel',
        'Damping adjusters allow you to soften the ride for street commuting and stiffen it for track days'
      ],
      thingsToWatch: [
        'Avoid lowering the car so much that the lower control arms point upward, which ruins roll center',
        'Always get a laser four-wheel alignment immediately after height adjustment',
        'Coilover spherical pillowball mounts transmit more road noise than rubber OEM bushings'
      ]
    },
    enthusiastContent: {
      engineeringDynamics: 'Coilover systems like Öhlins DFV (Dual Flow Valve) feature high-speed internal blow-off shims. Under rapid piston acceleration (potholes/curbs), secondary fluid channels open instantly, maintaining contact patch compliance rather than skipping.',
      geometryAndDimensions: 'Lowering center of gravity (CoG) reduces steady-state lateral weight transfer: ΔW = (Weight × Lateral Accel × CoG Height) / Track Width. However, excessive drop drops the roll center faster than CoG, increasing roll moment arm.',
      thermalAndMechanicalStresses: 'Monotube dampers feature floating gas pistons with 20+ bar nitrogen charge, preventing cavitation and aeration of damper fluid under sustained 20-minute track sessions.',
      supportingModifications: ['Roll-center correction ball joints', 'Adjustable front endlinks', 'Corner balancing scale setup'],
      tuningParameters: ['Low-speed rebound clicks (transient roll)', 'High-speed compression blow-off', 'Spring rate frequency (1.8–2.2 Hz target for street/track)']
    },
    relatedMarketplaceCategory: 'SUSPENSION',
    buildComponentTags: ['coilover', 'coilovers', 'suspension', 'spring', 'damper', 'strut', 'ohlins', 'kw']
  },
  {
    id: 'learn-brake-fade-bbk',
    slug: 'brake-thermal-fade-and-bbk-clearance',
    title: 'Brake Thermal Fade, Caliper Piston Area & BBK Clearance',
    category: 'BRAKES',
    difficulty: 'Enthusiast',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=1000&q=80',
    summary: 'Why bigger rotors stop fade rather than stopping distances, and how hydraulic piston volumetric sizing affects master cylinder pedal feel.',
    beginnerContent: {
      plainLanguageExplanation: 'Brakes convert your car kinetic speed into raw heat. On a single stop from highway speed, your factory brakes work fine. But on track or aggressive mountain descents, small rotors heat soak, causing fluid to boil and pads to glaze—a dangerous condition called brake fade.',
      analogy: 'Think of a brake rotor as an iron frying pan. A tiny thin pan gets smoking hot in seconds and burns everything; a thick heavy cast-iron skillet absorbs and radiates heat evenly without warping.',
      whyItMatters: [
        'Consistent pedal firmness from lap 1 to lap 20 without mushy travel',
        'Two-piece floating rotors allow iron rings to expand radially without cracking hats',
        'High-friction compound pads grip instantly across wide 200°C–700°C operating windows'
      ],
      thingsToWatch: [
        'A Big Brake Kit (BBK) requires wheel spoke clearance—standard rims will often hit the caliper without spacers',
        'Racing pads make squealing brake dust and need heat before they bite properly',
        'Changing caliper piston sizes without checking brake bias can trigger early ABS activation'
      ]
    },
    enthusiastContent: {
      engineeringDynamics: 'Stopping distance in a single emergency stop is 100% limited by tire longitudinal adhesion coefficient (μ), not caliper clamping force. A BBK increases thermal sink mass (Joules = 0.5 × m × v²) and convective airflow via directional curved vanes.',
      geometryAndDimensions: 'Rotor diameter increases torque leverage: Torque = 2 × μ_pad × Clamping Force × Effective Radius. Total piston area must closely match OEM master cylinder displacement to prevent extended pedal stroke.',
      thermalAndMechanicalStresses: 'Cast iron disc rotor temps easily exceed 650°C. Two-piece hats use 7075-T6 aluminum with stainless drive bobbins to decouple thermal growth and prevent coning/pulsation.',
      supportingModifications: ['High-boiling-point DOT 4 / 5.1 racing fluid (320°C dry)', 'Stainless braided PTFE brake lines', 'Brake cooling ducting'],
      tuningParameters: ['Front-to-rear hydraulic brake bias percentage', 'Brake pedal leverage ratio', 'Pad friction coefficient (μ 0.45–0.55)']
    },
    relatedMarketplaceCategory: 'BRAKES',
    buildComponentTags: ['brake', 'brakes', 'caliper', 'rotor', 'pad', 'brembo', 'ap racing', 'bbk']
  },
  {
    id: 'learn-ecu-tuning-knock',
    slug: 'ecu-remapping-air-fuel-ratios-knock',
    title: 'ECU Remapping, Air-Fuel Ratios & Acoustic Knock Safeguards',
    category: 'TUNING',
    difficulty: 'Master',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1000&q=80',
    summary: 'How modern engine management balances spark advance, target boost, and stoichiometric lambda while managing knock sensor frequency thresholds.',
    beginnerContent: {
      plainLanguageExplanation: 'An ECU (Engine Control Unit) is the computer brain controlling how much air, fuel, and spark ignite inside each engine cylinder. An ECU tune unlocks hidden power by optimizing factory conservative timing maps designed for low-octane third-world fuel.',
      analogy: 'Factory ECU software is like a treadmill set to a gentle jog with safety railings; an ECU tune opens up the full athletic sprint suited for clean high-octane fuel.',
      whyItMatters: [
        'Significant horsepower and torque gains, especially on turbocharged and supercharged engines',
        'Sharper throttle response and elimination of electronic drive-by-wire lag',
        'Smooth power delivery matched to your upgraded intake and exhaust hardware'
      ],
      thingsToWatch: [
        'Never run a 93-octane (or 98-RON) Stage 1 tune with low-octane regular pump gas',
        'Cheap off-the-shelf "pop and bang" flame maps destroy catalytic converters and turbo exhaust wheels',
        'Always log engine parameters after flashing to ensure knock retard remains at 0°'
      ]
    },
    enthusiastContent: {
      engineeringDynamics: 'Combustion knock (detonation) is spontaneous secondary auto-ignition occurring prior to flame front arrival. Modern Bosch/Continental ECUs utilize acoustic piezoelectric knock sensors bandpass-filtered to the cylinder resonance frequency: f = (900 × Speed of Sound) / (π × Bore Diameter).',
      geometryAndDimensions: 'Target wide-open-throttle (WOT) lambda for direct-injected turbocharged engines is typically 0.80–0.84 (11.7:1 to 12.3:1 AFR) to provide evaporative charge cooling inside the cylinder bowl.',
      thermalAndMechanicalStresses: 'Advancing ignition timing towards Maximum Brake Torque (MBT) raises peak cylinder cylinder pressure (Pmax) exponentially. Pushing cylinder pressure beyond 160 bar risks bending connecting rods or lifting cylinder head studs.',
      supportingModifications: ['High-flow downpipe', 'Upgraded charge air intercooler', 'High-pressure fuel pump (HPFP)'],
      tuningParameters: ['Ignition advance (° BTDC)', 'Boost pressure target (Absolute Bar)', 'Intake air temperature (IAT) ignition retard table']
    },
    relatedMarketplaceCategory: 'PERFORMANCE',
    buildComponentTags: ['tune', 'ecu', 'reflash', 'chiptuning', 'cobb', 'bm3', 'flash', 'intake', 'exhaust']
  },
  {
    id: 'learn-downpipes-backpressure',
    slug: 'downpipes-and-exhaust-scavenging',
    title: 'Downpipes, Catalytic Converters & Scavenging Backpressure',
    category: 'PERFORMANCE',
    difficulty: 'Enthusiast',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
    summary: 'Debunking the "turbo engines need backpressure" myth: how exhaust pressure delta (P1 vs P2) across the turbine wheel drives boost spool.',
    beginnerContent: {
      plainLanguageExplanation: 'The downpipe connects directly to the exhaust side of your turbocharger. The factory downpipe is heavily restricted by dense ceramic catalytic honeycomb matrices. A high-flow motorsport downpipe lets hot gases exit effortlessly.',
      analogy: 'Blowing through a tiny coffee stirrer versus blowing through a wide smoothie straw. The easier it is for exhaust to rush out, the faster the turbo spins up.',
      whyItMatters: [
        'Dramatic reduction in turbo lag with boost coming on 300–600 RPM earlier',
        'Lower exhaust gas temperatures (EGTs) which protects turbo bearings from cooking',
        'Distinctive, throatier exhaust note with turbo spool whistle'
      ],
      thingsToWatch: [
        'Completely catless downpipes cause noxious chemical fumes and violate road legal emissions in most countries',
        'High-flow 200-cell or 300-cell catalytic converters provide 90% of the flow benefit with zero fuel odor',
        'Requires an ECU remap to prevent a Check Engine Light (CEL) for catalyst efficiency'
      ]
    },
    enthusiastContent: {
      engineeringDynamics: 'Turbochargers thrive on pressure differential: Expansion Ratio = P_turbine_in / P_downpipe_out. Decreasing P_downpipe_out directly increases enthalpy extraction across the turbine, reducing the expansion work needed to compress ambient charge air.',
      geometryAndDimensions: 'Mandrel-bent 3.0" (76mm) or 3.5" (89mm) stainless 304 or titanium piping with smooth 15° cone transitions minimizes boundary layer turbulence and acoustic shear waves.',
      thermalAndMechanicalStresses: 'Pre-turbine EGTs can reach 950°C on track. High-grade thermal ceramic coatings or insulated heat shields are critical to prevent radiating heat into brake master cylinders and wiring harnesses.',
      supportingModifications: ['Motorsport high-temp exhaust gaskets', 'V-band clamp retention', 'Thermal barrier wrap'],
      tuningParameters: ['Wastegate duty cycle (WGDC table)', 'Catalyst over-temperature protection threshold']
    },
    relatedMarketplaceCategory: 'PERFORMANCE',
    buildComponentTags: ['exhaust', 'downpipe', 'akrapovic', 'valvetronic', 'catback', 'muffler', 'titanium']
  },
  {
    id: 'learn-cold-air-intake',
    slug: 'cold-air-intakes-and-maf-calibration',
    title: 'Cold Air Intakes & Mass Airflow (MAF) Calibration',
    category: 'ENGINE',
    difficulty: 'Beginner',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&w=1000&q=80',
    summary: 'Why pulling air from outside the engine bay yields real thermodynamic density gains versus open filter elements sucking hot radiator air.',
    beginnerContent: {
      plainLanguageExplanation: 'An engine is fundamentally an air pump. Colder air is denser, containing more oxygen molecules per cubic foot. A true cold air intake uses a sealed carbon or composite airbox fed by scoops behind the front grille.',
      analogy: 'Imagine breathing in crisp fresh mountain air versus breathing in the hot air blown out of an oven. More oxygen means stronger combustion.',
      whyItMatters: [
        'Noticeable induction intake roar and turbo diverter valve sound',
        'Every 5°C drop in intake air temperature yields roughly 1% more engine power',
        'High-flow multi-layer cotton gauze filters allow less restrictive volumetric airflow'
      ],
      thingsToWatch: [
        'Beware "short ram" open cone filters that sit naked right next to the hot turbo—they often LOSE power due to heat soak',
        'Changing intake tube diameter without an ECU retune causes the MAF sensor to miscalculate fuel, running lean',
        'Ensure the filter is positioned well above standing water levels to eliminate any risk of hydrolock'
      ]
    },
    enthusiastContent: {
      engineeringDynamics: 'Air density follows ideal gas laws: ρ = P / (R × T). Sealed systems preserve dynamic ram-air pressure at vehicle speeds above 100 km/h: P_ram = 0.5 × ρ × v².',
      geometryAndDimensions: 'Venturi airbox designs (e.g. Eventuri) maintain continuous laminar flow vectors without sharp 90° bends that trigger airflow separation and parasitic pumping losses.',
      thermalAndMechanicalStresses: 'Pre-preg carbon fiber composite construction provides an exceptionally low thermal conductivity coefficient (k ≈ 0.8 W/m·K) compared to aluminum intake piping (k ≈ 205 W/m·K).',
      supportingModifications: ['Front grille air scoops', 'Heat-reflective gold foil insulation', 'MAF sensor re-scaling in ECU'],
      tuningParameters: ['MAF voltage vs Grams/Sec transfer curve', 'Charge air intake temperature threshold']
    },
    relatedMarketplaceCategory: 'PERFORMANCE',
    buildComponentTags: ['intake', 'eventuri', 'filter', 'airbox', 'carbon', 'cold air', 'maf']
  },
  {
    id: 'learn-unsprung-weight',
    slug: 'unsprung-weight-and-rotational-inertia',
    title: 'Unsprung Weight & Rotational Inertia: The Multiplier Effect',
    category: 'FUNDAMENTALS',
    difficulty: 'Beginner',
    readTime: '4 min read',
    image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1000&q=80',
    summary: 'Why saving 1 kg of wheel or brake rotor weight has 4 to 8 times the dynamic effect of removing 1 kg from the vehicle chassis or passenger seat.',
    beginnerContent: {
      plainLanguageExplanation: 'Everything supported by the car springs (the body, engine, interior) is sprung weight. Everything below the springs (wheels, tires, brake calipers, hubs) is unsprung weight. Lighter wheels let the suspension react instantly to road imperfections.',
      analogy: 'Imagine running a marathon with 5 kg in a backpack versus running with 2.5 kg weights strapped directly to your shoes. Foot weight tires you out instantly.',
      whyItMatters: [
        'Wheels stay glued to the asphalt over bumpy roads instead of hopping',
        'Noticeably quicker acceleration because the engine spends less energy spinning heavy metal',
        'Much faster steering transitions and turn-in response'
      ],
      thingsToWatch: [
        'Tire weight matters even more than wheel weight because tire mass is situated at the outermost radius',
        'Forged wheels are far stronger and lighter than budget gravity-cast replica wheels',
        'Never compromise structural wheel load ratings just to save a few hundred grams on a heavy car'
      ]
    },
    enthusiastContent: {
      engineeringDynamics: 'Rotational kinetic energy: E = 0.5 × I × ω², where moment of inertia I = m × r². Mass located at the rim barrel (r = 0.25m) carries twice the effective inertia penalty of mass located near the center hub (r = 0.08m).',
      geometryAndDimensions: 'Forged 6061-T6 aerospace aluminum allows thinner spoke cross-sections while withstanding 850 kg radial impact drop tests, saving 3–5 kg per corner over cast alloys.',
      thermalAndMechanicalStresses: 'Lower unsprung mass (M_u) shifts natural suspension resonance frequency upward: f_n = (1 / 2π) × √(k_spring / M_u), keeping damper velocities inside linear valving bands.',
      supportingModifications: ['Forged monoblock wheels', 'Two-piece floating brake rotors with aluminum bells', 'Titanium lug nuts'],
      tuningParameters: ['Corner weight distribution', 'Damper high-speed rebound rate']
    },
    relatedMarketplaceCategory: 'WHEELS',
    buildComponentTags: ['forged', 'wheel', 'wheels', 'bbs', 'rim', 'unsprung', 'lightweight']
  },
  {
    id: 'learn-corner-balancing',
    slug: 'corner-balancing-and-roll-center',
    title: 'Corner Balancing, Ride Height & Roll Center Kinematics',
    category: 'SUSPENSION',
    difficulty: 'Master',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=80',
    summary: 'How individual coilover perch adjustments equalize diagonal cross-weights for symmetrical left and right braking and cornering grip.',
    beginnerContent: {
      plainLanguageExplanation: 'Even if a car looks perfectly level to the eye, weight is never distributed evenly across the four tires. Corner balancing places the car on four electronic scales and adjusts coilover heights until diagonal wheel weights are balanced.',
      analogy: 'Imagine a four-legged dining chair where one leg is 2 millimeters shorter. The chair wobbles between diagonals. Corner balancing makes all four legs press firmly on the floor.',
      whyItMatters: [
        'The car turns left and right with identical grip and steering confidence',
        'Under heavy threshold braking, the rear end stops squirming and drifting sideways',
        'Tire wear is evenly distributed rather than destroying a single corner'
      ],
      thingsToWatch: [
        'Always corner balance with the driver (or ballast weight) seated in the driver seat',
        'Sway bar endlinks must be disconnected during corner balancing to prevent artificial preloading',
        'Setting equal fender heights does NOT mean the car has equal corner weights'
      ]
    },
    enthusiastContent: {
      engineeringDynamics: 'Cross-weight (wedge) percentage formula: Cross% = (Front Right + Rear Left) / Total Vehicle Weight × 100%. Target on sports car chassis is exactly 50.0% with driver ballast and 1/2 tank of fuel.',
      geometryAndDimensions: 'Lowering the chassis lowers instantaneous roll centers faster than the center of gravity (CoG), lengthening the roll moment arm: M_roll = m × a × (h_CoG - h_RC). Roll center correction geometry is required.',
      thermalAndMechanicalStresses: 'Unequal cross weights cause one front tire to lock early under ABS braking, transferring extreme localized thermal friction load to that single contact patch.',
      supportingModifications: ['Adjustable spherical sway bar endlinks', 'Corner weight scale pads with levelers', 'Chassis alignment ballast'],
      tuningParameters: ['Cross weight percentage (50.0% ± 0.2%)', 'Front-to-rear ride height rake angle']
    },
    relatedMarketplaceCategory: 'SUSPENSION',
    buildComponentTags: ['coilover', 'corner balance', 'suspension', 'alignment', 'scale', 'handling']
  }
];
