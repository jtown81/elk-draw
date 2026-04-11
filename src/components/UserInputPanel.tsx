/**
 * User Input Panel
 *
 * Allows user to input preference points (0-25) and select tag type.
 * Features custom slider, segmented toggle, and metric tiles.
 */

import { useUserConfig } from '@hooks/useUserConfig';
import { getQualifyingPool, calcEntries, getPoolAllocationPct } from '@modules/odds-calculator';

interface UserInputPanelProps {
  userId: string;
}

const POOL_LABELS: Record<string, string> = {
  '15plus': '15+ Pool',
  '10plus': '10+ Pool',
  '2plus': '2+ Pool',
  '0plus': '0+ Pool',
};

export function UserInputPanel({ userId }: UserInputPanelProps) {
  const { config, setPreferencePoints, setTagTypePreference } = useUserConfig(userId);

  const qualifyingPool = getQualifyingPool(config.preferencePoints);
  const userEntries = calcEntries(config.preferencePoints);
  // BH units get 30%/15%/5%; CSP gets 34%/33%/33% — show BH as default
  // since 95%+ of units are Black Hills; pool allocation note shown in info strip
  const bhAllocationPct = getPoolAllocationPct(qualifyingPool, 'blackhills');
  const cspAllocationPct = getPoolAllocationPct(qualifyingPool, 'csp');

  return (
    <div className="bg-surface border border-border rounded-lg p-6 mb-6">
      {/* Header with amber underline */}
      <div className="pb-4 border-b-2 border-amber-dark mb-6">
        <h3 className="text-lg font-heading text-cream uppercase tracking-wide">Your Setup</h3>
      </div>

      {/* Points Section */}
      <div className="space-y-6">
        {/* Large Points Display */}
        <div className="text-center">
          <div className="text-6xl font-display text-gold tracking-wide">
            {config.preferencePoints}
          </div>
          <div className="text-xs font-heading text-parchment uppercase tracking-wider mt-1">
            Preference Points
          </div>
        </div>

        {/* Custom Range Slider */}
        <div className="space-y-3">
          <input
            type="range"
            min="0"
            max="25"
            value={config.preferencePoints}
            onChange={e => setPreferencePoints(parseInt(e.target.value))}
            className="w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-amber-dark"
            style={{
              background: `linear-gradient(to right, var(--color-amber) 0%, var(--color-amber) ${(config.preferencePoints / 25) * 100}%, var(--color-surface-2) ${(config.preferencePoints / 25) * 100}%, var(--color-surface-2) 100%)`,
            }}
          />
          <div className="flex justify-between text-xs text-parchment font-mono">
            <span>0</span>
            <span>25</span>
          </div>
        </div>

        {/* Tag Type Segmented Control */}
        <div className="space-y-2">
          <div className="text-xs font-heading text-parchment uppercase tracking-wider">
            Tag Type
          </div>
          <div className="flex gap-1 bg-surface-2 rounded-lg p-1">
            <button
              onClick={() => setTagTypePreference('any_elk')}
              className={`flex-1 px-4 py-3 rounded transition-colors font-heading text-sm uppercase tracking-wide ${
                config.tagType === 'any_elk'
                  ? 'bg-amber-dark text-forest'
                  : 'text-parchment hover:text-cream'
              }`}
            >
              Any Elk
            </button>
            <button
              onClick={() => setTagTypePreference('antlerless')}
              className={`flex-1 px-4 py-3 rounded transition-colors font-heading text-sm uppercase tracking-wide ${
                config.tagType === 'antlerless'
                  ? 'bg-amber-dark text-forest'
                  : 'text-parchment hover:text-cream'
              }`}
            >
              Antlerless
            </button>
          </div>
        </div>

        {/* Metric Tiles */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-surface-2 border border-border rounded-lg p-3">
            <div className="text-xs font-heading text-parchment uppercase tracking-wider">
              Qualifying Pool
            </div>
            <div className="text-lg font-heading text-amber-dark mt-2">
              {POOL_LABELS[qualifyingPool]}
            </div>
          </div>
          <div className="bg-surface-2 border border-border rounded-lg p-3">
            <div className="text-xs font-heading text-parchment uppercase tracking-wider">
              Pool Share
            </div>
            {bhAllocationPct > 0 ? (
              <div className="text-lg font-display text-gold mt-2">
                {bhAllocationPct}%
                {cspAllocationPct > 0 && cspAllocationPct !== bhAllocationPct && (
                  <span className="text-xs font-heading text-parchment ml-1">
                    / {cspAllocationPct}%
                  </span>
                )}
              </div>
            ) : (
              <div className="text-sm font-heading text-parchment mt-2">N/A</div>
            )}
            <div className="text-xs text-bark mt-1">BH / CSP</div>
          </div>
          <div className="bg-surface-2 border border-border rounded-lg p-3">
            <div className="text-xs font-heading text-parchment uppercase tracking-wider">
              Your Entries
            </div>
            <div className="text-lg font-mono text-gold mt-2">
              {userEntries.toLocaleString()}
            </div>
          </div>
          <div className="bg-surface-2 border border-border rounded-lg p-3">
            <div className="text-xs font-heading text-parchment uppercase tracking-wider">
              Formula
            </div>
            <div className="text-xs font-mono text-parchment mt-2">
              ({config.preferencePoints}+1)³
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 bg-surface-2/50 border-l-2 border-l-sage rounded text-xs text-parchment space-y-1">
          <p>
            <strong>🏹 How it works:</strong> You qualify for the {POOL_LABELS[qualifyingPool]}.
          </p>
          <p>
            GFP cubes your entries: ({config.preferencePoints}+1)³ = {userEntries.toLocaleString()} lottery entries.
          </p>
          <p>
            Black Hills: {bhAllocationPct}% of tags go to this pool.
            {cspAllocationPct > 0 ? ` CSP: ${cspAllocationPct}%.` : ''}
          </p>
        </div>
      </div>
    </div>
  );
}
