'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cantonSubsidies, CantonSubsidy } from '@/lib/data/cantons';
import { formatSwissCurrency } from '@/lib/utils/format';

const cantonIdMap: Record<string, string> = {
  'zurich': 'ZH',
  'bern': 'BE',
  'geneva': 'GE',
  'vaud': 'VD',
  'neuchatel': 'NE',
  'basel-stadt': 'BS',
  'ticino': 'TI',
  'thurgau': 'TG',
  'graubunden': 'GR',
  'aargau': 'AG',
  'appenzell-innerrhoden': 'AI',
  'appenzell-ausserrhoden': 'AR',
  'basel-landschaft': 'BL',
  'fribourg': 'FR',
  'glarus': 'GL',
  'jura': 'JU',
  'luzern': 'LU',
  'nidwalden': 'NW',
  'obwalden': 'OW',
  'st-gallen': 'SG',
  'schaffhausen': 'SH',
  'solothurn': 'SO',
  'schwyz': 'SZ',
  'uri': 'UR',
  'valais': 'VS',
  'zug': 'ZG',
};

const reverseCantonIdMap: Record<string, string> = Object.fromEntries(
  Object.entries(cantonIdMap).map(([k, v]) => [v, k])
);

interface GeoFeature {
  type: string;
  properties: { id: string; name: string };
  geometry: { type: string; coordinates: number[][][] | number[][][][] };
}

interface GeoJSON {
  type: string;
  features: GeoFeature[];
}

