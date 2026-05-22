// Swiss Canton Subsidy Data for EV Charging Infrastructure
export interface CantonSubsidy {
  id: string;
  name: string;
  nameDE: string;
  nameFR: string;
  nameIT?: string;
  coordinates: [number, number]; // [lat, lng]
  subsidyType: string; // DE
  subsidyTypeEN?: string;
  subsidyTypeFR?: string;
  maxAmount: number;
  amountPerSpace?: number;
  percentageCovered?: number;
  conditions: string[]; // DE
  conditionsEN?: string[];
  conditionsFR?: string[];
  requiresLoadManagement: boolean;
  validityStart?: string;
  validityEnd?: string;
  isActive: boolean;
  officialLink: string;
  heatmapIntensity: number; // 1-10 subsidy strength
  isHomeMarket?: boolean; // Basel = Malim's home market
}

// Helper to get localized conditions
export function getLocalizedConditions(canton: CantonSubsidy, locale: 'en' | 'de' | 'fr'): string[] {
  if (locale === 'fr' && canton.conditionsFR) return canton.conditionsFR;
  if (locale === 'en' && canton.conditionsEN) return canton.conditionsEN;
  return canton.conditions;
}

// Helper to get localized subsidy type
export function getLocalizedSubsidyType(canton: CantonSubsidy, locale: 'en' | 'de' | 'fr'): string {
  if (locale === 'fr' && canton.subsidyTypeFR) return canton.subsidyTypeFR;
  if (locale === 'en' && canton.subsidyTypeEN) return canton.subsidyTypeEN;
  return canton.subsidyType;
}

