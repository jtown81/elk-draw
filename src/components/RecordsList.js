import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Records List & Management
 *
 * Displays existing records with edit/delete functionality.
 * Grouped by unit for easy scanning.
 * Memoized to prevent unnecessary re-renders when parent updates.
 */
import { memo } from 'react';
function RecordsListComponent({ records, onEdit, onDelete }) {
    if (records.length === 0) {
        return (_jsx("div", { className: "text-center py-12", children: _jsx("p", { className: "text-gray-500", children: "No records yet" }) }));
    }
    // Group records by unit
    const grouped = new Map();
    records.forEach(record => {
        const unit = record.unitName.toUpperCase();
        if (!grouped.has(unit)) {
            grouped.set(unit, []);
        }
        grouped.get(unit).push(record);
    });
    // Sort units alphabetically
    const sortedUnits = Array.from(grouped.keys()).sort();
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("h3", { className: "font-semibold text-gray-900", children: ["Records (", records.length, ")"] }), sortedUnits.map(unit => {
                const unitRecords = grouped.get(unit);
                // Sort by year descending
                const sorted = [...unitRecords].sort((a, b) => b.year - a.year);
                return (_jsxs("div", { className: "border rounded-lg overflow-hidden", children: [_jsx("div", { className: "bg-gray-100 px-4 py-2 border-b", children: _jsx("h4", { className: "font-semibold text-gray-900", children: unit }) }), _jsx("div", { className: "divide-y", children: sorted.map(record => (_jsxs("div", { className: "p-4 hover:bg-gray-50 flex items-center justify-between group", children: [_jsxs("div", { className: "flex-1 min-w-0", children: [_jsxs("div", { className: "flex items-center gap-2 flex-wrap", children: [_jsx("span", { className: "text-sm font-medium text-gray-900", children: record.year }), _jsx("span", { className: `text-xs px-2 py-1 rounded ${record.tagType === 'any_elk'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : 'bg-green-100 text-green-700'}`, children: record.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless' }), _jsxs("span", { className: "text-xs text-gray-500", children: [record.pools.length, " ", record.pools.length === 1 ? 'pool' : 'pools'] })] }), _jsx("div", { className: "text-xs text-gray-600 mt-1 space-y-0.5", children: record.pools.map((pool, idx) => (_jsxs("div", { children: [_jsx("span", { className: "font-medium", children: pool.pool === '15plus'
                                                                ? '15+'
                                                                : pool.pool === '10plus'
                                                                    ? '10+'
                                                                    : '0+' }), ": ", pool.tagsAvailable, " tags, ", pool.applicants.toLocaleString(), " applicants", pool.lowestPointDrawn ? `, lowest: ${pool.lowestPointDrawn}` : ''] }, idx))) }), record.notes && (_jsxs("p", { className: "text-xs text-gray-500 mt-2 italic", children: ["\"", record.notes, "\""] })), _jsxs("p", { className: "text-xs text-gray-400 mt-1", children: ["Added ", new Date(record.addedDate).toLocaleDateString()] })] }), _jsxs("div", { className: "ml-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: () => onEdit(record), className: "px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium rounded transition-colors", title: "Edit record", children: "Edit" }), _jsx("button", { onClick: () => {
                                                    if (confirm(`Delete ${record.unitName} (${record.year}) ${record.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless'}?`)) {
                                                        onDelete(record.id);
                                                    }
                                                }, className: "px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium rounded transition-colors", title: "Delete record", children: "Delete" })] })] }, record.id))) })] }, unit));
            })] }));
}
/**
 * Memoized RecordsList to prevent unnecessary re-renders.
 */
export const RecordsList = memo(RecordsListComponent);
