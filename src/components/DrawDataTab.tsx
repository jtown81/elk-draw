/**
 * Draw Data Tab — Read-Only Seed Data
 *
 * Displays GFP draw statistics loaded from bundled seed data.
 * Read-only view with export functionality for power users.
 */

import { SEED_DRAW_DATA } from '@data/seed-draw-data';
import { DrawDataTable } from './DrawDataTable';
import { AdPlaceholder } from './ads/AdPlaceholder';

interface DrawDataTabProps {
  userId: string;
  accountName: string;
}

export function DrawDataTab({}: DrawDataTabProps) {
  const handleExport = () => {
    const dataStr = JSON.stringify(SEED_DRAW_DATA, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elk-draw-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
        <div>
          <h2 className="text-3xl font-heading text-cream uppercase tracking-wide">
            DRAW DATA
          </h2>
          <p className="text-parchment mt-2">
            GFP statistics loaded for {SEED_DRAW_DATA.length} records
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="text-xs text-parchment">
            Last updated: April 2026
          </div>
          <button
            onClick={handleExport}
            className="px-4 py-2 font-heading text-sm text-amber-dark hover:text-gold border border-amber-dark hover:border-gold rounded transition-colors"
          >
            ⬇️ EXPORT
          </button>
        </div>
      </div>

      {/* Ad Banner */}
      <AdPlaceholder size="banner" />

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-parchment text-xs font-heading uppercase tracking-wide">
            Total Records
          </div>
          <div className="text-2xl font-display text-gold mt-2">
            {SEED_DRAW_DATA.length}
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-parchment text-xs font-heading uppercase tracking-wide">
            Unique Units
          </div>
          <div className="text-2xl font-display text-gold mt-2">
            {new Set(SEED_DRAW_DATA.map(r => r.unitName)).size}
          </div>
        </div>
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="text-parchment text-xs font-heading uppercase tracking-wide">
            Year Range
          </div>
          <div className="text-2xl font-display text-gold mt-2">
            {SEED_DRAW_DATA.length > 0
              ? `${Math.min(...SEED_DRAW_DATA.map(r => r.year))}–${Math.max(...SEED_DRAW_DATA.map(r => r.year))}`
              : '—'}
          </div>
        </div>
      </div>

      {/* Ad Rectangle */}
      <AdPlaceholder size="rectangle" />

      {/* Data Table */}
      <DrawDataTable records={SEED_DRAW_DATA} />
    </div>
  );
}
