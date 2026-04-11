/**
 * Draw Data Table — Read-Only Grouped Display
 *
 * Mobile: card-per-record layout
 * Desktop: grouped table with unit/year rowspan
 */

import { useState, useMemo } from 'react';
import type { DrawRecord, TagType, PoolKey } from '@models/draw';

interface DrawDataTableProps {
  records: DrawRecord[];
}

type SortBy = 'unit' | 'year';

const POOL_LABELS: Record<PoolKey, string> = {
  '15plus': '15+ Points',
  '10plus': '10+ Points',
  '2plus': '2+ Points',
  '0plus': '0+ Points',
};

const POOL_COLORS: Record<PoolKey, string> = {
  '15plus': 'border-l-sage',
  '10plus': 'border-l-sage',
  '2plus': 'border-l-meadow',
  '0plus': 'border-l-gold',
};

export function DrawDataTable({ records }: DrawDataTableProps) {
  const [tagTypeFilter, setTagTypeFilter] = useState<'any' | TagType>('any');
  const [sortBy, setSortBy] = useState<SortBy>('unit');

  const filteredRecords = useMemo(() => {
    let result = [...records];
    if (tagTypeFilter !== 'any') {
      result = result.filter(r => r.tagType === tagTypeFilter);
    }
    if (sortBy === 'unit') {
      result.sort((a, b) => a.unitName.localeCompare(b.unitName) || a.year - b.year);
    } else {
      result.sort((a, b) => b.year - a.year || a.unitName.localeCompare(b.unitName));
    }
    return result;
  }, [records, tagTypeFilter, sortBy]);

  const getPoolColor = (odds: number): string => {
    if (odds >= 5) return 'text-gold';
    if (odds >= 2) return 'text-amber-dark';
    return 'text-danger';
  };

  // Mobile Card View
  return (
    <div className="space-y-4">
      {/* Filter & Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <button
            onClick={() => setTagTypeFilter('any')}
            className={`px-4 py-2 text-sm font-heading uppercase rounded transition-colors ${
              tagTypeFilter === 'any'
                ? 'bg-amber-dark text-forest'
                : 'bg-surface-2 text-cream hover:bg-surface'
            }`}
          >
            Any Elk
          </button>
          <button
            onClick={() => setTagTypeFilter('antlerless')}
            className={`px-4 py-2 text-sm font-heading uppercase rounded transition-colors ${
              tagTypeFilter === 'antlerless'
                ? 'bg-amber-dark text-forest'
                : 'bg-surface-2 text-cream hover:bg-surface'
            }`}
          >
            Antlerless
          </button>
        </div>

        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as SortBy)}
            className="px-3 py-2 text-sm font-body bg-surface-2 border border-border text-cream rounded hover:border-amber-dark transition-colors"
          >
            <option value="unit">Sort by Unit</option>
            <option value="year">Sort by Year</option>
          </select>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredRecords.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg" role="region" aria-label="No records">
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">No Records Found</h3>
              <p className="empty-state-description">
                No records match your filters
              </p>
            </div>
          </div>
        ) : (
          filteredRecords.map(record => (
            <div
              key={record.id}
              className="bg-surface border border-border rounded-lg p-4 space-y-3"
            >
              {/* Unit Name & Year */}
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl font-heading text-cream">{record.unitName}</div>
                  <div className="text-sm text-parchment">{record.year}</div>
                </div>
                <div className="text-xs font-heading px-2 py-1 rounded bg-surface-2 text-parchment">
                  {record.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless'}
                </div>
              </div>

              {/* Pools */}
              <div className="space-y-2">
                {record.pools.map(pool => {
                  const odds = (1728 / pool.applicants) * 100;
                  return (
                    <div
                      key={pool.pool}
                      className={`border-l-4 ${POOL_COLORS[pool.pool]} bg-surface-2 rounded-r p-3 space-y-1`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className="text-xs font-heading text-parchment uppercase">
                          {POOL_LABELS[pool.pool]}
                        </span>
                        <span className={`text-lg font-display ${getPoolColor(odds)}`}>
                          {odds.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs text-parchment">
                        <span>{pool.tagsAvailable} tags</span>
                        <span>{pool.applicants} applicants</span>
                      </div>
                      {pool.lowestPointDrawn !== null && (
                        <div className="text-xs text-sage">
                          Lowest drawn: {pool.lowestPointDrawn}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        {filteredRecords.length === 0 ? (
          <div className="bg-surface border border-border rounded-lg" role="region" aria-label="No records">
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3 className="empty-state-title">No Records Found</h3>
              <p className="empty-state-description">
                No records match your filters
              </p>
            </div>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 border-b border-border">
                <th className="px-4 py-3 text-left font-heading text-xs uppercase text-parchment">
                  Unit
                </th>
                <th className="px-4 py-3 text-left font-heading text-xs uppercase text-parchment">
                  Year
                </th>
                <th className="px-4 py-3 text-left font-heading text-xs uppercase text-parchment">
                  Tag Type
                </th>
                <th className="px-4 py-3 text-left font-heading text-xs uppercase text-parchment">
                  Pool
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
              </tr>
            </thead>
            <tbody>
              {filteredRecords.flatMap((record, recordIdx) =>
                record.pools.map((pool, poolIdx) => {
                  const isFirstPool = poolIdx === 0;
                  const bgClass = recordIdx % 2 === 0 ? 'bg-surface' : 'bg-surface-2';
                  return (
                    <tr key={`${record.id}-${pool.pool}`} className={`border-b border-border ${bgClass}`}>
                      {/* Unit (only on first pool of record) */}
                      {isFirstPool && (
                        <td
                          rowSpan={record.pools.length}
                          className="px-4 py-3 font-heading text-cream"
                        >
                          {record.unitName}
                        </td>
                      )}

                      {/* Year (only on first pool of record) */}
                      {isFirstPool && (
                        <td
                          rowSpan={record.pools.length}
                          className="px-4 py-3 font-mono text-parchment"
                        >
                          {record.year}
                        </td>
                      )}

                      {/* Tag Type (only on first pool of record) */}
                      {isFirstPool && (
                        <td
                          rowSpan={record.pools.length}
                          className="px-4 py-3 text-parchment text-xs"
                        >
                          {record.tagType === 'any_elk' ? 'Any' : 'Antlerless'}
                        </td>
                      )}

                      {/* Pool Label */}
                      <td className="px-4 py-3 text-xs text-parchment font-heading uppercase">
                        {POOL_LABELS[pool.pool]}
                      </td>

                      {/* Tags */}
                      <td className="px-4 py-3 text-center font-mono text-cream">
                        {pool.tagsAvailable}
                      </td>

                      {/* Applicants */}
                      <td className="px-4 py-3 text-center font-mono text-cream">
                        {pool.applicants}
                      </td>

                      {/* Lowest Point */}
                      <td className="px-4 py-3 text-center text-sage">
                        {pool.lowestPointDrawn ?? '—'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