export default function SwissMap({
  onSelectCanton,
  selectedCanton,
  locale = 'de',
  zoomToCanton,
  isDark = true,
}: {
  onSelectCanton: (canton: CantonSubsidy | null) => void;
  selectedCanton: CantonSubsidy | null;
  locale?: 'en' | 'de' | 'fr' | 'it';
  zoomToCanton?: string | null;
  isDark?: boolean;
}) {
  const [geoData, setGeoData] = useState<GeoJSON | null>(null);
  const [hoveredCanton, setHoveredCanton] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [viewBox, setViewBox] = useState({ x: 0, y: 0, w: 800, h: 500 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; y: number; vx: number; vy: number } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const DEFAULT_VB = { x: 0, y: 0, w: 800, h: 500 };
  const MIN_ZOOM = 100; // minimum viewBox width
  const MAX_ZOOM = 1200; // maximum viewBox width

  const vbString = `${viewBox.x.toFixed(1)} ${viewBox.y.toFixed(1)} ${viewBox.w.toFixed(1)} ${viewBox.h.toFixed(1)}`;

  // Convert screen coords to SVG coords
  const screenToSVG = useCallback((clientX: number, clientY: number): { x: number; y: number } => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    return {
      x: viewBox.x + ((clientX - rect.left) / rect.width) * viewBox.w,
      y: viewBox.y + ((clientY - rect.top) / rect.height) * viewBox.h,
    };
  }, [viewBox]);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 1.12 : 0.88; // zoom out / zoom in
    const cursor = screenToSVG(e.clientX, e.clientY);

    setViewBox(prev => {
      const newW = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.w * zoomFactor));
      const newH = newW * (500 / 800); // maintain aspect ratio
      const ratio = newW / prev.w;
      const newX = cursor.x - (cursor.x - prev.x) * ratio;
      const newY = cursor.y - (cursor.y - prev.y) * ratio;
      return { x: newX, y: newY, w: newW, h: newH };
    });
  }, [screenToSVG]);

  // Drag to pan
  const handleMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (e.button !== 0) return; // left click only
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY, vx: viewBox.x, vy: viewBox.y };
  }, [viewBox]);

  const handleMouseMoveDrag = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const vb = viewBox;

    // Update tooltip position
    const svgX = vb.x + ((e.clientX - rect.left) / rect.width) * vb.w;
    const svgY = vb.y + ((e.clientY - rect.top) / rect.height) * vb.h;
    setMousePos({ x: svgX, y: svgY });

    // Handle drag
    if (isDragging && dragStart.current) {
      const dx = (e.clientX - dragStart.current.x) / rect.width * vb.w;
      const dy = (e.clientY - dragStart.current.y) / rect.height * vb.h;
      setViewBox(prev => ({ ...prev, x: dragStart.current!.vx - dx, y: dragStart.current!.vy - dy }));
    }
  }, [isDragging, viewBox]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  const legendText = {
    en: { homeMarket: 'Basel-Stadt (Home Market)', withSubsidy: 'With Subsidies', withoutSubsidy: 'Without Subsidies', noSubsidy: 'No subsidy' },
    de: { homeMarket: 'Basel-Stadt (Heimmarkt)', withSubsidy: 'Mit Subventionen', withoutSubsidy: 'Ohne Subventionen', noSubsidy: 'Keine Subvention' },
    fr: { homeMarket: 'Bâle-Ville (Marché principal)', withSubsidy: 'Avec subventions', withoutSubsidy: 'Sans subventions', noSubsidy: 'Pas de subvention' },
    it: { homeMarket: 'Basilea Città (Mercato principale)', withSubsidy: 'Con sovvenzioni', withoutSubsidy: 'Senza sovvenzioni', noSubsidy: 'Nessuna sovvenzione' },
  };
  const t = legendText[locale] || legendText.de;

  useEffect(() => {
    fetch('/geo/ch-cantons.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load GeoJSON:', err));
  }, []);

  const getCantonData = (geoId: string) => {
    const ourId = reverseCantonIdMap[geoId];
    return ourId ? cantonSubsidies.find(c => c.id === ourId) : null;
  };

  const projectCoord = (lon: number, lat: number): [number, number] => {
    const minLon = 5.9, maxLon = 10.5;
    const minLat = 45.8, maxLat = 47.85;
    const width = 800, height = 500;
    const padding = 40;
    const x = padding + ((lon - minLon) / (maxLon - minLon)) * (width - 2 * padding);
    const y = padding + ((maxLat - lat) / (maxLat - minLat)) * (height - 2 * padding);
    return [x, y];
  };

  const ringToPath = (ring: number[][]): string => {
    if (!ring || ring.length === 0) return '';
    const points = ring.map(([lon, lat]) => projectCoord(lon, lat));
    return points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ') + 'Z';
  };

  const featureToPath = (feature: GeoFeature): string => {
    try {
      if (feature.geometry.type === 'MultiPolygon') {
        const multiCoords = feature.geometry.coordinates as number[][][][];
        return multiCoords.map(polygon => polygon.map(ring => ringToPath(ring)).join(' ')).join(' ');
      } else {
        const polyCoords = feature.geometry.coordinates as number[][][];
        return polyCoords.map(ring => ringToPath(ring)).join(' ');
      }
    } catch { return ''; }
  };

  const getCantonCenter = useCallback((feature: GeoFeature): [number, number] => {
    try {
      let coords: number[][];
      if (feature.geometry.type === 'MultiPolygon') {
        const multi = feature.geometry.coordinates as number[][][][];
        let largest = multi[0][0];
        for (const poly of multi) {
          if (poly[0] && poly[0].length > largest.length) largest = poly[0];
        }
        coords = largest;
      } else {
        coords = (feature.geometry.coordinates as number[][][])[0];
      }
      if (!coords || coords.length === 0) return [400, 250];
      let sumLon = 0, sumLat = 0;
      coords.forEach(([lon, lat]) => { sumLon += lon; sumLat += lat; });
      return projectCoord(sumLon / coords.length, sumLat / coords.length);
    } catch { return [400, 250]; }
  }, []);

  const getCantonBBox = useCallback((feature: GeoFeature): { x: number; y: number; w: number; h: number } => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    const processCoords = (coords: number[][]) => {
      coords.forEach(([lon, lat]) => {
        const [x, y] = projectCoord(lon, lat);
        minX = Math.min(minX, x); minY = Math.min(minY, y);
        maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
      });
    };
    try {
      if (feature.geometry.type === 'MultiPolygon') {
        (feature.geometry.coordinates as number[][][][]).forEach(poly => poly.forEach(ring => processCoords(ring)));
      } else {
        (feature.geometry.coordinates as number[][][]).forEach(ring => processCoords(ring));
      }
    } catch { /* fallback */ }
    const pad = 60;
    return { x: minX - pad, y: minY - pad, w: (maxX - minX) + pad * 2, h: (maxY - minY) + pad * 2 };
  }, []);

  // Zoom to canton on search
  useEffect(() => {
    if (!zoomToCanton || !geoData) return;
    const geoId = cantonIdMap[zoomToCanton];
    if (!geoId) return;
    const feature = geoData.features.find(f => f.properties.id === geoId);
    if (!feature) return;
    const bbox = getCantonBBox(feature);
    const minSize = 200;
    if (bbox.w < minSize) { bbox.x -= (minSize - bbox.w) / 2; bbox.w = minSize; }
    if (bbox.h < minSize) { bbox.y -= (minSize - bbox.h) / 2; bbox.h = minSize; }
    const targetRatio = 800 / 500;
    const currentRatio = bbox.w / bbox.h;
    if (currentRatio > targetRatio) {
      const newH = bbox.w / targetRatio;
      bbox.y -= (newH - bbox.h) / 2;
      bbox.h = newH;
    } else {
      const newW = bbox.h * targetRatio;
      bbox.x -= (newW - bbox.w) / 2;
      bbox.w = newW;
    }
    setViewBox({ x: bbox.x, y: bbox.y, w: bbox.w, h: bbox.h });
  }, [zoomToCanton, geoData, getCantonBBox]);

  // Reset zoom when no canton selected
  useEffect(() => {
    if (!selectedCanton && !zoomToCanton) {
      setViewBox(DEFAULT_VB);
    }
  }, [selectedCanton, zoomToCanton]);

  // Prevent default scroll on SVG container
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const prevent = (e: WheelEvent) => e.preventDefault();
    svg.addEventListener('wheel', prevent, { passive: false });
    return () => svg.removeEventListener('wheel', prevent);
  }, []);

  const getCantonColor = (geoId: string) => {
    const canton = getCantonData(geoId);
    const isHome = canton?.isHomeMarket;
    const isSelected = selectedCanton && cantonIdMap[selectedCanton.id] === geoId;
    const isHovered = hoveredCanton === geoId;
    const hasSubsidy = canton && canton.maxAmount > 0 && canton.isActive;
    
    if (isDark) {
      // Dark mode colors
      if (isHome) return isHovered ? '#5eead4' : '#2dd4bf';
      if (isSelected && hasSubsidy) return '#14b8a6';
      if (isHovered && hasSubsidy) return '#10b981';
      if (hasSubsidy) {
        const intensity = canton.heatmapIntensity;
        if (intensity > 7) return '#0d9488';
        if (intensity > 4) return '#0f766e';
        return '#115e59';
      }
      return isHovered ? '#1e3a5f' : '#152238';
    } else {
      // Light mode colors - white background, light green-gray for no subsidy
      if (isHome) return isHovered ? '#14b8a6' : '#0d9488';
      if (isSelected && hasSubsidy) return '#0f766e';
      if (isHovered && hasSubsidy) return '#14b8a6';
      if (hasSubsidy) {
        const intensity = canton.heatmapIntensity;
        if (intensity > 7) return '#2dd4bf';
        if (intensity > 4) return '#5eead4';
        return '#99f6e4';
      }
      // No subsidy: light green-gray
      return isHovered ? '#d1d5db' : '#e5e7eb';
    }
  };

  const getStrokeColor = (geoId: string) => {
    const canton = getCantonData(geoId);
    const isHome = canton?.isHomeMarket;
    const isSelected = selectedCanton && cantonIdMap[selectedCanton.id] === geoId;
    const isHovered = hoveredCanton === geoId;
    const hasSubsidy = canton && canton.maxAmount > 0 && canton.isActive;
    
    if (isDark) {
      if (isSelected && hasSubsidy) return '#5eead4';
      if (isHome) return '#5eead4';
      if (isHovered && hasSubsidy) return '#2dd4bf';
      if (hasSubsidy) return 'rgba(45, 212, 191, 0.15)';
      if (isHovered) return 'rgba(148, 163, 184, 0.2)';
      return 'rgba(51, 65, 85, 0.5)';
    } else {
      if (isSelected && hasSubsidy) return '#0d9488';
      if (isHome) return '#0d9488';
      if (isHovered && hasSubsidy) return '#14b8a6';
      if (hasSubsidy) return 'rgba(20, 184, 166, 0.3)';
      if (isHovered) return 'rgba(100, 116, 139, 0.3)';
      return 'rgba(148, 163, 184, 0.4)';
    }
  };

  const getStrokeWidth = (geoId: string) => {
    const canton = getCantonData(geoId);
    const isSelected = selectedCanton && cantonIdMap[selectedCanton.id] === geoId;
    const isHome = canton?.isHomeMarket;
    const isHovered = hoveredCanton === geoId;
    const hasSubsidy = canton && canton.maxAmount > 0 && canton.isActive;
    if (isSelected && hasSubsidy) return 1.2;
    if (isHome) return 1.2;
    if (isHovered && hasSubsidy) return 0.8;
    return 0.4;
  };

  const getFilter = (geoId: string) => {
    const canton = getCantonData(geoId);
    const isSelected = selectedCanton && cantonIdMap[selectedCanton.id] === geoId;
    const hasSubsidy = canton && canton.maxAmount > 0 && canton.isActive;
    if (isSelected && hasSubsidy) return 'url(#activeGlow)';
    if (canton?.isHomeMarket) return 'url(#strongGlow)';
    return undefined;
  };

  if (!geoData) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex items-center justify-center p-2 md:p-4 relative">
      <svg
        ref={svgRef}
        viewBox={vbString}
        className="w-full h-full max-w-4xl select-none"
        style={{ 
          transition: isDragging ? 'none' : 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMoveDrag}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { setMousePos(null); handleMouseUp(); }}
      >
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="strongGlow"><feGaussianBlur stdDeviation="4" result="coloredBlur" /><feFlood floodColor="#2dd4bf" floodOpacity="0.2" result="glowColor" /><feComposite in="glowColor" in2="coloredBlur" operator="in" result="softGlow" /><feMerge><feMergeNode in="softGlow" /><feMergeNode in="softGlow" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <filter id="activeGlow"><feGaussianBlur stdDeviation="3.5" result="blur1" /><feFlood floodColor="#5eead4" floodOpacity="0.18" result="glowColor" /><feComposite in="glowColor" in2="blur1" operator="in" result="softGlow" /><feGaussianBlur in="softGlow" stdDeviation="2" result="outerGlow" /><feMerge><feMergeNode in="outerGlow" /><feMergeNode in="softGlow" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="mapBgDark" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0f1d2f" />
            <stop offset="50%" stopColor="#0c1625" />
            <stop offset="100%" stopColor="#091220" />
          </linearGradient>
          <linearGradient id="mapBgLight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="50%" stopColor="#f8fafc" />
            <stop offset="100%" stopColor="#f1f5f9" />
          </linearGradient>
          <radialGradient id="mapVignetteDark" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.4)" />
          </radialGradient>
          <radialGradient id="mapVignetteLight" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.05)" />
          </radialGradient>
        </defs>

        <rect x="-200" y="-200" width="1200" height="900" fill={isDark ? "url(#mapBgDark)" : "url(#mapBgLight)"} />
        <rect x="-200" y="-200" width="1200" height="900" fill={isDark ? "url(#mapVignetteDark)" : "url(#mapVignetteLight)"} />

        {geoData.features.map((feature, idx) => {
          const geoId = feature.properties.id;
          const canton = getCantonData(geoId);
          const path = featureToPath(feature);
          return (
            <motion.path
              key={geoId}
              d={path}
              fill={getCantonColor(geoId)}
              stroke={getStrokeColor(geoId)}
              strokeWidth={getStrokeWidth(geoId)}
              filter={getFilter(geoId)}
              style={{ cursor: canton ? 'pointer' : 'default', transition: 'fill 0.2s, stroke 0.2s, stroke-width 0.2s' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: idx * 0.015 }}
              onMouseEnter={() => setHoveredCanton(geoId)}
              onMouseLeave={() => setHoveredCanton(null)}
              onClick={() => canton && onSelectCanton(canton)}
            />
          );
        })}

        {geoData.features.map(feature => {
          const geoId = feature.properties.id;
          const canton = getCantonData(geoId);
          if (!canton?.isHomeMarket) return null;
          const [cx, cy] = getCantonCenter(feature);
          return (
            <g key={`pulse-${geoId}`}>
              <circle cx={cx} cy={cy} r="12" fill="none" stroke="#5eead4" strokeWidth="1.5" opacity="0.4">
                <animate attributeName="r" from="6" to="22" dur="2.5s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.5" to="0" dur="2.5s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r="10" fill="none" stroke="#2dd4bf" strokeWidth="1" opacity="0.3">
                <animate attributeName="r" from="5" to="18" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
                <animate attributeName="opacity" from="0.4" to="0" dur="2.5s" begin="0.8s" repeatCount="indefinite" />
              </circle>
              <circle cx={cx} cy={cy} r="4" fill="#2dd4bf" filter="url(#glow)" />
            </g>
          );
        })}

        {hoveredCanton && mousePos && (() => {
          const canton = getCantonData(hoveredCanton);
          const feature = geoData.features.find(f => f.properties.id === hoveredCanton);
          if (!feature) return null;
          const label = canton
            ? (locale === 'fr' ? canton.nameFR : locale === 'it' ? (canton.nameIT || canton.name) : locale === 'de' ? canton.nameDE : canton.name)
            : feature.properties.name;
          const subsidy = canton && canton.maxAmount > 0 && canton.isActive ? formatSwissCurrency(canton.maxAmount) : t.noSubsidy;
          const hasSubsidy = canton && canton.maxAmount > 0 && canton.isActive;
          const tooltipX = Math.max(80, Math.min(720, mousePos.x));
          const tooltipY = Math.max(40, mousePos.y - 20);
          return (
            <g transform={`translate(${tooltipX}, ${tooltipY})`} style={{ pointerEvents: 'none' }}>
              <rect x="-75" y="-32" width="150" height="42" rx="12" fill={isDark ? "rgba(6,10,18,0.92)" : "rgba(255,255,255,0.95)"} stroke={hasSubsidy ? (isDark ? 'rgba(45,212,191,0.25)' : 'rgba(20,184,166,0.4)') : (isDark ? 'rgba(148,163,184,0.08)' : 'rgba(148,163,184,0.3)')} strokeWidth="1" />
              <text x="0" y="-13" textAnchor="middle" fill={isDark ? "#e2e8f0" : "#1e293b"} fontSize="11" fontWeight="600" fontFamily="system-ui, sans-serif">{label}</text>
              <text x="0" y="4" textAnchor="middle" fill={hasSubsidy ? (isDark ? '#5eead4' : '#0d9488') : '#64748b'} fontSize="10" fontFamily="system-ui, sans-serif">{subsidy}</text>
            </g>
          );
        })()}

        <g transform="translate(30, 460)">
          <rect x="-10" y="-18" width="520" height="36" rx="10" fill={isDark ? "rgba(6,10,18,0.85)" : "rgba(255,255,255,0.9)"} stroke={isDark ? "rgba(45,212,191,0.08)" : "rgba(148,163,184,0.3)"} strokeWidth="1" />
          <circle cx="10" cy="0" r="5" fill="#2dd4bf" filter="url(#glow)" />
          <text x="24" y="4" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="10" fontFamily="system-ui, sans-serif">{t.homeMarket}</text>
          <rect x="190" y="-6" width="14" height="14" rx="3" fill={isDark ? "#0f766e" : "#2dd4bf"} stroke={isDark ? "rgba(45,212,191,0.2)" : "rgba(20,184,166,0.5)"} strokeWidth="0.5" />
          <text x="212" y="5" fill={isDark ? "#94a3b8" : "#64748b"} fontSize="10" fontFamily="system-ui, sans-serif">{t.withSubsidy}</text>
          <rect x="350" y="-6" width="14" height="14" rx="3" fill={isDark ? "#0f172a" : "#e5e7eb"} stroke={isDark ? "rgba(148,163,184,0.1)" : "rgba(148,163,184,0.4)"} strokeWidth="0.5" />
          <text x="372" y="5" fill="#64748b" fontSize="10" fontFamily="system-ui, sans-serif">{t.withoutSubsidy}</text>
        </g>
      </svg>

      {/* Reset zoom button */}
      {(viewBox.w !== 800 || viewBox.x !== 0 || viewBox.y !== 0) && (
        <button
          onClick={() => { setViewBox(DEFAULT_VB); onSelectCanton(null); }}
          className={`absolute top-3 right-3 px-3 py-1.5 active:scale-95 backdrop-blur-md rounded-lg border text-xs transition-all duration-200 ${
            isDark 
              ? 'bg-white/[0.08] hover:bg-white/[0.15] border-white/[0.08] text-white/70' 
              : 'bg-slate-800/80 hover:bg-slate-900 border-slate-700 text-white shadow-lg'
          }`}
        >
          ← Übersicht
        </button>
      )}
    </div>
  );
}
