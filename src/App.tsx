/**
 * South Dakota Elk Draw Analyzer — Main App
 *
 * Two-tab layout with account management:
 * - My Odds: Query draw odds for entered data
 * - Enter Data: Add/manage elk unit draw statistics
 */

import { useState } from 'react';
import { useUserAccount } from '@hooks/useUserAccount';
import { AppHeader } from '@components/AppHeader';
import { OddsTab } from '@components/OddsTab';
import { DataEntryTab } from '@components/DataEntryTab';

type TabName = 'odds' | 'data';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('odds');
  const {
    accounts,
    activeUserId,
    activeAccount,
    isLoading: accountsLoading,
    createAccount,
    deleteAccount,
    renameAccount,
    switchAccount,
  } = useUserAccount();

  // Show loading state while accounts are being loaded
  if (accountsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-700 mb-2">Loading...</div>
          <div className="text-sm text-gray-500">Initializing elk draw analyzer</div>
        </div>
      </div>
    );
  }

  // Show onboarding if no accounts exist
  if (accounts.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">🦌 Elk Draw Analyzer</h1>
          <p className="text-gray-600 mb-6">
            South Dakota hunting odds calculator for preference point holders.
          </p>
          <button
            onClick={() => {
              const name = prompt('Enter your name:');
              if (name?.trim()) {
                createAccount(name.trim());
              }
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            Create Account
          </button>
          <p className="text-xs text-gray-400 text-center mt-4">
            Your data stays on your device. No accounts needed.
          </p>
        </div>
      </div>
    );
  }

  // Main app layout
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        accounts={accounts}
        activeUserId={activeUserId}
        activeAccount={activeAccount}
        onCreateAccount={createAccount}
        onDeleteAccount={deleteAccount}
        onRenameAccount={renameAccount}
        onSwitchAccount={switchAccount}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'odds' && activeUserId && (
          <OddsTab userId={activeUserId} accountName={activeAccount?.name || 'Unknown'} />
        )}

        {activeTab === 'data' && activeUserId && (
          <DataEntryTab userId={activeUserId} accountName={activeAccount?.name || 'Unknown'} />
        )}
      </main>
    </div>
  );
}
