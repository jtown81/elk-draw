/**
 * Odds Table — Mobile Cards + Desktop Table
 *
 * Displays calculated odds for all units with dark theme styling.
 * Mobile: card-per-unit layout with collapsible history
 * Desktop: traditional table with color-coded odds and historical columns
 *
 * Memoized to prevent unnecessary recalculations.
 */

import { useMemo, memo, useState } from 'react';
import type { DrawRecord, OddsResult } from '@models/draw';
import { getQualifyingPool, calcOdds, couldUserDraw } from '@modules/odds-calculator';

interface OddsTableProps {
  records: DrawRecord[];
  userPoints: number;
  userTagType: 'any_elk' | 'antlerless';
}

function OddsTableComponent({ records, userPoints, userTagType }: OddsTableProps) {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  // Calculate odds for all records
  const oddsResults = useMemo(() => {
    const userPool = getQualifyingPool(userPoints);
    const results: OddsResult[] = [];

    // Group records by unit + tag type
    const grouped = new Map<string, DrawRecord[]>();
    records.forEach(record => {
      if (record.tagType !== userTagType) return; // Filter by tag type

      const unitKey = `${record.unitName}-${record.tagType}`;
      if (!grouped.has(unitKey)) {
        grouped.set(unitKey, []);
      }
      grouped.get(unitKey)!.push(record);
    });

    // Calculate odds for each unit
    grouped.forEach((unitRecords) => {
      const latest = unitRecords.sort((a, b) => b.year - a.year)[0];

      // Find pool data matching user's qualifying pool
      const poolData = latest.pools.find(p => p.pool === userPool);
      if (!poolData) return; // No matching pool

      // Check if user could have drawn based on lowest point
      if (!couldUserDraw(userPoints, poolData.lowestPointDrawn)) {
        return; // User didn't qualify in this draw
      }

      const odds = calcOdds(userPoints, userPool, poolData.applicants, poolData.tagsAvailable);

      // Collect historical odds
      const historicalOdds = unitRecords
        .map(record => {
          const hp = record.pools.find(p => p.pool === userPool);
          if (!hp) return null;
          if (!couldUserDraw(userPoints, hp.lowestPointDrawn)) return null;

          return {
            year: record.year,
            oddsPercent: calcOdds(userPoints, userPool, hp.applicants, hp.tagsAvailable),
            applicants: hp.applicants,
            tagsAvailable: hp.tagsAvailable,
            lowestPointDrawn: hp.lowestPointDrawn,
          };
        })
        .filter(Boolean);

      results.push({
        unitName: latest.unitName,
        year: latest.year,
        tagType: latest.tagType,
        qualifyingPool: userPool,
        userEntries: (userPoints + 1) ** 3,
        tagsAvailable: poolData.tagsAvailable,
        applicants: poolData.applicants,
        lowestPointDrawn: poolData.lowestPointDrawn,
        oddsPercent: odds,
        historicalOdds: historicalOdds as any,
      });
    });

    // Sort by odds descending (best odds first)
    return results.sort((a, b) => b.oddsPercent - a.oddsPercent);
  }, [records, userPoints, userTagType]);

  if (oddsResults.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-lg" role="region" aria-label="No results">
        <div className="empty-state">
          <div className="empty-state-icon">📊</div>
          <h3 className="empty-state-title">No Matching Data</h3>
          <p className="empty-state-description">
            No units found for {userTagType === 'any_elk' ? 'Any Elk' : 'Antlerless'} tag type.
          </p>
        </div>
      </div>
    );
  }

  const getOddsColor = (odds: number): { border: string; text: string; bg: string } => {
    if (odds >= 5) return { border: 'border-l-gold', text: 'text-gold', bg: 'bg-gold/10' };
    if (odds >= 2) return { border: 'border-l-amber-dark', text: 'text-amber-dark', bg: 'bg-amber-dark/10' };
    return { border: 'border-l-danger', text: 'text-danger', bg: 'bg-danger/10' };
  };

  const topThree = oddsResults.slice(0, 3).map(r => r.unitName);

  // Get all unique years from records for historical columns
  const allYears = [...new Set(records.map(r => r.year))].sort((a, b) => b - a);

  // Mobile Card View
  return (
    <>
      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {oddsResults.map((result) => {
          const colors = getOddsColor(result.oddsPercent);
          const isTopThree = topThree.includes(result.unitName);
          const isExpanded = expandedCard === result.unitName;

          return (
            <div
              key={`${result.unitName}-${result.tagType}`}
              className={`${colors.border} border-l-4 bg-surface border border-border rounded-r-lg overflow-hidden transition-colors`}
            >
              {/* Card Header */}
              <div
                className="p-4 cursor-pointer hover:bg-surface-2 transition-colors"
                onClick={() => setExpandedCard(isExpanded ? null : result.unitName)}
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Unit & Odds */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-heading text-cream">{result.unitName}</span>
                      {isTopThree && (
                        <span className="text-xs font-heading bg-gold/20 text-gold px-2 py-1 rounded">
                          TOP PICK
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-parchment mt-1">
                      {result.year} • {result.tagsAvailable} tags available
                    </div>
                  </div>

                  {/* Large Odds % */}
                  <div className={`text-3xl font-display ${colors.text}`}>
                    {result.oddsPercent.toFixed(1)}%
                  </div>
                </div>

                {/* Quick Stats Row */}
                <div className="flex gap-3 mt-3 text-xs text-parchment">
                  <span>{result.applicants.toLocaleString()} applicants</span>
                  {result.lowestPointDrawn && (
                    <span className={result.lowestPointDrawn > userPoints ? 'text-danger' : 'text-meadow'}>
                      Lowest: {result.lowestPointDrawn}
                    </span>
                  )}
                </div>
              </div>

              {/* Expanded History */}
              {isExpanded && result.historicalOdds.length > 0 && (
                <div className="px-4 pb-4 border-t border-border bg-surface-2/50">
                  <div className="text-xs font-heading text-parchment uppercase tracking-wider mb-3 mt-3">
                    History
                  </div>
                  <div className="space-y-2">
                    {result.historicalOdds.map(hist => (
                      <div key={hist.year} className="flex justify-between text-xs text-parchment">
                        <span>{hist.year}</span>
                        <span>{hist.oddsPercent.toFixed(1)}%</span>
                        <span className="text-bark">({hist.applicants})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header */}
          <thead className="bg-surface-2 border-b border-border sticky top-0">
            <tr>
              <th className="px-4 py-3 text-left font-heading text-xs uppercase text-parchment">
                Unit
              </th>
              <th className="px-4 py-3 text-center font-heading text-xs uppercase text-parchment">
                Your Odds
              </th>
              <th className="px-4 py-3 text-center font-heading text-xs uppercase text-parchment">
                Tags
              </th>
              <th className="px-4 py-3 text-center font-heading text-xs uppercase text-parchment">
                Applicants
              </th>
              <th className="px-4 py-3 text-center font-heading text-xs uppercase text-parchment">
                Lowest Pt
              </th>
              {allYears.slice(0, 3).map(year => (
                <th
                  key={year}
                  className="px-3 py-3 text-center font-heading text-xs uppercase text-parchment bg-surface"
                >
                  {year}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-border">
            {oddsResults.map((result, index) => {
              const colors = getOddsColor(result.oddsPercent);
              const isTopThree = topThree.includes(result.unitName);
              const bgClass = index % 2 === 0 ? 'bg-surface' : 'bg-surface-2';

              return (
                <tr
                  key={`${result.unitName}-${result.tagType}`}
                  className={`${bgClass} hover:bg-amber-dark/5 transition-colors ${isTopThree ? 'border-l-2 border-l-gold' : ''}`}
                >
                  {/* Unit Name */}
                  <td className="px-4 py-3 font-heading text-cream flex items-center gap-2">
                    {result.unitName}
                    {isTopThree && <span className="text-xs bg-gold/20 text-gold px-2 py-1 rounded font-heading">TOP</span>}
                  </td>

                  {/* Odds % (colored pill) */}
                  <td className={`px-4 py-3 text-center font-display text-lg ${colors.text}`}>
                    ~{result.oddsPercent.toFixed(2)}%
                  </td>

                  {/* Tags */}
                  <td className="px-4 py-3 text-center font-mono text-cream">
                    {result.tagsAvailable}
                  </td>

                  {/* Applicants */}
                  <td className="px-4 py-3 text-center font-mono text-cream">
                    {result.applicants.toLocaleString()}
                  </td>

                  {/* Lowest Point Drawn */}
                  <td className="px-4 py-3 text-center font-mono">
                    {result.lowestPointDrawn ? (
                      <span
                        className={
                          result.lowestPointDrawn > userPoints
                            ? 'text-danger font-semibold'
                            : 'text-meadow'
                        }
                      >
                        {result.lowestPointDrawn}
                      </span>
                    ) : (
                      <span className="text-bark">—</span>
                    )}
                  </td>

                  {/* Historical Years */}
                  {allYears.slice(0, 3).map(year => {
                    const historical = result.historicalOdds.find(h => h.year === year);
                    return (
                      <td
                        key={year}
                        className="px-3 py-3 text-center text-xs bg-surface"
                      >
                        {historical ? (
                          <>
                            <div className="font-mono text-cream">~{historical.oddsPercent.toFixed(2)}%</div>
                            <div className="text-parchment text-xs">{historical.applicants}</div>
                          </>
                        ) : (
                          <span className="text-bark">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="bg-surface-2 px-4 py-3 border-t border-border text-xs text-parchment space-y-2 md:space-y-0 md:flex md:flex-wrap md:gap-6">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-gold" />
          <span>≥5% — Good odds</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-amber-dark" />
          <span>2–5% — Fair odds</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-danger" />
          <span>&lt;2% — Low odds</span>
        </div>
      </div>
    </>
  );
}

/**
 * Memoized OddsTable to prevent unnecessary re-renders.
 */
export const OddsTable = memo(OddsTableComponent);
