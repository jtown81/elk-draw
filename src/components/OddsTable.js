import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * Odds Table — Mobile Cards + Desktop Table
 *
 * Displays calculated odds for all units with dark theme styling.
 * Mobile: card-per-unit layout with collapsible history
 * Desktop: traditional table with color-coded odds and historical columns
 *
 * Memoized to prevent unnecessary recalculations.
 */
import { useMemo, memo, useState } from 'react';
import { getQualifyingPool, calcOdds, couldUserDraw } from '@modules/odds-calculator';
function OddsTableComponent({ records, userPoints, userTagType }) {
    const [expandedCard, setExpandedCard] = useState(null);
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
        return (_jsx("div", { className: "bg-surface border border-border rounded-lg", role: "region", "aria-label": "No results", children: _jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-state-icon", children: "\uD83D\uDCCA" }), _jsx("h3", { className: "empty-state-title", children: "No Matching Data" }), _jsxs("p", { className: "empty-state-description", children: ["No units found for ", userTagType === 'any_elk' ? 'Any Elk' : 'Antlerless', " tag type."] })] }) }));
    }
    const getOddsColor = (odds) => {
        if (odds >= 5)
            return { border: 'border-l-gold', text: 'text-gold', bg: 'bg-gold/10' };
        if (odds >= 2)
            return { border: 'border-l-amber-dark', text: 'text-amber-dark', bg: 'bg-amber-dark/10' };
        return { border: 'border-l-danger', text: 'text-danger', bg: 'bg-danger/10' };
    };
    const topThree = oddsResults.slice(0, 3).map(r => r.unitName);
    // Get all unique years from records for historical columns
    const allYears = [...new Set(records.map(r => r.year))].sort((a, b) => b - a);
    // Mobile Card View
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "md:hidden space-y-3", children: oddsResults.map((result) => {
                    const colors = getOddsColor(result.oddsPercent);
                    const isTopThree = topThree.includes(result.unitName);
                    const isExpanded = expandedCard === result.unitName;
                    return (_jsxs("div", { className: `${colors.border} border-l-4 bg-surface border border-border rounded-r-lg overflow-hidden transition-colors`, children: [_jsxs("div", { className: "p-4 cursor-pointer hover:bg-surface-2 transition-colors", onClick: () => setExpandedCard(isExpanded ? null : result.unitName), children: [_jsxs("div", { className: "flex items-start justify-between gap-3", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-2xl font-heading text-cream", children: result.unitName }), isTopThree && (_jsx("span", { className: "text-xs font-heading bg-gold/20 text-gold px-2 py-1 rounded", children: "TOP PICK" }))] }), _jsxs("div", { className: "text-xs text-parchment mt-1", children: [result.year, " \u2022 ", result.tagsAvailable, " tags available"] })] }), _jsxs("div", { className: `text-3xl font-display ${colors.text}`, children: [result.oddsPercent.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex gap-3 mt-3 text-xs text-parchment", children: [_jsxs("span", { children: [result.applicants.toLocaleString(), " applicants"] }), result.lowestPointDrawn && (_jsxs("span", { className: result.lowestPointDrawn > userPoints ? 'text-danger' : 'text-meadow', children: ["Lowest: ", result.lowestPointDrawn] }))] })] }), isExpanded && result.historicalOdds.length > 0 && (_jsxs("div", { className: "px-4 pb-4 border-t border-border bg-surface-2/50", children: [_jsx("div", { className: "text-xs font-heading text-parchment uppercase tracking-wider mb-3 mt-3", children: "History" }), _jsx("div", { className: "space-y-2", children: result.historicalOdds.map(hist => (_jsxs("div", { className: "flex justify-between text-xs text-parchment", children: [_jsx("span", { children: hist.year }), _jsxs("span", { children: [hist.oddsPercent.toFixed(1), "%"] }), _jsxs("span", { className: "text-bark", children: ["(", hist.applicants, ")"] })] }, hist.year))) })] }))] }, `${result.unitName}-${result.tagType}`));
                }) }), _jsx("div", { className: "hidden md:block overflow-x-auto", children: _jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { className: "bg-surface-2 border-b border-border sticky top-0", children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-3 text-left font-heading text-xs uppercase text-parchment", children: "Unit" }), _jsx("th", { className: "px-4 py-3 text-center font-heading text-xs uppercase text-parchment", children: "Your Odds" }), _jsx("th", { className: "px-4 py-3 text-center font-heading text-xs uppercase text-parchment", children: "Tags" }), _jsx("th", { className: "px-4 py-3 text-center font-heading text-xs uppercase text-parchment", children: "Applicants" }), _jsx("th", { className: "px-4 py-3 text-center font-heading text-xs uppercase text-parchment", children: "Lowest Pt" }), allYears.slice(0, 3).map(year => (_jsx("th", { className: "px-3 py-3 text-center font-heading text-xs uppercase text-parchment bg-surface", children: year }, year)))] }) }), _jsx("tbody", { className: "divide-y divide-border", children: oddsResults.map((result, index) => {
                                const colors = getOddsColor(result.oddsPercent);
                                const isTopThree = topThree.includes(result.unitName);
                                const bgClass = index % 2 === 0 ? 'bg-surface' : 'bg-surface-2';
                                return (_jsxs("tr", { className: `${bgClass} hover:bg-amber-dark/5 transition-colors ${isTopThree ? 'border-l-2 border-l-gold' : ''}`, children: [_jsxs("td", { className: "px-4 py-3 font-heading text-cream flex items-center gap-2", children: [result.unitName, isTopThree && _jsx("span", { className: "text-xs bg-gold/20 text-gold px-2 py-1 rounded font-heading", children: "TOP" })] }), _jsxs("td", { className: `px-4 py-3 text-center font-display text-lg ${colors.text}`, children: ["~", result.oddsPercent.toFixed(2), "%"] }), _jsx("td", { className: "px-4 py-3 text-center font-mono text-cream", children: result.tagsAvailable }), _jsx("td", { className: "px-4 py-3 text-center font-mono text-cream", children: result.applicants.toLocaleString() }), _jsx("td", { className: "px-4 py-3 text-center font-mono", children: result.lowestPointDrawn ? (_jsx("span", { className: result.lowestPointDrawn > userPoints
                                                    ? 'text-danger font-semibold'
                                                    : 'text-meadow', children: result.lowestPointDrawn })) : (_jsx("span", { className: "text-bark", children: "\u2014" })) }), allYears.slice(0, 3).map(year => {
                                            const historical = result.historicalOdds.find(h => h.year === year);
                                            return (_jsx("td", { className: "px-3 py-3 text-center text-xs bg-surface", children: historical ? (_jsxs(_Fragment, { children: [_jsxs("div", { className: "font-mono text-cream", children: ["~", historical.oddsPercent.toFixed(2), "%"] }), _jsx("div", { className: "text-parchment text-xs", children: historical.applicants })] })) : (_jsx("span", { className: "text-bark", children: "\u2014" })) }, year));
                                        })] }, `${result.unitName}-${result.tagType}`));
                            }) })] }) }), _jsxs("div", { className: "bg-surface-2 px-4 py-3 border-t border-border text-xs text-parchment space-y-2 md:space-y-0 md:flex md:flex-wrap md:gap-6", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-3 h-3 rounded bg-gold" }), _jsx("span", { children: "\u22655% \u2014 Good odds" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-3 h-3 rounded bg-amber-dark" }), _jsx("span", { children: "2\u20135% \u2014 Fair odds" })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "w-3 h-3 rounded bg-danger" }), _jsx("span", { children: "<2% \u2014 Low odds" })] })] })] }));
}
/**
 * Memoized OddsTable to prevent unnecessary re-renders.
 */
export const OddsTable = memo(OddsTableComponent);
