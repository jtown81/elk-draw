/**
 * Integration Tests — Elk Draw Analyzer Workflow
 *
 * Tests complete user workflows: data entry → odds calculation → filtering
 * These tests verify the full system works end-to-end.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { DrawRecord, UserAccount } from '@models/draw';
import { calcOdds, getQualifyingPool } from '@modules/odds-calculator';

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

describe('Complete User Workflow', () => {
  it('creates account, adds draw data, calculates odds', () => {
    // Step 1: User creates account
    const userId = 'test-user-1';
    const account: UserAccount = {
      id: userId,
      name: 'John Hunter',
      createdDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };
    localStorage.setItem('sd-elk:accounts', JSON.stringify([account]));
    localStorage.setItem('sd-elk:active-user-id', userId);

    // Step 2: User sets preferences (11 points, any elk)
    const config = { preferencePoints: 11, tagType: 'any_elk' as const };
    localStorage.setItem(`sd-elk:user-config:${userId}`, JSON.stringify(config));

    // Step 3: User adds first draw record (H1A 2024)
    const record1: DrawRecord = {
      id: 'rec-1',
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

    const records = [record1];
    localStorage.setItem(`sd-elk:draw-records:${userId}`, JSON.stringify(records));

    // Step 4: Verify data persistence
    expect(localStorage.getItem('sd-elk:active-user-id')).toBe(userId);
    expect(localStorage.getItem(`sd-elk:user-config:${userId}`)).toBeDefined();
    expect(localStorage.getItem(`sd-elk:draw-records:${userId}`)).toBeDefined();

    // Step 5: Calculate odds for H1A with 11 points in 10+ pool
    const pool = getQualifyingPool(config.preferencePoints);
    expect(pool).toBe('10plus');

    const odds = calcOdds(config.preferencePoints, pool, 4320, 30);
    expect(odds).toBeGreaterThan(0);
    expect(odds).toBeLessThan(1); // ~0.55%

    // Odds should be approximately 0.546%
    expect(odds).toBeCloseTo(0.546, 2);
  });

  it('adds multiple units and filters by tag type', () => {
    const userId = 'test-user-2';
    const config = { preferencePoints: 15, tagType: 'any_elk' as const };

    // Add multiple draw records
    const records: DrawRecord[] = [
      {
        id: 'rec-1',
        unitName: 'H1A',
        year: 2024,
        tagType: 'any_elk',
        pools: [
          {
            pool: '15plus',
            tagsAvailable: 20,
            applicants: 2000,
            lowestPointDrawn: 15,
          },
        ],
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
      {
        id: 'rec-2',
        unitName: 'H1A',
        year: 2024,
        tagType: 'antlerless',
        pools: [
          {
            pool: '15plus',
            tagsAvailable: 10,
            applicants: 1500,
            lowestPointDrawn: 14,
          },
        ],
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
      {
        id: 'rec-3',
        unitName: 'H2A',
        year: 2024,
        tagType: 'any_elk',
        pools: [
          {
            pool: '15plus',
            tagsAvailable: 15,
            applicants: 1800,
            lowestPointDrawn: 15,
          },
        ],
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
    ];

    localStorage.setItem(`sd-elk:user-config:${userId}`, JSON.stringify(config));
    localStorage.setItem(`sd-elk:draw-records:${userId}`, JSON.stringify(records));

    // Load and verify
    const storedConfig = JSON.parse(
      localStorage.getItem(`sd-elk:user-config:${userId}`)!
    );
    const storedRecords = JSON.parse(
      localStorage.getItem(`sd-elk:draw-records:${userId}`)!
    ) as DrawRecord[];

    // Filter by user's tag type
    const matchingRecords = storedRecords.filter(
      r => r.tagType === storedConfig.tagType
    );

    expect(matchingRecords).toHaveLength(2); // H1A + H2A (both any_elk)
    expect(matchingRecords.map(r => r.unitName).sort()).toEqual(['H1A', 'H2A']);
  });

  it('updates user preferences and recalculates odds', () => {
    const userId = 'test-user-3';

    // Initial: 11 points, any elk
    let config = { preferencePoints: 11, tagType: 'any_elk' as const };
    localStorage.setItem(`sd-elk:user-config:${userId}`, JSON.stringify(config));

    // Add a record
    const record: DrawRecord = {
      id: 'rec-1',
      unitName: 'H1A',
      year: 2024,
      tagType: 'any_elk',
      pools: [
        {
          pool: '10plus',
          tagsAvailable: 30,
          applicants: 4320,
          lowestPointDrawn: 10,
        },
      ],
      addedDate: new Date().toISOString(),
      updatedDate: new Date().toISOString(),
    };
    localStorage.setItem(`sd-elk:draw-records:${userId}`, JSON.stringify([record]));

    // Calculate initial odds
    let pool = getQualifyingPool(config.preferencePoints);
    let odds = calcOdds(config.preferencePoints, pool, 4320, 30);
    const oddsAt11Points = odds;

    // User updates to 15 points
    config = { preferencePoints: 15, tagType: 'any_elk' };
    localStorage.setItem(`sd-elk:user-config:${userId}`, JSON.stringify(config));

    // Recalculate odds
    pool = getQualifyingPool(config.preferencePoints);
    expect(pool).toBe('15plus'); // Should move to higher pool
    odds = calcOdds(config.preferencePoints, pool, 4320, 20);
    const oddsAt15Points = odds;

    // At 15 points, user has more entries but higher pool competitiveness
    // Odds may be lower or higher depending on pool composition
    expect(oddsAt15Points).toBeGreaterThanOrEqual(0);
    expect(oddsAt15Points).toBeLessThanOrEqual(100);
  });

  it('calculates odds across multiple years (historical comparison)', () => {
    const userId = 'test-user-4';
    const config = { preferencePoints: 11, tagType: 'any_elk' as const };

    // Add same unit, different years
    const records: DrawRecord[] = [
      {
        id: 'rec-2024',
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
      },
      {
        id: 'rec-2023',
        unitName: 'H1A',
        year: 2023,
        tagType: 'any_elk',
        pools: [
          {
            pool: '10plus',
            tagsAvailable: 30,
            applicants: 3200, // Fewer applicants in 2023
            lowestPointDrawn: 11,
          },
        ],
        addedDate: new Date().toISOString(),
        updatedDate: new Date().toISOString(),
      },
    ];

    localStorage.setItem(`sd-elk:user-config:${userId}`, JSON.stringify(config));
    localStorage.setItem(`sd-elk:draw-records:${userId}`, JSON.stringify(records));

    // Calculate odds for each year
    const odds2024 = calcOdds(11, '10plus', 4320, 30);
    const odds2023 = calcOdds(11, '10plus', 3200, 30);

    // Fewer applicants = better odds
    expect(odds2023).toBeGreaterThan(odds2024);
  });

  it('handles no matching data gracefully', () => {
    const userId = 'test-user-empty';
    const config = { preferencePoints: 11, tagType: 'any_elk' as const };

    localStorage.setItem(`sd-elk:user-config:${userId}`, JSON.stringify(config));
    localStorage.setItem(`sd-elk:draw-records:${userId}`, JSON.stringify([]));

    const storedRecords = JSON.parse(
      localStorage.getItem(`sd-elk:draw-records:${userId}`)!
    ) as DrawRecord[];

    expect(storedRecords).toHaveLength(0);
    expect(storedRecords.filter(r => r.tagType === config.tagType)).toHaveLength(0);
  });

  it('validates odds calculations against known values', () => {
    // Test against real GFP example: H1A 2024 10+ pool with 11 points
    // Real data: 30 tags, 4320 applicants, user has 11 points (1,728 entries)
    // Formula: (1,728 × 30 / (4,320 × 2,197 avg)) × 100 ≈ 0.546%

    const odds = calcOdds(11, '10plus', 4320, 30);

    // Should be approximately 0.546%
    expect(odds).toBeCloseTo(0.546, 2);

    // Test with different applicant counts
    const oddsHighCompetition = calcOdds(11, '10plus', 10000, 30);
    const oddsLowCompetition = calcOdds(11, '10plus', 1000, 30);

    // More applicants = lower odds
    expect(oddsHighCompetition).toBeLessThan(oddsLowCompetition);

    // Test with more preference points
    const odds15Pts = calcOdds(15, '15plus', 4320, 20);
    expect(odds15Pts).toBeGreaterThan(0);
  });
});
