import { jsx as _jsx } from "react/jsx-runtime";
const sizeMap = {
    banner: {
        mobile: 'w-full h-[50px]',
        desktop: 'w-full h-[90px]',
        hidden: false,
    },
    rectangle: {
        mobile: 'w-full h-[100px]',
        desktop: 'w-[300px] h-[250px]',
        hidden: false,
    },
    sidebar: {
        mobile: 'hidden',
        desktop: 'w-[300px] h-[600px]',
        hidden: true,
    },
    leaderboard: {
        mobile: 'w-full h-[50px]',
        desktop: 'w-full h-[90px]',
        hidden: false,
    },
};
export function AdPlaceholder({ size, className = '' }) {
    const dims = sizeMap[size];
    if (size === 'sidebar') {
        return (_jsx("div", { className: `hidden lg:block ${dims.desktop} border-2 border-dashed border-amber-dark/30 rounded-lg flex items-center justify-center bg-canopy/50 ${className}`, "data-ad-slot": `ad-${size}`, children: _jsx("span", { className: "text-parchment text-sm font-heading", children: "Advertisement" }) }));
    }
    return (_jsx("div", { className: `${dims.mobile} md:${dims.desktop} border-2 border-dashed border-amber-dark/30 rounded-lg flex items-center justify-center bg-canopy/50 ${className}`, "data-ad-slot": `ad-${size}`, children: _jsx("span", { className: "text-parchment text-sm font-heading", children: "Advertisement" }) }));
}
