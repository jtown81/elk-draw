import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Pool Indicator
 *
 * Displays information about the user's qualifying pool and tag allocation.
 * Memoized to prevent unnecessary recalculations.
 */
import { memo } from 'react';
import { getQualifyingPool, calcEntries } from '@modules/odds-calculator';
import { DRAW_POOLS } from '@data/draw-pools';
function PoolIndicatorComponent({ preferencePoints }) {
    const pool = getQualifyingPool(preferencePoints);
    const poolConfig = DRAW_POOLS[pool];
    const entries = calcEntries(preferencePoints);
    const tagPercentage = (poolConfig.tagPct * 100).toFixed(0);
    return (_jsxs("div", { className: "bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200 p-4 mb-6", children: [_jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { children: [_jsx("div", { className: "text-xs font-semibold text-gray-600 uppercase tracking-wide", children: "Your Pool" }), _jsx("div", { className: "text-xl font-bold text-blue-700 mt-1", children: poolConfig.label }), _jsxs("div", { className: "text-xs text-gray-500 mt-1", children: ["Requires ", poolConfig.minPoints, "+ points"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs font-semibold text-gray-600 uppercase tracking-wide", children: "Lottery Entries" }), _jsx("div", { className: "text-xl font-bold text-indigo-700 mt-1", children: entries.toLocaleString() }), _jsxs("div", { className: "text-xs text-gray-500 mt-1", children: ["(", preferencePoints, "+1)\u00B3"] })] }), _jsxs("div", { children: [_jsx("div", { className: "text-xs font-semibold text-gray-600 uppercase tracking-wide", children: "Tag Allocation" }), _jsxs("div", { className: "text-xl font-bold text-blue-700 mt-1", children: [tagPercentage, "%"] }), _jsx("div", { className: "text-xs text-gray-500 mt-1", children: "of available tags" })] })] }), _jsx("div", { className: "mt-4 pt-4 border-t border-blue-200", children: _jsxs("p", { className: "text-xs text-gray-700", children: [_jsx("strong", { children: "Pool Details:" }), " With ", preferencePoints, " preference points, you qualify for the ", poolConfig.label, ", which receives ", tagPercentage, "% of available elk tags. Your ", entries.toLocaleString(), " lottery entries compete against other applicants in this same pool."] }) })] }));
}
/**
 * Memoized PoolIndicator to prevent unnecessary re-renders.
 */
export const PoolIndicator = memo(PoolIndicatorComponent);
