'use client';

import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { CantonSubsidy, getLocalizedConditions, getLocalizedSubsidyType } from '@/lib/data/cantons';
import AnimatedNumber from './AnimatedNumber';
import { useEffect, useState } from 'react';
import { formatSwissCurrency, calculateSubsidy } from '@/lib/utils/format';

interface InfoPanelProps {
  canton: CantonSubsidy | null;
  onClose: () => void;
  locale: 'en' | 'de' | 'fr' | 'it';
  isDark?: boolean;
}

const translations = {
  en: {
    subsidyType: 'Subsidy Type',
    maxAmount: 'Maximum Amount',
    coverage: 'Coverage',
    perSpace: 'Per Parking Space',
    conditions: 'Conditions',
    loadManagement: 'Load Management Required',
    validity: 'Validity',
    homeMarket: '🏠 Malim Home Market',
    learnMore: 'Learn More',
    active: 'Active',
    upcoming: 'Upcoming',
    yes: 'Yes',
    no: 'No',
    roiCalculator: 'ROI Calculator',
    estimatedCost: 'Estimated Installation Costs',
    yourSubsidy: 'Your Subsidy',
    yourOutOfPocket: 'Your Out-of-pocket Cost',
    getQuote: 'Get a free quote',
    noSubsidy: 'No Subsidy Available',
    noSubsidyMessage: 'This canton currently offers no subsidies for EV charging infrastructure.',
    checkFederal: 'Check Federal Subsidies',
    contactSupport: 'Contact us for alternative solutions',
  },
  de: {
    subsidyType: 'Förderungsart',
    maxAmount: 'Maximalbetrag',
    coverage: 'Deckung',
    perSpace: 'Pro Parkplatz',
    conditions: 'Bedingungen',
    loadManagement: 'Lastmanagement erforderlich',
    validity: 'Gültigkeit',
    homeMarket: '🏠 Malim Heimmarkt',
    learnMore: 'Mehr erfahren',
    active: 'Aktiv',
    upcoming: 'Kommend',
    yes: 'Ja',
    no: 'Nein',
    roiCalculator: 'ROI Rechner',
    estimatedCost: 'Geschätzte Installationskosten',
    yourSubsidy: 'Ihre Subvention',
    yourOutOfPocket: 'Ihr Eigenanteil',
    getQuote: 'Kostenlose Offerte einholen',
    noSubsidy: 'Keine Subvention verfügbar',
    noSubsidyMessage: 'Dieser Kanton bietet derzeit keine Subventionen für EV-Ladeinfrastruktur.',
    checkFederal: 'Bundessubventionen prüfen',
    contactSupport: 'Kontaktieren Sie uns für alternative Lösungen',
  },
  fr: {
    subsidyType: 'Type de subvention',
    maxAmount: 'Montant maximum',
    coverage: 'Couverture',
    perSpace: 'Par place de parking',
    conditions: 'Conditions',
    loadManagement: 'Gestion de charge requise',
    validity: 'Validité',
    homeMarket: '🏠 Marché principal Malim',
    learnMore: 'En savoir plus',
    active: 'Actif',
    upcoming: 'À venir',
    yes: 'Oui',
    no: 'Non',
    roiCalculator: 'Calculateur ROI',
    estimatedCost: 'Coûts d\'installation estimés',
    yourSubsidy: 'Votre subvention',
    yourOutOfPocket: 'Votre coût net',
    getQuote: 'Obtenir un devis gratuit',
    noSubsidy: 'Aucune subvention disponible',
    noSubsidyMessage: 'Ce canton n\'offre actuellement aucune subvention pour l\'infrastructure de recharge VE.',
    checkFederal: 'Vérifier les subventions fédérales',
    contactSupport: 'Contactez-nous pour des solutions alternatives',
  },
  it: {
    subsidyType: 'Tipo di sovvenzione',
    maxAmount: 'Importo massimo',
    coverage: 'Copertura',
    perSpace: 'Per posto auto',
    conditions: 'Condizioni',
    loadManagement: 'Gestione del carico richiesta',
    validity: 'Validità',
    homeMarket: '🏠 Mercato principale Malim',
    learnMore: 'Scopri di più',
    active: 'Attivo',
    upcoming: 'In arrivo',
    yes: 'Sì',
    no: 'No',
    roiCalculator: 'Calcolatore ROI',
    estimatedCost: 'Costi di installazione stimati',
    yourSubsidy: 'La tua sovvenzione',
    yourOutOfPocket: 'Il tuo costo netto',
    getQuote: 'Richiedi un preventivo gratuito',
    noSubsidy: 'Nessuna sovvenzione disponibile',
    noSubsidyMessage: 'Questo cantone attualmente non offre sovvenzioni per l\'infrastruttura di ricarica VE.',
    checkFederal: 'Verifica le sovvenzioni federali',
    contactSupport: 'Contattaci per soluzioni alternative',
  },
};

