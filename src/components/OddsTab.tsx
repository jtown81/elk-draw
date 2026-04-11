/**
 * My Odds Tab
 *
 * Displays calculated odds for units based on user preferences.
 * Redesigned with dark theme, custom slider, and ad integration.
 */

import { useDrawData } from '@hooks/useDrawData';
import { useUserConfig } from '@hooks/useUserConfig';
import { UserInputPanel } from './UserInputPanel';
import { OddsTable } from './OddsTable';
import { AdPlaceholder } from './ads/AdPlaceholder';

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
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-amber-dark border-t-gold rounded-full animate-spin" />
          <div className="text-parchment text-sm">Loading odds...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-3xl font-heading text-cream uppercase tracking-wide">
          MY ODDS
        </h2>
        <p className="text-parchment mt-2">
          Calculate your hunting odds for {accountName}
        </p>
      </div>

      {/* Ad Banner */}
      <AdPlaceholder size="banner" />

      {/* User Input Controls */}
      <UserInputPanel userId={userId} />

      {/* Ad Rectangle */}
      <AdPlaceholder size="rectangle" />

      {/* Results Section */}
      {records.length === 0 ? (
        <div className="bg-surface border border-border rounded-lg" role="region" aria-label="No data">
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3 className="empty-state-title">No Data Yet</h3>
            <p className="empty-state-description">
              Draw statistics are preloaded. Head to the <strong>DATA</strong> tab to see available records.
            </p>
            <p className="text-xs text-bark">
              Data from GFP: https://license.gooutdoorssouthdakota.com/License/DrawStatistics
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Results Header */}
          <div className="flex items-center justify-between flex-col sm:flex-row gap-2">
            <h3 className="text-lg font-heading text-cream uppercase tracking-wide">
              RESULTS ({records.length})
            </h3>
            <div className="text-sm text-parchment">
              Filtering for{' '}
              <span className="font-heading text-gold">
                {config.tagType === 'any_elk' ? 'ANY ELK' : 'ANTLERLESS'} TAGS
              </span>
            </div>
          </div>

          {/* Odds Table */}
          <OddsTable
            records={records}
            userPoints={config.preferencePoints}
            userTagType={config.tagType}
          />

          {/* Ad Leaderboard */}
          <AdPlaceholder size="leaderboard" />

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border">
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="text-xs font-heading text-parchment uppercase tracking-wide">
                Your Points
              </div>
              <div className="text-3xl font-display text-gold mt-2">
                {config.preferencePoints}
              </div>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="text-xs font-heading text-parchment uppercase tracking-wide">
                Tag Type
              </div>
              <div className="text-lg font-heading text-gold mt-2 uppercase">
                {config.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless'}
              </div>
            </div>
            <div className="bg-surface border border-border rounded-lg p-4">
              <div className="text-xs font-heading text-parchment uppercase tracking-wide">
                Units Tracked
              </div>
              <div className="text-3xl font-display text-gold mt-2">
                {new Set(records.map(r => r.unitName)).size}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