export const cantonSubsidies: CantonSubsidy[] = [
  {
    id: 'zurich',
    name: 'Zurich',
    nameDE: 'Zürich',
    nameFR: 'Zurich',
    coordinates: [47.3769, 8.5417],
    subsidyType: 'Kollektive/Einfamilienhaus-Infrastruktur',
    subsidyTypeEN: 'Collective/single-family infrastructure',
    subsidyTypeFR: 'Infrastructure collective/maison individuelle',
    maxAmount: 500,
    amountPerSpace: 500,
    conditions: [
      'Gebäude vor 2023',
      'Grundversorgung Strom',
      'Lastmanagement erforderlich',
      'SIA 2060 C1 Niveau',
      'Ladegeräte nicht subventioniert'
    ],
    conditionsEN: [
      'Pre-2023 buildings',
      'Basic power supply',
      'Load management required',
      'SIA 2060 C1 level',
      'Chargers not subsidised'
    ],
    conditionsFR: [
      'Bâtiments avant 2023',
      'Alimentation électrique de base',
      'Gestion de charge requise',
      'Niveau SIA 2060 C1',
      'Chargeurs non subventionnés'
    ],
    requiresLoadManagement: true,
    validityEnd: '2026-12-31',
    isActive: true,
    officialLink: 'https://www.zh.ch/de/umwelt-tiere/energie/energiefoerderung.html',
    heatmapIntensity: 6,
  },
  {
    id: 'geneva',
    name: 'Geneva',
    nameDE: 'Genf',
    nameFR: 'Genève',
    coordinates: [46.2044, 6.1432],
    subsidyType: 'Kollektive Parkplatz-Vorinstallation & Stationen',
    subsidyTypeEN: 'Collective parking pre-equipment & stations',
    subsidyTypeFR: 'Pré-équipement collectif parking & stations',
    maxAmount: 20000,
    amountPerSpace: 500,
    percentageCovered: 50,
    conditions: [
      'Min. 5 Wohnungen',
      'Basisinstallation (Verkabelung, Lastmanagement)',
      'Ladegeräte nicht inbegriffen',
      '500 CHF (erste 5-10 Plätze)',
      '300 CHF (11-30 Plätze)',
      '250 CHF (31+ Plätze)'
    ],
    conditionsEN: [
      'Min. 5 apartments',
      'Basic installation (wiring, load management)',
      'Chargers not included',
      '500 CHF (first 5-10 spaces)',
      '300 CHF (11-30 spaces)',
      '250 CHF (31+ spaces)'
    ],
    conditionsFR: [
      'Min. 5 appartements',
      'Installation de base (câblage, gestion de charge)',
      'Chargeurs non inclus',
      '500 CHF (5-10 premières places)',
      '300 CHF (11-30 places)',
      '250 CHF (31+ places)'
    ],
    requiresLoadManagement: true,
    validityStart: '2024-02-01',
    isActive: true,
    officialLink: 'https://www.ge.ch/subventions-electromobilite',
    heatmapIntensity: 9,
  },
  {
    id: 'vaud',
    name: 'Vaud',
    nameDE: 'Waadt',
    nameFR: 'Vaud',
    coordinates: [46.5197, 6.6323],
    subsidyType: 'Kollektive Wohninfrastruktur',
    subsidyTypeEN: 'Collective residential infrastructure',
    subsidyTypeFR: 'Infrastructure résidentielle collective',
    maxAmount: 100000,
    amountPerSpace: 400,
    percentageCovered: 50,
    conditions: [
      'Gebäude vor 2021',
      'Min. 3 Parkplätze',
      'Nur Infrastruktur (keine Ladegeräte)',
      '400 CHF (erste 1-20 Plätze)',
      '300 CHF (21-30 Plätze)',
      '200 CHF (31+ Plätze)'
    ],
    conditionsEN: [
      'Pre-2021 buildings',
      'Min. 3 parking spaces',
      'Infrastructure only (no chargers)',
      '400 CHF (first 1-20 spaces)',
      '300 CHF (21-30 spaces)',
      '200 CHF (31+ spaces)'
    ],
    conditionsFR: [
      'Bâtiments avant 2021',
      'Min. 3 places de parking',
      'Infrastructure uniquement (pas de chargeurs)',
      '400 CHF (1-20 premières places)',
      '300 CHF (21-30 places)',
      '200 CHF (31+ places)'
    ],
    requiresLoadManagement: true,
    isActive: true,
    officialLink: 'https://www.vd.ch/environnement/energie',
    heatmapIntensity: 10,
  },
  {
    id: 'neuchatel',
    name: 'Neuchâtel',
    nameDE: 'Neuenburg',
    nameFR: 'Neuchâtel',
    coordinates: [46.9900, 6.9293],
    subsidyType: 'Private/Firmen/öffentliche Ladegeräte',
    subsidyTypeEN: 'Private/company/public chargers',
    subsidyTypeFR: 'Chargeurs privés/entreprise/publics',
    maxAmount: 800,
    amountPerSpace: 800,
    conditions: [
      'Privatpersonen, Unternehmen, Gemeinden',
      'Professionelle Installation',
      'OIBT-Standards',
      'Antrag innerhalb 6 Monaten nach Installation'
    ],
    conditionsEN: [
      'Individuals, companies, municipalities',
      'Professional installation',
      'OIBT standards',
      'Apply within 6 months after installation'
    ],
    conditionsFR: [
      'Particuliers, entreprises, communes',
      'Installation professionnelle',
      'Normes OIBT',
      'Demande dans les 6 mois après installation'
    ],
    requiresLoadManagement: false,
    validityStart: '2024-07-01',
    isActive: true,
    officialLink: 'https://www.ne.ch/autorites/DDTE/SENE',
    heatmapIntensity: 5,
  },
  {
    id: 'bern',
    name: 'Bern',
    nameDE: 'Bern',
    nameFR: 'Berne',
    coordinates: [46.9480, 7.4474],
    subsidyType: 'Kollektive Parkplatz-Infrastruktur',
    subsidyTypeEN: 'Collective parking infrastructure',
    subsidyTypeFR: 'Infrastructure collective de parking',
    maxAmount: 200000,
    amountPerSpace: 250,
    percentageCovered: 35,
    conditions: [
      'Gedeckte Parkplätze mit Baubewilligung vor 2023',
      'Min. 10 Plätze',
      'Basisinfrastruktur SIA 2060 C1'
    ],
    conditionsEN: [
      'Pre-2023 permitted covered parking',
      'Min. 10 spaces',
      'Basic infrastructure SIA 2060 C1'
    ],
    conditionsFR: [
      'Parkings couverts avec permis avant 2023',
      'Min. 10 places',
      'Infrastructure de base SIA 2060 C1'
    ],
    requiresLoadManagement: true,
    isActive: true,
    officialLink: 'https://www.weu.be.ch/fr/start/themen/energie',
    heatmapIntensity: 6,
  },
  {
    id: 'basel-stadt',
    name: 'Basel-Stadt',
    nameDE: 'Basel-Stadt',
    nameFR: 'Bâle-Ville',
    coordinates: [47.5596, 7.5886],
    subsidyType: 'Private/kollektive Ladeinfrastruktur',
    subsidyTypeEN: 'Private/collective charging infrastructure',
    subsidyTypeFR: 'Infrastructure de recharge privée/collective',
    maxAmount: 1300,
    percentageCovered: 60,
    conditions: [
      'Basisinstallation (C1/C2 Niveau)',
      'Lastmanagement erforderlich',
      'Zähler erforderlich',
      'Privater Parkplatz'
    ],
    conditionsEN: [
      'Basic installation (C1/C2 level)',
      'Load management required',
      'Metering required',
      'Private parking'
    ],
    conditionsFR: [
      'Installation de base (niveau C1/C2)',
      'Gestion de charge requise',
      'Compteur requis',
      'Parking privé'
    ],
    requiresLoadManagement: true,
    validityStart: '2024-07-01',
    validityEnd: '2030-12-31',
    isActive: true,
    officialLink: 'https://www.bs.ch/wsu/aue',
    heatmapIntensity: 8,
    isHomeMarket: true, // Malim's home market!
  },
  {
    id: 'ticino',
    name: 'Ticino',
    nameDE: 'Tessin',
    nameFR: 'Tessin',
    coordinates: [46.3167, 8.8000],
    subsidyType: 'Private/Arbeitsplatz-Ladestationen',
    subsidyTypeEN: 'Private/workplace charging stations',
    subsidyTypeFR: 'Stations de recharge privées/lieu de travail',
    maxAmount: 4000,
    amountPerSpace: 500,
    conditions: [
      'Privat- oder Firmennutzung',
      'Priorität für bidirektionale Ladegeräte (V2G)',
      '500-4\'000 CHF (höher für V2G)'
    ],
    conditionsEN: [
      'Private or company use',
      'Priority for bidirectional chargers (V2G)',
      '500-4,000 CHF (higher for V2G)'
    ],
    conditionsFR: [
      'Usage privé ou entreprise',
      'Priorité aux chargeurs bidirectionnels (V2G)',
      '500-4\'000 CHF (plus élevé pour V2G)'
    ],
    requiresLoadManagement: false,
    isActive: true,
    officialLink: 'https://www4.ti.ch/dt/da/spaas/ucd/temi/risparmio-energetico/incentivi/incentivi-mobilita-elettrica',
    heatmapIntensity: 7,
  },
  {
    id: 'thurgau',
    name: 'Thurgau',
    nameDE: 'Thurgau',
    nameFR: 'Thurgovie',
    coordinates: [47.5536, 9.0746],
    subsidyType: 'Ladeinfrastruktur (hauptsächlich Gewerbe)',
    subsidyTypeEN: 'Charging infrastructure (mainly business)',
    subsidyTypeFR: 'Infrastructure de recharge (principalement entreprises)',
    maxAmount: 0,
    conditions: [
      'Prozentsatz der Investition (Details variieren)',
      'Mehrfamilienhaus- oder Geschäftsinfrastruktur'
    ],
    conditionsEN: [
      'Percentage of investment (details vary)',
      'Multi-family or business infrastructure'
    ],
    conditionsFR: [
      'Pourcentage de l\'investissement (détails variables)',
      'Infrastructure multi-familiale ou commerciale'
    ],
    requiresLoadManagement: false,
    isActive: true,
    officialLink: 'https://energie.tg.ch',
    heatmapIntensity: 4,
  },
  {
    id: 'graubunden',
    name: 'Graubünden',
    nameDE: 'Graubünden',
    nameFR: 'Grisons',
    coordinates: [46.8508, 9.5320],
    subsidyType: 'Ladeinfrastruktur & PV',
    subsidyTypeEN: 'Charging infrastructure & PV',
    subsidyTypeFR: 'Infrastructure de recharge & PV',
    maxAmount: 0,
    conditions: [
      'Details unter spezifischen Kriterien (neues Programm)',
      'Bestimmte Bedingungen für private/kollektive Anlagen'
    ],
    conditionsEN: [
      'Details under specific criteria (new program)',
      'Certain conditions for private/collective setups'
    ],
    conditionsFR: [
      'Détails selon critères spécifiques (nouveau programme)',
      'Certaines conditions pour installations privées/collectives'
    ],
    requiresLoadManagement: false,
    validityStart: '2026-01-01',
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/GR',
    heatmapIntensity: 3,
  },
  {
    id: 'aargau',
    name: 'Aargau',
    nameDE: 'Aargau',
    nameFR: 'Argovie',
    coordinates: [47.3900, 8.0455],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/AG',
    heatmapIntensity: 1,
  },
  {
    id: 'appenzell-innerrhoden',
    name: 'Appenzell Innerrhoden',
    nameDE: 'Appenzell Innerrhoden',
    nameFR: 'Appenzell Rhodes-Intérieures',
    coordinates: [47.3317, 9.4090],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/AI',
    heatmapIntensity: 1,
  },
  {
    id: 'appenzell-ausserrhoden',
    name: 'Appenzell Ausserrhoden',
    nameDE: 'Appenzell Ausserrhoden',
    nameFR: 'Appenzell Rhodes-Extérieures',
    coordinates: [47.3833, 9.2833],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/AR',
    heatmapIntensity: 1,
  },
  {
    id: 'basel-landschaft',
    name: 'Basel-Landschaft',
    nameDE: 'Basel-Landschaft',
    nameFR: 'Bâle-Campagne',
    coordinates: [47.4855, 7.7234],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/BL',
    heatmapIntensity: 2,
  },
  {
    id: 'fribourg',
    name: 'Fribourg',
    nameDE: 'Freiburg',
    nameFR: 'Fribourg',
    coordinates: [46.8065, 7.1620],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/FR',
    heatmapIntensity: 2,
  },
  {
    id: 'glarus',
    name: 'Glarus',
    nameDE: 'Glarus',
    nameFR: 'Glaris',
    coordinates: [47.0404, 9.0680],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/GL',
    heatmapIntensity: 1,
  },
  {
    id: 'jura',
    name: 'Jura',
    nameDE: 'Jura',
    nameFR: 'Jura',
    coordinates: [47.3667, 7.3500],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/JU',
    heatmapIntensity: 1,
  },
  {
    id: 'luzern',
    name: 'Lucerne',
    nameDE: 'Luzern',
    nameFR: 'Lucerne',
    coordinates: [47.0502, 8.3093],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/LU',
    heatmapIntensity: 2,
  },
  {
    id: 'nidwalden',
    name: 'Nidwalden',
    nameDE: 'Nidwalden',
    nameFR: 'Nidwald',
    coordinates: [46.9480, 8.3860],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/NW',
    heatmapIntensity: 1,
  },
  {
    id: 'obwalden',
    name: 'Obwalden',
    nameDE: 'Obwalden',
    nameFR: 'Obwald',
    coordinates: [46.8960, 8.2460],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/OW',
    heatmapIntensity: 1,
  },
  {
    id: 'st-gallen',
    name: 'St. Gallen',
    nameDE: 'St. Gallen',
    nameFR: 'Saint-Gall',
    coordinates: [47.4245, 9.3767],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/SG',
    heatmapIntensity: 2,
  },
  {
    id: 'schaffhausen',
    name: 'Schaffhausen',
    nameDE: 'Schaffhausen',
    nameFR: 'Schaffhouse',
    coordinates: [47.6960, 8.6350],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/SH',
    heatmapIntensity: 1,
  },
  {
    id: 'solothurn',
    name: 'Solothurn',
    nameDE: 'Solothurn',
    nameFR: 'Soleure',
    coordinates: [47.2088, 7.5323],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/SO',
    heatmapIntensity: 1,
  },
  {
    id: 'schwyz',
    name: 'Schwyz',
    nameDE: 'Schwyz',
    nameFR: 'Schwyz',
    coordinates: [47.0207, 8.6530],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/SZ',
    heatmapIntensity: 1,
  },
  {
    id: 'uri',
    name: 'Uri',
    nameDE: 'Uri',
    nameFR: 'Uri',
    coordinates: [46.8800, 8.6440],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/UR',
    heatmapIntensity: 1,
  },
  {
    id: 'valais',
    name: 'Valais',
    nameDE: 'Wallis',
    nameFR: 'Valais',
    coordinates: [46.2333, 7.3607],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/VS',
    heatmapIntensity: 2,
  },
  {
    id: 'zug',
    name: 'Zug',
    nameDE: 'Zug',
    nameFR: 'Zoug',
    coordinates: [47.1724, 8.5173],
    subsidyType: 'Kantonales Förderprogramm Energie',
    subsidyTypeEN: 'Cantonal energy subsidy program',
    subsidyTypeFR: 'Programme cantonal de subventions énergie',
    maxAmount: 0,
    conditions: [
      'Kein spezifisches EV-Ladeinfrastruktur-Programm',
      'Allgemeines Energieförderprogramm verfügbar',
      'Details via Energiefranken'
    ],
    conditionsEN: [
      'No specific EV charging infrastructure program',
      'General energy subsidy program available',
      'Details via Energiefranken'
    ],
    conditionsFR: [
      'Pas de programme spécifique infrastructure de recharge VE',
      'Programme général de subventions énergie disponible',
      'Détails via Energiefranken'
    ],
    requiresLoadManagement: false,
    isActive: false,
    officialLink: 'https://www.energiefranken.ch/de/suche-nach-kanton/ZG',
    heatmapIntensity: 2,
  },
];

