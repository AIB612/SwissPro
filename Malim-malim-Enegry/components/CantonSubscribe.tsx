'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const cantonOptions = [
  { id: 'ZH', name: 'Zürich' },
  { id: 'BE', name: 'Bern' },
  { id: 'GE', name: 'Genève' },
  { id: 'VD', name: 'Vaud' },
  { id: 'NE', name: 'Neuchâtel' },
  { id: 'BS', name: 'Basel-Stadt' },
  { id: 'TI', name: 'Ticino' },
  { id: 'AG', name: 'Aargau' },
  { id: 'BL', name: 'Basel-Landschaft' },
  { id: 'FR', name: 'Fribourg' },
  { id: 'GR', name: 'Graubünden' },
  { id: 'LU', name: 'Luzern' },
  { id: 'SG', name: 'St. Gallen' },
  { id: 'SO', name: 'Solothurn' },
  { id: 'TG', name: 'Thurgau' },
  { id: 'VS', name: 'Valais' },
  { id: 'ZG', name: 'Zug' },
  { id: 'SH', name: 'Schaffhausen' },
  { id: 'AR', name: 'Appenzell A.Rh.' },
  { id: 'AI', name: 'Appenzell I.Rh.' },
  { id: 'GL', name: 'Glarus' },
  { id: 'JU', name: 'Jura' },
  { id: 'NW', name: 'Nidwalden' },
  { id: 'OW', name: 'Obwalden' },
  { id: 'SZ', name: 'Schwyz' },
  { id: 'UR', name: 'Uri' },
];

const translations = {
  en: {
    title: 'Subsidy Alert',
    subtitle: 'Get notified when funding pools are running low or new subsidies are announced',
    selectCanton: 'Select Canton',
    emailPlaceholder: 'your@email.com',
    subscribe: 'Subscribe',
    subscribing: 'Subscribing...',
    success: 'Subscribed! We\'ll notify you about updates.',
    error: 'Something went wrong. Please try again.',
    privacy: 'We respect your privacy. Unsubscribe anytime.',
  },
  de: {
    title: 'Subventions-Alarm',
    subtitle: 'Erhalten Sie Benachrichtigungen, wenn Fördertöpfe fast leer sind oder neue Richtlinien veröffentlicht werden',
    selectCanton: 'Kanton wählen',
    emailPlaceholder: 'ihre@email.ch',
    subscribe: 'Abonnieren',
    subscribing: 'Wird abonniert...',
    success: 'Abonniert! Wir benachrichtigen Sie über Updates.',
    error: 'Etwas ist schiefgelaufen. Bitte versuchen Sie es erneut.',
    privacy: 'Wir respektieren Ihre Privatsphäre. Jederzeit abmelden.',
  },
  fr: {
    title: 'Alerte Subventions',
    subtitle: 'Soyez notifié lorsque les fonds sont presque épuisés ou que de nouvelles directives sont publiées',
    selectCanton: 'Choisir le canton',
    emailPlaceholder: 'votre@email.ch',
    subscribe: 'S\'abonner',
    subscribing: 'Abonnement...',
    success: 'Abonné! Nous vous informerons des mises à jour.',
    error: 'Une erreur s\'est produite. Veuillez réessayer.',
    privacy: 'Nous respectons votre vie privée. Désabonnez-vous à tout moment.',
  },
  it: {
    title: 'Avviso Sovvenzioni',
    subtitle: 'Ricevi notifiche quando i fondi stanno per esaurirsi o vengono pubblicate nuove linee guida',
    selectCanton: 'Seleziona cantone',
    emailPlaceholder: 'tua@email.ch',
    subscribe: 'Iscriviti',
    subscribing: 'Iscrizione...',
    success: 'Iscritto! Ti informeremo sugli aggiornamenti.',
    error: 'Qualcosa è andato storto. Riprova.',
    privacy: 'Rispettiamo la tua privacy. Cancellati in qualsiasi momento.',
  },
};

type Locale = 'en' | 'de' | 'fr' | 'it';

export default function CantonSubscribe({ locale = 'de', isDark = true }: { locale?: Locale; isDark?: boolean }) {
  const [canton, setCanton] = useState('');
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const t = translations[locale] || translations.de;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canton || !email) return;

    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ canton, email, locale, timestamp: new Date().toISOString() }),
      });
      if (res.ok) {
        setStatus('success');
        setCanton('');
        setEmail('');
        setTimeout(() => setStatus('idle'), 5000);
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <motion.div
      className={`relative rounded-2xl border p-4 md:p-6 overflow-hidden transition-colors duration-300 ${
        isDark 
          ? 'bg-gradient-to-br from-[rgba(15,23,42,0.8)] to-[rgba(20,30,50,0.8)] backdrop-blur-lg border-teal-500/[0.12]' 
          : 'bg-white border-slate-200 shadow-sm'
      }`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      {/* Decorative gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-teal-400/20 to-transparent" />
      
      {/* Bell icon + Title */}
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
          isDark 
            ? 'bg-gradient-to-br from-teal-500/20 to-emerald-500/20 border-teal-500/20' 
            : 'bg-gradient-to-br from-teal-50 to-emerald-50 border-teal-200'
        }`}>
          <svg className="w-5 h-5 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <div>
          <h3 className={`text-base md:text-lg font-semibold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{t.title}</h3>
          <p className={`text-xs hidden md:block ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t.subtitle}</p>
        </div>
      </div>
      
      <p className={`text-xs mb-4 md:hidden ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>{t.subtitle}</p>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        {/* Canton Select */}
        <select
          value={canton}
          onChange={(e) => setCanton(e.target.value)}
          className={`flex-1 border rounded-xl px-4 py-3 text-sm focus:outline-none transition-all appearance-none cursor-pointer ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50 text-slate-200 focus:border-teal-500/40 focus:shadow-[0_0_12px_rgba(20,184,166,0.1)]' 
              : 'bg-white border-slate-200 text-slate-700 focus:border-teal-500/50 focus:shadow-[0_0_12px_rgba(20,184,166,0.08)]'
          }`}
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2394a3b8'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
        >
          <option value="" disabled>{t.selectCanton}</option>
          {cantonOptions.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.emailPlaceholder}
          required
          className={`flex-1 border rounded-xl px-4 py-3 text-sm placeholder-slate-500 focus:outline-none transition-all ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50 text-slate-200 focus:border-teal-500/40 focus:shadow-[0_0_12px_rgba(20,184,166,0.1)]' 
              : 'bg-white border-slate-200 text-slate-700 focus:border-teal-500/50 focus:shadow-[0_0_12px_rgba(20,184,166,0.08)]'
          }`}
        />

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'loading' || !canton || !email}
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-semibold rounded-xl hover:from-teal-400 hover:to-emerald-400 active:scale-95 transition-all shadow-lg shadow-teal-500/15 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {status === 'loading' ? t.subscribing : t.subscribe}
        </button>
      </form>

      {/* Status Messages */}
      <AnimatePresence>
        {status === 'success' && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm text-teal-500 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {t.success}
          </motion.p>
        )}
        {status === 'error' && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-3 text-sm text-red-500"
          >
            {t.error}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Privacy note */}
      <p className={`mt-3 text-[10px] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{t.privacy}</p>
    </motion.div>
  );
}
