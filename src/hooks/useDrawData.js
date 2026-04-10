/**
 * Multi-User Draw Data Persistence Hook
 *
 * Manages CRUD operations for draw records, scoped per user account.
 * All data is stored in localStorage under user-specific keys.
 */
import { useState, useEffect, useCallback } from 'react';
/**
 * Hook for managing draw records for a specific user.
 *
 * @param userId The user account ID to load/save data for
 * @returns Draw data management interface
 */
export function useDrawData(userId) {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    // Generate storage key for this user
    const getStorageKey = useCallback(() => {
        return userId ? `sd-elk:draw-records:${userId}` : null;
    }, [userId]);
    // Load from localStorage on mount or when userId changes
    useEffect(() => {
        const key = getStorageKey();
        if (!key) {
            setRecords([]);
            setIsLoading(false);
            return;
        }
        try {
            const stored = localStorage.getItem(key);
            if (stored) {
                const parsed = JSON.parse(stored);
                setRecords(parsed);
            }
            else {
                setRecords([]);
            }
        }
        catch (error) {
            console.error(`Failed to load draw data for user ${userId}:`, error);
            setRecords([]);
        }
        setIsLoading(false);
    }, [userId, getStorageKey]);
    // Persist records whenever they change
    useEffect(() => {
        if (!isLoading) {
            const key = getStorageKey();
            if (key) {
                localStorage.setItem(key, JSON.stringify(records));
            }
        }
    }, [records, isLoading, getStorageKey]);
    /**
     * Add a new draw record.
     */
    const addRecord = useCallback((data) => {
        const now = new Date().toISOString();
        const newRecord = {
            ...data,
            id: crypto.randomUUID(),
            addedDate: now,
            updatedDate: now,
        };
        setRecords(prev => [...prev, newRecord]);
        return newRecord;
    }, []);
    /**
     * Update an existing draw record.
     */
    const updateRecord = useCallback((id, updates) => {
        let updated = null;
        setRecords(prev => prev.map(r => {
            if (r.id === id) {
                updated = {
                    ...r,
                    ...updates,
                    updatedDate: new Date().toISOString(),
                };
                return updated;
            }
            return r;
        }));
        return updated;
    }, []);
    /**
     * Delete a draw record.
     */
    const deleteRecord = useCallback((id) => {
        setRecords(prev => prev.filter(r => r.id !== id));
    }, []);
    /**
     * Get a single record by ID.
     */
    const getRecord = useCallback((id) => {
        return records.find(r => r.id === id) || null;
    }, [records]);
    /**
     * Get records filtered by unit name.
     */
    const getRecordsByUnit = useCallback((unitName) => {
        return records.filter(r => r.unitName.toUpperCase() === unitName.toUpperCase());
    }, [records]);
    /**
     * Get records filtered by tag type.
     */
    const getRecordsByTagType = useCallback((tagType) => {
        return records.filter(r => r.tagType === tagType);
    }, [records]);
    /**
     * Get records for a specific unit and tag type.
     */
    const getRecordsByUnitAndTagType = useCallback((unitName, tagType) => {
        return records.filter(r => r.unitName.toUpperCase() === unitName.toUpperCase() &&
            r.tagType === tagType);
    }, [records]);
    /**
     * Import records from JSON, merging with existing data.
     */
    const importRecords = useCallback((data) => {
        try {
            setRecords(prev => {
                const ids = new Set(prev.map(r => r.id));
                const newRecords = data.filter(d => !ids.has(d.id));
                return [...prev, ...newRecords];
            });
            return true;
        }
        catch (error) {
            console.error('Failed to import records:', error);
            return false;
        }
    }, []);
    /**
     * Replace all records (destructive import).
     */
    const replaceRecords = useCallback((data) => {
        try {
            setRecords(data);
            return true;
        }
        catch (error) {
            console.error('Failed to replace records:', error);
            return false;
        }
    }, []);
    /**
     * Export records as JSON string.
     */
    const exportRecords = useCallback(() => {
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
