/**
 * App Header — Navigation & Account Management
 *
 * Desktop: sticky top bar with brand, centered tabs, account dropdown
 * Mobile: compact top bar + fixed bottom tab bar
 */

import { useState } from 'react';
import type { UserAccount } from '@models/draw';

type TabName = 'odds' | 'data' | 'map';

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
  const [isCreatingNewAccount, setIsCreatingNewAccount] = useState(false);
  const [newAccountName, setNewAccountName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleRename = (userId: string) => {
    const newName = renameValue.trim();
    if (newName && newName !== accounts.find(a => a.id === userId)?.name) {
      onRenameAccount(userId, newName);
    }
    setIsRenamingId(null);
    setRenameValue('');
  };

  const handleCreateNewAccount = () => {
    const name = newAccountName.trim();
    if (name) {
      onCreateAccount(name);
      setNewAccountName('');
      setIsCreatingNewAccount(false);
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky top-0 z-40 bg-surface border-b border-border hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Brand */}
            <div className="flex items-center gap-2">
              <span className="text-2xl">🦌</span>
              <div>
                <div className="text-lg font-display text-cream tracking-wider">ELK DRAW</div>
                <div className="text-xs font-heading text-parchment">ANALYZER</div>
              </div>
            </div>

            {/* Center Tab Navigation — Pill buttons */}
            <nav className="flex gap-2 bg-surface-2 rounded-lg p-1" role="tablist" aria-label="Main navigation">
              <button
                onClick={() => onTabChange('odds')}
                role="tab"
                aria-selected={activeTab === 'odds'}
                aria-controls="odds-panel"
                className={`px-6 py-2 font-heading text-sm uppercase tracking-wide rounded transition-colors min-h-[44px] ${
                  activeTab === 'odds'
                    ? 'bg-amber-dark text-forest'
                    : 'text-cream hover:text-gold'
                }`}
              >
                My Odds
              </button>
              <button
                onClick={() => onTabChange('data')}
                role="tab"
                aria-selected={activeTab === 'data'}
                aria-controls="data-panel"
                className={`px-6 py-2 font-heading text-sm uppercase tracking-wide rounded transition-colors min-h-[44px] ${
                  activeTab === 'data'
                    ? 'bg-amber-dark text-forest'
                    : 'text-cream hover:text-gold'
                }`}
              >
                Data
              </button>
              <button
                onClick={() => onTabChange('map')}
                role="tab"
                aria-selected={activeTab === 'map'}
                aria-controls="map-panel"
                className={`px-6 py-2 font-heading text-sm uppercase tracking-wide rounded transition-colors min-h-[44px] ${
                  activeTab === 'map'
                    ? 'bg-amber-dark text-forest'
                    : 'text-cream hover:text-gold'
                }`}
              >
                Map
              </button>
            </nav>

            {/* Account Menu */}
            <div className="relative">
              <button
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-surface-2 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-amber-dark/20 flex items-center justify-center">
                  <span className="text-sm font-heading text-amber-dark">
                    {activeAccount?.name.charAt(0).toUpperCase() || '?'}
                  </span>
                </div>
                <span className="text-sm text-cream hidden sm:inline">{activeAccount?.name}</span>
              </button>

              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-surface-2 border border-border rounded-lg shadow-xl z-50">
                  {/* Account List */}
                  <div className="max-h-64 overflow-y-auto">
                    {accounts.map(account => (
                      <div
                        key={account.id}
                        className={`px-4 py-3 border-b border-border flex items-center justify-between group transition-colors ${
                          activeUserId === account.id
                            ? 'bg-amber-dark/10 border-l-2 border-l-amber-dark'
                            : 'hover:bg-surface'
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
                              if (e.key === 'Escape') {
                                setIsRenamingId(null);
                                setRenameValue('');
                              }
                            }}
                            autoFocus
                            className="flex-1 px-2 py-1 bg-surface border border-border rounded text-sm text-cream font-body"
                          />
                        ) : (
                          <div className="flex-1 flex items-center gap-2">
                            <button
                              onClick={() => {
                                onSwitchAccount(account.id);
                                setShowAccountMenu(false);
                              }}
                              className="flex-1 text-left hover:text-gold transition-colors"
                            >
                              <span className="font-heading text-cream">{account.name}</span>
                              {activeUserId === account.id && (
                                <span className="ml-2 text-amber-dark font-bold">●</span>
                              )}
                            </button>
                          </div>
                        )}

                        {/* Actions */}
                        {!isRenamingId && (
                          <div className="flex gap-1">
                            <button
                              onClick={() => {
                                setIsRenamingId(account.id);
                                setRenameValue(account.name);
                              }}
                              className="px-2 py-1 text-xs text-parchment hover:text-gold hover:bg-surface rounded transition-colors"
                              title="Rename"
                            >
                              ✏️
                            </button>
                            {accounts.length > 1 && (
                              <div className="relative">
                                <button
                                  onClick={() =>
                                    setDeletingId(deletingId === account.id ? null : account.id)
                                  }
                                  className="px-2 py-1 text-xs text-parchment hover:text-warn hover:bg-surface rounded transition-colors"
                                  title="Delete"
                                >
                                  🗑️
                                </button>

                                {deletingId === account.id && (
                                  <div className="absolute right-0 mt-1 bg-surface border border-border rounded shadow-lg whitespace-nowrap z-10">
                                    <div className="px-3 py-2 text-xs text-parchment">
                                      Delete "{account.name}"?
                                    </div>
                                    <div className="flex gap-1 px-2 pb-2">
                                      <button
                                        onClick={() => {
                                          onDeleteAccount(account.id);
                                          setDeletingId(null);
                                          setShowAccountMenu(false);
                                        }}
                                        className="px-2 py-1 text-xs bg-danger text-cream rounded hover:bg-warn transition-colors"
                                      >
                                        Delete
                                      </button>
                                      <button
                                        onClick={() => setDeletingId(null)}
                                        className="px-2 py-1 text-xs bg-surface-2 text-cream rounded hover:bg-border transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                )}
                            </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Create New Account */}
                  <div className="border-t border-border p-3">
                    {!isCreatingNewAccount ? (
                      <button
                        onClick={() => setIsCreatingNewAccount(true)}
                        className="w-full text-sm font-heading text-amber-dark hover:text-gold py-2 transition-colors"
                      >
                        + NEW ACCOUNT
                      </button>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Account name"
                          value={newAccountName}
                          onChange={e => setNewAccountName(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handleCreateNewAccount();
                            if (e.key === 'Escape') {
                              setIsCreatingNewAccount(false);
                              setNewAccountName('');
                            }
                          }}
                          autoFocus
                          className="flex-1 px-2 py-1 bg-surface border border-border rounded text-sm text-cream font-body"
                        />
                        <button
                          onClick={handleCreateNewAccount}
                          disabled={!newAccountName.trim()}
                          className="px-3 py-1 bg-amber-dark text-forest text-xs font-heading rounded hover:bg-gold disabled:opacity-50 transition-colors"
                        >
                          Add
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 bg-surface border-b border-border md:hidden">
        <div className="px-4 py-3 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <span className="text-xl">🦌</span>
            <div>
              <div className="text-sm font-display text-cream tracking-wider">ELK DRAW</div>
              <div className="text-xs font-heading text-parchment">ANALYZER</div>
            </div>
          </div>

          {/* Account button */}
          <div className="relative">
            <button
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              className="w-8 h-8 rounded-full bg-amber-dark/20 flex items-center justify-center text-xs font-heading text-amber-dark hover:bg-amber-dark/30 transition-colors"
              title={activeAccount?.name}
            >
              {activeAccount?.name.charAt(0).toUpperCase() || '?'}
            </button>

            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-2 border border-border rounded-lg shadow-xl z-50">
                {/* Account List (mobile version) */}
                <div className="max-h-48 overflow-y-auto">
                  {accounts.map(account => (
                    <div
                      key={account.id}
                      className={`px-4 py-3 border-b border-border flex items-center justify-between group transition-colors ${
                        activeUserId === account.id
                          ? 'bg-amber-dark/10 border-l-2 border-l-amber-dark'
                          : 'hover:bg-surface'
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
                            if (e.key === 'Escape') {
                              setIsRenamingId(null);
                              setRenameValue('');
                            }
                          }}
                          autoFocus
                          className="flex-1 px-2 py-1 bg-surface border border-border rounded text-xs text-cream font-body"
                        />
                      ) : (
                        <div className="flex-1">
                          <button
                            onClick={() => {
                              onSwitchAccount(account.id);
                              setShowAccountMenu(false);
                            }}
                            className="text-sm font-heading text-cream hover:text-gold transition-colors text-left w-full"
                          >
                            {account.name}
                            {activeUserId === account.id && (
                              <span className="ml-2 text-amber-dark font-bold">●</span>
                            )}
                          </button>
                        </div>
                      )}

                      {/* Actions */}
                      {!isRenamingId && (
                        <div className="flex gap-1 ml-2">
                          <button
                            onClick={() => {
                              setIsRenamingId(account.id);
                              setRenameValue(account.name);
                            }}
                            className="px-2 py-1 text-xs text-parchment hover:text-gold"
                            title="Rename"
                          >
                            ✏️
                          </button>
                          {accounts.length > 1 && (
                            <button
                              onClick={() =>
                                setDeletingId(deletingId === account.id ? null : account.id)
                              }
                              className="px-2 py-1 text-xs text-parchment hover:text-warn"
                              title="Delete"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      )}

                      {deletingId === account.id && (
                        <div className="absolute right-0 mt-12 bg-surface border border-border rounded shadow-lg z-10">
                          <div className="px-3 py-2 text-xs text-parchment">Delete?</div>
                          <div className="flex gap-1 px-2 pb-2">
                            <button
                              onClick={() => {
                                onDeleteAccount(account.id);
                                setDeletingId(null);
                                setShowAccountMenu(false);
                              }}
                              className="px-2 py-1 text-xs bg-danger text-cream rounded"
                            >
                              Delete
                            </button>
                            <button
                              onClick={() => setDeletingId(null)}
                              className="px-2 py-1 text-xs bg-surface-2 text-cream rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Create New Account */}
                <div className="border-t border-border p-2">
                  {!isCreatingNewAccount ? (
                    <button
                      onClick={() => setIsCreatingNewAccount(true)}
                      className="w-full text-xs font-heading text-amber-dark py-2 hover:text-gold"
                    >
                      + NEW ACCOUNT
                    </button>
                  ) : (
                    <div className="flex gap-1">
                      <input
                        type="text"
                        placeholder="Name"
                        value={newAccountName}
                        onChange={e => setNewAccountName(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') handleCreateNewAccount();
                          if (e.key === 'Escape') {
                            setIsCreatingNewAccount(false);
                            setNewAccountName('');
                          }
                        }}
                        autoFocus
                        className="flex-1 px-2 py-1 bg-surface border border-border rounded text-xs text-cream"
                      />
                      <button
                        onClick={handleCreateNewAccount}
                        disabled={!newAccountName.trim()}
                        className="px-2 py-1 bg-amber-dark text-forest text-xs font-heading rounded disabled:opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border md:hidden z-40" role="tablist" aria-label="Mobile navigation">
        <div className="flex h-14">
          <button
            onClick={() => onTabChange('odds')}
            role="tab"
            aria-selected={activeTab === 'odds'}
            aria-controls="odds-panel"
            className={`flex-1 flex items-center justify-center font-heading text-xs uppercase tracking-wide transition-colors relative min-h-[56px] ${
              activeTab === 'odds'
                ? 'text-amber-dark'
                : 'text-parchment hover:text-cream'
            }`}
          >
            My Odds
            {activeTab === 'odds' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-dark" />
            )}
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => onTabChange('data')}
            role="tab"
            aria-selected={activeTab === 'data'}
            aria-controls="data-panel"
            className={`flex-1 flex items-center justify-center font-heading text-xs uppercase tracking-wide transition-colors relative min-h-[56px] ${
              activeTab === 'data'
                ? 'text-amber-dark'
                : 'text-parchment hover:text-cream'
            }`}
          >
            Data
            {activeTab === 'data' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-dark" />
            )}
          </button>
          <div className="w-px bg-border" />
          <button
            onClick={() => onTabChange('map')}
            role="tab"
            aria-selected={activeTab === 'map'}
            aria-controls="map-panel"
            className={`flex-1 flex items-center justify-center font-heading text-xs uppercase tracking-wide transition-colors relative min-h-[56px] ${
              activeTab === 'map'
                ? 'text-amber-dark'
                : 'text-parchment hover:text-cream'
            }`}
          >
            Map
            {activeTab === 'map' && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-dark" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav spacer */}
      <div className="h-14 md:hidden" />
    </>
  );
}
