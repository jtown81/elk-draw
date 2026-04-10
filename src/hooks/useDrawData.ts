/**
 * Draw Data Hook
 *
 * Provides draw records from scraped GFP seed data.
 * Records are always loaded from the bundled seed — no localStorage persistence.
 */

import { useState, useEffect, useCallback } from 'react';
import type { DrawRecord, TagType } from '@models/draw';
import { SEED_DRAW_DATA } from '@data/seed-draw-data';

/**
 * Hook for accessing draw records for a specific user.
 *
 * @param userId The user account ID
 * @returns Draw data interface
 */
export function useDrawData(userId: string | null) {
  const [records, setRecords] = useState<DrawRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Always initialize from seed data — draw statistics come from scrapes, not user input
  useEffect(() => {
    if (!userId) {
      setRecords([]);
      setIsLoading(false);
      return;
    }

    setRecords(SEED_DRAW_DATA);
    setIsLoading(false);
  }, [userId]);


  /**
   * Add a new draw record.
   */
  const addRecord = useCallback(
    (data: Omit<DrawRecord, 'id' | 'addedDate' | 'updatedDate'>): DrawRecord => {
      const now = new Date().toISOString();
      const newRecord: DrawRecord = {
        ...data,
        id: crypto.randomUUID(),
        addedDate: now,
        updatedDate: now,
      };

      setRecords(prev => [...prev, newRecord]);
      return newRecord;
    },
    []
  );

  /**
   * Update an existing draw record.
   */
  const updateRecord = useCallback(
    (id: string, updates: Partial<Omit<DrawRecord, 'id' | 'addedDate'>>): DrawRecord | null => {
      let updated: DrawRecord | null = null;

      setRecords(prev =>
        prev.map(r => {
          if (r.id === id) {
            updated = {
              ...r,
              ...updates,
              updatedDate: new Date().toISOString(),
            };
            return updated;
          }
          return r;
        })
      );

      return updated;
    },
    []
  );

  /**
   * Delete a draw record.
   */
  const deleteRecord = useCallback((id: string) => {
    setRecords(prev => prev.filter(r => r.id !== id));
  }, []);

  /**
   * Get a single record by ID.
   */
  const getRecord = useCallback(
    (id: string): DrawRecord | null => {
      return records.find(r => r.id === id) || null;
    },
    [records]
  );

  /**
   * Get records filtered by unit name.
   */
  const getRecordsByUnit = useCallback(
    (unitName: string): DrawRecord[] => {
      return records.filter(r => r.unitName.toUpperCase() === unitName.toUpperCase());
    },
    [records]
  );

  /**
   * Get records filtered by tag type.
   */
  const getRecordsByTagType = useCallback(
    (tagType: TagType): DrawRecord[] => {
      return records.filter(r => r.tagType === tagType);
    },
    [records]
  );

  /**
   * Get records for a specific unit and tag type.
   */
  const getRecordsByUnitAndTagType = useCallback(
    (unitName: string, tagType: TagType): DrawRecord[] => {
      return records.filter(
        r =>
          r.unitName.toUpperCase() === unitName.toUpperCase() &&
          r.tagType === tagType
      );
    },
    [records]
  );

  /**
   * Import records from JSON, merging with existing data.
   */
  const importRecords = useCallback((data: DrawRecord[]) => {
    try {
      setRecords(prev => {
        const ids = new Set(prev.map(r => r.id));
        const newRecords = data.filter(d => !ids.has(d.id));
        return [...prev, ...newRecords];
      });
      return true;
    } catch (error) {
      console.error('Failed to import records:', error);
      return false;
    }
  }, []);

  /**
   * Replace all records (destructive import).
   */
  const replaceRecords = useCallback((data: DrawRecord[]) => {
    try {
      setRecords(data);
      return true;
    } catch (error) {
      console.error('Failed to replace records:', error);
      return false;
    }
  }, []);

  /**
   * Export records as JSON string.
   */
  const exportRecords = useCallback((): string => {
    return JSON.stringify(records, null, 2);
  }, [records]);

  /**
   * Delete all records for this user (destructive).
   */
  const clearAll = useCallback(() => {
    setRecords([]);
  }, []);

  return {
    records,
    isLoading,
    addRecord,
    updateRecord,
    deleteRecord,
    getRecord,
    getRecordsByUnit,
    getRecordsByTagType,
    getRecordsByUnitAndTagType,
    importRecords,
    replaceRecords,
    exportRecords,
    clearAll,
  };
}
