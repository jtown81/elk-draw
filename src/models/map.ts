/**
 * Map Data Models
 *
 * Interfaces for unit polygons, odds tiers, and map rendering.
 */

import type { TagType } from './draw';

/**
 * A unit polygon for SVG rendering.
 *
 * All coordinates are relative to MAP_VIEWBOX and must be projected
 * from geographic coordinates (lat/lng) to SVG viewport coordinates.
 */
export interface UnitPolygon {
  unitName: string;
  tagType: TagType;
  region: 'blackHills' | 'prairie' | 'csp';
  path: string;          // SVG path 'd' string
  labelX: number;        // centroid X for label placement
  labelY: number;        // centroid Y for label placement
}

/**
 * Odds tier for color-coding on the map.
 */
export type OddsTier = 'guaranteed' | 'good' | 'fair' | 'low' | 'none';

/**
 * Odds data for a unit on the map.
 */
export interface UnitOdds {
  unitName: string;
  oddsPercent: number;
  tier: OddsTier;
  tagsAvailable: number;
  applicants: number;
  lowestPointDrawn: number | null;
  hasData: boolean;
}

/**
 * Calculate odds tier based on percentage.
 */
export function getOddsTier(oddsPercent: number): OddsTier {
  if (oddsPercent === 100) return 'guaranteed';
  if (oddsPercent >= 5) return 'good';
  if (oddsPercent >= 2) return 'fair';
  if (oddsPercent > 0) return 'low';
  return 'none';
}

/**
 * Get color for an odds tier.
 */
export function getTierColor(tier: OddsTier): string {
  switch (tier) {
    case 'guaranteed':
      return '#7dbf94'; // meadow
    case 'good':
      return '#e8a542'; // gold
    case 'fair':
      return '#c97d28'; // amber-dark
    case 'low':
      return '#c0392b'; // danger
    case 'none':
      return '#7a5230'; // bark
  }
}
