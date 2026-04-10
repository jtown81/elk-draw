import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * South Dakota Elk Draw Analyzer — Main App
 *
 * Two-tab layout with account management:
 * - My Odds: Query draw odds for entered data
 * - Enter Data: Add/manage elk unit draw statistics
 */
import { useState } from 'react';
import { useUserAccount } from '@hooks/useUserAccount';
import { AppHeader } from '@components/AppHeader';
import { OddsTab } from '@components/OddsTab';
import { DataEntryTab } from '@components/DataEntryTab';
export default function App() {
    const [activeTab, setActiveTab] = useState('odds');
    const { accounts, activeUserId, activeAccount, isLoading: accountsLoading, createAccount, deleteAccount, renameAccount, switchAccount, } = useUserAccount();
    // Show loading state while accounts are being loaded
    if (accountsLoading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "text-lg font-semibold text-gray-700 mb-2", children: "Loading..." }), _jsx("div", { className: "text-sm text-gray-500", children: "Initializing elk draw analyzer" })] }) }));
    }
    // Show onboarding if no accounts exist
    if (accounts.length === 0) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50", children: _jsxs("div", { className: "bg-white rounded-lg shadow-md p-8 max-w-md w-full mx-4", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 mb-2", children: "\uD83E\uDD8C Elk Draw Analyzer" }), _jsx("p", { className: "text-gray-600 mb-6", children: "South Dakota hunting odds calculator for preference point holders." }), _jsx("button", { onClick: () => {
                            const name = prompt('Enter your name:');
                            if (name?.trim()) {
                                createAccount(name.trim());
                            }
                        }, className: "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors", children: "Create Account" }), _jsx("p", { className: "text-xs text-gray-400 text-center mt-4", children: "Your data stays on your device. No accounts needed." })] }) }));
    }
    // Main app layout
    return (_jsxs("div", { className: "min-h-screen bg-gray-50", children: [_jsx(AppHeader, { activeTab: activeTab, onTabChange: setActiveTab, accounts: accounts, activeUserId: activeUserId, activeAccount: activeAccount, onCreateAccount: createAccount, onDeleteAccount: deleteAccount, onRenameAccount: renameAccount, onSwitchAccount: switchAccount }), _jsxs("main", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6", children: [activeTab === 'odds' && activeUserId && (_jsx(OddsTab, { userId: activeUserId, accountName: activeAccount?.name || 'Unknown' })), activeTab === 'data' && activeUserId && (_jsx(DataEntryTab, { userId: activeUserId, accountName: activeAccount?.name || 'Unknown' }))] })] }));
}
