'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { CantonSubsidy } from '@/lib/data/cantons';
import InfoPanel from '@/components/InfoPanel';
import PostalSearch from '@/components/PostalSearch';
import CantonSubscribe from '@/components/CantonSubscribe';
import ThemeToggle from '@/components/ThemeToggle';

const SwissMap = dynamic(() => import('@/components/SwissMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0a0a0f] dark:bg-[#0a0a0f]">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-emerald-500/20 rounded-full animate-ping absolute" />
        <div className="w-16 h-16 border-2 border-emerald-500/40 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    </div>
  )
});

type Locale = 'en' | 'de' | 'fr' | 'it';

const translations = {
  en: {
    title: 'Swiss EV Charging',
    subtitle: 'Subsidy Explorer',
    tagline: 'Discover subsidies for electric vehicle charging infrastructure across Switzerland',
    federal: 'Federal Subsidies',
    sia: 'SIA 2060 Compliance',
    search: 'Find Your Subsidies',
    searchDesc: 'Discover all federal, cantonal and municipal subsidies for your location.',
    stats: { cantons: 'Cantons', maxSubsidy: 'Max Subsidy', coverage: 'Coverage' }
  },
  de: {
    title: 'Schweizer E-Ladeinfrastruktur',
    subtitle: 'Subventions-Explorer',
    tagline: 'Entdecken Sie Subventionen für Elektrofahrzeug-Ladeinfrastruktur in der Schweiz',
    federal: 'Bundessubventionen',
    sia: 'SIA 2060 Konformität',
    search: 'Finden Sie Ihre Subventionen',
    searchDesc: 'Entdecken Sie alle Bundes-, Kantons- und Gemeindesubventionen für Ihren Standort.',
    stats: { cantons: 'Kantone', maxSubsidy: 'Max. Subvention', coverage: 'Deckung' }
  },
  fr: {
    title: 'Infrastructure de recharge Suisse',
    subtitle: 'Explorateur de subventions',
    tagline: 'Découvrez les subventions pour l\'infrastructure de recharge des véhicules électriques',
    federal: 'Subventions fédérales',
    sia: 'Conformité SIA 2060',
    search: 'Trouvez vos subventions',
    searchDesc: 'Découvrez toutes les subventions fédérales, cantonales et communales pour votre emplacement.',
    stats: { cantons: 'Cantons', maxSubsidy: 'Subvention max.', coverage: 'Couverture' }
  },
  it: {
    title: 'Infrastruttura di ricarica Svizzera',
    subtitle: 'Esploratore di sovvenzioni',
    tagline: 'Scopri le sovvenzioni per l\'infrastruttura di ricarica dei veicoli elettrici in Svizzera',
    federal: 'Sovvenzioni federali',
    sia: 'Conformità SIA 2060',
    search: 'Trova le tue sovvenzioni',
    searchDesc: 'Scopri tutte le sovvenzioni federali, cantonali e comunali per la tua posizione.',
    stats: { cantons: 'Cantoni', maxSubsidy: 'Sovvenzione max.', coverage: 'Copertura' }
  },
};

