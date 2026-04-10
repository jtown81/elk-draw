/**
 * Enter Data Tab
 *
 * Allows users to add, edit, and manage elk unit draw statistics.
 * Includes import/export functionality for data management.
 */

import { useState } from 'react';
import type { DrawRecord } from '@models/draw';
import { useDrawData } from '@hooks/useDrawData';
import { AddRecordForm } from './AddRecordForm';
import { RecordsList } from './RecordsList';

interface DataEntryTabProps {
  userId: string;
  accountName: string;
}

export function DataEntryTab({ userId, accountName }: DataEntryTabProps) {
  const {
    records,
    addRecord,
    updateRecord,
    deleteRecord,
    clearAll,
    exportRecords,
    replaceRecords,
    isLoading,
  } = useDrawData(userId);

  const [editingRecord, setEditingRecord] = useState<DrawRecord | null>(null);
  const [showForm, setShowForm] = useState(!editingRecord);

  const handleAddRecord = (
    record: Omit<DrawRecord, 'id' | 'addedDate' | 'updatedDate'>
  ) => {
    if (editingRecord) {
      updateRecord(editingRecord.id, record);
      setEditingRecord(null);
    } else {
      addRecord(record);
    }
    setShowForm(false);
  };

  const handleExport = () => {
    const dataStr = exportRecords();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elk-draw-data-${accountName}-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const data = JSON.parse(content) as DrawRecord[];

        if (!Array.isArray(data)) {
          throw new Error('Invalid format: expected array of records');
        }

        // Validate basic structure
        if (!data.every(d => d.unitName && d.year && d.pools)) {
          throw new Error('Invalid format: missing required fields');
        }

        const shouldReplace = records.length > 0;

        if (
          shouldReplace &&
          !confirm(
            `Replace existing ${records.length} records with ${data.length} records from file?`
          )
        ) {
          return;
        }

        if (shouldReplace) {
          replaceRecords(data);
        } else {
          data.forEach(d => addRecord(d));
        }
      } catch (err) {
        alert(`Failed to import: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    reader.readAsText(file);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Enter Data</h2>
        <p className="text-gray-600 mt-1">
          Add elk unit draw statistics from GFP for {accountName}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Record Form */}
        <div className="lg:col-span-2">
          {(showForm || editingRecord) && (
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingRecord ? 'Edit Record' : 'Add Unit Data'}
              </h3>
              <AddRecordForm
                existingRecord={editingRecord || undefined}
                onSubmit={handleAddRecord}
                onCancel={() => {
                  setShowForm(false);
                  setEditingRecord(null);
                }}
              />
            </div>
          )}

          {!showForm && !editingRecord && (
            <button
              onClick={() => setShowForm(true)}
              className="w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
            >
              + Add New Record
            </button>
          )}

          {/* Records List */}
          <div className="bg-white rounded-lg shadow p-6">
            <RecordsList
              records={records}
              onEdit={record => {
                setEditingRecord(record);
                setShowForm(true);
              }}
              onDelete={deleteRecord}
            />
          </div>
        </div>

        {/* Export/Import & Management */}
        <div>
          <div className="bg-white rounded-lg shadow p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Data Management
            </h3>

            <div className="space-y-2">
              {/* Export */}
              <button
                onClick={handleExport}
                disabled={records.length === 0}
                className="w-full text-sm bg-green-50 hover:bg-green-100 disabled:bg-gray-50 text-green-700 disabled:text-gray-400 font-medium py-2 px-3 rounded transition-colors border border-green-200 disabled:border-gray-200"
              >
                ⬇️ Export ({records.length})
              </button>

              {/* Import */}
              <label className="block">
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                />
                <div className="w-full text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-3 rounded transition-colors border border-blue-200 cursor-pointer text-center">
                  ⬆️ Import
                </div>
              </label>

              {/* Clear All */}
              {records.length > 0 && (
                <button
                  onClick={() => {
                    if (
                      confirm(
                        `Delete all ${records.length} records? This cannot be undone.`
                      )
                    ) {
                      clearAll();
                    }
                  }}
                  className="w-full text-sm bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 rounded transition-colors border border-red-200"
                >
                  🗑️ Clear All
                </button>
              )}
            </div>

            {/* Stats */}
            <div className="mt-6 pt-6 border-t space-y-2">
              <div className="text-sm">
                <span className="text-gray-600">Total Records:</span>
                <span className="ml-2 font-bold text-gray-900">{records.length}</span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Unique Units:</span>
                <span className="ml-2 font-bold text-gray-900">
                  {new Set(records.map(r => r.unitName)).size}
                </span>
              </div>
              <div className="text-sm">
                <span className="text-gray-600">Year Range:</span>
                <span className="ml-2 font-bold text-gray-900">
                  {records.length > 0
                    ? `${Math.min(...records.map(r => r.year))}–${Math.max(...records.map(r => r.year))}`
                    : '—'}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg text-xs text-blue-700">
              <p className="font-semibold mb-1">💡 Tips:</p>
              <ul className="space-y-1">
                <li>• Export regularly to back up your data</li>
                <li>• Import JSON files to restore data</li>
                <li>• All data stays on your device</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
