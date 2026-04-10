/**
 * Demo Data Fixture
 *
 * Sample elk draw data for new users to explore the app without manually
 * entering data. Based on realistic 2024 GFP statistics.
 *
 * Source: South Dakota Game, Fish and Parks
 * https://license.gooutdoorssouthdakota.com/License/DrawStatistics
 */

import type { DrawRecord, UserAccount } from '@models/draw';

/**
 * Demo account for first-time exploration.
 */
export const DEMO_ACCOUNT: UserAccount = {
  id: 'demo-user',
  name: 'Demo Hunter',
  createdDate: new Date('2024-01-01').toISOString(),
  updatedDate: new Date().toISOString(),
};

/**
 * Sample elk draw records (2023–2024) from popular Black Hills units.
 * Data reflects approximate GFP statistics for demonstration purposes.
 */
export const DEMO_RECORDS: DrawRecord[] = [
  // H1A — Custer area (popular, high competition)
  {
    id: 'demo-h1a-2024',
    unitName: 'H1A',
    year: 2024,
    tagType: 'any_elk',
    pools: [
      {
        pool: '15plus',
        tagsAvailable: 20,
        applicants: 1200,
        lowestPointDrawn: 15,
      },
      {
        pool: '10plus',
        tagsAvailable: 20,
        applicants: 4320,
        lowestPointDrawn: 11,
      },
      {
        pool: '0plus',
        tagsAvailable: 21,
        applicants: 8500,
        lowestPointDrawn: 1,
      },
    ],
    addedDate: new Date('2024-03-15').toISOString(),
    updatedDate: new Date('2024-03-15').toISOString(),
  },
  {
    id: 'demo-h1a-2024-ant',
    unitName: 'H1A',
    year: 2024,
    tagType: 'antlerless',
    pools: [
      {
        pool: '15plus',
        tagsAvailable: 10,
        applicants: 800,
        lowestPointDrawn: 14,
      },
      {
        pool: '10plus',
        tagsAvailable: 10,
        applicants: 2500,
        lowestPointDrawn: 10,
      },
      {
        pool: '0plus',
        tagsAvailable: 11,
        applicants: 4200,
        lowestPointDrawn: 0,
      },
    ],
    addedDate: new Date('2024-03-15').toISOString(),
    updatedDate: new Date('2024-03-15').toISOString(),
  },
  {
    id: 'demo-h1a-2023',
    unitName: 'H1A',
    year: 2023,
    tagType: 'any_elk',
    pools: [
      {
        pool: '15plus',
        tagsAvailable: 20,
        applicants: 1100,
        lowestPointDrawn: 16,
      },
      {
        pool: '10plus',
        tagsAvailable: 20,
        applicants: 4100,
        lowestPointDrawn: 12,
      },
    ],
    addedDate: new Date('2024-03-15').toISOString(),
    updatedDate: new Date('2024-03-15').toISOString(),
  },

  // H3A — Badlands area (moderate competition)
  {
    id: 'demo-h3a-2024',
    unitName: 'H3A',
    year: 2024,
    tagType: 'any_elk',
    pools: [
      {
        pool: '15plus',
        tagsAvailable: 15,
        applicants: 650,
        lowestPointDrawn: 15,
      },
      {
        pool: '10plus',
        tagsAvailable: 15,
        applicants: 2400,
        lowestPointDrawn: 11,
      },
      {
        pool: '0plus',
        tagsAvailable: 16,
        applicants: 4200,
        lowestPointDrawn: 1,
      },
    ],
    addedDate: new Date('2024-03-15').toISOString(),
    updatedDate: new Date('2024-03-15').toISOString(),
  },

  // H11E — Northern Black Hills (lower competition)
  {
    id: 'demo-h11e-2024',
    unitName: 'H11E',
    year: 2024,
    tagType: 'any_elk',
    pools: [
      {
        pool: '15plus',
        tagsAvailable: 12,
        applicants: 420,
        lowestPointDrawn: 15,
      },
      {
        pool: '10plus',
        tagsAvailable: 12,
        applicants: 1800,
        lowestPointDrawn: 10,
      },
      {
        pool: '0plus',
        tagsAvailable: 13,
        applicants: 2900,
        lowestPointDrawn: 0,
      },
    ],
    addedDate: new Date('2024-03-15').toISOString(),
    updatedDate: new Date('2024-03-15').toISOString(),
  },

  // CSP — Community Special Preference (niche draw)
  {
    id: 'demo-csp-2024',
    unitName: 'CSP',
    year: 2024,
    tagType: 'any_elk',
    pools: [
      {
        pool: '10plus',
        tagsAvailable: 8,
        applicants: 500,
        lowestPointDrawn: 10,
      },
    ],
    addedDate: new Date('2024-03-15').toISOString(),
    updatedDate: new Date('2024-03-15').toISOString(),
  },

  // Prairie unit (lower demand)
  {
    id: 'demo-9a-2024',
    unitName: '9A',
    year: 2024,
    tagType: 'any_elk',
    pools: [
      {
        pool: '15plus',
        tagsAvailable: 8,
        applicants: 280,
        lowestPointDrawn: 15,
      },
      {
        pool: '10plus',
        tagsAvailable: 8,
        applicants: 1200,
        lowestPointDrawn: 11,
      },
      {
        pool: '0plus',
        tagsAvailable: 9,
        applicants: 2100,
        lowestPointDrawn: 1,
      },
    ],
    addedDate: new Date('2024-03-15').toISOString(),
    updatedDate: new Date('2024-03-15').toISOString(),
  },
];

/**
 * Load demo data for a new user to explore the app.
 * Call this from App.tsx when first account is created.
 *
 * @param userId The new user's account ID
 */
export function loadDemoData(userId: string): void {
  // Update demo records with user's ID in localStorage keys
  localStorage.setItem(`sd-elk:draw-records:${userId}`, JSON.stringify(DEMO_RECORDS));

  // Set default config for demo user
  localStorage.setItem(
    `sd-elk:user-config:${userId}`,
    JSON.stringify({ preferencePoints: 11, tagType: 'any_elk' })
  );
}

/**
 * Get record count for demo data.
 */
export function getDemoRecordCount(): number {
  return DEMO_RECORDS.length;
}

/**
 * Get unique units in demo data.
 */
export function getDemoUnitCount(): number {
  return new Set(DEMO_RECORDS.map(r => r.unitName)).size;
}
