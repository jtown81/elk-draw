import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Enter Data Tab
 *
 * Allows users to add, edit, and manage elk unit draw statistics.
 * Includes import/export functionality for data management.
 */
import { useState } from 'react';
import { useDrawData } from '@hooks/useDrawData';
import { AddRecordForm } from './AddRecordForm';
import { RecordsList } from './RecordsList';
export function DataEntryTab({ userId, accountName }) {
    const { records, addRecord, updateRecord, deleteRecord, clearAll, exportRecords, replaceRecords, isLoading, } = useDrawData(userId);
    const [editingRecord, setEditingRecord] = useState(null);
    const [showForm, setShowForm] = useState(!editingRecord);
    const handleAddRecord = (record) => {
        if (editingRecord) {
            updateRecord(editingRecord.id, record);
            setEditingRecord(null);
        }
        else {
            addRecord(record);
        }
        setShowForm(false);
    };
    const handleExport = () => {
        const dataStr = exportRecords();
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `elk-draw-data-${accountName}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };
    const handleImport = (e) => {
        const file = e.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const content = event.target?.result;
                const data = JSON.parse(content);
                if (!Array.isArray(data)) {
                    throw new Error('Invalid format: expected array of records');
                }
                // Validate basic structure
                if (!data.every(d => d.unitName && d.year && d.pools)) {
                    throw new Error('Invalid format: missing required fields');
                }
                const shouldReplace = records.length > 0;
                if (shouldReplace &&
                    !confirm(`Replace existing ${records.length} records with ${data.length} records from file?`)) {
                    return;
                }
                if (shouldReplace) {
                    replaceRecords(data);
                }
                else {
                    data.forEach(d => addRecord(d));
                }
            }
            catch (err) {
                alert(`Failed to import: ${err instanceof Error ? err.message : 'Unknown error'}`);
            }
        };
        reader.readAsText(file);
    };
    if (isLoading) {
        return (_jsx("div", { className: "flex items-center justify-center py-12", children: _jsx("div", { className: "text-gray-600", children: "Loading..." }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-900", children: "Enter Data" }), _jsxs("p", { className: "text-gray-600 mt-1", children: ["Add elk unit draw statistics from GFP for ", accountName] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2", children: [(showForm || editingRecord) && (_jsxs("div", { className: "bg-white rounded-lg shadow p-6 mb-6", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: editingRecord ? 'Edit Record' : 'Add Unit Data' }), _jsx(AddRecordForm, { existingRecord: editingRecord || undefined, onSubmit: handleAddRecord, onCancel: () => {
                                            setShowForm(false);
                                            setEditingRecord(null);
                                        } })] })), !showForm && !editingRecord && (_jsx("button", { onClick: () => setShowForm(true), className: "w-full mb-6 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors", children: "+ Add New Record" })), _jsx("div", { className: "bg-white rounded-lg shadow p-6", children: _jsx(RecordsList, { records: records, onEdit: record => {
                                        setEditingRecord(record);
                                        setShowForm(true);
                                    }, onDelete: deleteRecord }) })] }), _jsx("div", { children: _jsxs("div", { className: "bg-white rounded-lg shadow p-6 sticky top-4", children: [_jsx("h3", { className: "text-lg font-semibold text-gray-900 mb-4", children: "Data Management" }), _jsxs("div", { className: "space-y-2", children: [_jsxs("button", { onClick: handleExport, disabled: records.length === 0, className: "w-full text-sm bg-green-50 hover:bg-green-100 disabled:bg-gray-50 text-green-700 disabled:text-gray-400 font-medium py-2 px-3 rounded transition-colors border border-green-200 disabled:border-gray-200", children: ["\u2B07\uFE0F Export (", records.length, ")"] }), _jsxs("label", { className: "block", children: [_jsx("input", { type: "file", accept: ".json", onChange: handleImport, className: "hidden" }), _jsx("div", { className: "w-full text-sm bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium py-2 px-3 rounded transition-colors border border-blue-200 cursor-pointer text-center", children: "\u2B06\uFE0F Import" })] }), records.length > 0 && (_jsx("button", { onClick: () => {
                                                if (confirm(`Delete all ${records.length} records? This cannot be undone.`)) {
                                                    clearAll();
                                                }
                                            }, className: "w-full text-sm bg-red-50 hover:bg-red-100 text-red-700 font-medium py-2 px-3 rounded transition-colors border border-red-200", children: "\uD83D\uDDD1\uFE0F Clear All" }))] }), _jsxs("div", { className: "mt-6 pt-6 border-t space-y-2", children: [_jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Total Records:" }), _jsx("span", { className: "ml-2 font-bold text-gray-900", children: records.length })] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Unique Units:" }), _jsx("span", { className: "ml-2 font-bold text-gray-900", children: new Set(records.map(r => r.unitName)).size })] }), _jsxs("div", { className: "text-sm", children: [_jsx("span", { className: "text-gray-600", children: "Year Range:" }), _jsx("span", { className: "ml-2 font-bold text-gray-900", children: records.length > 0
                                                        ? `${Math.min(...records.map(r => r.year))}–${Math.max(...records.map(r => r.year))}`
                                                        : '—' })] })] }), _jsxs("div", { className: "mt-6 p-3 bg-blue-50 rounded-lg text-xs text-blue-700", children: [_jsx("p", { className: "font-semibold mb-1", children: "\uD83D\uDCA1 Tips:" }), _jsxs("ul", { className: "space-y-1", children: [_jsx("li", { children: "\u2022 Export regularly to back up your data" }), _jsx("li", { children: "\u2022 Import JSON files to restore data" }), _jsx("li", { children: "\u2022 All data stays on your device" })] })] })] }) })] })] }));
}
