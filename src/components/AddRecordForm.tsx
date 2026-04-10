/**
 * Add/Edit Record Form
 *
 * Form for entering elk unit draw statistics.
 * Supports 1-3 pools per unit with full validation.
 */

import { useState } from 'react';
import type { DrawRecord, PoolData, PoolKey } from '@models/draw';
import { getAllUnitsSorted } from '@data/elk-units';
import { getAllPoolsOrdered } from '@data/draw-pools';

interface AddRecordFormProps {
  existingRecord?: DrawRecord;
  onSubmit: (record: Omit<DrawRecord, 'id' | 'addedDate' | 'updatedDate'>) => void;
  onCancel?: () => void;
}

interface FormState {
  unitName: string;
  year: number;
  tagType: 'any_elk' | 'antlerless';
  pools: PoolData[];
  notes: string;
}

const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 2020;

export function AddRecordForm({ existingRecord, onSubmit, onCancel }: AddRecordFormProps) {
  const [formState, setFormState] = useState<FormState>(
    existingRecord
      ? {
          unitName: existingRecord.unitName,
          year: existingRecord.year,
          tagType: existingRecord.tagType,
          pools: existingRecord.pools,
          notes: existingRecord.notes || '',
        }
      : {
          unitName: '',
          year: CURRENT_YEAR,
          tagType: 'any_elk',
          pools: [
            { pool: '15plus', tagsAvailable: 0, applicants: 0, lowestPointDrawn: null },
          ],
          notes: '',
        }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formState.unitName.trim()) {
      newErrors.unitName = 'Unit name is required';
    }

    if (formState.year < MIN_YEAR || formState.year > CURRENT_YEAR) {
      newErrors.year = `Year must be between ${MIN_YEAR} and ${CURRENT_YEAR}`;
    }

    if (formState.pools.length === 0) {
      newErrors.pools = 'At least one pool is required';
    }

    for (let i = 0; i < formState.pools.length; i++) {
      const pool = formState.pools[i];
      if (pool.tagsAvailable <= 0) {
        newErrors[`pool-${i}-tags`] = 'Tags must be > 0';
      }
      if (pool.applicants <= 0) {
        newErrors[`pool-${i}-applicants`] = 'Applicants must be > 0';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddPool = () => {
    const usedPools = new Set(formState.pools.map(p => p.pool));
    const availablePools = getAllPoolsOrdered().filter(p => !usedPools.has(p));

    if (availablePools.length === 0) {
      setErrors({ pools: 'All pools already added' });
      return;
    }

    setFormState(prev => ({
      ...prev,
      pools: [
        ...prev.pools,
        {
          pool: availablePools[0],
          tagsAvailable: 0,
          applicants: 0,
          lowestPointDrawn: null,
        },
      ],
    }));
  };

  const handleRemovePool = (index: number) => {
    setFormState(prev => ({
      ...prev,
      pools: prev.pools.filter((_, i) => i !== index),
    }));
  };

  const handlePoolChange = (
    index: number,
    field: keyof PoolData,
    value: any
  ) => {
    setFormState(prev => ({
      ...prev,
      pools: prev.pools.map((p, i) => {
        if (i === index) {
          if (field === 'lowestPointDrawn') {
            return { ...p, [field]: value === '' ? null : parseInt(value) };
          }
          return { ...p, [field]: field === 'pool' ? value : parseInt(value) };
        }
        return p;
      }),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    onSubmit({
      unitName: formState.unitName.toUpperCase().trim(),
      year: formState.year,
      tagType: formState.tagType,
      pools: formState.pools,
      notes: formState.notes.trim() || undefined,
    });

    // Reset form if not editing
    if (!existingRecord) {
      setFormState({
        unitName: '',
        year: CURRENT_YEAR,
        tagType: 'any_elk',
        pools: [
          { pool: '15plus', tagsAvailable: 0, applicants: 0, lowestPointDrawn: null },
        ],
        notes: '',
      });
    }
  };

  const allUnits = getAllUnitsSorted();
  const poolLabels: Record<PoolKey, string> = {
    '15plus': '15+ Pool',
    '10plus': '10+ Pool',
    '0plus': '0+ Pool',
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step 1: Unit, Year, Tag Type */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">Basic Info</h4>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Unit Name *
          </label>
          <select
            value={formState.unitName}
            onChange={e => {
              setFormState(prev => ({ ...prev, unitName: e.target.value }));
              if (errors.unitName) setErrors(prev => ({ ...prev, unitName: '' }));
            }}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.unitName ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Select unit...</option>
            {allUnits.map(unit => (
              <option key={unit} value={unit}>
                {unit}
              </option>
            ))}
          </select>
          {errors.unitName && <p className="text-xs text-red-600 mt-1">{errors.unitName}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year *
            </label>
            <input
              type="number"
              min={MIN_YEAR}
              max={CURRENT_YEAR}
              value={formState.year}
              onChange={e => {
                setFormState(prev => ({ ...prev, year: parseInt(e.target.value) }));
                if (errors.year) setErrors(prev => ({ ...prev, year: '' }));
              }}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.year ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.year && <p className="text-xs text-red-600 mt-1">{errors.year}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tag Type *
            </label>
            <select
              value={formState.tagType}
              onChange={e =>
                setFormState(prev => ({ ...prev, tagType: e.target.value as any }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="any_elk">Any Elk</option>
              <option value="antlerless">Antlerless</option>
            </select>
          </div>
        </div>
      </div>

      {/* Step 2: Pool Data */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-gray-900">Pool Data</h4>
          {formState.pools.length < 3 && (
            <button
              type="button"
              onClick={handleAddPool}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add Pool
            </button>
          )}
        </div>

        {errors.pools && <p className="text-xs text-red-600">{errors.pools}</p>}

        <div className="space-y-4">
          {formState.pools.map((pool, idx) => (
            <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">
                  {poolLabels[pool.pool]}
                </label>
                {formState.pools.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePool(idx)}
                    className="text-xs text-red-600 hover:text-red-700 font-medium"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-3 gap-3">
                {/* Pool Selector (only if multiple possible) */}
                {formState.pools.length > 1 && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Pool
                    </label>
                    <select
                      value={pool.pool}
                      onChange={e =>
                        handlePoolChange(idx, 'pool', e.target.value as PoolKey)
                      }
                      className="w-full px-2 py-2 border border-gray-300 rounded text-sm"
                    >
                      {getAllPoolsOrdered().map(p => (
                        <option key={p} value={p}>
                          {poolLabels[p]}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Tags Available */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Tags *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pool.tagsAvailable || ''}
                    onChange={e => handlePoolChange(idx, 'tagsAvailable', e.target.value)}
                    placeholder="e.g. 30"
                    className={`w-full px-2 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`pool-${idx}-tags`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {errors[`pool-${idx}-tags`] && (
                    <p className="text-xs text-red-600 mt-1">{errors[`pool-${idx}-tags`]}</p>
                  )}
                </div>

                {/* Applicants */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Applicants *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={pool.applicants || ''}
                    onChange={e => handlePoolChange(idx, 'applicants', e.target.value)}
                    placeholder="e.g. 4320"
                    className={`w-full px-2 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors[`pool-${idx}-applicants`]
                        ? 'border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {errors[`pool-${idx}-applicants`] && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors[`pool-${idx}-applicants`]}
                    </p>
                  )}
                </div>

                {/* Lowest Point Drawn */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Lowest Point
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={pool.lowestPointDrawn ?? ''}
                    onChange={e => handlePoolChange(idx, 'lowestPointDrawn', e.target.value)}
                    placeholder="e.g. 11"
                    className="w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes (optional)
        </label>
        <textarea
          value={formState.notes}
          onChange={e => setFormState(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Any additional info about this draw..."
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-2 pt-4 border-t">
        <button
          type="submit"
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {existingRecord ? 'Update Record' : 'Save Record'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
