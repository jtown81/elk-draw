import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * My Odds Tab
 *
 * Displays calculated odds for units based on entered data.
 * Integrates UserInputPanel, PoolIndicator, and OddsTable with real-time
 * recalculation when user adjusts preference points or tag type.
 */
import { useDrawData } from '@hooks/useDrawData';
import { useUserConfig } from '@hooks/useUserConfig';
import { UserInputPanel } from './UserInputPanel';
import { PoolIndicator } from './PoolIndicator';
import { OddsTable } from './OddsTable';
export function OddsTab({ userId, accountName }) {
    const { records, isLoading: recordsLoading } = useDrawData(userId);
    const { config, isLoading: configLoading } = useUserConfig(userId);
    const isLoading = recordsLoading || configLoading;
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "text-gray-600", children: "Loading..." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "My Odds" }), _jsxs("p", { className: "text-gray-600 mt-1", children: ["Calculate your hunting odds for ", accountName] })] }), _jsx(UserInputPanel, { userId: userId }), _jsx(PoolIndicator, { preferencePoints: config.preferencePoints }), records.length === 0 ? (_jsxs("div", { className: "bg-white rounded-lg shadow p-12 text-center", children: [_jsx("div", { className: "text-5xl mb-4", children: "\uD83D\uDCCA" }), _jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-2", children: "No Data Yet" }), _jsxs("p", { className: "text-gray-600 mb-6", children: ["Enter elk unit draw statistics in the ", _jsx("strong", { children: "Enter Data" }), " tab to calculate odds."] }), _jsx("p", { className: "text-sm text-gray-500", children: "Data from GFP: https://license.gooutdoorssouthdakota.com/License/DrawStatistics" })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-lg font-semibold text-gray-900", children: ["Results (", records.length, " ", records.length === 1 ? 'record' : 'records', ")"] }), _jsxs("div", { className: "text-sm text-gray-600", children: ["Filtering for", ' ', _jsxs("span", { className: "font-semibold", children: [config.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless', " tags"] })] })] }), _jsx(OddsTable, { records: records, userPoints: config.preferencePoints, userTagType: config.tagType }), _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t", children: [_jsxs("div", { className: "bg-blue-50 rounded p-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-600 mb-1", children: "Your Points" }), _jsx("div", { className: "text-2xl font-bold text-blue-600", children: config.preferencePoints })] }), _jsxs("div", { className: "bg-blue-50 rounded p-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-600 mb-1", children: "Tag Type" }), _jsx("div", { className: "text-lg font-bold text-blue-600", children: config.tagType === 'any_elk' ? 'Any Elk' : 'Antlerless' })] }), _jsxs("div", { className: "bg-blue-50 rounded p-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-600 mb-1", children: "Units Tracked" }), _jsx("div", { className: "text-2xl font-bold text-blue-600", children: new Set(records.map(r => r.unitName)).size })] })] })] }))] }));
}
