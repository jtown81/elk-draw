/**
 * My Odds Tab
 *
 * Displays calculated odds for units based on entered data.
 * Integrates UserInputPanel, PoolIndicator, and OddsTable with real-time
 * recalculation when user adjusts preference points or tag type.
 */

import { useDrawData } from '@hooks/useDrawData';
import { useUserConfig } from '@hooks/useUserConfig';
import { UserInputPanel } from './UserInputPanel';
import { PoolIndicator } from './PoolIndicator';
import { OddsTable } from './OddsTable';

interface OddsTabProps {
  userId: string;
  accountName: string;
}

export function OddsTab({ userId, accountName }: OddsTabProps) {
  const { records, isLoading: recordsLoading } = useDrawData(userId);
  const { config, isLoading: configLoading } = useUserConfig(userId);

  const isLoading = recordsLoading || configLoading;

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
        <h2 className="text-2xl font-bold text-gray-900">My Odds</h2>
        <p className="text-gray-600 mt-1">
          Calculate your hunting odds for {accountName}
        </p>
      </div>

      {/* User Input Controls (interactive) */}
      <UserInputPanel userId={userId} />

      {/* Pool Info (updates with user input) */}
      <PoolIndicator preferencePoints={config.preferencePoints} />

      {/* Results Section */}
      {records.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Yet</h3>
          <p className="text-gray-600 mb-6">
            Enter elk unit draw statistics in the <strong>Enter Data</strong> tab to calculate odds.
          </p>
          <p className="text-sm text-gray-500">
            Data from GFP: https://license.gooutdoorssouthdakota.com/License/DrawStatistics
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Results Header with Filters */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Results ({records.length} {records.length === 1 ? 'record' : 'records'})
            </h3>
            <div className="text-sm text-gray-600">
              Filtering for{' '}
              <span className="font-semibold">
                {config.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless'} tags
              </span>
            </div>
          </div>

          {/* Odds Table (updates in real-time with user config) */}
          <OddsTable
            records={records}
            userPoints={config.preferencePoints}
            userTagType={config.tagType}
          />

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t">
            <div className="bg-blue-50 rounded p-4">
              <div className="text-sm font-medium text-gray-600 mb-1">Your Points</div>
              <div className="text-2xl font-bold text-blue-600">{config.preferencePoints}</div>
            </div>
            <div className="bg-blue-50 rounded p-4">
              <div className="text-sm font-medium text-gray-600 mb-1">Tag Type</div>
              <div className="text-lg font-bold text-blue-600">
                {config.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless'}
              </div>
            </div>
            <div className="bg-blue-50 rounded p-4">
              <div className="text-sm font-medium text-gray-600 mb-1">Units Tracked</div>
              <div className="text-2xl font-bold text-blue-600">
                {new Set(records.map(r => r.unitName)).size}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
