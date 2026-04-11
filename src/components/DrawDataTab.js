import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Draw Data Tab — Read-Only Seed Data
 *
 * Displays GFP draw statistics loaded from bundled seed data.
 * Read-only view with export functionality for power users.
 */
import { SEED_DRAW_DATA } from '@data/seed-draw-data';
import { DrawDataTable } from './DrawDataTable';
import { AdPlaceholder } from './ads/AdPlaceholder';
export function DrawDataTab({}) {
    const handleExport = () => {
        const dataStr = JSON.stringify(SEED_DRAW_DATA, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elk-draw-data-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex items-start justify-between gap-4 flex-col sm:flex-row", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-heading text-cream uppercase tracking-wide", children: "DRAW DATA" }), _jsxs("p", { className: "text-parchment mt-2", children: ["GFP statistics loaded for ", SEED_DRAW_DATA.length, " records"] })] }), _jsxs("div", { className: "flex flex-col items-end gap-2", children: [_jsx("div", { className: "text-xs text-parchment", children: "Last updated: April 2026" }), _jsx("button", { onClick: handleExport, className: "px-4 py-2 font-heading text-sm text-amber-dark hover:text-gold border border-amber-dark hover:border-gold rounded transition-colors", children: "\u2B07\uFE0F EXPORT" })] })] }), _jsx(AdPlaceholder, { size: "banner" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-surface border border-border rounded-lg p-4", children: [_jsx("div", { className: "text-parchment text-xs font-heading uppercase tracking-wide", children: "Total Records" }), _jsx("div", { className: "text-2xl font-display text-gold mt-2", children: SEED_DRAW_DATA.length })] }), _jsxs("div", { className: "bg-surface border border-border rounded-lg p-4", children: [_jsx("div", { className: "text-parchment text-xs font-heading uppercase tracking-wide", children: "Unique Units" }), _jsx("div", { className: "text-2xl font-display text-gold mt-2", children: new Set(SEED_DRAW_DATA.map(r => r.unitName)).size })] }), _jsxs("div", { className: "bg-surface border border-border rounded-lg p-4", children: [_jsx("div", { className: "text-parchment text-xs font-heading uppercase tracking-wide", children: "Year Range" }), _jsx("div", { className: "text-2xl font-display text-gold mt-2", children: SEED_DRAW_DATA.length > 0
                                    ? `${Math.min(...SEED_DRAW_DATA.map(r => r.year))}–${Math.max(...SEED_DRAW_DATA.map(r => r.year))}`
                                    : '—' })] })] }), _jsx(AdPlaceholder, { size: "rectangle" }), _jsx(DrawDataTable, { records: SEED_DRAW_DATA })] }));
}
