/**
 * Records List & Management
 *
 * Displays existing records with edit/delete functionality.
 * Grouped by unit for easy scanning.
 * Memoized to prevent unnecessary re-renders when parent updates.
 */

import { memo } from 'react';
import type { DrawRecord } from '@models/draw';

interface RecordsListProps {
  records: DrawRecord[];
  onEdit: (record: DrawRecord) => void;
  onDelete: (recordId: string) => void;
}

function RecordsListComponent({ records, onEdit, onDelete }: RecordsListProps) {
  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No records yet</p>
      </div>
    );
  }

  // Group records by unit
  const grouped = new Map<string, DrawRecord[]>();
  records.forEach(record => {
    const unit = record.unitName.toUpperCase();
    if (!grouped.has(unit)) {
      grouped.set(unit, []);
    }
    grouped.get(unit)!.push(record);
  });

  // Sort units alphabetically
  const sortedUnits = Array.from(grouped.keys()).sort();

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900">
        Records ({records.length})
      </h3>

      {sortedUnits.map(unit => {
        const unitRecords = grouped.get(unit)!;
        // Sort by year descending
        const sorted = [...unitRecords].sort((a, b) => b.year - a.year);

        return (
          <div key={unit} className="border rounded-lg overflow-hidden">
            {/* Unit Header */}
            <div className="bg-gray-100 px-4 py-2 border-b">
              <h4 className="font-semibold text-gray-900">{unit}</h4>
            </div>

            {/* Records for Unit */}
            <div className="divide-y">
              {sorted.map(record => (
                <div
                  key={record.id}
                  className="p-4 hover:bg-gray-50 flex items-center justify-between group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-gray-900">
                        {record.year}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          record.tagType === 'any_elk'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-green-100 text-green-700'
                        }`}
                      >
                        {record.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless'}
                      </span>
                      <span className="text-xs text-gray-500">
                        {record.pools.length} {record.pools.length === 1 ? 'pool' : 'pools'}
                      </span>
                    </div>

                    {/* Pool Summary */}
                    <div className="text-xs text-gray-600 mt-1 space-y-0.5">
                      {record.pools.map((pool, idx) => (
                        <div key={idx}>
                          <span className="font-medium">
                            {pool.pool === '15plus'
                              ? '15+'
                              : pool.pool === '10plus'
                                ? '10+'
                                : '0+'}
                          </span>
                          : {pool.tagsAvailable} tags, {pool.applicants.toLocaleString()} applicants
                          {pool.lowestPointDrawn ? `, lowest: ${pool.lowestPointDrawn}` : ''}
                        </div>
                      ))}
                    </div>

                    {/* Notes */}
                    {record.notes && (
                      <p className="text-xs text-gray-500 mt-2 italic">"{record.notes}"</p>
                    )}

                    {/* Dates */}
                    <p className="text-xs text-gray-400 mt-1">
                      Added {new Date(record.addedDate).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="ml-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => onEdit(record)}
                      className="px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded transition-colors"
                      title="Edit record"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (
                          confirm(
                            `Delete ${record.unitName} (${record.year}) ${record.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless'}?`
                          )
                        ) {
                          onDelete(record.id);
                        }
                      }}
                      className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded transition-colors"
                      title="Delete record"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Memoized RecordsList to prevent unnecessary re-renders.
 */
export const RecordsList = memo(RecordsListComponent);
