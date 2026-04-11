/**
 * Elk Unit Boundaries — SVG Polygons
 *
 * Simplified polygonal boundaries for Black Hills, Prairie, and CSP elk units.
 * Coordinates projected to SVG viewBox: 0 0 1000 800
 *
 * Source: GFP official maps (simplified for MVP)
 * Note: These are approximate boundaries suitable for visualization.
 * For production use, obtain official geometries from GFP ArcGIS services.
 */

import type { UnitPolygon } from '@models/map';

/**
 * Map viewBox dimensions (all paths are relative to this)
 */
export const MAP_VIEWBOX = '0 0 1000 800';

/**
 * Black Hills unit polygons (simplified geographic approximations)
 * Named based on their north-south (1-11) and east-west (A-J) position within the range.
 */
export const BLACK_HILLS_UNITS: UnitPolygon[] = [
  // H1 — Northeast corner
  {
    unitName: 'H1A',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 700 50 L 850 50 L 850 200 L 700 200 Z',
    labelX: 775,
    labelY: 125,
  },
  {
    unitName: 'H1B',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 700 50 L 850 50 L 850 200 L 700 200 Z',
    labelX: 775,
    labelY: 125,
  },

  // H2 — Central-north (large region, subdivided A-J)
  {
    unitName: 'H2A',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 550 100 L 700 100 L 700 250 L 550 250 Z',
    labelX: 625,
    labelY: 175,
  },
  {
    unitName: 'H2B',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 550 100 L 700 100 L 700 250 L 550 250 Z',
    labelX: 625,
    labelY: 175,
  },
  {
    unitName: 'H2C',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 550 100 L 700 100 L 700 250 L 550 250 Z',
    labelX: 625,
    labelY: 175,
  },
  {
    unitName: 'H2D',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 400 100 L 550 100 L 550 250 L 400 250 Z',
    labelX: 475,
    labelY: 175,
  },
  {
    unitName: 'H2E',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 400 100 L 550 100 L 550 250 L 400 250 Z',
    labelX: 475,
    labelY: 175,
  },
  {
    unitName: 'H2F',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 250 100 L 400 100 L 400 250 L 250 250 Z',
    labelX: 325,
    labelY: 175,
  },
  {
    unitName: 'H2G',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 250 100 L 400 100 L 400 250 L 250 250 Z',
    labelX: 325,
    labelY: 175,
  },
  {
    unitName: 'H2H',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 100 100 L 250 100 L 250 250 L 100 250 Z',
    labelX: 175,
    labelY: 175,
  },
  {
    unitName: 'H2I',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 100 100 L 250 100 L 250 250 L 100 250 Z',
    labelX: 175,
    labelY: 175,
  },
  {
    unitName: 'H2J',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 50 100 L 150 100 L 150 250 L 50 250 Z',
    labelX: 100,
    labelY: 175,
  },

  // H3 — Central (east-west subdivision)
  {
    unitName: 'H3A',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 500 250 L 700 250 L 700 400 L 500 400 Z',
    labelX: 600,
    labelY: 325,
  },
  {
    unitName: 'H3B',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 500 250 L 700 250 L 700 400 L 500 400 Z',
    labelX: 600,
    labelY: 325,
  },
  {
    unitName: 'H3C',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 300 250 L 500 250 L 500 400 L 300 400 Z',
    labelX: 400,
    labelY: 325,
  },
  {
    unitName: 'H3D',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 300 250 L 500 250 L 500 400 L 300 400 Z',
    labelX: 400,
    labelY: 325,
  },
  {
    unitName: 'H3E',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 100 250 L 300 250 L 300 400 L 100 400 Z',
    labelX: 200,
    labelY: 325,
  },
  {
    unitName: 'H3F',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 100 250 L 300 250 L 300 400 L 100 400 Z',
    labelX: 200,
    labelY: 325,
  },
  {
    unitName: 'H3G',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 50 250 L 150 250 L 150 400 L 50 400 Z',
    labelX: 100,
    labelY: 325,
  },

  // H4 — Southwest
  {
    unitName: 'H4A',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 400 400 L 600 400 L 600 550 L 400 550 Z',
    labelX: 500,
    labelY: 475,
  },
  {
    unitName: 'H4B',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 400 400 L 600 400 L 600 550 L 400 550 Z',
    labelX: 500,
    labelY: 475,
  },

  // H5 — South
  {
    unitName: 'H5A',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 300 500 L 500 500 L 500 650 L 300 650 Z',
    labelX: 400,
    labelY: 575,
  },

  // H6 — Eastern foothills
  {
    unitName: 'H6A',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 750 300 L 900 300 L 900 450 L 750 450 Z',
    labelX: 825,
    labelY: 375,
  },
  {
    unitName: 'H6B',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 750 300 L 900 300 L 900 450 L 750 450 Z',
    labelX: 825,
    labelY: 375,
  },

  // H7 — Northwest
  {
    unitName: 'H7A',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 200 50 L 350 50 L 350 200 L 200 200 Z',
    labelX: 275,
    labelY: 125,
  },
  {
    unitName: 'H7B',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 200 50 L 350 50 L 350 200 L 200 200 Z',
    labelX: 275,
    labelY: 125,
  },

  // H9 — Central-east
  {
    unitName: 'H9A',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 700 250 L 850 250 L 850 400 L 700 400 Z',
    labelX: 775,
    labelY: 325,
  },
  {
    unitName: 'H9B',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 700 250 L 850 250 L 850 400 L 700 400 Z',
    labelX: 775,
    labelY: 325,
  },

  // H11 — Various subdivisions (north-central spread)
  {
    unitName: 'H11A',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 400 50 L 550 50 L 550 200 L 400 200 Z',
    labelX: 475,
    labelY: 125,
  },
  {
    unitName: 'H11B',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 400 50 L 550 50 L 550 200 L 400 200 Z',
    labelX: 475,
    labelY: 125,
  },
  {
    unitName: 'H11C',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 550 300 L 700 300 L 700 450 L 550 450 Z',
    labelX: 625,
    labelY: 375,
  },
  {
    unitName: 'H11D',
    tagType: 'antlerless',
    region: 'blackHills',
    path: 'M 550 300 L 700 300 L 700 450 L 550 450 Z',
    labelX: 625,
    labelY: 375,
  },
  {
    unitName: 'H11E',
    tagType: 'any_elk',
    region: 'blackHills',
    path: 'M 300 350 L 450 350 L 450 500 L 300 500 Z',
    labelX: 375,
    labelY: 425,
  },
];

