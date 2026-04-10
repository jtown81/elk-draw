/**
 * Odds Table
 *
 * Displays calculated odds for all units, sorted by best odds.
 * Shows historical trends across years and pool information.
 *
 * Memoized to prevent unnecessary recalculations when parent re-renders
 * with same data (props are stable).
 */

import { useMemo, memo } from 'react';
import type { DrawRecord, OddsResult } from '@models/draw';
import { getQualifyingPool, calcOdds, couldUserDraw } from '@modules/odds-calculator';

interface OddsTableProps {
  records: DrawRecord[];
  userPoints: number;
  userTagType: 'any_elk' | 'antlerless';
}

function OddsTableComponent({ records, userPoints, userTagType }: OddsTableProps) {
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

      const odds = calcOdds(userPoints, userPool, poolData.applicants);

      // Collect historical odds
      const historicalOdds = unitRecords
        .map(record => {
          const hp = record.pools.find(p => p.pool === userPool);
          if (!hp) return null;
          if (!couldUserDraw(userPoints, hp.lowestPointDrawn)) return null;

          return {
            year: record.year,
            oddsPercent: calcOdds(userPoints, userPool, hp.applicants),
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
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <div className="text-gray-400 text-3xl mb-3">📊</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Matching Data</h3>
        <p className="text-gray-600">
          No units found for {userTagType === 'any_elk' ? 'Any Elk' : 'Antlerless'} tag type.
          Add data in the "Enter Data" tab to calculate odds.
        </p>
      </div>
    );
  }

  // Get all unique years from records for historical columns
  const allYears = [...new Set(records.map(r => r.year))].sort((a, b) => b - a);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          {/* Header */}
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-900">Unit</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Your Odds %</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Tags</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Applicants</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-900">Lowest Pt</th>
              {allYears.slice(0, 3).map(year => (
                <th
                  key={year}
                  className="px-3 py-3 text-center font-semibold text-gray-700 bg-gray-50"
                >
                  {year}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-200">
            {oddsResults.map((result) => {
              // Get odds color
              const oddsColor =
                result.oddsPercent >= 5
                  ? 'text-green-700 bg-green-50'
                  : result.oddsPercent >= 2
                    ? 'text-yellow-700 bg-yellow-50'
                    : 'text-red-700 bg-red-50';

              return (
                <tr key={`${result.unitName}-${result.tagType}`} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-semibold text-gray-900">{result.unitName}</td>

                  {/* Odds % */}
                  <td className={`px-4 py-3 text-center font-bold ${oddsColor} rounded`}>
                    ~{result.oddsPercent.toFixed(2)}%
                  </td>

                  {/* Tags */}
                  <td className="px-4 py-3 text-center text-gray-700">
                    {result.tagsAvailable}
                  </td>

                  {/* Applicants */}
                  <td className="px-4 py-3 text-center text-gray-700">
                    {result.applicants.toLocaleString()}
                  </td>

                  {/* Lowest Point Drawn */}
                  <td className="px-4 py-3 text-center text-gray-700">
                    {result.lowestPointDrawn ? (
                      <span
                        className={
                          result.lowestPointDrawn > userPoints
                            ? 'text-red-600 font-semibold'
                            : 'text-green-600'
                        }
                      >
                        {result.lowestPointDrawn}
                      </span>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </td>

                  {/* Historical Years */}
                  {allYears.slice(0, 3).map(year => {
                    const historical = result.historicalOdds.find(h => h.year === year);
                    return (
                      <td
                        key={year}
                        className="px-3 py-3 text-center text-gray-600 bg-gray-50 text-xs"
                      >
                        {historical ? (
                          <>
                            <div className="font-medium">~{historical.oddsPercent.toFixed(2)}%</div>
                            <div className="text-gray-500">{historical.applicants}</div>
                          </>
                        ) : (
                          <span className="text-gray-300">—</span>
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
      <div className="bg-gray-50 px-4 py-3 border-t text-xs text-gray-600">
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded font-medium">
              ≥5%
            </span>
            Good odds
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded font-medium">
              2–5%
            </span>
            Fair odds
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 bg-red-50 text-red-700 rounded font-medium">
              &lt;2%
            </span>
            Low odds
          </div>
          <div className="flex items-center gap-2">
            <span className="text-red-600 font-semibold">Lowest Pt</span>
            Red = didn't draw (pt too low)
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Memoized OddsTable to prevent unnecessary re-renders.
 * Only recalculates when records, userPoints, or userTagType change.
 */
export const OddsTable = memo(OddsTableComponent);
