import type { ContentTree, Sector, Language, SectorContent } from "./types";

const SECTORS: Sector[] = ["Industrial", "Hospitality", "Residential", "Logistics Cluster", "Comercial / Retail", "Hotel", "Truck Center"];
const LANGUAGES: Language[] = ["ES", "EN"];

const buildSectorLang = (lang: Language, sector: Sector): SectorContent => {
  const isES = lang === "ES";

  // Sector-specific framing (subtle hook, shared 10-tab structure)
  const sectorHook = (() => {
    if (sector === "Industrial") {
      return isES
        ? "Foco en activos logísticos e industriales Clase A en Loma Campana, donde el 90% del desarrollo actual es residencial — creando un déficit severo de capacidad industrial."
        : "Focus on Class A logistics and industrial assets in Loma Campana, where 90% of current development is residential — creating a severe deficit in industrial capacity.";
    }
    if (sector === "Hospitality") {
      return isES
        ? "Foco en hospitality de alta rotación para ejecutivos y crews de O&G: hoteles 3-4★, extended stay y servicios F&B alineados al ciclo 24/7 de la cuenca."
        : "Focus on high-turnover hospitality for O&G executives and crews: 3-4★ hotels, extended stay and F&B services aligned with the basin's 24/7 cycle.";
    }
    if (sector === "Residential") {
      return isES
        ? "Foco en vivienda dolarizada para mandos medios y profesionales relocados a Vaca Muerta, con un déficit estructural superior a 8.000 unidades en Añelo + Loma Campana."
        : "Focus on dollarized housing for mid-management and professionals relocating to Vaca Muerta, with a structural deficit of over 8,000 units across Añelo + Loma Campana.";
    }
    if (sector === "Comercial / Retail") {
      return isES
        ? "Foco en locales comerciales y retail para grandes marcas, empresas de servicios petroleros y formatos de conveniencia que atienden a la fuerza laboral de O&G."
        : "Focus on commercial retail spaces for major brands, oil services companies and convenience formats serving the O&G workforce.";
    }
    if (sector === "Hotel") {
      return isES
        ? "Foco en hotel 3-4 estrellas para ejecutivos y crews de O&G que requieren alojamiento nocturno cerca de las operaciones de perforación."
        : "Focus on 3-4 star hotel development for O&G executives and crews requiring nightly accommodation near drilling operations.";
    }
    if (sector === "Truck Center") {
      return isES
        ? "Foco en centros de servicios para camiones (combustible, mantenimiento, descanso, logística) que atenderán el tráfico pesado del nuevo bypass Ruta 7-17 que atraviesa el proyecto."
        : "Focus on truck service centers (fuel, maintenance, rest areas, logistics) serving the heavy vehicle traffic through the new Route 7-17 bypass directly through the project.";
    }
    return isES
      ? "Foco en el cluster logístico multimodal: convergencia de rutas, ferrocarril, aeropuerto de carga y warehousing Clase A en un único nodo regional."
      : "Focus on the multimodal logistics cluster: convergence of road, rail, cargo airport and Class A warehousing in a single regional node.";
  })();

  return {
    tab1: {
      title: isES ? "Introducción" : "Intro",
      isVisible: true,
      execSummary: {
        title: isES ? "Resumen Ejecutivo" : "Executive Summary",
        isVisible: true,
        text: isES
          ? `Distrito Energético representa una oportunidad única para invertir en infraestructura crítica en el epicentro de Vaca Muerta, la segunda reserva de gas no convencional más grande del mundo. ${sectorHook}\n\nPara 2026, el nuevo bypass de la Ruta 7-17 canalizará el 95% de todo el tráfico de equipo pesado directamente a través del proyecto. Con una producción proyectada a aumentar 2,6x para 2030, la demanda de infraestructura logística, residencial y de servicios nunca ha sido tan urgente.\n\nLa estructura del vehículo es 100% respaldada por activos físicos dolarizados (escritura o fideicomiso auditado por Big 4), ofreciendo ingresos en USD, cobertura cambiaria natural y múltiples puntos de salida: alquiler, venta institucional o re-financiamiento.`
          : `Distrito Energético represents a unique opportunity to invest in critical infrastructure at the epicenter of Vaca Muerta, the world's second-largest non-conventional gas reserve. ${sectorHook}\n\nBy 2026, the new Route 7-17 bypass will funnel 95% of all heavy equipment traffic directly through the project site. With production projected to grow 2.6x by 2030, demand for logistics, residential and service infrastructure has never been more urgent.\n\nThe vehicle is 100% backed by dollarized physical assets (titled land or Big-4 audited trust), delivering USD income, natural FX hedge and multiple exit points: lease, institutional sale or refinancing.`,
      },
      thesis: {
        title: isES ? "Tesis de Inversión" : "Investment Thesis",
        isVisible: true,
        text: isES
          ? "La tesis central se apoya en tres pilares:\n\n1. Cuello de Botella de Infraestructura — La capacidad logística está saturada. El Tren Norpatagónico y el Aeropuerto de Carga crearán un nodo de convergencia multimodal que no existe en ningún otro punto de la cuenca.\n\n2. Escasez de Activos Clase A — Casi no existe oferta industrial, hotelera o residencial premium. Los operadores utilizan hoy instalaciones ineficientes a 60-120 km del pad de perforación, con sobre-costos logísticos del 30-40%.\n\n3. Vientos de Cola Regulatorios — Alineación estratégica con el objetivo nacional de USD 25.000 M/año en exportaciones de hidrocarburos, RIGI activo y régimen de promoción a la construcción industrial."
          : "The core thesis rests on three pillars:\n\n1. Infrastructure Bottleneck — Logistics capacity is saturated. The Norpatagónico Train and Cargo Airport will create a multimodal convergence node that does not exist anywhere else in the basin.\n\n2. Class A Asset Scarcity — There is almost no Class A industrial, hospitality or premium residential supply. Operators currently rely on inefficient facilities 60-120 km from the drilling pad, with 30-40% logistics cost overruns.\n\n3. Regulatory Tailwinds — Strategic alignment with the national USD 25B/year hydrocarbon export goal, active RIGI regime and federal incentives for industrial construction.",
      },
    },

    // Sector-specific financial reference numbers
    const entryTicket = sector === "Comercial / Retail" ? "USD 300K" : sector === "Hotel" ? "USD 800K" : sector === "Truck Center" ? "USD 400K" : "USD 500K";
    const irrRental = sector === "Comercial / Retail" ? "14.0%" : sector === "Hotel" ? "16.0%" : sector === "Truck Center" ? "18.0%" : "15.0%";
    const irrSale = sector === "Comercial / Retail" ? "18.0%" : sector === "Hotel" ? "22.0%" : sector === "Truck Center" ? "24.0%" : "18.5%";
    const roiRental = sector === "Comercial / Retail" ? "2.1x" : sector === "Hotel" ? "2.5x" : sector === "Truck Center" ? "2.8x" : "2.4x";
    const roiSale = sector === "Comercial / Retail" ? "2.6x" : sector === "Hotel" ? "3.2x" : sector === "Truck Center" ? "3.5x" : "2.9x";

    tab2: {
      title: isES ? "Visión General" : "Overview",
      isVisible: true,
      packages: {
        title: isES ? "Opciones de Paquetes de Inversión" : "Investment Package Options",
        isVisible: true,
        items: {
          virginLand: {
            isVisible: true,
            name: isES ? "Tierra Virgen" : "Virgin Land",
            multiplier: "1x base",
            desc: isES
              ? "Lote industrial crudo, titulado, listo para desarrollo a medida del inversor."
              : "Raw, titled industrial plot ready for full custom development by the investor.",
            ownership: isES ? "Dominio directo (Escritura)" : "Direct land ownership (Escritura)",
            includes: isES
              ? "Título de tierra registrado\nAcceso básico al sitio\nDelimitación y mensura"
              : "Registered land title\nBasic site access\nBoundary survey",
            excludes: isES
              ? "Conexión de servicios (agua, energía, gas)\nObras civiles\nConstrucción"
              : "Utilities hookup (water, power, gas)\nCivil works\nBuilding construction",
          },
          landServices: {
            isVisible: true,
            name: isES ? "Tierra + Servicios" : "Land + Services",
            multiplier: "1.25x base",
            desc: isES
              ? "Lote totalmente servido y zonificado, listo para iniciar construcción."
              : "Fully serviced and zoned plot ready to begin construction immediately.",
            ownership: isES ? "Dominio directo (Escritura)" : "Direct land ownership (Escritura)",
            includes: isES
              ? "Título registrado\nCertificación de zonificación I2\nAcceso pavimentado\nConexión de agua, energía y gas\nDrenaje pluvial"
              : "Registered title\nI2 zoning certification\nPaved site access\nWater, power and gas hookup\nStormwater drainage",
            excludes: isES
              ? "Construcción del edificio\nFit-out interior"
              : "Building construction\nInterior fit-out",
          },
          turnkey: {
            isVisible: true,
            name: isES ? "Nave Llave en Mano" : "Turnkey Warehouse",
            multiplier: "1.8x base",
            desc: isES
              ? "Nave industrial Clase A construida y entregada lista para operar, con muelles y oficinas."
              : "Class A industrial warehouse, built and delivered ready to operate, with loading docks and offices.",
            ownership: isES ? "Participación en Fideicomiso o Dominio Directo" : "Direct ownership or trust participation",
            includes: isES
              ? "Todo lo anterior\nNave 1.000–2.000 m²\nAltura libre 12 m\nMuelles de carga niveladores\nOficinas administrativas\nSistema contra incendios NFPA"
              : "All of the above\n1,000–2,000 sqm warehouse\n12 m clear height\nDock levelers\nAdministrative offices\nNFPA fire system",
            excludes: isES ? "Equipamiento operativo del inquilino" : "Tenant operational equipment",
          },
          custom: {
            isVisible: true,
            name: isES ? "A Medida" : "Custom Package",
            multiplier: isES ? "Variable" : "Variable",
            desc: isES
              ? "Combinación a medida de tierra, servicios y construcción, con estructura legal negociable."
              : "Tailor any combination of land, services and construction, with negotiable legal structure.",
            ownership: isES ? "Estructura negociable (directa o fiduciaria)" : "Negotiable structure (direct or trust)",
            includes: isES
              ? "Mix flexible de tierra, servicios y obra\nModelos fiduciarios o de dominio directo\nCo-inversión con el sponsor"
              : "Flexible mix of land, services and construction\nTrust or direct ownership models\nCo-investment with sponsor",
            excludes: "-",
          },
        },
      },
      dashboard: {
        title: isES ? "Estrategia de Salida de Inversión" : "Investment Exit Strategy",
        isVisible: true,
        entryTicket: entryTicket,
        irrRental: irrRental,
        roiRental: "32%",
        irrSale: "20.3%",
        roiSale: "51%",
        term: isES ? "36 meses" : "36 months",
      },
      faq: {
        title: isES ? "FAQ Crítico para Inversores" : "Critical Investor FAQ",
        isVisible: true,
        items: [
          {
            isVisible: true,
            q: isES ? "¿Por qué Loma Campana es la ubicación estratégica?" : "Why is Loma Campana the strategic location?",
            a: isES
              ? "Es el epicentro geográfico de Vaca Muerta y el único punto donde convergen el nuevo bypass de Rutas 7 y 17, el Tren Norpatagónico y el futuro Aeropuerto de Carga. Esto la convierte en la única zona donde la infraestructura multimodal está garantizada por inversión pública y privada simultánea."
              : "It is the geographic epicenter of Vaca Muerta and the only point where the new Route 7 & 17 bypass, the Norpatagónico Train and the future Cargo Airport converge. This makes it the only area where multimodal infrastructure is locked in by both public and private investment.",
          },
          {
            isVisible: true,
            q: isES ? "¿Qué hace que esto esté respaldado por activos?" : "What makes this asset-backed?",
            a: isES
              ? "Cada inversión está garantizada por terrenos industriales titulados a nombre del inversor (escritura) o vía fideicomiso auditado por una firma Big 4. No hay deuda apalancada sobre el activo subyacente."
              : "Every investment is secured by titled industrial land registered in the investor's name (escritura) or via a Big-4 audited trust. There is no leveraged debt on the underlying asset.",
          },
          {
            isVisible: true,
            q: isES ? "¿Cómo se justifica el TIR del 15%?" : "How is the 15% IRR justified?",
            a: isES
              ? "Por ingresos de alquiler de naves Clase A con contratos dolarizados a 5-10 años indexados, sumado a la apreciación de la tierra (+18-22% anual histórico en la zona) y opciones de salida institucional al cierre del ciclo."
              : "Through rental income from Class A warehouses with 5-10 year dollarized contracts (indexed), plus land appreciation (+18-22% historical annual in the area) and institutional exit options at cycle close.",
          },
          {
            isVisible: true,
            q: isES ? "¿Qué pasa si cae el precio del petróleo?" : "What if the oil price drops?",
            a: isES
              ? "Vaca Muerta tiene un breakeven entre USD 35-45/bbl, muy por debajo del precio internacional actual. Incluso en escenarios de stress, los contratos de alquiler dolarizados ya están firmados y el activo físico mantiene valor residual."
              : "Vaca Muerta has a USD 35-45/bbl breakeven, well below current international prices. Even under stress scenarios, dollarized lease contracts are already signed and the physical asset retains residual value.",
          },
        ],
      },
    },

    tab3: {
      title: isES ? "Ubicación" : "Location",
      isVisible: true,
      funnel: {
        isVisible: true,
        title: isES ? "El Embudo de Tráfico 2026" : "The 2026 Traffic Funnel",
        text: isES
          ? "Para 2026, la nueva rotonda de las Rutas 7 y 17 canalizará el 95% del tráfico pesado de Vaca Muerta a través del sitio Distrito Energético. Hoy ese tráfico ya supera los 15.000 vehículos/día y se proyecta a 30.000 vehículos/día en 2028, lo que convierte al proyecto en un cuello de botella natural de la cadena logística regional."
          : "By 2026, the new Route 7 & 17 roundabout will funnel 95% of Vaca Muerta's heavy equipment traffic through the Distrito Energético site. That traffic already exceeds 15,000 vehicles/day and is projected to reach 30,000 vehicles/day by 2028, making the project a natural bottleneck in the regional supply chain.",
      },
      epicenter: {
        isVisible: true,
        title: isES ? "Epicentro Loma Campana" : "Loma Campana Epicenter",
        text: isES
          ? "El sitio está rodeado por operaciones de YPF, Chevron, Shell, ExxonMobil, Pan American Energy y Tecpetrol — los seis mayores operadores de la cuenca. Esta densidad operativa única en Argentina genera demanda inelástica de servicios logísticos, hoteleros y residenciales."
          : "The site is surrounded by YPF, Chevron, Shell, ExxonMobil, Pan American Energy and Tecpetrol operations — the six largest operators in the basin. This operational density (unique in Argentina) generates inelastic demand for logistics, hospitality and residential services.",
      },
      proximity: {
        isVisible: true,
        title: isES ? "Proximidad Industrial" : "Industrial Proximity",
        text: isES
          ? "Conectividad de última milla a plantas de procesamiento de arena, talleres de fractura, pads de perforación y centros de tratamiento de crudo. Distancia promedio al pad: 8-12 km versus 60-120 km de las alternativas actuales."
          : "Zero-last-mile connectivity to sand processing plants, frac shops, drilling pads and crude treatment centers. Average distance to pad: 8-12 km versus 60-120 km for current alternatives.",
      },
    },

    tab4: {
      title: isES ? "Hub Multimodal" : "Multimodal Hub",
      isVisible: true,
      intro: {
        isVisible: true,
        title: isES ? "¿Por qué este Proyecto es Indispensable?" : "Why This Project is Indispensable",
        text: isES
          ? "En el sector inmobiliario industrial, la conectividad es el principal motor de apreciación de la tierra. Al integrar los cuatro modos de transporte — ferrocarril, ruta, aéreo y almacenamiento — Distrito Energético se transforma en un activo de infraestructura crítica regional, no solo en un parque industrial más."
          : "In industrial real estate, connectivity is the primary driver of land appreciation. By integrating all four modes of transport — rail, road, air and warehousing — Distrito Energético becomes a regionally critical infrastructure asset, not just another industrial park.",
      },
      pillars: {
        isVisible: true,
        title: isES ? "Convergencia Multimodal: Arquitectura Hub & Spoke" : "Multimodal Convergence: Hub & Spoke Architecture",
        rail: {
          isVisible: true,
          title: isES ? "El Pilar Ferroviario" : "The Rail Pillar",
          sub: "Tren Norpatagónico",
          stat: isES ? "1 tren = 120 camiones" : "1 train = 120 trucks",
          details: isES
            ? "Acceso directo a las vías, capacidad de carga a granel para arena de fractura y tubulares, reducción del 30-40% en costos logísticos punta a punta vs camión."
            : "Direct rail access, bulk capacity for frac sand and tubulars, 30-40% logistics cost reduction end-to-end vs trucking.",
        },
        aviation: {
          isVisible: true,
          title: isES ? "El Pilar de Aviación" : "The Aviation Pillar",
          sub: isES ? "Aeropuerto de Carga y Helipuerto" : "Cargo Airport & Heliport",
          stat: isES ? "Entrega Just-in-Time" : "Just-in-Time delivery",
          details: isES
            ? "Pista de 2.200 m con capacidad Boeing 737-F, helipuerto certificado, hangares de mantenimiento y rampa para vuelos ejecutivos corporativos."
            : "2,200 m runway with Boeing 737-F capacity, certified heliport, maintenance hangars and corporate executive flight apron.",
        },
        road: {
          isVisible: true,
          title: isES ? "El Pilar de Rutas y Transferencia" : "The Road & Transfer Pillar",
          sub: isES ? "El Cuello de Botella 2026" : "The 2026 Squeeze",
          stat: isES ? "Convergencia obligatoria" : "Mandatory convergence",
          details: isES
            ? "Capacidad diseñada para 30.000 vehículos/día, patios de cross-docking, balanzas, control de acceso 24/7 y áreas de descanso para choferes."
            : "Designed capacity for 30,000 vehicles/day, cross-docking yards, weighbridges, 24/7 access control and driver rest areas.",
        },
        warehousing: {
          isVisible: true,
          title: isES ? "El Pilar de Almacenamiento" : "The Warehousing Pillar",
          sub: isES ? "Unidades Industriales Clase A" : "Class A Industrial Units",
          stat: isES ? "Vida útil 20+ años" : "20+ year design life",
          details: isES
            ? "Carga de losa 7-10 ton/m², altura libre 12 m, muelles niveladores, sprinklers ESFR, energía resiliente (generador + solar) y conectividad fibra óptica."
            : "Slab load 7-10 t/m², 12 m clear height, dock levelers, ESFR sprinklers, resilient power (genset + solar) and fiber connectivity.",
        },
      },
    },

    tab5: {
      title: isES ? "Mercado y Competencia" : "Market & Competitive",
      isVisible: true,
      benchmarks: {
        isVisible: true,
        title: isES ? "Benchmarks de Alquiler — Naves Industriales" : "Industrial Warehouse Rental Benchmarks",
        text: isES
          ? "• Neuquén capital (Clase B existente): USD 12-16 /m²/mes\n• Añelo (oferta informal, sin Clase A): USD 18-22 /m²/mes\n• Distrito Energético — Clase A proyectado (pre-lease): USD 20-28 /m²/mes\n• Benchmark internacional (Permian Basin, TX): USD 24-32 /m²/mes\n\nLa brecha entre la oferta existente y los benchmarks internacionales valida el pricing power del proyecto."
          : "• Neuquén City (existing Class B): USD 12-16 /sqm/month\n• Añelo (informal supply, no Class A): USD 18-22 /sqm/month\n• Distrito Energético — projected Class A (pre-lease): USD 20-28 /sqm/month\n• International benchmark (Permian Basin, TX): USD 24-32 /sqm/month\n\nThe gap between existing supply and international benchmarks validates the project's pricing power.",
      },
      risk: {
        isVisible: true,
        title: isES ? "Mitigación de Riesgos: El 'Foso' (Moat)" : "Risk Mitigation: The 'Moat'",
        items: [
          {
            isVisible: true,
            t: isES ? "Cobertura Cambiaria" : "Currency Hedge",
            d: isES
              ? "Activos 100% físicos dolarizados, contratos de alquiler en USD indexados, exposición cero a inflación en pesos."
              : "100% dollarized physical assets, USD-indexed lease contracts, zero peso inflation exposure.",
          },
          {
            isVisible: true,
            t: isES ? "Mitigación de Ejecución" : "Execution Risk Mitigation",
            d: isES
              ? "Construcción industrial modular pre-fabricada permite despliegue 3-5x más rápido que obra tradicional, con contratos EPC a precio cerrado."
              : "Modular pre-fabricated industrial construction enables 3-5x faster deployment than traditional builds, with fixed-price EPC contracts.",
          },
          {
            isVisible: true,
            t: isES ? "Apoyo Regulatorio" : "Regulatory Support",
            d: isES
              ? "Alineado con el objetivo nacional de USD 25 B/año en exportaciones, RIGI activo y régimen provincial de promoción industrial Neuquén."
              : "Aligned with the national USD 25B/year export goal, active RIGI and Neuquén provincial industrial promotion regime.",
          },
        ],
      },
    },

    tab6: {
      title: isES ? "Modelo Financiero" : "Financial Model",
      isVisible: true,
      timeline: {
        isVisible: true,
        title: isES ? "Cronograma de Desarrollo y Puntos de Salida" : "Development Timeline & Exit Points",
        phases: [
          {
            isVisible: true,
            name: isES ? "Fase 1 — Adquisición" : "Phase 1 — Land Acquisition",
            desc: isES
              ? "Meses 0-3. Adquisición de propiedad titulada, due diligence ambiental y zonificación I2 confirmada."
              : "Months 0-3. Secure titled property, environmental due diligence and confirmed I2 zoning.",
          },
          {
            isVisible: true,
            name: isES ? "Fase 2 — Infraestructura" : "Phase 2 — Service Infrastructure",
            desc: isES
              ? "Meses 4-12. Tendido de energía media tensión, agua, gas, accesos pavimentados y drenaje pluvial."
              : "Months 4-12. Medium-voltage power, water, gas, paved access and stormwater drainage.",
          },
          {
            isVisible: true,
            name: isES ? "Fase 3 — Construcción" : "Phase 3 — Construction",
            desc: isES
              ? "Meses 12-24. Construcción modular de naves Clase A, muelles, oficinas y sistema contra incendios."
              : "Months 12-24. Modular construction of Class A warehouses, docks, offices and fire system.",
          },
          {
            isVisible: true,
            name: isES ? "Fase 4 — Salida" : "Phase 4 — Exit",
            desc: isES
              ? "Meses 24-36. Venta institucional, recolocación del activo o continuidad de renta dolarizada según preferencia del inversor."
              : "Months 24-36. Institutional sale, asset recycling or continued dollarized rental income per investor preference.",
          },
        ],
      },
      protection: {
        isVisible: true,
        title: isES ? "Protección de Capital" : "Capital Protection",
        text: isES
          ? "Vehículo fiduciario profesionalmente administrado, con marco de auditoría Big 4 (KPMG / Deloitte / EY / PwC), reporting trimestral, valuación independiente anual y comité de inversores con poder de veto sobre decisiones materiales."
          : "Professionally managed trust vehicle, Big 4 audit framework (KPMG / Deloitte / EY / PwC), quarterly reporting, annual independent valuation and investor committee with veto power over material decisions.",
      },
    },

    tab7: {
      title: isES ? "Uso de Suelo y Métricas" : "Land Use & Metrics",
      isVisible: true,
      metrics: {
        isVisible: true,
        title: isES ? "Métricas Clave de Edificabilidad" : "Key Land Metrics",
        fos: {
          isVisible: true,
          val: "0.70",
          label: "F.O.S.",
          desc: isES
            ? "Factor de Ocupación del Suelo — cobertura máxima a nivel de planta baja: 70% del lote."
            : "Floor Occupation Factor — maximum ground-level coverage: 70% of the plot.",
        },
        fot: {
          isVisible: true,
          val: "1.40",
          label: "F.O.T.",
          desc: isES
            ? "Factor de Ocupación Total — superficie total construible: 140% del lote (multinivel admitido en sectores de oficinas)."
            : "Total Occupation Factor — total buildable area: 140% of the plot (multi-level allowed in office areas).",
        },
      },
      specs: {
        isVisible: true,
        title: isES ? "Especificaciones Físicas" : "Physical Specifications",
        text: isES
          ? "Zonificación: I2 (Industrial Pesado).\nAltura máxima: 8-10 m a alero, 14 m a cumbrera.\nCarga de losa: 5 ton/m² piso terminado.\nRetiros: 5 m frente, 3 m laterales.\nEstacionamiento: 1 plaza / 100 m² construido.\nÁrea verde mínima: 10% del lote.\nCarga eléctrica disponible: hasta 1 MW por lote (ampliable)."
          : "Zoning: I2 (Heavy Industrial).\nMaximum height: 8-10 m to eaves, 14 m to ridge.\nSlab load: 5 t/m² finished floor.\nSetbacks: 5 m front, 3 m sides.\nParking: 1 space / 100 sqm built.\nMinimum green area: 10% of plot.\nAvailable electrical capacity: up to 1 MW per plot (expandable).",
      },
    },

    tab8: {
      title: "Partnership",
      isVisible: true,
      mixer: {
        isVisible: true,
        title: isES ? "Partnership Estratégico" : "Strategic Partnership",
        text: isES
          ? "Reduzca la barrera financiera de entrada aportando equipamiento, capacidad de construcción, contratos de off-take o acceso a clientes ancla. Estos aportes se valúan a mercado y se convierten en equity dentro del vehículo, permitiendo participación desde USD 100K efectivos cuando se combinan con aportes operativos.\n\nPerfiles bienvenidos: EPCs locales, operadores logísticos, brokers inmobiliarios con cartera de inquilinos O&G, y proveedores de servicios para la cuenca."
          : "Reduce the financial entry barrier by contributing equipment, construction capacity, off-take contracts or anchor-client access. These contributions are valued at market and converted into equity inside the vehicle, enabling participation from USD 100K cash when combined with operational contributions.\n\nWelcome profiles: local EPCs, logistics operators, real estate brokers with O&G tenant book, and basin service providers.",
      },
    },

    tab9: {
      title: "LOI",
      isVisible: true,
      builder: {
        isVisible: true,
        title: isES ? "Resumen de Inversión / Carta de Intención" : "Investment Summary / Letter of Intent",
        investorName: isES ? "[Nombre del Inversor / Vehículo]" : "[Investor Name / Vehicle]",
        entryAmount: "500000",
        structure: isES ? "Fideicomiso (Trust)" : "Trust (Fideicomiso)",
        package: isES ? "Nave Llave en Mano" : "Turnkey Warehouse",
      },
    },

    tab10: {
      title: isES ? "Contexto" : "Context",
      isVisible: true,
      data: {
        isVisible: true,
        title: isES ? "Inteligencia de Mercado — Vaca Muerta" : "Market Intelligence — Vaca Muerta",
        items: [
          {
            isVisible: true,
            cat: "Oil & Gas",
            label: isES ? "Producción de crudo no convencional" : "Unconventional crude production",
            current: isES ? "400.000 bbl/d" : "400,000 bbl/d",
            proj: isES ? "1.000.000 bbl/d (2030)" : "1,000,000 bbl/d (2030)",
          },
          {
            isVisible: true,
            cat: "Oil & Gas",
            label: isES ? "Producción de gas no convencional" : "Unconventional gas production",
            current: "85 MMm³/d",
            proj: "180 MMm³/d (2030)",
          },
          {
            isVisible: true,
            cat: "Logistics",
            label: isES ? "Tráfico diario de camiones (Ruta 7)" : "Daily truck traffic (Route 7)",
            current: isES ? "15.000 veh/día" : "15,000 veh/day",
            proj: isES ? "30.000 veh/día (2028)" : "30,000 veh/day (2028)",
          },
          {
            isVisible: true,
            cat: "Logistics",
            label: isES ? "Demanda de arena de fractura" : "Frac sand demand",
            current: "8 Mt/año",
            proj: "22 Mt/año (2030)",
          },
          {
            isVisible: true,
            cat: "Real Estate",
            label: isES ? "Déficit de naves Clase A" : "Class A warehouse deficit",
            current: isES ? "~250.000 m²" : "~250,000 sqm",
            proj: isES ? "~700.000 m² (2028)" : "~700,000 sqm (2028)",
          },
          {
            isVisible: true,
            cat: "Real Estate",
            label: isES ? "Déficit de vivienda dolarizada" : "Dollarized housing deficit",
            current: isES ? "~8.000 unidades" : "~8,000 units",
            proj: isES ? "~15.000 unidades (2030)" : "~15,000 units (2030)",
          },
          {
            isVisible: true,
            cat: "Macro",
            label: isES ? "Exportaciones de hidrocarburos AR" : "AR hydrocarbon exports",
            current: "USD 7 B",
            proj: "USD 25 B (2030)",
          },
          {
            isVisible: true,
            cat: "Macro",
            label: isES ? "Inversión CAPEX anual cuenca" : "Annual basin CAPEX",
            current: "USD 8 B",
            proj: "USD 15 B (2027)",
          },
        ],
      },
    },
  };
};

export const createDefaultContent = (): ContentTree => {
  const data = {} as ContentTree;
  SECTORS.forEach((s) => {
    data[s] = {} as Record<Language, SectorContent>;
    LANGUAGES.forEach((l) => {
      data[s][l] = buildSectorLang(l, s);
    });
  });
  return data;
};

export const TAB_KEYS = ["tab1", "tab2", "tab3", "tab4", "tab5", "tab6", "tab7", "tab8", "tab9", "tab10"] as const;
export const SECTORS_LIST = SECTORS;
export const LANGUAGES_LIST = LANGUAGES;