/**
 * Prairie unit polygons (approximate geographic regions)
 * These units are in the grasslands east/north of the Black Hills.
 */
export const PRAIRIE_UNITS: UnitPolygon[] = [
  {
    unitName: '9A',
    tagType: 'any_elk',
    region: 'prairie',
    path: 'M 100 50 L 250 50 L 250 200 L 100 200 Z',
    labelX: 175,
    labelY: 125,
  },
  {
    unitName: '11A',
    tagType: 'any_elk',
    region: 'prairie',
    path: 'M 100 200 L 250 200 L 250 350 L 100 350 Z',
    labelX: 175,
    labelY: 275,
  },
  {
    unitName: '11B',
    tagType: 'antlerless',
    region: 'prairie',
    path: 'M 100 200 L 250 200 L 250 350 L 100 350 Z',
    labelX: 175,
    labelY: 275,
  },
  {
    unitName: '15A',
    tagType: 'any_elk',
    region: 'prairie',
    path: 'M 100 350 L 250 350 L 250 500 L 100 500 Z',
    labelX: 175,
    labelY: 425,
  },
  {
    unitName: '15B',
    tagType: 'antlerless',
    region: 'prairie',
    path: 'M 100 350 L 250 350 L 250 500 L 100 500 Z',
    labelX: 175,
    labelY: 425,
  },
  {
    unitName: '27A',
    tagType: 'any_elk',
    region: 'prairie',
    path: 'M 100 500 L 250 500 L 250 650 L 100 650 Z',
    labelX: 175,
    labelY: 575,
  },
  {
    unitName: '27B',
    tagType: 'antlerless',
    region: 'prairie',
    path: 'M 100 500 L 250 500 L 250 650 L 100 650 Z',
    labelX: 175,
    labelY: 575,
  },
];

/**
 * Custer State Park unit polygon
 */
export const CSP_UNITS: UnitPolygon[] = [
  {
    unitName: 'CSP',
    tagType: 'any_elk',
    region: 'csp',
    path: 'M 450 500 L 600 500 L 600 650 L 450 650 Z',
    labelX: 525,
    labelY: 575,
  },
];

/**
 * All unit polygons combined
 */
export const ALL_UNIT_BOUNDARIES: UnitPolygon[] = [
  ...BLACK_HILLS_UNITS,
  ...PRAIRIE_UNITS,
  ...CSP_UNITS,
];

/**
 * Get boundaries for a specific unit
 */
export function getUnitBoundary(unitName: string): UnitPolygon | undefined {
  return ALL_UNIT_BOUNDARIES.find(u => u.unitName === unitName);
}

/**
 * Get boundaries for a tag type (all matching units)
 */
export function getUnitsByTagType(tagType: 'any_elk' | 'antlerless'): UnitPolygon[] {
  return ALL_UNIT_BOUNDARIES.filter(u => u.tagType === tagType);
}

/**
 * Get boundaries for a region
 */
export function getUnitsByRegion(region: 'blackHills' | 'prairie' | 'csp'): UnitPolygon[] {
  return ALL_UNIT_BOUNDARIES.filter(u => u.region === region);
}
