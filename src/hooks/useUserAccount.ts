/**
 * Multi-User Account Management Hook
 *
 * Manages user account creation, selection, deletion, and persistence.
 * All draw records and preferences are scoped per user account.
 */

import { useState, useEffect, useCallback } from 'react';
import type { UserAccount } from '@models/draw';

const ACCOUNTS_KEY = 'sd-elk:accounts';
const ACTIVE_USER_KEY = 'sd-elk:active-user-id';

/**
 * Hook for managing user accounts.
 *
 * @returns Object with account management functions and state
 */
export function useUserAccount() {
  const [accounts, setAccounts] = useState<UserAccount[]>([]);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize from localStorage on mount
  useEffect(() => {
    const storedAccounts = localStorage.getItem(ACCOUNTS_KEY);
    const storedActiveUserId = localStorage.getItem(ACTIVE_USER_KEY);

    if (storedAccounts) {
      try {
        const parsed = JSON.parse(storedAccounts) as UserAccount[];
        setAccounts(parsed);

        // Set active user if available and valid
        if (storedActiveUserId && parsed.some(a => a.id === storedActiveUserId)) {
          setActiveUserId(storedActiveUserId);
        } else if (parsed.length > 0) {
          // Default to first account if active user not found
          setActiveUserId(parsed[0].id);
        }
      } catch (error) {
        console.error('Failed to load accounts:', error);
      }
    }

    setIsLoading(false);
  }, []);

  // Persist accounts whenever they change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
    }
  }, [accounts, isLoading]);

  // Persist active user whenever it changes
  useEffect(() => {
    if (!isLoading) {
      if (activeUserId) {
        localStorage.setItem(ACTIVE_USER_KEY, activeUserId);
      } else {
        localStorage.removeItem(ACTIVE_USER_KEY);
      }
    }
  }, [activeUserId, isLoading]);

  /**
   * Create a new user account.
   */
  const createAccount = useCallback((name: string): UserAccount => {
    const now = new Date().toISOString();
    const newAccount: UserAccount = {
      id: crypto.randomUUID(),
      name,
      createdDate: now,
      updatedDate: now,
    };

    setAccounts(prev => [...prev, newAccount]);
    setActiveUserId(newAccount.id);
    return newAccount;
  }, []);

  /**
   * Delete a user account and all associated data.
   *
   * @param userId Account ID to delete
   */
  const deleteAccount = useCallback((userId: string) => {
    // Remove from accounts list
    setAccounts(prev => prev.filter(a => a.id !== userId));

    // Remove all data associated with this user
    localStorage.removeItem(`sd-elk:draw-records:${userId}`);
    localStorage.removeItem(`sd-elk:user-config:${userId}`);

    // If this was the active user, switch to another or clear
    if (activeUserId === userId) {
      const remaining = accounts.filter(a => a.id !== userId);
      if (remaining.length > 0) {
        setActiveUserId(remaining[0].id);
      } else {
        setActiveUserId(null);
      }
    }
  }, [activeUserId, accounts]);

  /**
   * Rename a user account.
   */
  const renameAccount = useCallback((userId: string, newName: string) => {
    setAccounts(prev =>
      prev.map(a =>
        a.id === userId
          ? { ...a, name: newName, updatedDate: new Date().toISOString() }
          : a
      )
    );
  }, []);

  /**
   * Switch to a different user account.
   */
  const switchAccount = useCallback((userId: string) => {
    if (accounts.some(a => a.id === userId)) {
      setActiveUserId(userId);
    }
  }, [accounts]);

  /**
   * Get the currently active user account.
   */
  const getActiveAccount = useCallback((): UserAccount | null => {
    if (!activeUserId) return null;
    return accounts.find(a => a.id === activeUserId) || null;
  }, [accounts, activeUserId]);

  return {
    accounts,
    activeUserId,
    activeAccount: getActiveAccount(),
    isLoading,
    createAccount,
    deleteAccount,
    renameAccount,
    switchAccount,
  };
}
