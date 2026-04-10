import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Odds Table
 *
 * Displays calculated odds for all units, sorted by best odds.
 * Shows historical trends across years and pool information.
 *
 * Memoized to prevent unnecessary recalculations when parent re-renders
 * with same data (props are stable).
 */
import { useMemo, memo } from 'react';
import { getQualifyingPool, calcOdds, couldUserDraw } from '@modules/odds-calculator';
function OddsTableComponent({ records, userPoints, userTagType }) {
    // Calculate odds for all records
    const oddsResults = useMemo(() => {
        const userPool = getQualifyingPool(userPoints);
        const results = [];
        // Group records by unit + tag type
        const grouped = new Map();
        records.forEach(record => {
            if (record.tagType !== userTagType)
                return; // Filter by tag type
            const unitKey = `${record.unitName}-${record.tagType}`;
            if (!grouped.has(unitKey)) {
                grouped.set(unitKey, []);
            }
            grouped.get(unitKey).push(record);
        });
        // Calculate odds for each unit
        grouped.forEach((unitRecords) => {
            const latest = unitRecords.sort((a, b) => b.year - a.year)[0];
            // Find pool data matching user's qualifying pool
            const poolData = latest.pools.find(p => p.pool === userPool);
            if (!poolData)
                return; // No matching pool
            // Check if user could have drawn based on lowest point
            if (!couldUserDraw(userPoints, poolData.lowestPointDrawn)) {
                return; // User didn't qualify in this draw
            }
            const odds = calcOdds(userPoints, userPool, poolData.applicants);
            // Collect historical odds
            const historicalOdds = unitRecords
                .map(record => {
                const hp = record.pools.find(p => p.pool === userPool);
                if (!hp)
                    return null;
                if (!couldUserDraw(userPoints, hp.lowestPointDrawn))
                    return null;
                return {
                    year: record.year,
                    oddsPercent: calcOdds(userPoints, userPool, hp.applicants),
                    applicants: hp.applicants,
                    tagsAvailable: hp.tagsAvailable,
                    lowestPointDrawn: hp.lowestPointDrawn,
                };
            })
                .filter(Boolean);
            results.push({
                unitName: latest.unitName,
                year: latest.year,
                tagType: latest.tagType,
                qualifyingPool: userPool,
                userEntries: (userPoints + 1) ** 3,
                tagsAvailable: poolData.tagsAvailable,
                applicants: poolData.applicants,
                lowestPointDrawn: poolData.lowestPointDrawn,
                oddsPercent: odds,
                historicalOdds: historicalOdds,
            });
        });
        // Sort by odds descending (best odds first)
        return results.sort((a, b) => b.oddsPercent - a.oddsPercent);
    }, [records, userPoints, userTagType]);
    if (oddsResults.length === 0) {
        return (_jsxs("div", { className: "bg-white rounded-lg shadow p-8 text-center", children: [_jsx("div", { className: "text-gray-400 text-3xl mb-3", children: "\uD83D\uDCCA" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No Matching Data" }), _jsxs("p", { className: "text-gray-600", children: ["No units found for ", userTagType === 'any_elk' ? 'Any Elk' : 'Antlerless', " tag type. Add data in the \"Enter Data\" tab to calculate odds."] })] }));
    }
    // Get all unique years from records for historical columns
    const allYears = [...new Set(records.map(r => r.year))].sort((a, b) => b - a);
    return (_jsxs("div", { className: "bg-white rounded-lg shadow overflow-hidden", children: [_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-gray-100 border-b-2 border-gray-300", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left font-semibold text-gray-900", children: "Unit" }), _jsx("th", { className: "px-4 py-3 text-center font-semibold text-gray-900", children: "Your Odds %" }), _jsx("th", { className: "px-4 py-3 text-center font-semibold text-gray-900", children: "Tags" }), _jsx("th", { className: "px-4 py-3 text-center font-semibold text-gray-900", children: "Applicants" }), _jsx("th", { className: "px-4 py-3 text-center font-semibold text-gray-900", children: "Lowest Pt" }), allYears.slice(0, 3).map(year => (_jsx("th", { className: "px-3 py-3 text-center font-semibold text-gray-700 bg-gray-50", children: year }, year)))] }) }), _jsx("tbody", { className: "divide-y divide-gray-200", children: oddsResults.map((result) => {
                                // Get odds color
                                const oddsColor = result.oddsPercent >= 5
                                    ? 'text-green-700 bg-green-50'
                                    : result.oddsPercent >= 2
                                        ? 'text-yellow-700 bg-yellow-50'
                                        : 'text-red-700 bg-red-50';
                                return (_jsxs("tr", { className: "hover:bg-gray-50", children: [_jsx("td", { className: "px-4 py-3 font-semibold text-gray-900", children: result.unitName }), _jsxs("td", { className: `px-4 py-3 text-center font-bold ${oddsColor} rounded`, children: ["~", result.oddsPercent.toFixed(2), "%"] }), _jsx("td", { className: "px-4 py-3 text-center text-gray-700", children: result.tagsAvailable }), _jsx("td", { className: "px-4 py-3 text-center text-gray-700", children: result.applicants.toLocaleString() }), _jsx("td", { className: "px-4 py-3 text-center text-gray-700", children: result.lowestPointDrawn ? (_jsx("span", { className: result.lowestPointDrawn > userPoints
                                                    ? 'text-red-600 font-semibold'
                                                    : 'text-green-600', children: result.lowestPointDrawn })) : (_jsx("span", { className: "text-gray-400", children: "\u2014" })) }), allYears.slice(0, 3).map(year => {
                                            const historical = result.historicalOdds.find(h => h.year === year);
                                            return (_jsx("td", { className: "px-3 py-3 text-center text-gray-600 bg-gray-50 text-xs", children: historical ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "font-medium", children: ["~", historical.oddsPercent.toFixed(2), "%"] }), _jsx("div", { className: "text-gray-500", children: historical.applicants })] })) : (_jsx("span", { className: "text-gray-300", children: "\u2014" })) }, year));
                                        })] }, `${result.unitName}-${result.tagType}`));
                            }) })] }) }), _jsx("div", { className: "bg-gray-50 px-4 py-3 border-t text-xs text-gray-600", children: _jsxs("div", { className: "flex flex-wrap gap-4", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "px-2 py-1 bg-green-50 text-green-700 rounded font-medium", children: "\u22655%" }), "Good odds"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "px-2 py-1 bg-yellow-50 text-yellow-700 rounded font-medium", children: "2\u20135%" }), "Fair odds"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "px-2 py-1 bg-red-50 text-red-700 rounded font-medium", children: "<2%" }), "Low odds"] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-red-600 font-semibold", children: "Lowest Pt" }), "Red = didn't draw (pt too low)"] })] }) })] }));
}
/**
 * Memoized OddsTable to prevent unnecessary re-renders.
 * Only recalculates when records, userPoints, or userTagType change.
 */
export const OddsTable = memo(OddsTableComponent);
