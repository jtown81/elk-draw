import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * User Input Panel
 *
 * Allows user to input preference points (0-25) and select tag type.
 * Displays entry count and pool information.
 */
import { useUserConfig } from '@hooks/useUserConfig';
import { getQualifyingPool } from '@modules/odds-calculator';
import { calcEntries } from '@modules/odds-calculator';
export function UserInputPanel({ userId }) {
    const { config, setPreferencePoints, setTagTypePreference } = useUserConfig(userId);
    const qualifyingPool = getQualifyingPool(config.preferencePoints);
    const userEntries = calcEntries(config.preferencePoints);
    const poolLabels = {
        '15plus': '15+ Pool',
        '10plus': '10+ Pool',
        '0plus': '0+ Pool',
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-6", children: "Your Preferences" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsxs("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: ["Preference Points: ", _jsx("span", { className: "text-blue-600 font-bold", children: config.preferencePoints })] }), _jsx("input", { type: "range", min: "0", max: "25", value: config.preferencePoints, onChange: e => setPreferencePoints(parseInt(e.target.value)), className: "w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600" }), _jsxs("div", { className: "mt-3 flex items-center gap-2", children: [_jsx("input", { type: "number", min: "0", max: "25", value: config.preferencePoints, onChange: e => {
                                            const val = parseInt(e.target.value);
                                            if (val >= 0 && val <= 25) {
                                                setPreferencePoints(val);
                                            }
                                        }, className: "w-16 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" }), _jsx("span", { className: "text-sm text-gray-600", children: "/ 25 points" })] }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Drag slider or enter value directly (0\u201325)" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-3", children: "Tag Type Preference" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("button", { onClick: () => setTagTypePreference('any_elk'), className: `flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${config.tagType === 'any_elk'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: "Any Elk" }), _jsx("button", { onClick: () => setTagTypePreference('antlerless'), className: `flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${config.tagType === 'antlerless'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`, children: "Antlerless" })] }), _jsx("p", { className: "text-xs text-gray-500 mt-2", children: "Select which tag type to focus on" })] })] }), _jsx("div", { className: "mt-6 pt-6 border-t border-gray-200", children: _jsxs("div", { className: "grid grid-cols-1 sm:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-blue-50 rounded p-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-600 mb-1", children: "Qualifying Pool" }), _jsx("div", { className: "text-lg font-bold text-blue-600", children: poolLabels[qualifyingPool] })] }), _jsxs("div", { className: "bg-blue-50 rounded p-4", children: [_jsx("div", { className: "text-sm font-medium text-gray-600 mb-1", children: "Your Lottery Entries" }), _jsx("div", { className: "text-lg font-bold text-blue-600", children: userEntries.toLocaleString() }), _jsxs("div", { className: "text-xs text-gray-500 mt-1", children: ["(", config.preferencePoints, "+1)\u00B3"] })] })] }) }), _jsx("div", { className: "mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600", children: _jsxs("p", { children: ["\uD83C\uDFF9 ", _jsx("strong", { children: "How it works:" }), " GFP uses ", qualifyingPool, " (minimum ", config.preferencePoints, " points). Your ", userEntries.toLocaleString(), " entries compete against other applicants in this pool."] }) })] }));
}
