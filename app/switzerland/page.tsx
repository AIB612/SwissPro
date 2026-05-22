'use client';

import { useState } from 'react';
import Link from 'next/link';
import { categories, cities, swissLinks, allCantons } from './data';

export default function SwitzerlandPage() {
  const [selectedCategory, setSelectedCategory] = useState('work');
  const [selectedCanton, setSelectedCanton] = useState('all');

  const currentCategory = categories.find((c) => c.id === selectedCategory);
  const currentLinks = currentCategory?.links || [];

  return (
    <div className="mx-auto max-w-7xl px-4 pb-12 md:px-6">
      {/* Category Filter */}
      <div className="border-b pb-4 mb-6 border-slate-200">
        <div className="hidden md:flex flex-wrap items-center gap-x-4 gap-y-3 text-sm md:text-[15px]">
          <span className="text-slate-400">Kategorien</span>
          {categories.map((cat, idx) => (
            <div key={cat.id} className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative pb-1 transition-all duration-300 ${
                  selectedCategory === cat.id
                    ? 'text-slate-900 font-bold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-all after:duration-300 after:scale-x-100 after:bg-gradient-to-r after:from-red-600 after:to-rose-600'
                    : 'text-slate-500 hover:text-red-600 font-medium after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-all after:duration-300 after:scale-x-0 hover:after:scale-x-100 after:bg-gradient-to-r after:from-red-500 after:to-rose-500'
                }`}
              >
                {cat.name}
              </button>
              {idx < categories.length - 1 && <span className="text-slate-300">-</span>}
            </div>
          ))}
        </div>

        {/* Mobile Category Select */}
        <div className="md:hidden">
          <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-400">
            Kategorien
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full rounded-lg border px-4 py-3 text-sm font-medium transition-colors bg-white border-slate-200 text-slate-900"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_240px]">
        {/* Category Links */}
        <div>
          <div className="mb-8">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] text-slate-400">
              Ausgewählter Bereich
            </div>
            <h1 className="text-xl font-semibold tracking-tight md:text-2xl lg:text-4xl text-slate-900">
              {selectedCanton === 'all' ? 'Alle' : allCantons.find((c) => c.id === selectedCanton)?.name} × {currentCategory?.name}
            </h1>
            <p className="mt-2 max-w-3xl text-xs leading-6 md:text-sm md:leading-7 text-slate-600">
              Gemeinsame Schweiz-Links · {currentCategory?.description}
            </p>
          </div>

          <section>
            <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">
              Themenlinks
            </div>
            <div className="space-y-2 md:space-y-3 border-l pl-3 md:pl-4 border-slate-200">
              {currentLinks.length > 0 ? (
                currentLinks.map((link) => (
                  <a
                    key={link.url}
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-xs md:text-sm leading-6 md:leading-7 underline-offset-4 hover:underline hover:text-red-500 text-slate-700"
                  >
                    {link.text}
                  </a>
                ))
              ) : (
                <p className="text-xs md:text-sm text-slate-400">Keine Links verfügbar</p>
              )}
            </div>
          </section>
        </div>

        {/* Swiss-wide Links */}
        <div>
          <div className="mb-8 hidden lg:block">
            <div className="mb-2 text-xs uppercase tracking-[0.18em] opacity-0 text-slate-400">
              Ausgewählter Bereich
            </div>
            <h2 className="text-2xl font-semibold tracking-tight md:text-4xl opacity-0">
              placeholder
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-7 opacity-0">placeholder</p>
          </div>

          <section>
            <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">
              Städte links
            </div>
            <div className="border-l pl-3 md:pl-4 border-slate-200">
              <div className="mb-4 last:mb-0">
                <div className="mb-2 text-xs md:text-sm font-medium text-slate-800">
                  Schweizweit
                </div>
                <div className="space-y-2">
                  {swissLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-xs md:text-sm leading-6 md:leading-7 underline-offset-4 hover:underline hover:text-red-500 text-slate-700"
                    >
                      {link.text}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Canton Sidebar */}
        <aside className="hidden lg:block lg:sticky lg:top-24 lg:self-start text-slate-700">
          <div className="mb-3 text-xs uppercase tracking-[0.18em] text-slate-400">Kantone</div>
          <div className="max-h-[70vh] space-y-3 overflow-auto border-l pl-4 border-slate-200">
            {allCantons.map((canton) => (
              <button
                key={canton.id}
                type="button"
                onClick={() => setSelectedCanton(canton.id)}
                className={`relative block text-left text-sm pb-1 transition-all duration-300 ${
                  selectedCanton === canton.id
                    ? 'text-slate-900 font-bold after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-all after:duration-300 after:scale-x-100 after:bg-gradient-to-r after:from-red-600 after:to-rose-600'
                    : 'text-slate-500 hover:text-red-600 font-medium after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:transition-all after:duration-300 after:scale-x-0 hover:after:scale-x-100 after:bg-gradient-to-r after:from-red-500 after:to-rose-500'
                }`}
              >
                <span className="mr-2">🇨🇭</span>
                {canton.name}
                <span className="ml-2 text-xs text-slate-400">{canton.code}</span>
              </button>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}
