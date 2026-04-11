import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * App Header — Navigation & Account Management
 *
 * Desktop: sticky top bar with brand, centered tabs, account dropdown
 * Mobile: compact top bar + fixed bottom tab bar
 */
import { useState } from 'react';
export function AppHeader({ activeTab, onTabChange, accounts, activeUserId, activeAccount, onCreateAccount, onDeleteAccount, onRenameAccount, onSwitchAccount, }) {
    const [showAccountMenu, setShowAccountMenu] = useState(false);
    const [isRenamingId, setIsRenamingId] = useState(null);
    const [renameValue, setRenameValue] = useState('');
    const [isCreatingNewAccount, setIsCreatingNewAccount] = useState(false);
    const [newAccountName, setNewAccountName] = useState('');
    const [deletingId, setDeletingId] = useState(null);
    const handleRename = (userId) => {
        const newName = renameValue.trim();
        if (newName && newName !== accounts.find(a => a.id === userId)?.name) {
            onRenameAccount(userId, newName);
        }
        setIsRenamingId(null);
        setRenameValue('');
    };
    const handleCreateNewAccount = () => {
        const name = newAccountName.trim();
        if (name) {
            onCreateAccount(name);
            setNewAccountName('');
            setIsCreatingNewAccount(false);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "sticky top-0 z-40 bg-surface border-b border-border hidden md:block", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-2xl", children: "\uD83E\uDD8C" }), _jsxs("div", { children: [_jsx("div", { className: "text-lg font-display text-cream tracking-wider", children: "ELK DRAW" }), _jsx("div", { className: "text-xs font-heading text-parchment", children: "ANALYZER" })] })] }), _jsxs("nav", { className: "flex gap-2 bg-surface-2 rounded-lg p-1", role: "tablist", "aria-label": "Main navigation", children: [_jsx("button", { onClick: () => onTabChange('odds'), role: "tab", "aria-selected": activeTab === 'odds', "aria-controls": "odds-panel", className: `px-6 py-2 font-heading text-sm uppercase tracking-wide rounded transition-colors min-h-[44px] ${activeTab === 'odds'
                                            ? 'bg-amber-dark text-forest'
                                            : 'text-cream hover:text-gold'}`, children: "My Odds" }), _jsx("button", { onClick: () => onTabChange('data'), role: "tab", "aria-selected": activeTab === 'data', "aria-controls": "data-panel", className: `px-6 py-2 font-heading text-sm uppercase tracking-wide rounded transition-colors min-h-[44px] ${activeTab === 'data'
                                            ? 'bg-amber-dark text-forest'
                                            : 'text-cream hover:text-gold'}`, children: "Data" })] }), _jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setShowAccountMenu(!showAccountMenu), className: "flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-surface-2 transition-colors", children: [_jsx("div", { className: "w-8 h-8 rounded-full bg-amber-dark/20 flex items-center justify-center", children: _jsx("span", { className: "text-sm font-heading text-amber-dark", children: activeAccount?.name.charAt(0).toUpperCase() || '?' }) }), _jsx("span", { className: "text-sm text-cream hidden sm:inline", children: activeAccount?.name })] }), showAccountMenu && (_jsxs("div", { className: "absolute right-0 mt-2 w-72 bg-surface-2 border border-border rounded-lg shadow-xl z-50", children: [_jsx("div", { className: "max-h-64 overflow-y-auto", children: accounts.map(account => (_jsxs("div", { className: `px-4 py-3 border-b border-border flex items-center justify-between group transition-colors ${activeUserId === account.id
                                                        ? 'bg-amber-dark/10 border-l-2 border-l-amber-dark'
                                                        : 'hover:bg-surface'}`, children: [isRenamingId === account.id ? (_jsx("input", { type: "text", value: renameValue, onChange: e => setRenameValue(e.target.value), onBlur: () => handleRename(account.id), onKeyDown: e => {
                                                                if (e.key === 'Enter')
                                                                    handleRename(account.id);
                                                                if (e.key === 'Escape') {
                                                                    setIsRenamingId(null);
                                                                    setRenameValue('');
                                                                }
                                                            }, autoFocus: true, className: "flex-1 px-2 py-1 bg-surface border border-border rounded text-sm text-cream font-body" })) : (_jsx("div", { className: "flex-1 flex items-center gap-2", children: _jsxs("button", { onClick: () => {
                                                                    onSwitchAccount(account.id);
                                                                    setShowAccountMenu(false);
                                                                }, className: "flex-1 text-left hover:text-gold transition-colors", children: [_jsx("span", { className: "font-heading text-cream", children: account.name }), activeUserId === account.id && (_jsx("span", { className: "ml-2 text-amber-dark font-bold", children: "\u25CF" }))] }) })), !isRenamingId && (_jsxs("div", { className: "flex gap-1", children: [_jsx("button", { onClick: () => {
                                                                        setIsRenamingId(account.id);
                                                                        setRenameValue(account.name);
                                                                    }, className: "px-2 py-1 text-xs text-parchment hover:text-gold hover:bg-surface rounded transition-colors", title: "Rename", children: "\u270F\uFE0F" }), accounts.length > 1 && (_jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => setDeletingId(deletingId === account.id ? null : account.id), className: "px-2 py-1 text-xs text-parchment hover:text-warn hover:bg-surface rounded transition-colors", title: "Delete", children: "\uD83D\uDDD1\uFE0F" }), deletingId === account.id && (_jsxs("div", { className: "absolute right-0 mt-1 bg-surface border border-border rounded shadow-lg whitespace-nowrap z-10", children: [_jsxs("div", { className: "px-3 py-2 text-xs text-parchment", children: ["Delete \"", account.name, "\"?"] }), _jsxs("div", { className: "flex gap-1 px-2 pb-2", children: [_jsx("button", { onClick: () => {
                                                                                                onDeleteAccount(account.id);
                                                                                                setDeletingId(null);
                                                                                                setShowAccountMenu(false);
                                                                                            }, className: "px-2 py-1 text-xs bg-danger text-cream rounded hover:bg-warn transition-colors", children: "Delete" }), _jsx("button", { onClick: () => setDeletingId(null), className: "px-2 py-1 text-xs bg-surface-2 text-cream rounded hover:bg-border transition-colors", children: "Cancel" })] })] }))] }))] }))] }, account.id))) }), _jsx("div", { className: "border-t border-border p-3", children: !isCreatingNewAccount ? (_jsx("button", { onClick: () => setIsCreatingNewAccount(true), className: "w-full text-sm font-heading text-amber-dark hover:text-gold py-2 transition-colors", children: "+ NEW ACCOUNT" })) : (_jsxs("div", { className: "flex gap-2", children: [_jsx("input", { type: "text", placeholder: "Account name", value: newAccountName, onChange: e => setNewAccountName(e.target.value), onKeyDown: e => {
                                                                if (e.key === 'Enter')
                                                                    handleCreateNewAccount();
                                                                if (e.key === 'Escape') {
                                                                    setIsCreatingNewAccount(false);
                                                                    setNewAccountName('');
                                                                }
                                                            }, autoFocus: true, className: "flex-1 px-2 py-1 bg-surface border border-border rounded text-sm text-cream font-body" }), _jsx("button", { onClick: handleCreateNewAccount, disabled: !newAccountName.trim(), className: "px-3 py-1 bg-amber-dark text-forest text-xs font-heading rounded hover:bg-gold disabled:opacity-50 transition-colors", children: "Add" })] })) })] }))] })] }) }) }), _jsx("header", { className: "sticky top-0 z-40 bg-surface border-b border-border md:hidden", children: _jsxs("div", { className: "px-4 py-3 flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xl", children: "\uD83E\uDD8C" }), _jsxs("div", { children: [_jsx("div", { className: "text-sm font-display text-cream tracking-wider", children: "ELK DRAW" }), _jsx("div", { className: "text-xs font-heading text-parchment", children: "ANALYZER" })] })] }), _jsxs("div", { className: "relative", children: [_jsx("button", { onClick: () => setShowAccountMenu(!showAccountMenu), className: "w-8 h-8 rounded-full bg-amber-dark/20 flex items-center justify-center text-xs font-heading text-amber-dark hover:bg-amber-dark/30 transition-colors", title: activeAccount?.name, children: activeAccount?.name.charAt(0).toUpperCase() || '?' }), showAccountMenu && (_jsxs("div", { className: "absolute right-0 mt-2 w-64 bg-surface-2 border border-border rounded-lg shadow-xl z-50", children: [_jsx("div", { className: "max-h-48 overflow-y-auto", children: accounts.map(account => (_jsxs("div", { className: `px-4 py-3 border-b border-border flex items-center justify-between group transition-colors ${activeUserId === account.id
                                                    ? 'bg-amber-dark/10 border-l-2 border-l-amber-dark'
                                                    : 'hover:bg-surface'}`, children: [isRenamingId === account.id ? (_jsx("input", { type: "text", value: renameValue, onChange: e => setRenameValue(e.target.value), onBlur: () => handleRename(account.id), onKeyDown: e => {
                                                            if (e.key === 'Enter')
                                                                handleRename(account.id);
                                                            if (e.key === 'Escape') {
                                                                setIsRenamingId(null);
                                                                setRenameValue('');
                                                            }
                                                        }, autoFocus: true, className: "flex-1 px-2 py-1 bg-surface border border-border rounded text-xs text-cream font-body" })) : (_jsx("div", { className: "flex-1", children: _jsxs("button", { onClick: () => {
                                                                onSwitchAccount(account.id);
                                                                setShowAccountMenu(false);
                                                            }, className: "text-sm font-heading text-cream hover:text-gold transition-colors text-left w-full", children: [account.name, activeUserId === account.id && (_jsx("span", { className: "ml-2 text-amber-dark font-bold", children: "\u25CF" }))] }) })), !isRenamingId && (_jsxs("div", { className: "flex gap-1 ml-2", children: [_jsx("button", { onClick: () => {
                                                                    setIsRenamingId(account.id);
                                                                    setRenameValue(account.name);
                                                                }, className: "px-2 py-1 text-xs text-parchment hover:text-gold", title: "Rename", children: "\u270F\uFE0F" }), accounts.length > 1 && (_jsx("button", { onClick: () => setDeletingId(deletingId === account.id ? null : account.id), className: "px-2 py-1 text-xs text-parchment hover:text-warn", title: "Delete", children: "\uD83D\uDDD1\uFE0F" }))] })), deletingId === account.id && (_jsxs("div", { className: "absolute right-0 mt-12 bg-surface border border-border rounded shadow-lg z-10", children: [_jsx("div", { className: "px-3 py-2 text-xs text-parchment", children: "Delete?" }), _jsxs("div", { className: "flex gap-1 px-2 pb-2", children: [_jsx("button", { onClick: () => {
                                                                            onDeleteAccount(account.id);
                                                                            setDeletingId(null);
                                                                            setShowAccountMenu(false);
                                                                        }, className: "px-2 py-1 text-xs bg-danger text-cream rounded", children: "Delete" }), _jsx("button", { onClick: () => setDeletingId(null), className: "px-2 py-1 text-xs bg-surface-2 text-cream rounded", children: "Cancel" })] })] }))] }, account.id))) }), _jsx("div", { className: "border-t border-border p-2", children: !isCreatingNewAccount ? (_jsx("button", { onClick: () => setIsCreatingNewAccount(true), className: "w-full text-xs font-heading text-amber-dark py-2 hover:text-gold", children: "+ NEW ACCOUNT" })) : (_jsxs("div", { className: "flex gap-1", children: [_jsx("input", { type: "text", placeholder: "Name", value: newAccountName, onChange: e => setNewAccountName(e.target.value), onKeyDown: e => {
                                                            if (e.key === 'Enter')
                                                                handleCreateNewAccount();
                                                            if (e.key === 'Escape') {
                                                                setIsCreatingNewAccount(false);
                                                                setNewAccountName('');
                                                            }
                                                        }, autoFocus: true, className: "flex-1 px-2 py-1 bg-surface border border-border rounded text-xs text-cream" }), _jsx("button", { onClick: handleCreateNewAccount, disabled: !newAccountName.trim(), className: "px-2 py-1 bg-amber-dark text-forest text-xs font-heading rounded disabled:opacity-50", children: "Add" })] })) })] }))] })] }) }), _jsx("nav", { className: "fixed bottom-0 left-0 right-0 bg-surface border-t border-border md:hidden z-40", role: "tablist", "aria-label": "Mobile navigation", children: _jsxs("div", { className: "flex h-14", children: [_jsxs("button", { onClick: () => onTabChange('odds'), role: "tab", "aria-selected": activeTab === 'odds', "aria-controls": "odds-panel", className: `flex-1 flex items-center justify-center font-heading text-xs uppercase tracking-wide transition-colors relative min-h-[56px] ${activeTab === 'odds'
                                ? 'text-amber-dark'
                                : 'text-parchment hover:text-cream'}`, children: ["My Odds", activeTab === 'odds' && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-amber-dark" }))] }), _jsx("div", { className: "w-px bg-border" }), _jsxs("button", { onClick: () => onTabChange('data'), role: "tab", "aria-selected": activeTab === 'data', "aria-controls": "data-panel", className: `flex-1 flex items-center justify-center font-heading text-xs uppercase tracking-wide transition-colors relative min-h-[56px] ${activeTab === 'data'
                                ? 'text-amber-dark'
                                : 'text-parchment hover:text-cream'}`, children: ["Data", activeTab === 'data' && (_jsx("div", { className: "absolute bottom-0 left-0 right-0 h-1 bg-amber-dark" }))] })] }) }), _jsx("div", { className: "h-14 md:hidden" })] }));
}
