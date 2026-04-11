/**
 * Map Tab — Interactive unit map with download functionality
 *
 * Wrapper component for UnitMap with controls:
 * - Tag type toggle (Any Elk | Antlerless)
 * - Year selector dropdown
 * - Download as PDF button (via window.print())
 */

import { useState, useMemo } from 'react';
import { UnitMap } from './UnitMap';
import type { DrawRecord } from '@models/draw';

interface MapTabProps {
  records: DrawRecord[];
  userPoints: number;
  userTagType: 'any_elk' | 'antlerless';
  setUserTagType?: (tagType: 'any_elk' | 'antlerless') => void;
}

export function MapTab({ records, userPoints, userTagType, setUserTagType }: MapTabProps) {
  // Get unique years from records, sorted descending
  const availableYears = useMemo(() => {
    return [...new Set(records.map(r => r.year))].sort((a, b) => b - a);
  }, [records]);

  const [selectedYear, setSelectedYear] = useState(availableYears[0] || new Date().getFullYear());

  const handleDownloadPDF = () => {
    // The @media print CSS in index.css handles PDF rendering
    window.print();
  };

  return (
    <div className="space-y-4">
      {/* Header with controls */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Title */}
          <div>
            <h2 className="text-lg font-heading text-cream uppercase tracking-wide">
              Unit Map
            </h2>
            <p className="text-xs text-parchment mt-1">
              Draw odds by unit for {selectedYear}
            </p>
          </div>

          {/* Controls */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Tag Type Toggle */}
            <div className="flex gap-1 bg-surface-2 rounded-lg p-1">
              <button
                onClick={() => setUserTagType?.('any_elk')}
                className={`px-3 py-2 rounded transition-colors font-heading text-xs uppercase tracking-wide ${
                  userTagType === 'any_elk'
                    ? 'bg-amber-dark text-forest'
                    : 'text-parchment hover:text-cream'
                }`}
              >
                Any Elk
              </button>
              <button
                onClick={() => setUserTagType?.('antlerless')}
                className={`px-3 py-2 rounded transition-colors font-heading text-xs uppercase tracking-wide ${
                  userTagType === 'antlerless'
                    ? 'bg-amber-dark text-forest'
                    : 'text-parchment hover:text-cream'
                }`}
              >
                Antlerless
              </button>
            </div>

            {/* Year Selector */}
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(Number(e.target.value))}
              className="px-3 py-2 bg-surface-2 border border-border rounded text-cream text-xs font-mono focus:outline-none focus:border-amber-dark transition-colors"
            >
              {availableYears.map(year => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            {/* Download PDF Button */}
            <button
              onClick={handleDownloadPDF}
              className="px-3 py-2 bg-amber-dark text-forest rounded font-heading text-xs uppercase tracking-wide hover:bg-gold transition-colors"
              title="Download map as PDF (uses browser print)"
            >
              📥 Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Map */}
      <UnitMap
        records={records}
        userPoints={userPoints}
        userTagType={userTagType}
        year={selectedYear}
      />

      {/* Info Panel */}
      <div className="bg-surface-2/50 border border-border rounded p-3 text-xs text-parchment space-y-2">
        <p>
          <strong>💡 How to use:</strong> Hover over units to see current odds. Click the tag
          type toggle to switch between Any Elk and Antlerless draws.
        </p>
        <p>
          This map shows your estimated draw odds for the selected year based on{' '}
          <strong>{userPoints} preference points</strong> in the corresponding pool.
        </p>
        <p>
          <strong>Note:</strong> Odds are approximate. Official GFP draw statistics are
          authoritative.
        </p>
      </div>
    </div>
  );
}
