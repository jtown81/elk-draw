import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * My Odds Tab
 *
 * Displays calculated odds for units based on user preferences.
 * Redesigned with dark theme, custom slider, and ad integration.
 */
import { useDrawData } from '@hooks/useDrawData';
import { useUserConfig } from '@hooks/useUserConfig';
import { UserInputPanel } from './UserInputPanel';
import { OddsTable } from './OddsTable';
import { AdPlaceholder } from './ads/AdPlaceholder';
export function OddsTab({ userId, accountName }) {
    const { records, isLoading: recordsLoading } = useDrawData(userId);
    const { config, isLoading: configLoading } = useUserConfig(userId);
    const isLoading = recordsLoading || configLoading;
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 border-3 border-amber-dark border-t-gold rounded-full animate-spin" }), _jsx("div", { className: "text-parchment text-sm", children: "Loading odds..." })] }) }));
    }
    return (_jsxs("div", { className: "w-full space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-3xl font-heading text-cream uppercase tracking-wide", children: "MY ODDS" }), _jsxs("p", { className: "text-parchment mt-2", children: ["Calculate your hunting odds for ", accountName] })] }), _jsx(AdPlaceholder, { size: "banner" }), _jsx(UserInputPanel, { userId: userId }), _jsx(AdPlaceholder, { size: "rectangle" }), records.length === 0 ? (_jsx("div", { className: "bg-surface border border-border rounded-lg", role: "region", "aria-label": "No data", children: _jsxs("div", { className: "empty-state", children: [_jsx("div", { className: "empty-state-icon", children: "\uD83D\uDCCA" }), _jsx("h3", { className: "empty-state-title", children: "No Data Yet" }), _jsxs("p", { className: "empty-state-description", children: ["Draw statistics are preloaded. Head to the ", _jsx("strong", { children: "DATA" }), " tab to see available records."] }), _jsx("p", { className: "text-xs text-bark", children: "Data from GFP: https://license.gooutdoorssouthdakota.com/License/DrawStatistics" })] }) })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between flex-col sm:flex-row gap-2", children: [_jsxs("h3", { className: "text-lg font-heading text-cream uppercase tracking-wide", children: ["RESULTS (", records.length, ")"] }), _jsxs("div", { className: "text-sm text-parchment", children: ["Filtering for", ' ', _jsxs("span", { className: "font-heading text-gold", children: [config.tagType === 'any_elk' ? 'ANY ELK' : 'ANTLERLESS', " TAGS"] })] })] }), _jsx(OddsTable, { records: records, userPoints: config.preferencePoints, userTagType: config.tagType }), _jsx(AdPlaceholder, { size: "leaderboard" }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-border", children: [_jsxs("div", { className: "bg-surface border border-border rounded-lg p-4", children: [_jsx("div", { className: "text-xs font-heading text-parchment uppercase tracking-wide", children: "Your Points" }), _jsx("div", { className: "text-3xl font-display text-gold mt-2", children: config.preferencePoints })] }), _jsxs("div", { className: "bg-surface border border-border rounded-lg p-4", children: [_jsx("div", { className: "text-xs font-heading text-parchment uppercase tracking-wide", children: "Tag Type" }), _jsx("div", { className: "text-lg font-heading text-gold mt-2 uppercase", children: config.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless' })] }), _jsxs("div", { className: "bg-surface border border-border rounded-lg p-4", children: [_jsx("div", { className: "text-xs font-heading text-parchment uppercase tracking-wide", children: "Units Tracked" }), _jsx("div", { className: "text-3xl font-display text-gold mt-2", children: new Set(records.map(r => r.unitName)).size })] })] })] }))] }));
}
