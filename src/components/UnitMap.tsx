/**
 * Unit Map — SVG visualization of elk units with odds
 *
 * Displays all elk units as color-coded polygons. Colors represent odds tiers:
 * - Green (guaranteed): 100% odds
 * - Gold (good): ≥5% odds
 * - Amber (fair): 2-5% odds
 * - Red (low): <2% odds
 * - Gray (none): 0% or no data
 *
 * Memoized for performance.
 */

import { memo, useMemo, useState } from 'react';
import { getQualifyingPool, calcOdds } from '@modules/odds-calculator';
import { getUnitsByTagType, MAP_VIEWBOX } from '@data/elk-unit-boundaries';
import { getTierColor, getOddsTier, type UnitOdds } from '@models/map';
import type { DrawRecord } from '@models/draw';

interface UnitMapProps {
  records: DrawRecord[];
  userPoints: number;
  userTagType: 'any_elk' | 'antlerless';
  year: number;
}

interface UnitTooltip {
  unitName: string;
  x: number;
  y: number;
}

function UnitMapComponent({ records, userPoints, userTagType, year }: UnitMapProps) {
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<UnitTooltip | null>(null);

  // Calculate odds for all units
  const unitsOdds = useMemo(() => {
    const userPool = getQualifyingPool(userPoints);
    const oddsMap = new Map<string, UnitOdds>();

    // Group records by unit + tag type for the specified year
    records.forEach(record => {
      if (record.year !== year || record.tagType !== userTagType) return;

      const poolData = record.pools.find(p => p.pool === userPool);
      if (!poolData) return;

      const odds = calcOdds(userPoints, userPool, poolData.applicants, poolData.tagsAvailable);
      const tier = getOddsTier(odds);

      oddsMap.set(record.unitName, {
        unitName: record.unitName,
        oddsPercent: odds,
        tier,
        tagsAvailable: poolData.tagsAvailable,
        applicants: poolData.applicants,
        lowestPointDrawn: poolData.lowestPointDrawn,
        hasData: true,
      });
    });

    return oddsMap;
  }, [records, userPoints, userTagType, year]);

  // Get unit polygons for selected tag type
  const unitPolygons = useMemo(() => {
    return getUnitsByTagType(userTagType);
  }, [userTagType]);

  const handleUnitMouseEnter = (unitName: string, labelX: number, labelY: number) => {
    setHoveredUnit(unitName);
    setTooltip({ unitName, x: labelX, y: labelY });
  };

  const handleUnitMouseLeave = () => {
    setHoveredUnit(null);
    setTooltip(null);
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 overflow-hidden">
      {/* Map Container */}
      <div className="flex justify-center mb-4">
        <svg
          viewBox={MAP_VIEWBOX}
          className="w-full max-w-2xl h-auto border border-border rounded-lg bg-surface-2"
          style={{ aspectRatio: '1000/800' }}
          role="img"
          aria-label={`Elk units map for ${userTagType === 'any_elk' ? 'Any Elk' : 'Antlerless'} - ${year}`}
        >
          {/* Map background */}
          <defs>
            <pattern id="topography" patternUnits="userSpaceOnUse" width="40" height="40">
              <path
                d="M0 20 Q10 15 20 20 T40 20"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                opacity="0.1"
              />
            </pattern>
          </defs>

          <rect width="1000" height="800" fill="var(--color-surface-2)" />
          <rect width="1000" height="800" fill="url(#topography)" />

          {/* Unit polygons */}
          {unitPolygons.map(polygon => {
            const odds = unitsOdds.get(polygon.unitName);
            const color = odds ? getTierColor(odds.tier) : '#7a5230'; // bark (no data)
            const isHovered = hoveredUnit === polygon.unitName;

            return (
              <g key={polygon.unitName}>
                {/* Unit polygon */}
                <path
                  d={polygon.path}
                  fill={color}
                  stroke="var(--color-border)"
                  strokeWidth={isHovered ? '2' : '1'}
                  opacity={isHovered ? 0.9 : 0.7}
                  className="transition-all cursor-pointer hover:opacity-90"
                  onMouseEnter={() =>
                    handleUnitMouseEnter(polygon.unitName, polygon.labelX, polygon.labelY)
                  }
                  onMouseLeave={handleUnitMouseLeave}
                  role="button"
                  tabIndex={0}
                />

                {/* Unit label */}
                <text
                  x={polygon.labelX}
                  y={polygon.labelY}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="font-heading text-white pointer-events-none"
                  style={{
                    fontSize: isHovered ? '16px' : '14px',
                    fontWeight: isHovered ? 600 : 400,
                    transition: 'font-size 150ms ease',
                  }}
                >
                  {polygon.unitName}
                </text>

                {/* Odds label (if data available) */}
                {odds && odds.hasData && (
                  <text
                    x={polygon.labelX}
                    y={polygon.labelY + 18}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="font-mono text-cream pointer-events-none"
                    style={{
                      fontSize: '11px',
                      opacity: isHovered ? 1 : 0.8,
                      transition: 'opacity 150ms ease',
                    }}
                  >
                    {odds.oddsPercent.toFixed(1)}%
                  </text>
                )}
              </g>
            );
          })}

          {/* Tooltip on hover */}
          {tooltip && unitsOdds.get(tooltip.unitName) && (
            <g className="pointer-events-none">
              <rect
                x={Math.max(50, Math.min(900, tooltip.x - 80))}
                y={Math.max(20, tooltip.y - 60)}
                width="160"
                height="55"
                fill="var(--color-surface)"
                stroke="var(--color-amber)"
                strokeWidth="1"
                rx="4"
              />
              <text
                x={Math.max(50, Math.min(900, tooltip.x - 80)) + 80}
                y={Math.max(20, tooltip.y - 60) + 18}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-heading text-cream"
                style={{ fontSize: '13px', fontWeight: 600 }}
              >
                {tooltip.unitName}
              </text>
              <text
                x={Math.max(50, Math.min(900, tooltip.x - 80)) + 80}
                y={Math.max(20, tooltip.y - 60) + 35}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono text-gold"
                style={{ fontSize: '12px' }}
              >
                {unitsOdds.get(tooltip.unitName)?.oddsPercent.toFixed(1)}% odds
              </text>
            </g>
          )}

          {/* Attribution */}
          <text
            x="10"
            y="780"
            className="font-mono text-parchment"
            style={{ fontSize: '9px', opacity: 0.6 }}
          >
            Black Hills Elk Units • {year}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="bg-surface-2 rounded p-3 text-xs text-parchment space-y-1">
        <div className="font-heading uppercase tracking-wider mb-2">Odds Legend</div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#7dbf94' }} />
            <span>Guaranteed (100%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#e8a542' }} />
            <span>Good (≥5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#c97d28' }} />
            <span>Fair (2-5%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#c0392b' }} />
            <span>Low (&lt;2%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: '#7a5230' }} />
            <span>No Data</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Memoized UnitMap to prevent unnecessary re-renders.
 */
export const UnitMap = memo(UnitMapComponent);
