'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cantonSubsidies, CantonSubsidy, getLocalizedSubsidyType } from '@/lib/data/cantons';
import { formatSwissCurrency } from '@/lib/utils/format';

interface PostalSearchProps {
  locale: 'en' | 'de' | 'fr' | 'it';
  onSearch: (postalCode: string, canton: CantonSubsidy | null) => void;
  isDark?: boolean;
}

const translations = {
  en: {
    placeholder: 'Enter postal code (e.g. 4051)',
    search: 'Search',
    poweredBy: 'Powered by Energiefranken.ch',
    noResults: 'No specific canton data found. Check Energiefranken.ch for detailed local subsidies.',
    federal: 'Federal: KliK Foundation',
    federalDesc: 'Carbon credit cash return for public/semi-public charging stations.',
    checkExternal: 'Check detailed subsidies on Energiefranken.ch',
    upTo: 'Up to',
  },
  de: {
    placeholder: 'Postleitzahl eingeben (z.B. 4051)',
    search: 'Suchen',
    poweredBy: 'Powered by Energiefranken.ch',
    noResults: 'Keine spezifischen Kantonsdaten gefunden. Prüfen Sie Energiefranken.ch für detaillierte lokale Subventionen.',
    federal: 'Bund: Stiftung KliK',
    federalDesc: 'CO₂-Gutschriften-Rückerstattung für öffentliche/halböffentliche Ladestationen.',
    checkExternal: 'Detaillierte Subventionen auf Energiefranken.ch prüfen',
    upTo: 'Bis zu',
  },
  fr: {
    placeholder: 'Entrez le code postal (ex. 4051)',
    search: 'Rechercher',
    poweredBy: 'Powered by Energiefranken.ch',
    noResults: 'Aucune donnée cantonale spécifique trouvée. Consultez Energiefranken.ch pour les subventions locales détaillées.',
    federal: 'Fédéral: Fondation KliK',
    federalDesc: 'Remboursement en espèces des crédits carbone pour les bornes publiques/semi-publiques.',
    checkExternal: 'Vérifier les subventions détaillées sur Energiefranken.ch',
    upTo: "Jusqu'à",
  },
  it: {
    placeholder: 'Inserisci il codice postale (es. 6500)',
    search: 'Cerca',
    poweredBy: 'Powered by Energiefranken.ch',
    noResults: 'Nessun dato cantonale specifico trovato. Controlla Energiefranken.ch per le sovvenzioni locali dettagliate.',
    federal: 'Federale: Fondazione KliK',
    federalDesc: 'Rimborso crediti di carbonio per stazioni di ricarica pubbliche/semi-pubbliche.',
    checkExternal: 'Controlla le sovvenzioni dettagliate su Energiefranken.ch',
    upTo: 'Fino a',
  },
};

// Swiss postal code to canton mapping (simplified)
const postalCodeToCanton: Record<string, string> = {
  '80': 'zurich', '81': 'zurich', '82': 'zurich', '83': 'zurich', '84': 'zurich',
  '12': 'geneva',
  '10': 'vaud', '11': 'vaud',
  '20': 'neuchatel', '21': 'neuchatel',
  '30': 'bern', '31': 'bern', '32': 'bern', '33': 'bern', '34': 'bern', '36': 'bern',
  '40': 'basel-stadt', '41': 'basel-stadt',
  '65': 'ticino', '66': 'ticino', '69': 'ticino',
  '85': 'thurgau', '86': 'thurgau',
  '70': 'graubunden', '71': 'graubunden', '74': 'graubunden', '75': 'graubunden',
};

function findCantonByPostalCode(code: string): string | null {
  const prefix = code.substring(0, 2);
  return postalCodeToCanton[prefix] || null;
}

export default function PostalSearch({ locale, onSearch, isDark = true }: PostalSearchProps) {
  const [postalCode, setPostalCode] = useState('');
  const [result, setResult] = useState<typeof cantonSubsidies[0] | null>(null);
  const [searched, setSearched] = useState(false);
  const t = translations[locale];

  const handleSearch = () => {
    if (postalCode.length !== 4) return;
    
    const cantonId = findCantonByPostalCode(postalCode);
    let canton: CantonSubsidy | null = null;
    if (cantonId) {
      canton = cantonSubsidies.find(c => c.id === cantonId) || null;
    }
    setResult(canton);
    setSearched(true);
    onSearch(postalCode, canton);
  };

  return (
    <div className="max-w-md w-full">
      {/* Search input */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={postalCode}
          onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, '').slice(0, 4))}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder={t.placeholder}
          className={`flex-1 border rounded-xl px-4 py-3 placeholder-slate-500 focus:outline-none transition-all duration-300 ${
            isDark 
              ? 'bg-slate-800/40 border-teal-500/[0.1] text-slate-100 focus:border-teal-500/40 focus:shadow-[0_0_16px_rgba(20,184,166,0.12)]' 
              : 'bg-white border-slate-200 text-slate-800 focus:border-teal-500/50 focus:shadow-[0_0_16px_rgba(20,184,166,0.08)]'
          }`}
        />
        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-teal-400 hover:to-emerald-400 active:scale-95 transition-all shadow-lg shadow-teal-500/15"
        >
          {t.search}
        </button>
      </div>

      {/* Results */}
      {searched && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3"
        >
          {/* Federal subsidy - always shown */}
          <div className={`border rounded-xl p-4 ${
            isDark ? 'bg-slate-800/30 border-teal-500/[0.08]' : 'bg-slate-50 border-slate-200'
          }`}>
            <div className="flex items-center gap-2 mb-1">
              <span>🇨🇭</span>
              <span className={`font-semibold text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>{t.federal}</span>
            </div>
            <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t.federalDesc}</p>
          </div>

          {/* Canton subsidy */}
          {result ? (
            <div className={`border rounded-xl p-4 ${
              isDark ? 'bg-slate-800/30 border-teal-500/20' : 'bg-teal-50/50 border-teal-200'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className={`font-semibold text-sm ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                  {locale === 'fr' ? result.nameFR : locale === 'it' ? (result.nameIT || result.name) : locale === 'de' ? result.nameDE : result.name}
                </span>
                {result.isHomeMarket && (
                  <span className="text-xs bg-teal-500/10 text-teal-600 px-2 py-1 rounded-full border border-teal-500/20">
                    🏠 Malim
                  </span>
                )}
              </div>
              <div className="text-lg font-bold mb-1 bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                {result.percentageCovered ? `${t.upTo} ${result.percentageCovered}%` : ''} 
                {result.maxAmount > 0 ? ` · Max ${formatSwissCurrency(result.maxAmount)}` : ''}
              </div>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{getLocalizedSubsidyType(result, locale as 'en' | 'de' | 'fr')}</p>
            </div>
          ) : (
            <div className={`border rounded-xl p-4 ${
              isDark ? 'bg-slate-800/30 border-slate-700/50' : 'bg-slate-50 border-slate-200'
            }`}>
              <p className={`text-xs ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t.noResults}</p>
            </div>
          )}

          {/* External link */}
          <a
            href={`https://www.energiefranken.ch/de/${postalCode}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full py-3 border text-center rounded-xl transition-all text-sm ${
              isDark 
                ? 'bg-slate-800/40 hover:bg-slate-700/50 border-teal-500/[0.08] text-slate-300 hover:text-teal-300' 
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-600 hover:text-teal-600'
            }`}
          >
            {t.checkExternal} →
          </a>

          <p className={`text-xs text-center ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{t.poweredBy}</p>
        </motion.div>
      )}
    </div>
  );
}