export default function Home() {
  const [selectedCanton, setSelectedCanton] = useState<CantonSubsidy | null>(null);
  const [zoomToCanton, setZoomToCanton] = useState<string | null>(null);
  const [locale, setLocale] = useState<Locale>('de');
  const [isDark, setIsDark] = useState(true);
  const t = translations[locale];

  // Load theme preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('malim-theme');
    if (saved) {
      setIsDark(saved === 'dark');
    }
  }, []);

  // Save theme preference
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    localStorage.setItem('malim-theme', newTheme ? 'dark' : 'light');
  };

  const handleSearch = (code: string, canton: CantonSubsidy | null) => {
    if (canton) {
      setSelectedCanton(canton);
      setZoomToCanton(canton.id);
    }
  };

  const handleClosePanel = () => {
    setSelectedCanton(null);
    setZoomToCanton(null);
  };

  return (
    <main className={`min-h-screen transition-colors duration-300 ${
      isDark 
        ? 'bg-gradient-to-br from-[#0c1829] via-[#0a1420] to-[#081018] text-white' 
        : 'bg-white text-slate-900'
    }`}>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 px-4 md:px-6 py-3 md:py-4 flex items-center justify-between backdrop-blur-xl border-b transition-colors duration-300 ${
        isDark 
          ? 'bg-[rgba(12,22,37,0.85)] border-teal-500/[0.08]' 
          : 'bg-white border-slate-200'
      }`}>
        <h1 className="text-lg md:text-xl font-bold tracking-tight">
          <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">Malim</span>
          <span className={isDark ? 'text-slate-500' : 'text-slate-400'}>.energy</span>
        </h1>
        <div className="flex items-center gap-2 md:gap-3">
          <div className={`flex gap-0.5 md:gap-1 backdrop-blur-lg rounded-lg p-0.5 md:p-1 border transition-colors duration-300 ${
            isDark 
              ? 'bg-[rgba(15,23,42,0.7)] border-teal-500/[0.08]' 
              : 'bg-slate-100/80 border-slate-200'
          }`}>
            {(['de', 'fr', 'it', 'en'] as Locale[]).map((lang) => (
              <button
                key={lang}
                onClick={() => setLocale(lang)}
                className={`px-2 md:px-3 py-1 md:py-1.5 rounded-md text-xs font-medium transition-all active:scale-95 ${
                  locale === lang 
                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20' 
                    : isDark ? 'text-slate-500 hover:text-slate-300' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {lang.toUpperCase()}
              </button>
            ))}
          </div>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
      </header>

      {/* Main content */}
      <div className="pt-16 md:pt-20 pb-4 md:pb-8 px-3 md:px-6 min-h-screen flex flex-col">
        {/* Title section */}
        <div className="text-center mb-4 md:mb-6">
          <h2 className={`text-2xl md:text-4xl font-bold mb-1 md:mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{t.title}</h2>
          <h3 className={`text-base md:text-lg mb-1 md:mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.subtitle}</h3>
          <p className={`text-xs md:text-sm max-w-lg mx-auto hidden md:block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.tagline}</p>
        </div>

        {/* Stats bar */}
        <div className="flex justify-center gap-2 md:gap-4 mb-4 md:mb-6">
          {[
            { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', icon2: 'M15 11a3 3 0 11-6 0 3 3 0 016 0z', value: '9+', label: t.stats.cantons },
            { icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z', value: '100K', label: t.stats.maxSubsidy },
            { icon: 'M13 10V3L4 14h7v7l9-11h-7z', value: '60%', label: t.stats.coverage },
          ].map((stat, i) => (
            <div key={i} className={`text-center px-3 md:px-6 py-2 md:py-4 rounded-xl border transition-all duration-300 hover:shadow-[0_0_24px_rgba(20,184,166,0.08)] ${
              isDark 
                ? 'bg-[rgba(15,23,42,0.6)] backdrop-blur-lg border-teal-500/[0.08] hover:border-teal-500/[0.15]' 
                : 'bg-white border-slate-200 hover:border-teal-500/30 shadow-sm'
            }`}>
              <div className="flex items-center justify-center gap-1 md:gap-2 mb-0.5 md:mb-1">
                <svg className="w-4 h-4 md:w-5 md:h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon} />
                  {stat.icon2 && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={stat.icon2} />}
                </svg>
                <span className="text-lg md:text-2xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">{stat.value}</span>
              </div>
              <div className={`text-[10px] md:text-xs ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Map container - taller on mobile */}
        <div className={`flex-1 min-h-[250px] md:min-h-[350px] max-h-[45vh] md:max-h-[500px] rounded-2xl border overflow-hidden shadow-2xl transition-colors duration-300 ${
          isDark 
            ? 'bg-[#0c1625] border-teal-500/[0.1] shadow-black/30' 
            : 'bg-slate-100 border-slate-200 shadow-slate-300/30'
        }`}>
          <SwissMap 
            onSelectCanton={(canton) => {
              setSelectedCanton(canton);
              if (canton) setZoomToCanton(canton.id);
            }}
            selectedCanton={selectedCanton}
            locale={locale}
            zoomToCanton={zoomToCanton}
            isDark={isDark}
          />
        </div>

        {/* Bottom section - stacks on mobile */}
        <div className="mt-4 md:mt-6 grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {/* Search */}
          <div className={`relative rounded-xl border p-3 md:p-4 overflow-hidden transition-colors duration-300 ${
            isDark 
              ? 'bg-[rgba(15,23,42,0.6)] backdrop-blur-lg border-teal-500/[0.08]' 
              : 'bg-white border-slate-200 shadow-sm'
          } before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-teal-400/15 before:to-transparent`}>
            <h4 className={`text-sm font-medium mb-1 md:mb-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{t.search}</h4>
            <p className={`text-xs mb-2 md:mb-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{t.searchDesc}</p>
            <PostalSearch locale={locale} onSearch={handleSearch} isDark={isDark} />
          </div>

          {/* Quick links */}
          <div className={`relative rounded-xl border p-3 md:p-4 overflow-hidden transition-colors duration-300 ${
            isDark 
              ? 'bg-[rgba(15,23,42,0.6)] backdrop-blur-lg border-teal-500/[0.08]' 
              : 'bg-white border-slate-200 shadow-sm'
          } before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-teal-400/15 before:to-transparent`}>
            <h4 className={`text-sm font-medium mb-2 md:mb-3 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Links</h4>
            <div className="space-y-2">
              {[
                { href: 'https://www.klik.ch/schweiz/verkehr/', icon: '🇨🇭', label: t.federal },
                { href: 'https://www.swiss-emobility.ch', icon: '📐', label: t.sia },
                { href: 'https://www.energiefranken.ch', icon: '💰', label: 'Energiefranken.ch' },
              ].map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-2 text-xs transition-all duration-200 active:scale-[0.98] ${
                    isDark ? 'text-slate-500 hover:text-teal-400' : 'text-slate-500 hover:text-teal-600'
                  }`}
                >
                  <span>{link.icon}</span> {link.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Subsidy Alert / PLZ-Abo */}
        <div className="mt-4 md:mt-6">
          <CantonSubscribe locale={locale} isDark={isDark} />
        </div>
      </div>

      {/* Info Panel (desktop drawer / mobile bottom sheet) */}
      <InfoPanel 
        canton={selectedCanton} 
        onClose={handleClosePanel} 
        locale={locale}
        isDark={isDark}
      />
    </main>
  );
}
