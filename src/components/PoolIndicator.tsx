/**
 * Pool Indicator
 *
 * Displays information about the user's qualifying pool and tag allocation.
 * Memoized to prevent unnecessary recalculations.
 */

import { memo } from 'react';
import { getQualifyingPool, calcEntries } from '@modules/odds-calculator';
import { DRAW_POOLS } from '@data/draw-pools';

interface PoolIndicatorProps {
  preferencePoints: number;
}

function PoolIndicatorComponent({ preferencePoints }: PoolIndicatorProps) {
  const pool = getQualifyingPool(preferencePoints);
  const poolConfig = DRAW_POOLS[pool];
  const entries = calcEntries(preferencePoints);
  const tagPercentage = (poolConfig.tagPct * 100).toFixed(0);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Your Pool
          </div>
          <div className="text-xl font-bold text-blue-700 mt-1">{poolConfig.label}</div>
          <div className="text-xs text-gray-500 mt-1">
            Requires {poolConfig.minPoints}+ points
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Lottery Entries
          </div>
          <div className="text-xl font-bold text-indigo-700 mt-1">
            {entries.toLocaleString()}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            ({preferencePoints}+1)³
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
            Tag Allocation
          </div>
          <div className="text-xl font-bold text-blue-700 mt-1">{tagPercentage}%</div>
          <div className="text-xs text-gray-500 mt-1">
            of available tags
          </div>
        </div>
      </div>

      {/* Pool Info */}
      <div className="mt-4 pt-4 border-t border-blue-200">
        <p className="text-xs text-gray-700">
          <strong>Pool Details:</strong> With {preferencePoints} preference points, you qualify for the {poolConfig.label},
          which receives {tagPercentage}% of available elk tags. Your {entries.toLocaleString()} lottery entries
          compete against other applicants in this same pool.
        </p>
      </div>
    </div>
  );
}

/**
 * Memoized PoolIndicator to prevent unnecessary re-renders.
 */
export const PoolIndicator = memo(PoolIndicatorComponent);
