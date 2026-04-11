/**
 * South Dakota Elk Draw Analyzer — Main App
 *
 * Two-tab layout with account management:
 * - My Odds: Query draw odds for entered data
 * - Data: Read-only draw statistics
 */

import { useState } from 'react';
import { useUserAccount } from '@hooks/useUserAccount';
import { AppHeader } from '@components/AppHeader';
import { OddsTab } from '@components/OddsTab';
import { DrawDataTab } from '@components/DrawDataTab';

type TabName = 'odds' | 'data';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('odds');
  const [accountNameInput, setAccountNameInput] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
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
      <div className="flex items-center justify-center min-h-screen bg-forest">
        <div className="text-center">
          {/* Elk antler SVG or bold text */}
          <div className="text-5xl font-display text-amber-dark mb-8 tracking-wide">
            🦌
          </div>
          <div className="text-2xl font-display text-cream mb-1 tracking-wide">
            SD ELK DRAW
          </div>
          <div className="text-sm font-heading text-parchment mb-8">
            ANALYZER
          </div>

          {/* Pulsing amber dot */}
          <div className="flex justify-center">
            <div className="w-3 h-3 bg-amber-dark rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Show onboarding if no accounts exist
  if (accounts.length === 0) {
    const handleCreateAccount = (e: React.FormEvent) => {
      e.preventDefault();
      if (accountNameInput.trim()) {
        setIsCreatingAccount(true);
        try {
          const account = createAccount(accountNameInput.trim());
          console.log('Account created successfully:', account);
          setAccountNameInput('');
        } catch (error) {
          console.error('Failed to create account:', error);
        } finally {
          setIsCreatingAccount(false);
        }
      }
    };

    return (
      <div className="flex items-center justify-center min-h-screen bg-forest overflow-hidden">
        {/* Topographic texture background */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="topo" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="0.5" />
                <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#topo)" className="text-cream" />
          </svg>
        </div>

        {/* Onboarding panel */}
        <div className="relative z-10 bg-surface rounded-lg p-8 max-w-md w-full mx-4 border border-border shadow-lg">
          <h1 className="text-4xl font-display text-cream mb-2 tracking-wide text-center">
            SOUTH DAKOTA<br />ELK DRAW ANALYZER
          </h1>
          <p className="text-parchment text-center mb-8 font-body italic">
            Track your odds. Know your draw.
          </p>

          <form onSubmit={handleCreateAccount} className="space-y-4">
            <input
              type="text"
              placeholder="Enter your name or nickname"
              value={accountNameInput}
              onChange={(e) => setAccountNameInput(e.target.value)}
              className="w-full px-4 py-3 bg-surface-2 border border-border rounded-sm text-cream placeholder-parchment font-body focus:outline-none focus:border-amber-dark focus:ring-1 focus:ring-amber-dark/50"
              disabled={isCreatingAccount}
              autoFocus
            />
            <button
              type="submit"
              disabled={isCreatingAccount || !accountNameInput.trim()}
              className="w-full bg-amber-dark hover:bg-gold disabled:bg-sage/50 disabled:cursor-not-allowed text-forest font-heading py-3 px-4 rounded-sm transition-colors font-semibold tracking-wide"
            >
              {isCreatingAccount ? 'CREATING...' : 'GET STARTED →'}
            </button>
          </form>

          <p className="text-xs text-parchment text-center mt-6">
            Your data stays on your device. No signup required.
          </p>
        </div>
      </div>
    );
  }

  // Main app layout
  return (
    <div className="min-h-screen bg-forest flex flex-col">
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'odds' && activeUserId && (
          <OddsTab userId={activeUserId} accountName={activeAccount?.name || 'Unknown'} />
        )}

        {activeTab === 'data' && activeUserId && (
          <DrawDataTab userId={activeUserId} accountName={activeAccount?.name || 'Unknown'} />
        )}
      </main>
    </div>
  );
}
