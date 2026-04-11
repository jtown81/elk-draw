import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Draw Data Table — Read-Only Grouped Display
 *
 * Mobile: card-per-record layout
 * Desktop: grouped table with unit/year rowspan
 */
import { useState, useMemo } from 'react';
const POOL_LABELS = {
    '15plus': '15+ Points',
    '10plus': '10+ Points',
    '2plus': '2+ Points',
    '0plus': '0+ Points',
};
const POOL_COLORS = {
    '15plus': 'border-l-sage',
    '10plus': 'border-l-sage',
    '2plus': 'border-l-meadow',
    '0plus': 'border-l-gold',
};
export function DrawDataTable({ records }) {
    const [tagTypeFilter, setTagTypeFilter] = useState('any');
    const [sortBy, setSortBy] = useState('unit');
    const filteredRecords = useMemo(() => {
        let result = [...records];
        if (tagTypeFilter !== 'any') {
            result = result.filter(r => r.tagType === tagTypeFilter);
        }
        if (sortBy === 'unit') {
            result.sort((a, b) => a.unitName.localeCompare(b.unitName) || a.year - b.year);
        }
        else {
            result.sort((a, b) => b.year - a.year || a.unitName.localeCompare(b.unitName));
        }
        return result;
    }, [records, tagTypeFilter, sortBy]);
    const getPoolColor = (odds) => {
        if (odds >= 5)
            return 'text-gold';
        if (odds >= 2)
            return 'text-amber-dark';
        return 'text-danger';
    };
    // Mobile Card View
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between", children: [_jsxs("div", { className: "flex gap-2", children: [_jsx("button", { onClick: () => setTagTypeFilter('any'), className: `px-4 py-2 text-sm font-heading uppercase rounded transition-colors ${tagTypeFilter === 'any'
                                    ? 'bg-amber-dark text-forest'
                                    : 'bg-surface-2 text-cream hover:bg-surface'}`, children: "Any Elk" }), _jsx("button", { onClick: () => setTagTypeFilter('antlerless'), className: `px-4 py-2 text-sm font-heading uppercase rounded transition-colors ${tagTypeFilter === 'antlerless'
                                    ? 'bg-amber-dark text-forest'
                                    : 'bg-surface-2 text-cream hover:bg-surface'}`, children: "Antlerless" })] }), _jsx("div", { className: "flex gap-2", children: _jsxs("select", { value: sortBy, onChange: e => setSortBy(e.target.value), className: "px-3 py-2 text-sm font-body bg-surface-2 border border-border text-cream rounded hover:border-amber-dark transition-colors", children: [_jsx("option", { value: "unit", children: "Sort by Unit" }), _jsx("option", { value: "year", children: "Sort by Year" })] }) })] }), _jsx("div", { className: "md:hidden space-y-4", children: filteredRecords.length === 0 ? (_jsx("div", { className: "bg-surface border border-border rounded-lg", role: "region", "aria-label": "No records", children: _jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-state-icon", children: "\uD83D\uDCCB" }), _jsx("h3", { className: "empty-state-title", children: "No Records Found" }), _jsx("p", { className: "empty-state-description", children: "No records match your filters" })] }) })) : (filteredRecords.map(record => (_jsxs("div", { className: "bg-surface border border-border rounded-lg p-4 space-y-3", children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-2xl font-heading text-cream", children: record.unitName }), _jsx("div", { className: "text-sm text-parchment", children: record.year })] }), _jsx("div", { className: "text-xs font-heading px-2 py-1 rounded bg-surface-2 text-parchment", children: record.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless' })] }), _jsx("div", { className: "space-y-2", children: record.pools.map(pool => {
                                const odds = (1728 / pool.applicants) * 100;
                                return (_jsxs("div", { className: `border-l-4 ${POOL_COLORS[pool.pool]} bg-surface-2 rounded-r p-3 space-y-1`, children: [_jsxs("div", { className: "flex justify-between items-start gap-2", children: [_jsx("span", { className: "text-xs font-heading text-parchment uppercase", children: POOL_LABELS[pool.pool] }), _jsxs("span", { className: `text-lg font-display ${getPoolColor(odds)}`, children: [odds.toFixed(1), "%"] })] }), _jsxs("div", { className: "flex justify-between text-xs text-parchment", children: [_jsxs("span", { children: [pool.tagsAvailable, " tags"] }), _jsxs("span", { children: [pool.applicants, " applicants"] })] }), pool.lowestPointDrawn !== null && (_jsxs("div", { className: "text-xs text-sage", children: ["Lowest drawn: ", pool.lowestPointDrawn] }))] }, pool.pool));
                            }) })] }, record.id)))) }), _jsx("div", { className: "hidden md:block overflow-x-auto", children: filteredRecords.length === 0 ? (_jsx("div", { className: "bg-surface border border-border rounded-lg", role: "region", "aria-label": "No records", children: _jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-state-icon", children: "\uD83D\uDCCB" }), _jsx("h3", { className: "empty-state-title", children: "No Records Found" }), _jsx("p", { className: "empty-state-description", children: "No records match your filters" })] }) })) : (_jsxs("table", { className: "w-full text-sm", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-surface-2 border-b border-border", children: [_jsx("th", { className: "px-4 py-3 text-left font-heading text-xs uppercase text-parchment", children: "Unit" }), _jsx("th", { className: "px-4 py-3 text-left font-heading text-xs uppercase text-parchment", children: "Year" }), _jsx("th", { className: "px-4 py-3 text-left font-heading text-xs uppercase text-parchment", children: "Tag Type" }), _jsx("th", { className: "px-4 py-3 text-left font-heading text-xs uppercase text-parchment", children: "Pool" }), _jsx("th", { className: "px-4 py-3 text-center font-heading text-xs uppercase text-parchment", children: "Tags" }), _jsx("th", { className: "px-4 py-3 text-center font-heading text-xs uppercase text-parchment", children: "Applicants" }), _jsx("th", { className: "px-4 py-3 text-center font-heading text-xs uppercase text-parchment", children: "Lowest Pt" })] }) }), _jsx("tbody", { children: filteredRecords.flatMap((record, recordIdx) => record.pools.map((pool, poolIdx) => {
                                const isFirstPool = poolIdx === 0;
                                const bgClass = recordIdx % 2 === 0 ? 'bg-surface' : 'bg-surface-2';
                                return (_jsxs("tr", { className: `border-b border-border ${bgClass}`, children: [isFirstPool && (_jsx("td", { rowSpan: record.pools.length, className: "px-4 py-3 font-heading text-cream", children: record.unitName })), isFirstPool && (_jsx("td", { rowSpan: record.pools.length, className: "px-4 py-3 font-mono text-parchment", children: record.year })), isFirstPool && (_jsx("td", { rowSpan: record.pools.length, className: "px-4 py-3 text-parchment text-xs", children: record.tagType === 'any_elk' ? 'Any' : 'Antlerless' })), _jsx("td", { className: "px-4 py-3 text-xs text-parchment font-heading uppercase", children: POOL_LABELS[pool.pool] }), _jsx("td", { className: "px-4 py-3 text-center font-mono text-cream", children: pool.tagsAvailable }), _jsx("td", { className: "px-4 py-3 text-center font-mono text-cream", children: pool.applicants }), _jsx("td", { className: "px-4 py-3 text-center text-sage", children: pool.lowestPointDrawn ?? '—' })] }, `${record.id}-${pool.pool}`));
                            })) })] })) })] }));
}