// Federal level subsidy - KliK Foundation
export const federalSubsidy = {
  name: 'Stiftung KliK',
  nameDE: 'Stiftung KliK - Ladeinfrastruktur',
  nameFR: 'Fondation KliK - Infrastructure de recharge',
  type: 'Carbon credit cash return',
  description: {
    en: 'Federal government purchases your "emission reductions" through KliK Foundation. Convert charging volume to carbon reduction certificates for cash return.',
    de: 'Der Bund kauft über die KliK-Stiftung Ihre "Emissionsreduktionen". Wandeln Sie Ladevolumen in CO2-Reduktionszertifikate für Barrückerstattung um.',
    fr: 'Le gouvernement fédéral achète vos "réductions d\'émissions" via la Fondation KliK. Convertissez le volume de charge en certificats de réduction carbone pour un remboursement en espèces.'
  },
  conditions: [
    'Ladestation mit Zähleraufzeichnung',
    'Teilweise öffentlich/für Besucher zugänglich',
    'Kann als Aggregator für mehrere Kunden agieren'
  ],
  officialLink: 'https://www.klik.ch/schweiz/verkehr/',
};

// SIA 2060 Standard
export const sia2060Standard = {
  name: 'SIA 2060',
  fullName: 'Infrastruktur für Elektrofahrzeuge in Gebäuden',
  description: {
    en: 'Mandatory standard for all new and renovated buildings specifying power reservation for EVs.',
    de: 'Verbindliche Norm für alle Neu- und Umbauten zur Festlegung der Leistungsreserve für Elektrofahrzeuge.',
    fr: 'Norme obligatoire pour tous les bâtiments neufs et rénovés spécifiant la réserve de puissance pour les VE.'
  },
  levels: ['C1', 'C2', 'C3'],
  supportOrg: 'Swiss eMobility',
  officialLink: 'https://www.swiss-emobility.ch',
};

// Energiefranken tool
export const energiefrankenTool = {
  name: 'Energiefranken',
  description: {
    en: 'Enter postal code to find all federal, cantonal, and municipal subsidies available.',
    de: 'Geben Sie die Postleitzahl ein, um alle verfügbaren Bundes-, Kantons- und Gemeindesubventionen zu finden.',
    fr: 'Entrez le code postal pour trouver toutes les subventions fédérales, cantonales et communales disponibles.'
  },
  url: 'https://www.energiefranken.ch',
};
