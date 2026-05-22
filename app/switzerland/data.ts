// Swiss.pro 数据文件
// 从 out/ HTML 恢复

export interface Link {
  url: string;
  text: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  links: Link[];
}

export interface City {
  id: string;
  name: string;
  code: string;
  description: string;
  highlights: string[];
}

// 分类数据
export const categories: Category[] = [
  {
    id: 'work',
    name: 'Arbeit',
    description: 'Jobs, Bewerbung, Bewilligungen',
    links: [
      { url: 'https://www.jobs.ch/', text: 'jobs.ch' },
      { url: 'https://www.jobscout24.ch/', text: 'JobScout24' },
      { url: 'https://www.linkedin.com/jobs/', text: 'LinkedIn Jobs' },
      { url: 'https://www.arbeit.swiss/', text: 'arbeit.swiss' },
      { url: 'https://eures.europa.eu/', text: 'EURES Schweiz' },
      { url: 'https://www.jobagent.ch/', text: 'Jobagent' },
      { url: 'https://ch.indeed.com/', text: 'Indeed Schweiz' },
      { url: 'https://www.monster.ch/', text: 'Monster Schweiz' },
      { url: 'https://www.jobup.ch/', text: 'Jobup.ch' },
      { url: 'https://www.adecco.ch/', text: 'Adecco Schweiz' },
      { url: 'https://www.manpower.ch/', text: 'Manpower Schweiz' },
      { url: 'https://www.randstad.ch/', text: 'Randstad Schweiz' },
    ],
  },
  {
    id: 'startup-investment',
    name: 'Startup / Investment',
    description: 'Gründung, Finanzierung, Netzwerk',
    links: [],
  },
  {
    id: 'government',
    name: 'Behörden',
    description: 'Ämter, Bewilligungen, Steuern',
    links: [],
  },
  {
    id: 'daily-life',
    name: 'Alltag',
    description: 'Wohnen, Einkaufen, Freizeit',
    links: [],
  },
  {
    id: 'education',
    name: 'Bildung',
    description: 'Schulen, Universitäten, Kurse',
    links: [],
  },
  {
    id: 'healthcare',
    name: 'Gesundheit',
    description: 'Krankenkassen, Ärzte, Apotheken',
    links: [],
  },
  {
    id: 'news',
    name: 'News',
    description: 'Nachrichten, Medien, Zeitungen',
    links: [],
  },
  {
    id: 'community',
    name: 'Kammer / Community',
    description: 'Vereine, Netzwerke, Communities',
    links: [],
  },
];

// 城市数据
export const cities: City[] = [
  {
    id: 'zurich',
    name: 'Zürich',
    code: 'ZH',
    description: 'Finanzen, Tech, internationale Jobs',
    highlights: [
      'Jobmarkt und Tech-Szene',
      'Internationale Unternehmen',
      'Wohnen und Alltag in Zürich',
    ],
  },
  {
    id: 'basel',
    name: 'Basel',
    code: 'BS',
    description: 'Pharma, Chemie, Kultur',
    highlights: [],
  },
  {
    id: 'bern',
    name: 'Bern',
    code: 'BE',
    description: 'Bundesstadt, Verwaltung, Kultur',
    highlights: [],
  },
  {
    id: 'geneva',
    name: 'Genf',
    code: 'GE',
    description: 'International, Diplomatie, Luxus',
    highlights: [],
  },
  {
    id: 'lausanne',
    name: 'Lausanne',
    code: 'VD',
    description: 'Bildung, Sport, Kultur',
    highlights: [],
  },
  {
    id: 'zug',
    name: 'Zug',
    code: 'ZG',
    description: 'Steuern, Krypto, Business',
    highlights: [],
  },
];

// 瑞士全国链接
export const swissLinks: Link[] = [
  { url: 'https://www.ch.ch/de/', text: 'ch.ch' },
  { url: 'https://www.sbb.ch/', text: 'SBB' },
  { url: 'https://www.post.ch/', text: 'Swiss Post' },
];

// 所有瑞士州
export const allCantons = [
  { id: 'all', name: 'Alle', code: 'CH' },
  { id: 'zurich', name: 'Zürich', code: 'ZH' },
  { id: 'bern', name: 'Bern', code: 'BE' },
  { id: 'luzern', name: 'Luzern', code: 'LU' },
  { id: 'zug', name: 'Zug', code: 'ZG' },
  { id: 'basel-stadt', name: 'Basel-Stadt', code: 'BS' },
  { id: 'st-gallen', name: 'St. Gallen', code: 'SG' },
  { id: 'graubunden', name: 'Graubünden', code: 'GR' },
  { id: 'aargau', name: 'Aargau', code: 'AG' },
  { id: 'tessin', name: 'Tessin', code: 'TI' },
  { id: 'waadt', name: 'Waadt', code: 'VD' },
  { id: 'wallis', name: 'Wallis', code: 'VS' },
  { id: 'genf', name: 'Genf', code: 'GE' },
  { id: 'basel-landschaft', name: 'Basel-Landschaft', code: 'BL' },
  { id: 'fribourg', name: 'Fribourg', code: 'FR' },
  { id: 'solothurn', name: 'Solothurn', code: 'SO' },
  { id: 'schaffhausen', name: 'Schaffhausen', code: 'SH' },
  { id: 'appenzell-ausserrhoden', name: 'Appenzell Ausserrhoden', code: 'AR' },
  { id: 'appenzell-innerrhoden', name: 'Appenzell Innerrhoden', code: 'AI' },
  { id: 'schwyz', name: 'Schwyz', code: 'SZ' },
  { id: 'obwalden', name: 'Obwalden', code: 'OW' },
  { id: 'nidwalden', name: 'Nidwalden', code: 'NW' },
  { id: 'glarus', name: 'Glarus', code: 'GL' },
  { id: 'uri', name: 'Uri', code: 'UR' },
  { id: 'thurgau', name: 'Thurgau', code: 'TG' },
  { id: 'neuchatel', name: 'Neuchâtel', code: 'NE' },
  { id: 'jura', name: 'Jura', code: 'JU' },
];
