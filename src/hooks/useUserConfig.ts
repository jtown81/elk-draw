/**
 * Multi-User Config Hook
 *
 * Manages user preferences (preference points, tag type preference),
 * scoped per user account.
 */

import { useState, useEffect, useCallback } from 'react';
import type { UserConfig, TagType } from '@models/draw';

const DEFAULT_CONFIG: UserConfig = {
  preferencePoints: 11,
  tagType: 'any_elk',
};

/**
 * Hook for managing user preferences for a specific account.
 *
 * @param userId The user account ID to load/save config for
 * @returns Config management interface
 */
export function useUserConfig(userId: string | null) {
  const [config, setConfig] = useState<UserConfig>(DEFAULT_CONFIG);
  const [isLoading, setIsLoading] = useState(true);

  // Generate storage key for this user
  const getStorageKey = useCallback(() => {
    return userId ? `sd-elk:user-config:${userId}` : null;
  }, [userId]);

  // Load from localStorage on mount or when userId changes
  useEffect(() => {
    const key = getStorageKey();
    if (!key) {
      setConfig(DEFAULT_CONFIG);
      setIsLoading(false);
      return;
    }

    try {
      const stored = localStorage.getItem(key);
      if (stored) {
        const parsed = JSON.parse(stored) as UserConfig;
        setConfig(parsed);
      } else {
        setConfig(DEFAULT_CONFIG);
      }
    } catch (error) {
      console.error(`Failed to load config for user ${userId}:`, error);
      setConfig(DEFAULT_CONFIG);
    }

    setIsLoading(false);
  }, [userId, getStorageKey]);

  // Persist config whenever it changes
  useEffect(() => {
    if (!isLoading) {
      const key = getStorageKey();
      if (key) {
        localStorage.setItem(key, JSON.stringify(config));
      }
    }
  }, [config, isLoading, getStorageKey]);

  /**
   * Update the complete config.
   */
  const setCompleteConfig = useCallback((newConfig: UserConfig) => {
    // Validate preference points
    if (newConfig.preferencePoints < 0 || newConfig.preferencePoints > 25) {
      console.warn(
        `Invalid preference points: ${newConfig.preferencePoints}. Using previous value.`
      );
      return;
    }

    setConfig(newConfig);
  }, []);

  /**
   * Update preference points only.
   */
  const setPreferencePoints = useCallback((points: number) => {
    if (points < 0 || points > 25) {
      console.warn(`Invalid preference points: ${points}. Must be 0–25.`);
      return;
    }

    setConfig(prev => ({ ...prev, preferencePoints: points }));
  }, []);

  /**
   * Update tag type preference only.
   */
  const setTagTypePreference = useCallback((tagType: TagType) => {
    setConfig(prev => ({ ...prev, tagType }));
  }, []);

  /**
   * Reset config to defaults.
   */
  const reset = useCallback(() => {
    setConfig(DEFAULT_CONFIG);
  }, []);

  return {
    config,
    isLoading,
    setCompleteConfig,
    setPreferencePoints,
    setTagTypePreference,
    reset,
  };
}
