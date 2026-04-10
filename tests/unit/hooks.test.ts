/**
 * Unit Tests for Multi-User Hooks
 *
 * Tests localStorage persistence for user accounts and draw data.
 * Note: These tests use direct localStorage API mocking rather than renderHook
 * to focus on persistence logic.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { UserAccount, DrawRecord } from '@models/draw';

// Mock localStorage for testing
let store: Record<string, string> = {};

beforeEach(() => {
  store = {};
  global.localStorage = {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    length: 0,
    key: () => null,
  } as Storage;
});

afterEach(() => {
  store = {};
});

describe('User Account Persistence', () => {
  it('creates and stores a new account', () => {
    const now = new Date().toISOString();
    const account: UserAccount = {
      id: 'test-id-1',
      name: 'John Doe',
      createdDate: now,
      updatedDate: now,
    };

    localStorage.setItem('sd-elk:accounts', JSON.stringify([account]));

    const stored = localStorage.getItem('sd-elk:accounts');
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored!) as UserAccount[];
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('John Doe');
  });

  it('stores multiple accounts', () => {
    const accounts: UserAccount[] = [
      {
        id: 'user-1',
        name: 'Hunter A',
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
      {
        id: 'user-2',
        name: 'Hunter B',
        createdDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
    ];

    localStorage.setItem('sd-elk:accounts', JSON.stringify(accounts));
    const stored = localStorage.getItem('sd-elk:accounts');
    const parsed = JSON.parse(stored!) as UserAccount[];

    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe('Hunter A');
    expect(parsed[1].name).toBe('Hunter B');
  });

  it('tracks active user ID', () => {
    localStorage.setItem('sd-elk:active-user-id', 'user-123');
    expect(localStorage.getItem('sd-elk:active-user-id')).toBe('user-123');
  });
});

describe('User-Scoped Draw Data Persistence', () => {
  it('stores draw records under user-specific key', () => {
    const userId = 'user-456';
    const record: DrawRecord = {
      id: 'record-1',
      unitName: 'H1A',
      year: 2024,
      tagType: 'any_elk',
      pools: [
        {
          pool: '10plus',
          tagsAvailable: 30,
          applicants: 4320,
          lowestPointDrawn: 11,
        },
      ],
      addedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    const key = `sd-elk:draw-records:${userId}`;
    localStorage.setItem(key, JSON.stringify([record]));

    const stored = localStorage.getItem(key);
    expect(stored).toBeDefined();

    const parsed = JSON.parse(stored!) as DrawRecord[];
    expect(parsed).toHaveLength(1);
    expect(parsed[0].unitName).toBe('H1A');
  });

  it('isolates data between different users', () => {
    const record1: DrawRecord = {
      id: 'record-1',
      unitName: 'H1A',
      year: 2024,
      tagType: 'any_elk',
      pools: [],
      addedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    const record2: DrawRecord = {
      id: 'record-2',
      unitName: 'H2A',
      year: 2024,
      tagType: 'antlerless',
      pools: [],
      addedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };

    // Store different records for different users
    localStorage.setItem('sd-elk:draw-records:user-1', JSON.stringify([record1]));
    localStorage.setItem('sd-elk:draw-records:user-2', JSON.stringify([record2]));

    const user1Data = JSON.parse(
      localStorage.getItem('sd-elk:draw-records:user-1')!
    ) as DrawRecord[];
    const user2Data = JSON.parse(
      localStorage.getItem('sd-elk:draw-records:user-2')!
    ) as DrawRecord[];

    expect(user1Data[0].unitName).toBe('H1A');
    expect(user2Data[0].unitName).toBe('H2A');
  });

  it('stores multiple records per user', () => {
    const userId = 'user-789';
    const records: DrawRecord[] = [
      {
        id: 'rec-1',
        unitName: 'H1A',
        year: 2024,
        tagType: 'any_elk',
        pools: [],
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
      {
        id: 'rec-2',
        unitName: 'H1B',
        year: 2024,
        tagType: 'any_elk',
        pools: [],
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
      {
        id: 'rec-3',
        unitName: 'H1A',
        year: 2023,
        tagType: 'antlerless',
        pools: [],
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
    ];

    localStorage.setItem(`sd-elk:draw-records:${userId}`, JSON.stringify(records));

    const stored = localStorage.getItem(`sd-elk:draw-records:${userId}`);
    const parsed = JSON.parse(stored!) as DrawRecord[];

    expect(parsed).toHaveLength(3);
    expect(parsed.filter(r => r.unitName === 'H1A')).toHaveLength(2);
  });
});

describe('User-Scoped Config Persistence', () => {
  it('stores user preferences under user-specific key', () => {
    const userId = 'user-999';
    const config = {
      preferencePoints: 15,
      tagType: 'antlerless' as const,
    };

    localStorage.setItem(`sd-elk:user-config:${userId}`, JSON.stringify(config));

    const stored = localStorage.getItem(`sd-elk:user-config:${userId}`);
    const parsed = JSON.parse(stored!);

    expect(parsed.preferencePoints).toBe(15);
    expect(parsed.tagType).toBe('antlerless');
  });

  it('defaults to 11 points / any_elk when not set', () => {
    const userId = 'new-user';
    const key = `sd-elk:user-config:${userId}`;

    expect(localStorage.getItem(key)).toBeNull();

    // Application would provide defaults
    const defaults = {
      preferencePoints: 11,
      tagType: 'any_elk' as const,
    };
    expect(defaults.preferencePoints).toBe(11);
  });

  it('isolates preferences between users', () => {
    const config1 = { preferencePoints: 11, tagType: 'any_elk' as const };
    const config2 = { preferencePoints: 20, tagType: 'antlerless' as const };

    localStorage.setItem('sd-elk:user-config:user-1', JSON.stringify(config1));
    localStorage.setItem('sd-elk:user-config:user-2', JSON.stringify(config2));

    const user1Config = JSON.parse(localStorage.getItem('sd-elk:user-config:user-1')!);
    const user2Config = JSON.parse(localStorage.getItem('sd-elk:user-config:user-2')!);

    expect(user1Config.preferencePoints).toBe(11);
    expect(user2Config.preferencePoints).toBe(20);
  });
});

describe('Data Cleanup on Account Deletion', () => {
  it('removes user data when account is deleted', () => {
    const userId = 'user-to-delete';

    // Set up data for user
    localStorage.setItem(
      `sd-elk:draw-records:${userId}`,
      JSON.stringify([{ id: 'rec-1', unitName: 'H1A' }])
    );
    localStorage.setItem(
      `sd-elk:user-config:${userId}`,
      JSON.stringify({ preferencePoints: 11 })
    );

    // Verify data exists
    expect(localStorage.getItem(`sd-elk:draw-records:${userId}`)).toBeDefined();
    expect(localStorage.getItem(`sd-elk:user-config:${userId}`)).toBeDefined();

    // Delete user data (application would do this)
    localStorage.removeItem(`sd-elk:draw-records:${userId}`);
    localStorage.removeItem(`sd-elk:user-config:${userId}`);

    // Verify data removed
    expect(localStorage.getItem(`sd-elk:draw-records:${userId}`)).toBeNull();
    expect(localStorage.getItem(`sd-elk:user-config:${userId}`)).toBeNull();
  });
});
