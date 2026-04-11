import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import { getTierColor, getOddsTier } from '@models/map';
function UnitMapComponent({ records, userPoints, userTagType, year }) {
    const [hoveredUnit, setHoveredUnit] = useState(null);
    const [tooltip, setTooltip] = useState(null);
    // Calculate odds for all units
    const unitsOdds = useMemo(() => {
        const userPool = getQualifyingPool(userPoints);
        const oddsMap = new Map();
        // Group records by unit + tag type for the specified year
        records.forEach(record => {
            if (record.year !== year || record.tagType !== userTagType)
                return;
            const poolData = record.pools.find(p => p.pool === userPool);
            if (!poolData)
                return;
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
    const handleUnitMouseEnter = (unitName, labelX, labelY) => {
        setHoveredUnit(unitName);
        setTooltip({ unitName, x: labelX, y: labelY });
    };
    const handleUnitMouseLeave = () => {
        setHoveredUnit(null);
        setTooltip(null);
    };
    return (_jsxs("div", { className: "bg-surface border border-border rounded-lg p-4 overflow-hidden", children: [_jsx("div", { className: "flex justify-center mb-4", children: _jsxs("svg", { viewBox: MAP_VIEWBOX, className: "w-full max-w-2xl h-auto border border-border rounded-lg bg-surface-2", style: { aspectRatio: '1000/800' }, role: "img", "aria-label": `Elk units map for ${userTagType === 'any_elk' ? 'Any Elk' : 'Antlerless'} - ${year}`, children: [_jsx("defs", { children: _jsx("pattern", { id: "topography", patternUnits: "userSpaceOnUse", width: "40", height: "40", children: _jsx("path", { d: "M0 20 Q10 15 20 20 T40 20", stroke: "currentColor", strokeWidth: "0.5", fill: "none", opacity: "0.1" }) }) }), _jsx("rect", { width: "1000", height: "800", fill: "var(--color-surface-2)" }), _jsx("rect", { width: "1000", height: "800", fill: "url(#topography)" }), unitPolygons.map(polygon => {
                            const odds = unitsOdds.get(polygon.unitName);
                            const color = odds ? getTierColor(odds.tier) : '#7a5230'; // bark (no data)
                            const isHovered = hoveredUnit === polygon.unitName;
                            return (_jsxs("g", { children: [_jsx("path", { d: polygon.path, fill: color, stroke: "var(--color-border)", strokeWidth: isHovered ? '2' : '1', opacity: isHovered ? 0.9 : 0.7, className: "transition-all cursor-pointer hover:opacity-90", onMouseEnter: () => handleUnitMouseEnter(polygon.unitName, polygon.labelX, polygon.labelY), onMouseLeave: handleUnitMouseLeave, role: "button", tabIndex: 0 }), _jsx("text", { x: polygon.labelX, y: polygon.labelY, textAnchor: "middle", dominantBaseline: "middle", className: "font-heading text-white pointer-events-none", style: {
                                            fontSize: isHovered ? '16px' : '14px',
                                            fontWeight: isHovered ? 600 : 400,
                                            transition: 'font-size 150ms ease',
                                        }, children: polygon.unitName }), odds && odds.hasData && (_jsxs("text", { x: polygon.labelX, y: polygon.labelY + 18, textAnchor: "middle", dominantBaseline: "middle", className: "font-mono text-cream pointer-events-none", style: {
                                            fontSize: '11px',
                                            opacity: isHovered ? 1 : 0.8,
                                            transition: 'opacity 150ms ease',
                                        }, children: [odds.oddsPercent.toFixed(1), "%"] }))] }, polygon.unitName));
                        }), tooltip && unitsOdds.get(tooltip.unitName) && (_jsxs("g", { className: "pointer-events-none", children: [_jsx("rect", { x: Math.max(50, Math.min(900, tooltip.x - 80)), y: Math.max(20, tooltip.y - 60), width: "160", height: "55", fill: "var(--color-surface)", stroke: "var(--color-amber)", strokeWidth: "1", rx: "4" }), _jsx("text", { x: Math.max(50, Math.min(900, tooltip.x - 80)) + 80, y: Math.max(20, tooltip.y - 60) + 18, textAnchor: "middle", dominantBaseline: "middle", className: "font-heading text-cream", style: { fontSize: '13px', fontWeight: 600 }, children: tooltip.unitName }), _jsxs("text", { x: Math.max(50, Math.min(900, tooltip.x - 80)) + 80, y: Math.max(20, tooltip.y - 60) + 35, textAnchor: "middle", dominantBaseline: "middle", className: "font-mono text-gold", style: { fontSize: '12px' }, children: [unitsOdds.get(tooltip.unitName)?.oddsPercent.toFixed(1), "% odds"] })] })), _jsxs("text", { x: "10", y: "780", className: "font-mono text-parchment", style: { fontSize: '9px', opacity: 0.6 }, children: ["Black Hills Elk Units \u2022 ", year] })] }) }), _jsxs("div", { className: "bg-surface-2 rounded p-3 text-xs text-parchment space-y-1", children: [_jsx("div", { className: "font-heading uppercase tracking-wider mb-2", children: "Odds Legend" }), _jsxs("div", { className: "grid grid-cols-2 gap-2", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded", style: { backgroundColor: '#7dbf94' } }), _jsx("span", { children: "Guaranteed (100%)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded", style: { backgroundColor: '#e8a542' } }), _jsx("span", { children: "Good (\u22655%)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded", style: { backgroundColor: '#c97d28' } }), _jsx("span", { children: "Fair (2-5%)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded", style: { backgroundColor: '#c0392b' } }), _jsx("span", { children: "Low (<2%)" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-3 h-3 rounded", style: { backgroundColor: '#7a5230' } }), _jsx("span", { children: "No Data" })] })] })] })] }));
}
/**
 * Memoized UnitMap to prevent unnecessary re-renders.
 */
export const UnitMap = memo(UnitMapComponent);
