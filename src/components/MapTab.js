import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Map Tab — Interactive unit map with download functionality
 *
 * Wrapper component for UnitMap with controls:
 * - Tag type toggle (Any Elk | Antlerless)
 * - Year selector dropdown
 * - Download as PDF button (via window.print())
 */
import { useState, useMemo } from 'react';
import { UnitMap } from './UnitMap';
export function MapTab({ records, userPoints, userTagType, setUserTagType }) {
    // Get unique years from records, sorted descending
    const availableYears = useMemo(() => {
        return [...new Set(records.map(r => r.year))].sort((a, b) => b - a);
    }, [records]);
    const [selectedYear, setSelectedYear] = useState(availableYears[0] || new Date().getFullYear());
    const handleDownloadPDF = () => {
        // The @media print CSS in index.css handles PDF rendering
        window.print();
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsx("div", { className: "bg-surface border border-border rounded-lg p-4", children: _jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-lg font-heading text-cream uppercase tracking-wide", children: "Unit Map" }), _jsxs("p", { className: "text-xs text-parchment mt-1", children: ["Draw odds by unit for ", selectedYear] })] }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-3", children: [_jsxs("div", { className: "flex gap-1 bg-surface-2 rounded-lg p-1", children: [_jsx("button", { onClick: () => setUserTagType?.('any_elk'), className: `px-3 py-2 rounded transition-colors font-heading text-xs uppercase tracking-wide ${userTagType === 'any_elk'
                                                ? 'bg-amber-dark text-forest'
                                                : 'text-parchment hover:text-cream'}`, children: "Any Elk" }), _jsx("button", { onClick: () => setUserTagType?.('antlerless'), className: `px-3 py-2 rounded transition-colors font-heading text-xs uppercase tracking-wide ${userTagType === 'antlerless'
                                                ? 'bg-amber-dark text-forest'
                                                : 'text-parchment hover:text-cream'}`, children: "Antlerless" })] }), _jsx("select", { value: selectedYear, onChange: e => setSelectedYear(Number(e.target.value)), className: "px-3 py-2 bg-surface-2 border border-border rounded text-cream text-xs font-mono focus:outline-none focus:border-amber-dark transition-colors", children: availableYears.map(year => (_jsx("option", { value: year, children: year }, year))) }), _jsx("button", { onClick: handleDownloadPDF, className: "px-3 py-2 bg-amber-dark text-forest rounded font-heading text-xs uppercase tracking-wide hover:bg-gold transition-colors", title: "Download map as PDF (uses browser print)", children: "\uD83D\uDCE5 Download PDF" })] })] }) }), _jsx(UnitMap, { records: records, userPoints: userPoints, userTagType: userTagType, year: selectedYear }), _jsxs("div", { className: "bg-surface-2/50 border border-border rounded p-3 text-xs text-parchment space-y-2", children: [_jsxs("p", { children: [_jsx("strong", { children: "\uD83D\uDCA1 How to use:" }), " Hover over units to see current odds. Click the tag type toggle to switch between Any Elk and Antlerless draws."] }), _jsxs("p", { children: ["This map shows your estimated draw odds for the selected year based on", ' ', _jsxs("strong", { children: [userPoints, " preference points"] }), " in the corresponding pool."] }), _jsxs("p", { children: [_jsx("strong", { children: "Note:" }), " Odds are approximate. Official GFP draw statistics are authoritative."] })] })] }));
}
