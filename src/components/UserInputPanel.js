import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * User Input Panel
 *
 * Allows user to input preference points (0-25) and select tag type.
 * Features custom slider, segmented toggle, and metric tiles.
 */
import { useUserConfig } from '@hooks/useUserConfig';
import { getQualifyingPool, calcEntries, getPoolAllocationPct } from '@modules/odds-calculator';
const POOL_LABELS = {
    '15plus': '15+ Pool',
    '10plus': '10+ Pool',
    '2plus': '2+ Pool',
    '0plus': '0+ Pool',
};
export function UserInputPanel({ userId }) {
    const { config, setPreferencePoints, setTagTypePreference } = useUserConfig(userId);
    const qualifyingPool = getQualifyingPool(config.preferencePoints);
    const userEntries = calcEntries(config.preferencePoints);
    // BH units get 30%/15%/5%; CSP gets 34%/33%/33% — show BH as default
    // since 95%+ of units are Black Hills; pool allocation note shown in info strip
    const bhAllocationPct = getPoolAllocationPct(qualifyingPool, 'blackhills');
    const cspAllocationPct = getPoolAllocationPct(qualifyingPool, 'csp');
    return (_jsxs("div", { className: "bg-surface border border-border rounded-lg p-6 mb-6", children: [_jsx("div", { className: "pb-4 border-b-2 border-amber-dark mb-6", children: _jsx("h3", { className: "text-lg font-heading text-cream uppercase tracking-wide", children: "Your Setup" }) }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-6xl font-display text-gold tracking-wide", children: config.preferencePoints }), _jsx("div", { className: "text-xs font-heading text-parchment uppercase tracking-wider mt-1", children: "Preference Points" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("input", { type: "range", min: "0", max: "25", value: config.preferencePoints, onChange: e => setPreferencePoints(parseInt(e.target.value)), className: "w-full h-2 bg-surface-2 rounded-lg appearance-none cursor-pointer accent-amber-dark", style: {
                                    background: `linear-gradient(to right, var(--color-amber) 0%, var(--color-amber) ${(config.preferencePoints / 25) * 100}%, var(--color-surface-2) ${(config.preferencePoints / 25) * 100}%, var(--color-surface-2) 100%)`,
                                } }), _jsxs("div", { className: "flex justify-between text-xs text-parchment font-mono", children: [_jsx("span", { children: "0" }), _jsx("span", { children: "25" })] })] }), _jsxs("div", { className: "space-y-2", children: [_jsx("div", { className: "text-xs font-heading text-parchment uppercase tracking-wider", children: "Tag Type" }), _jsxs("div", { className: "flex gap-1 bg-surface-2 rounded-lg p-1", children: [_jsx("button", { onClick: () => setTagTypePreference('any_elk'), className: `flex-1 px-4 py-3 rounded transition-colors font-heading text-sm uppercase tracking-wide ${config.tagType === 'any_elk'
                                            ? 'bg-amber-dark text-forest'
                                            : 'text-parchment hover:text-cream'}`, children: "Any Elk" }), _jsx("button", { onClick: () => setTagTypePreference('antlerless'), className: `flex-1 px-4 py-3 rounded transition-colors font-heading text-sm uppercase tracking-wide ${config.tagType === 'antlerless'
                                            ? 'bg-amber-dark text-forest'
                                            : 'text-parchment hover:text-cream'}`, children: "Antlerless" })] })] }), _jsxs("div", { className: "grid grid-cols-2 gap-3", children: [_jsxs("div", { className: "bg-surface-2 border border-border rounded-lg p-3", children: [_jsx("div", { className: "text-xs font-heading text-parchment uppercase tracking-wider", children: "Qualifying Pool" }), _jsx("div", { className: "text-lg font-heading text-amber-dark mt-2", children: POOL_LABELS[qualifyingPool] })] }), _jsxs("div", { className: "bg-surface-2 border border-border rounded-lg p-3", children: [_jsx("div", { className: "text-xs font-heading text-parchment uppercase tracking-wider", children: "Pool Share" }), bhAllocationPct > 0 ? (_jsxs("div", { className: "text-lg font-display text-gold mt-2", children: [bhAllocationPct, "%", cspAllocationPct > 0 && cspAllocationPct !== bhAllocationPct && (_jsxs("span", { className: "text-xs font-heading text-parchment ml-1", children: ["/ ", cspAllocationPct, "%"] }))] })) : (_jsx("div", { className: "text-sm font-heading text-parchment mt-2", children: "N/A" })), _jsx("div", { className: "text-xs text-bark mt-1", children: "BH / CSP" })] }), _jsxs("div", { className: "bg-surface-2 border border-border rounded-lg p-3", children: [_jsx("div", { className: "text-xs font-heading text-parchment uppercase tracking-wider", children: "Your Entries" }), _jsx("div", { className: "text-lg font-mono text-gold mt-2", children: userEntries.toLocaleString() })] }), _jsxs("div", { className: "bg-surface-2 border border-border rounded-lg p-3", children: [_jsx("div", { className: "text-xs font-heading text-parchment uppercase tracking-wider", children: "Formula" }), _jsxs("div", { className: "text-xs font-mono text-parchment mt-2", children: ["(", config.preferencePoints, "+1)\u00B3"] })] })] }), _jsxs("div", { className: "p-3 bg-surface-2/50 border-l-2 border-l-sage rounded text-xs text-parchment space-y-1", children: [_jsxs("p", { children: [_jsx("strong", { children: "\uD83C\uDFF9 How it works:" }), " You qualify for the ", POOL_LABELS[qualifyingPool], "."] }), _jsxs("p", { children: ["GFP cubes your entries: (", config.preferencePoints, "+1)\u00B3 = ", userEntries.toLocaleString(), " lottery entries."] }), _jsxs("p", { children: ["Black Hills: ", bhAllocationPct, "% of tags go to this pool.", cspAllocationPct > 0 ? ` CSP: ${cspAllocationPct}%.` : ''] })] })] })] }));
}
