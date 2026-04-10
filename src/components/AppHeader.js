import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * App Header — Navigation & Account Management
 *
 * Displays app title, tab navigation, and account selector/switcher.
 */
import { useState } from 'react';
export function AppHeader({ activeTab, onTabChange, accounts, activeUserId, activeAccount, onCreateAccount, onDeleteAccount, onRenameAccount, onSwitchAccount, }) {
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [isRenamingId, setIsRenamingId] = useState(null);
    const [renameValue, setRenameValue] = useState('');
    const handleRename = (userId) => {
        const newName = renameValue.trim();
        if (newName) {
            onRenameAccount(userId, newName);
            setIsRenamingId(null);
            setRenameValue('');
        }
    };
    return (_jsx("header", { className: "bg-white shadow", children: _jsxs("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("h1", { className: "text-2xl font-bold text-gray-900 flex items-center gap-2", children: "\uD83E\uDD8C Elk Draw Analyzer" }), _jsxs("nav", { className: "flex gap-1", children: [_jsx("button", { onClick: () => onTabChange('odds'), className: `px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'odds'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: "My Odds" }), _jsx("button", { onClick: () => onTabChange('data'), className: `px-4 py-2 font-medium rounded-t-lg transition-colors ${activeTab === 'data'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`, children: "Enter Data" })] })] }), _jsxs("div", { className: "flex items-center justify-between border-t pt-3", children: [_jsx("div", { className: "text-sm text-gray-600", children: activeAccount && (_jsxs("span", { children: ["Signed in as ", _jsx("span", { className: "font-semibold text-gray-900", children: activeAccount.name })] })) }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowAccountMenu(!showAccountMenu), className: "px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded transition-colors", children: ["Accounts (", accounts.length, ")"] }), showAccountMenu && (_jsxs("div", { className: "absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg z-10", children: [_jsx("div", { className: "max-h-64 overflow-y-auto", children: accounts.map(account => (_jsxs("div", { className: `px-4 py-3 border-b hover:bg-gray-50 flex items-center justify-between group ${activeUserId === account.id ? 'bg-blue-50' : ''}`, children: [isRenamingId === account.id ? (_jsx("input", { type: "text", value: renameValue, onChange: e => setRenameValue(e.target.value), onBlur: () => handleRename(account.id), onKeyDown: e => {
                                                            if (e.key === 'Enter')
                                                                handleRename(account.id);
                                                            if (e.key === 'Escape')
                                                                setIsRenamingId(null);
                                                        }, autoFocus: true, className: "flex-1 px-2 py-1 border border-gray-300 rounded text-sm" })) : (_jsx("div", { className: "flex-1 flex items-center gap-2", children: _jsxs("button", { onClick: () => {
                                                                onSwitchAccount(account.id);
                                                                setShowAccountMenu(false);
                                                            }, className: "flex-1 text-left text-sm hover:underline", children: [_jsx("span", { className: "font-medium text-gray-900", children: account.name }), activeUserId === account.id && (_jsx("span", { className: "ml-2 text-xs text-blue-600 font-semibold", children: "\u25CF" }))] }) })), !isRenamingId && (_jsxs("div", { className: "flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity", children: [_jsx("button", { onClick: () => {
                                                                    setIsRenamingId(account.id);
                                                                    setRenameValue(account.name);
                                                                }, className: "px-2 py-1 text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded", title: "Rename", children: "\u270F\uFE0F" }), accounts.length > 1 && (_jsx("button", { onClick: () => {
                                                                    if (confirm(`Delete "${account.name}" and all associated data? This cannot be undone.`)) {
                                                                        onDeleteAccount(account.id);
                                                                        setShowAccountMenu(false);
                                                                    }
                                                                }, className: "px-2 py-1 text-xs text-red-500 hover:text-red-700 hover:bg-red-100 rounded", title: "Delete", children: "\uD83D\uDDD1\uFE0F" }))] }))] }, account.id))) }), _jsx("button", { onClick: () => {
                                                const name = prompt('Enter your name:');
                                                if (name?.trim()) {
                                                    onCreateAccount(name.trim());
                                                    setShowAccountMenu(false);
                                                }
                                            }, className: "w-full px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 border-t", children: "+ New Account" })] }))] })] })] }) }));
}
