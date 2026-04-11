import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * South Dakota Elk Draw Analyzer — Main App
 *
 * Two-tab layout with account management:
 * - My Odds: Query draw odds for entered data
 * - Data: Read-only draw statistics
 */
import { useState } from 'react';
import { useUserAccount } from '@hooks/useUserAccount';
import { AppHeader } from '@components/AppHeader';
import { OddsTab } from '@components/OddsTab';
import { DrawDataTab } from '@components/DrawDataTab';
export default function App() {
    const [activeTab, setActiveTab] = useState('odds');
    const [accountNameInput, setAccountNameInput] = useState('');
    const [isCreatingAccount, setIsCreatingAccount] = useState(false);
    const { accounts, activeUserId, activeAccount, isLoading: accountsLoading, createAccount, deleteAccount, renameAccount, switchAccount, } = useUserAccount();
    // Show loading state while accounts are being loaded
    if (accountsLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-forest", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-5xl font-display text-amber-dark mb-8 tracking-wide", children: "\uD83E\uDD8C" }), _jsx("div", { className: "text-2xl font-display text-cream mb-1 tracking-wide", children: "SD ELK DRAW" }), _jsx("div", { className: "text-sm font-heading text-parchment mb-8", children: "ANALYZER" }), _jsx("div", { className: "flex justify-center", children: _jsx("div", { className: "w-3 h-3 bg-amber-dark rounded-full animate-pulse" }) })] }) }));
    }
    // Show onboarding if no accounts exist
    if (accounts.length === 0) {
        const handleCreateAccount = (e) => {
            e.preventDefault();
            if (accountNameInput.trim()) {
                setIsCreatingAccount(true);
                try {
                    const account = createAccount(accountNameInput.trim());
                    console.log('Account created successfully:', account);
                    setAccountNameInput('');
                }
                catch (error) {
                    console.error('Failed to create account:', error);
                }
                finally {
                    setIsCreatingAccount(false);
                }
            }
        };
        return (_jsxs("div", { className: "flex items-center justify-center min-h-screen bg-forest overflow-hidden", children: [_jsx("div", { className: "absolute inset-0 opacity-5", children: _jsxs("svg", { width: "100%", height: "100%", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("defs", { children: _jsxs("pattern", { id: "topo", x: "0", y: "0", width: "100", height: "100", patternUnits: "userSpaceOnUse", children: [_jsx("circle", { cx: "50", cy: "50", r: "40", fill: "none", stroke: "currentColor", strokeWidth: "0.5" }), _jsx("circle", { cx: "50", cy: "50", r: "30", fill: "none", stroke: "currentColor", strokeWidth: "0.5" }), _jsx("circle", { cx: "50", cy: "50", r: "20", fill: "none", stroke: "currentColor", strokeWidth: "0.5" })] }) }), _jsx("rect", { width: "100%", height: "100%", fill: "url(#topo)", className: "text-cream" })] }) }), _jsxs("div", { className: "relative z-10 bg-surface rounded-lg p-8 max-w-md w-full mx-4 border border-border shadow-lg", children: [_jsxs("h1", { className: "text-4xl font-display text-cream mb-2 tracking-wide text-center", children: ["SOUTH DAKOTA", _jsx("br", {}), "ELK DRAW ANALYZER"] }), _jsx("p", { className: "text-parchment text-center mb-8 font-body italic", children: "Track your odds. Know your draw." }), _jsxs("form", { onSubmit: handleCreateAccount, className: "space-y-4", children: [_jsx("input", { type: "text", placeholder: "Enter your name or nickname", value: accountNameInput, onChange: (e) => setAccountNameInput(e.target.value), className: "w-full px-4 py-3 bg-surface-2 border border-border rounded-sm text-cream placeholder-parchment font-body focus:outline-none focus:border-amber-dark focus:ring-1 focus:ring-amber-dark/50", disabled: isCreatingAccount, autoFocus: true }), _jsx("button", { type: "submit", disabled: isCreatingAccount || !accountNameInput.trim(), className: "w-full bg-amber-dark hover:bg-gold disabled:bg-sage/50 disabled:cursor-not-allowed text-forest font-heading py-3 px-4 rounded-sm transition-colors font-semibold tracking-wide", children: isCreatingAccount ? 'CREATING...' : 'GET STARTED →' })] }), _jsx("p", { className: "text-xs text-parchment text-center mt-6", children: "Your data stays on your device. No signup required." })] })] }));
    }
    // Main app layout
    return (_jsxs("div", { className: "min-h-screen bg-forest flex flex-col", children: [_jsx(AppHeader, { activeTab: activeTab, onTabChange: setActiveTab, accounts: accounts, activeUserId: activeUserId, activeAccount: activeAccount, onCreateAccount: createAccount, onDeleteAccount: deleteAccount, onRenameAccount: renameAccount, onSwitchAccount: switchAccount }), _jsxs("main", { className: "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6", children: [activeTab === 'odds' && activeUserId && (_jsx(OddsTab, { userId: activeUserId, accountName: activeAccount?.name || 'Unknown' })), activeTab === 'data' && activeUserId && (_jsx(DrawDataTab, { userId: activeUserId, accountName: activeAccount?.name || 'Unknown' }))] })] }));
}
