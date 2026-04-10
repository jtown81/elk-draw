/**
 * User Input Panel
 *
 * Allows user to input preference points (0-25) and select tag type.
 * Displays entry count and pool information.
 */

import { useUserConfig } from '@hooks/useUserConfig';
import { getQualifyingPool } from '@modules/odds-calculator';
import { calcEntries } from '@modules/odds-calculator';

interface UserInputPanelProps {
  userId: string;
}

export function UserInputPanel({ userId }: UserInputPanelProps) {
  const { config, setPreferencePoints, setTagTypePreference } = useUserConfig(userId);

  const qualifyingPool = getQualifyingPool(config.preferencePoints);
  const userEntries = calcEntries(config.preferencePoints);

  const poolLabels = {
    '15plus': '15+ Pool',
    '10plus': '10+ Pool',
    '0plus': '0+ Pool',
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Your Preferences</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Preference Points Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Preference Points: <span className="text-blue-600 font-bold">{config.preferencePoints}</span>
          </label>

          {/* Slider */}
          <input
            type="range"
            min="0"
            max="25"
            value={config.preferencePoints}
            onChange={e => setPreferencePoints(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />

          {/* Numeric Input */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              min="0"
              max="25"
              value={config.preferencePoints}
              onChange={e => {
                const val = parseInt(e.target.value);
                if (val >= 0 && val <= 25) {
                  setPreferencePoints(val);
                }
              }}
              className="w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-600">/ 25 points</span>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Drag slider or enter value directly (0–25)
          </p>
        </div>

        {/* Tag Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tag Type Preference
          </label>

          <div className="flex gap-3">
            <button
              onClick={() => setTagTypePreference('any_elk')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                config.tagType === 'any_elk'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Any Elk
            </button>
            <button
              onClick={() => setTagTypePreference('antlerless')}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                config.tagType === 'antlerless'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Antlerless
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Select which tag type to focus on
          </p>
        </div>
      </div>

      {/* Pool & Entry Summary */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Qualifying Pool</div>
            <div className="text-lg font-bold text-blue-600">{poolLabels[qualifyingPool]}</div>
          </div>
          <div className="bg-blue-50 rounded p-4">
            <div className="text-sm font-medium text-gray-600 mb-1">Your Lottery Entries</div>
            <div className="text-lg font-bold text-blue-600">
              {userEntries.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              ({config.preferencePoints}+1)³
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
        <p>
          🏹 <strong>How it works:</strong> GFP uses {qualifyingPool} (minimum {config.preferencePoints} points).
          Your {userEntries.toLocaleString()} entries compete against other applicants in this pool.
        </p>
      </div>
    </div>
  );
}
