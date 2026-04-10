/**
 * App Header — Navigation & Account Management
 *
 * Displays app title, tab navigation, and account selector/switcher.
 */

import { useState } from 'react';
import type { UserAccount } from '@models/draw';

type TabName = 'odds' | 'data';

interface AppHeaderProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
  accounts: UserAccount[];
  activeUserId: string | null;
  activeAccount: UserAccount | null;
  onCreateAccount: (name: string) => UserAccount;
  onDeleteAccount: (userId: string) => void;
  onRenameAccount: (userId: string, newName: string) => void;
  onSwitchAccount: (userId: string) => void;
}

export function AppHeader({
  activeTab,
  onTabChange,
  accounts,
  activeUserId,
  activeAccount,
  onCreateAccount,
  onDeleteAccount,
  onRenameAccount,
  onSwitchAccount,
}: AppHeaderProps) {
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const [isRenamingId, setIsRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const handleRename = (userId: string) => {
    const newName = renameValue.trim();
    if (newName) {
      onRenameAccount(userId, newName);
      setIsRenamingId(null);
      setRenameValue('');
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Title and Tab Navigation */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            🦌 Elk Draw Analyzer
          </h1>

          {/* Tab Navigation */}
          <nav className="flex gap-1">
            <button
              onClick={() => onTabChange('odds')}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === 'odds'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              My Odds
            </button>
            <button
              onClick={() => onTabChange('data')}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors ${
                activeTab === 'data'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Enter Data
            </button>
          </nav>
        </div>

        {/* Account Management */}
        <div className="flex items-center justify-between border-t pt-3">
          <div className="text-sm text-gray-600">
            {activeAccount && (
              <span>
                Signed in as <span className="font-semibold text-gray-900">{activeAccount.name}</span>
              </span>
            )}
          </div>

          {/* Account Menu */}
          <div className="relative">
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded transition-colors"
            >
              Accounts ({accounts.length})
            </button>

            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                {/* Account List */}
                <div className="max-h-64 overflow-y-auto">
                  {accounts.map(account => (
                    <div
                      key={account.id}
                      className={`px-4 py-3 border-b hover:bg-gray-50 flex items-center justify-between group ${
                        activeUserId === account.id ? 'bg-blue-50' : ''
                      }`}
                    >
                      {isRenamingId === account.id ? (
                        <input
                          type="text"
                          value={renameValue}
                          onChange={e => setRenameValue(e.target.value)}
                          onBlur={() => handleRename(account.id)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleRename(account.id);
                            if (e.key === 'Escape') setIsRenamingId(null);
                          }}
                          autoFocus
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      ) : (
                        <div className="flex-1 flex items-center gap-2">
                          <button
                            onClick={() => {
                              onSwitchAccount(account.id);
                              setShowAccountMenu(false);
                            }}
                            className="flex-1 text-left text-sm hover:underline"
                          >
                            <span className="font-medium text-gray-900">{account.name}</span>
                            {activeUserId === account.id && (
                              <span className="ml-2 text-xs text-blue-600 font-semibold">●</span>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Actions */}
                      {!isRenamingId && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setIsRenamingId(account.id);
                              setRenameValue(account.name);
                            }}
                            className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded"
                            title="Rename"
                          >
                            ✏️
                          </button>
                          {accounts.length > 1 && (
                            <button
                              onClick={() => {
                                if (
                                  confirm(
                                    `Delete "${account.name}" and all associated data? This cannot be undone.`
                                  )
                                ) {
                                  onDeleteAccount(account.id);
                                  setShowAccountMenu(false);
                                }
                              }}
                              className="px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-100 rounded"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Create New Account */}
                <button
                  onClick={() => {
                    const name = prompt('Enter your name:');
                    if (name?.trim()) {
                      onCreateAccount(name.trim());
                      setShowAccountMenu(false);
                    }
                  }}
                  className="w-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 border-t"
                >
                  + New Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