export default function InfoPanel({ canton, onClose, locale, isDark = true }: InfoPanelProps) {
  const t = translations[locale] || translations.de;
  const [isMobile, setIsMobile] = useState(false);
  const [key, setKey] = useState(0);
  const [installationCost, setInstallationCost] = useState(10000);
  const dragControls = useDragControls();
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Reset animation key when canton changes
  useEffect(() => {
    if (canton) setKey(prev => prev + 1);
  }, [canton?.id]);
  
  const getCantonName = (canton: CantonSubsidy) => {
    if (locale === 'de') return canton.nameDE;
    if (locale === 'fr') return canton.nameFR;
    if (locale === 'it') return canton.nameIT || canton.name;
    return canton.name;
  };

  const handleDragEnd = (_: unknown, info: { velocity: { y: number }; offset: { y: number } }) => {
    if (info.velocity.y > 500 || info.offset.y > 150) {
      onClose();
    }
  };

  // Calculate subsidy and out-of-pocket cost
  const calculatedSubsidy = canton ? calculateSubsidy(
    installationCost,
    canton.percentageCovered,
    canton.maxAmount,
    canton.amountPerSpace
  ) : 0;
  const outOfPocket = installationCost - calculatedSubsidy;

  // Check if canton has no subsidy
  const hasNoSubsidy = canton && canton.maxAmount === 0 && !canton.amountPerSpace && !canton.percentageCovered;

  const panelContent = canton && (
    <div className={`h-full backdrop-blur-xl border-l md:border-l border-t md:border-t-0 flex flex-col transition-colors duration-300 ${
      isDark 
        ? 'bg-[rgba(8,13,22,0.97)] md:bg-[rgba(8,13,22,0.92)] border-teal-500/[0.08]' 
        : 'bg-white/95 md:bg-white/90 border-slate-200'
    }`}>
      <div className="flex-1 overflow-y-auto p-6 pb-8">
        {/* Drag handle for mobile */}
        {isMobile && (
          <div className="flex justify-center mb-4 -mt-2">
            <div className={`w-12 h-1.5 rounded-full ${isDark ? 'bg-slate-600' : 'bg-slate-300'}`} />
          </div>
        )}
        
        {/* Close button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 w-10 h-10 rounded-full hover:scale-105 active:scale-95 border flex items-center justify-center transition-all duration-200 z-10 ${
            isDark 
              ? 'bg-slate-800/50 hover:bg-slate-700/60 border-slate-700/50' 
              : 'bg-slate-100 hover:bg-slate-200 border-slate-200'
          }`}
        >
          <svg className={`w-6 h-6 ${isDark ? 'text-slate-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {canton.isHomeMarket && (
            <div className={`inline-block px-3 py-1 border rounded-full text-sm mb-3 ${
              isDark ? 'bg-teal-500/10 border-teal-500/25 text-teal-300' : 'bg-teal-50 border-teal-200 text-teal-600'
            }`}>
              {t.homeMarket}
            </div>
          )}
          <h2 className={`text-3xl font-bold mb-2 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
            {getCantonName(canton)}
          </h2>
          <div className={`inline-block px-3 py-1 rounded-full text-sm ${
            canton.isActive 
              ? (isDark ? 'bg-teal-500/15 text-teal-300' : 'bg-teal-50 text-teal-600') 
              : (isDark ? 'bg-amber-500/15 text-amber-300' : 'bg-amber-50 text-amber-600')
          }`}>
            {canton.isActive ? t.active : t.upcoming}
          </div>
        </motion.div>

        {/* Empty State for No Subsidy */}
        {hasNoSubsidy ? (
          <motion.div
            className={`rounded-xl p-6 border mb-6 ${
              isDark ? 'bg-slate-800/30 border-amber-500/[0.15]' : 'bg-amber-50/50 border-amber-200'
            }`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="flex items-start gap-3 mb-4">
              <svg className={`w-6 h-6 flex-shrink-0 mt-0.5 ${isDark ? 'text-amber-400' : 'text-amber-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <h3 className={`font-semibold mb-1 ${isDark ? 'text-amber-300' : 'text-amber-600'}`}>{t.noSubsidy}</h3>
                <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.noSubsidyMessage}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <a
                href="https://www.klik.ch/schweiz/verkehr/"
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-3 text-center font-medium rounded-lg transition-all duration-200 border ${
                  isDark 
                    ? 'bg-slate-700/40 hover:bg-slate-700/60 text-slate-200 border-slate-600/30' 
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                }`}
              >
                {t.checkFederal} →
              </a>
              <button
                className={`w-full py-3 text-center font-medium rounded-lg transition-all duration-200 border ${
                  isDark 
                    ? 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border-teal-500/30' 
                    : 'bg-teal-50 hover:bg-teal-100 text-teal-600 border-teal-200'
                }`}
              >
                {t.contactSupport}
              </button>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Stats grid - with animated numbers */}
            <motion.div 
              key={key}
              className="grid grid-cols-2 gap-4 mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              {canton.percentageCovered && (
                <div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/30 border-teal-500/[0.08]' : 'bg-teal-50/50 border-teal-100'}`}>
                  <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.coverage}</div>
                  <div>
                    <AnimatedNumber 
                      value={canton.percentageCovered} 
                      className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent"
                    />
                    <span className="text-sm text-slate-500 ml-1">%</span>
                  </div>
                </div>
              )}
              {canton.maxAmount > 0 && (
                <div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/30 border-teal-500/[0.08]' : 'bg-teal-50/50 border-teal-100'}`}>
                  <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.maxAmount}</div>
                  <div className="text-2xl font-bold bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
                    {formatSwissCurrency(canton.maxAmount)}
                  </div>
                </div>
              )}
              {canton.amountPerSpace && (
                <div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/30 border-teal-500/[0.08]' : 'bg-slate-50 border-slate-100'}`}>
                  <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.perSpace}</div>
                  <div className={`text-2xl font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {formatSwissCurrency(canton.amountPerSpace)}
                  </div>
                </div>
              )}
              <div className={`rounded-xl p-4 border ${isDark ? 'bg-slate-800/30 border-teal-500/[0.08]' : 'bg-slate-50 border-slate-100'}`}>
                <div className={`text-sm mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.loadManagement}</div>
                <div className={`text-xl font-bold ${canton.requiresLoadManagement ? 'bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent' : 'text-slate-500'}`}>
                  {canton.requiresLoadManagement ? t.yes : t.no}
                </div>
              </div>
            </motion.div>

            {/* Subsidy type */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <h3 className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.subsidyType}</h3>
              <p className={isDark ? 'text-slate-200' : 'text-slate-700'}>{getLocalizedSubsidyType(canton, locale === 'it' ? 'de' : locale)}</p>
            </motion.div>

            {/* Conditions */}
            <motion.div 
              className="mb-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className={`text-sm mb-3 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.conditions}</h3>
              <ul className="space-y-4">
                {getLocalizedConditions(canton, locale === 'it' ? 'de' : locale).map((condition, index) => (
                  <motion.li 
                    key={index} 
                    className={`flex items-start gap-2 ${isDark ? 'text-slate-300' : 'text-slate-600'}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                  >
                    <svg className="w-5 h-5 text-teal-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{condition}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>

            {/* Validity */}
            {(canton.validityStart || canton.validityEnd) && (
              <motion.div 
                className="mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className={`text-sm mb-2 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.validity}</h3>
                <p className={isDark ? 'text-slate-200' : 'text-slate-700'}>
                  {canton.validityStart && `${locale === 'de' ? 'Ab' : locale === 'fr' ? 'Dès le' : locale === 'it' ? 'Dal' : 'From'} ${canton.validityStart}`}
                  {canton.validityStart && canton.validityEnd && ' — '}
                  {canton.validityEnd && `${locale === 'de' ? 'Bis' : locale === 'fr' ? "Jusqu'au" : locale === 'it' ? 'Fino al' : 'Until'} ${canton.validityEnd}`}
                </p>
              </motion.div>
            )}

            {/* ROI Calculator */}
            <motion.div
              className={`mb-10 rounded-xl p-5 border ${
                isDark 
                  ? 'bg-gradient-to-br from-teal-500/[0.08] to-emerald-500/[0.08] border-teal-500/[0.15]' 
                  : 'bg-gradient-to-br from-teal-50/80 to-emerald-50/80 border-teal-200'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
            >
              <h3 className={`font-semibold mb-4 flex items-center gap-2 ${isDark ? 'text-teal-300' : 'text-teal-600'}`}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                {t.roiCalculator}
              </h3>

              {/* Installation Cost Input */}
              <div className="mb-4">
                <label className={`text-sm mb-2 block ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{t.estimatedCost}</label>
                <input
                  type="range"
                  min="5000"
                  max="50000"
                  step="500"
                  value={installationCost}
                  onChange={(e) => setInstallationCost(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-teal-500"
                  style={{
                    background: isDark 
                      ? `linear-gradient(to right, rgb(20 184 166) 0%, rgb(20 184 166) ${((installationCost - 5000) / 45000) * 100}%, rgb(51 65 85 / 0.5) ${((installationCost - 5000) / 45000) * 100}%, rgb(51 65 85 / 0.5) 100%)`
                      : `linear-gradient(to right, rgb(20 184 166) 0%, rgb(20 184 166) ${((installationCost - 5000) / 45000) * 100}%, rgb(203 213 225) ${((installationCost - 5000) / 45000) * 100}%, rgb(203 213 225) 100%)`
                  }}
                />
                <div className="flex justify-between items-center mt-3 mb-1">
                  <span className="text-xs text-slate-500 leading-none">5&apos;000</span>
                  <span className={`text-2xl font-bold leading-tight ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{formatSwissCurrency(installationCost)}</span>
                  <span className="text-xs text-slate-500 leading-none">50&apos;000</span>
                </div>
              </div>

              {/* Calculated Results */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`rounded-lg p-3 border ${isDark ? 'bg-white/[0.05] border-white/10' : 'bg-white/80 border-teal-200'}`}>
                  <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.yourSubsidy}</div>
                  <div className={`text-xl font-bold ${isDark ? 'text-teal-300' : 'text-teal-600'}`}>
                    {formatSwissCurrency(calculatedSubsidy)}
                  </div>
                </div>
                <div className={`rounded-lg p-3 border ${isDark ? 'bg-white/[0.05] border-white/10' : 'bg-white/80 border-slate-200'}`}>
                  <div className={`text-xs mb-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{t.yourOutOfPocket}</div>
                  <div className={`text-xl font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                    {formatSwissCurrency(outOfPocket)}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Fixed Footer: Official Link + CTA Button */}
      <div className={`flex-shrink-0 p-5 pt-3 border-t relative z-10 ${
        isDark 
          ? 'border-slate-700/30 bg-[rgba(8,13,22,0.98)]' 
          : 'border-slate-200 bg-white/95'
      }`}>
        {canton.officialLink && (
          <a
            href={canton.officialLink}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full py-2.5 mb-2.5 text-center font-medium rounded-xl transition-all duration-200 border text-sm cursor-pointer ${
              isDark 
                ? 'bg-slate-700/40 hover:bg-slate-700/60 text-slate-300 border-slate-600/30' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'
            }`}
          >
            🔗 {t.learnMore} — {getCantonName(canton)} →
          </a>
        )}
        <a
          href="https://calendly.com/markus-malim/30min"
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full py-3.5 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-center font-semibold rounded-xl hover:from-teal-400 hover:to-emerald-400 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-teal-500/35 cursor-pointer"
        >
          {t.getQuote} →
        </a>
      </div>
    </div>
  );

  return (
    <AnimatePresence>
      {canton && (
        <>
          {/* Backdrop for mobile */}
          {isMobile && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
          )}
          
          {/* Desktop: Right drawer */}
          {!isMobile && (
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-[450px] z-50 hidden md:block"
            >
              {panelContent}
            </motion.div>
          )}
          
          {/* Mobile: Bottom sheet */}
          {isMobile && (
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              drag="y"
              dragControls={dragControls}
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.5 }}
              onDragEnd={handleDragEnd}
              className="fixed left-0 right-0 bottom-0 h-[75vh] z-50 md:hidden rounded-t-3xl overflow-hidden"
            >
              {panelContent}
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
