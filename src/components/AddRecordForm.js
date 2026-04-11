import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * Add/Edit Record Form
 *
 * Form for entering elk unit draw statistics.
 * Supports 1-3 pools per unit with full validation.
 */
import { useState } from 'react';
import { getAllUnitsSorted } from '@data/elk-units';
import { getAllPoolsOrdered } from '@data/draw-pools';
const CURRENT_YEAR = new Date().getFullYear();
const MIN_YEAR = 2020;
export function AddRecordForm({ existingRecord, onSubmit, onCancel }) {
    const [formState, setFormState] = useState(existingRecord
        ? {
            unitName: existingRecord.unitName,
            year: existingRecord.year,
            tagType: existingRecord.tagType,
            pools: existingRecord.pools,
            notes: existingRecord.notes || '',
        }
        : {
            unitName: '',
            year: CURRENT_YEAR,
            tagType: 'any_elk',
            pools: [
                { pool: '15plus', tagsAvailable: 0, applicants: 0, lowestPointDrawn: null },
            ],
            notes: '',
        });
    const [errors, setErrors] = useState({});
    const validateForm = () => {
        const newErrors = {};
        if (!formState.unitName.trim()) {
            newErrors.unitName = 'Unit name is required';
        }
        if (formState.year < MIN_YEAR || formState.year > CURRENT_YEAR) {
            newErrors.year = `Year must be between ${MIN_YEAR} and ${CURRENT_YEAR}`;
        }
        if (formState.pools.length === 0) {
            newErrors.pools = 'At least one pool is required';
        }
        for (let i = 0; i < formState.pools.length; i++) {
            const pool = formState.pools[i];
            if (pool.tagsAvailable <= 0) {
                newErrors[`pool-${i}-tags`] = 'Tags must be > 0';
            }
            if (pool.applicants <= 0) {
                newErrors[`pool-${i}-applicants`] = 'Applicants must be > 0';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleAddPool = () => {
        const usedPools = new Set(formState.pools.map(p => p.pool));
        const availablePools = getAllPoolsOrdered().filter(p => !usedPools.has(p));
        if (availablePools.length === 0) {
            setErrors({ pools: 'All pools already added' });
            return;
        }
        setFormState(prev => ({
            ...prev,
            pools: [
                ...prev.pools,
                {
                    pool: availablePools[0],
                    tagsAvailable: 0,
                    applicants: 0,
                    lowestPointDrawn: null,
                },
            ],
        }));
    };
    const handleRemovePool = (index) => {
        setFormState(prev => ({
            ...prev,
            pools: prev.pools.filter((_, i) => i !== index),
        }));
    };
    const handlePoolChange = (index, field, value) => {
        setFormState(prev => ({
            ...prev,
            pools: prev.pools.map((p, i) => {
                if (i === index) {
                    if (field === 'lowestPointDrawn') {
                        return { ...p, [field]: value === '' ? null : parseInt(value) };
                    }
                    return { ...p, [field]: field === 'pool' ? value : parseInt(value) };
                }
                return p;
            }),
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm())
            return;
        onSubmit({
            unitName: formState.unitName.toUpperCase().trim(),
            year: formState.year,
            tagType: formState.tagType,
            pools: formState.pools,
            notes: formState.notes.trim() || undefined,
        });
        // Reset form if not editing
        if (!existingRecord) {
            setFormState({
                unitName: '',
                year: CURRENT_YEAR,
                tagType: 'any_elk',
                pools: [
                    { pool: '15plus', tagsAvailable: 0, applicants: 0, lowestPointDrawn: null },
                ],
                notes: '',
            });
        }
    };
    const allUnits = getAllUnitsSorted();
    const poolLabels = {
        '15plus': '15+ Pool',
        '10plus': '10+ Pool',
        '2plus': '2+ Pool',
        '0plus': '0+ Pool',
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: "Basic Info" }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Unit Name *" }), _jsxs("select", { value: formState.unitName, onChange: e => {
                                    setFormState(prev => ({ ...prev, unitName: e.target.value }));
                                    if (errors.unitName)
                                        setErrors(prev => ({ ...prev, unitName: '' }));
                                }, className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.unitName ? 'border-red-500' : 'border-gray-300'}`, children: [_jsx("option", { value: "", children: "Select unit..." }), allUnits.map(unit => (_jsx("option", { value: unit, children: unit }, unit)))] }), errors.unitName && _jsx("p", { className: "text-xs text-red-600 mt-1", children: errors.unitName })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Year *" }), _jsx("input", { type: "number", min: MIN_YEAR, max: CURRENT_YEAR, value: formState.year, onChange: e => {
                                            setFormState(prev => ({ ...prev, year: parseInt(e.target.value) }));
                                            if (errors.year)
                                                setErrors(prev => ({ ...prev, year: '' }));
                                        }, className: `w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.year ? 'border-red-500' : 'border-gray-300'}` }), errors.year && _jsx("p", { className: "text-xs text-red-600 mt-1", children: errors.year })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Tag Type *" }), _jsxs("select", { value: formState.tagType, onChange: e => setFormState(prev => ({ ...prev, tagType: e.target.value })), className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500", children: [_jsx("option", { value: "any_elk", children: "Any Elk" }), _jsx("option", { value: "antlerless", children: "Antlerless" })] })] })] })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h4", { className: "font-semibold text-gray-900", children: "Pool Data" }), formState.pools.length < 3 && (_jsx("button", { type: "button", onClick: handleAddPool, className: "text-sm text-blue-600 hover:text-blue-700 font-medium", children: "+ Add Pool" }))] }), errors.pools && _jsx("p", { className: "text-xs text-red-600", children: errors.pools }), _jsx("div", { className: "space-y-4", children: formState.pools.map((pool, idx) => (_jsxs("div", { className: "bg-gray-50 rounded-lg p-4 space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsx("label", { className: "text-sm font-medium text-gray-700", children: poolLabels[pool.pool] }), formState.pools.length > 1 && (_jsx("button", { type: "button", onClick: () => handleRemovePool(idx), className: "text-xs text-red-600 hover:text-red-700 font-medium", children: "Remove" }))] }), _jsxs("div", { className: "grid grid-cols-3 gap-3", children: [formState.pools.length > 1 && (_jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Pool" }), _jsx("select", { value: pool.pool, onChange: e => handlePoolChange(idx, 'pool', e.target.value), className: "w-full px-2 py-2 border border-gray-300 rounded text-sm", children: getAllPoolsOrdered().map(p => (_jsx("option", { value: p, children: poolLabels[p] }, p))) })] })), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Tags *" }), _jsx("input", { type: "number", min: "1", value: pool.tagsAvailable || '', onChange: e => handlePoolChange(idx, 'tagsAvailable', e.target.value), placeholder: "e.g. 30", className: `w-full px-2 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`pool-${idx}-tags`] ? 'border-red-500' : 'border-gray-300'}` }), errors[`pool-${idx}-tags`] && (_jsx("p", { className: "text-xs text-red-600 mt-1", children: errors[`pool-${idx}-tags`] }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Applicants *" }), _jsx("input", { type: "number", min: "1", value: pool.applicants || '', onChange: e => handlePoolChange(idx, 'applicants', e.target.value), placeholder: "e.g. 4320", className: `w-full px-2 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors[`pool-${idx}-applicants`]
                                                        ? 'border-red-500'
                                                        : 'border-gray-300'}` }), errors[`pool-${idx}-applicants`] && (_jsx("p", { className: "text-xs text-red-600 mt-1", children: errors[`pool-${idx}-applicants`] }))] }), _jsxs("div", { children: [_jsx("label", { className: "block text-xs font-medium text-gray-600 mb-1", children: "Lowest Point" }), _jsx("input", { type: "number", min: "0", max: "25", value: pool.lowestPointDrawn ?? '', onChange: e => handlePoolChange(idx, 'lowestPointDrawn', e.target.value), placeholder: "e.g. 11", className: "w-full px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" })] })] })] }, idx))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Notes (optional)" }), _jsx("textarea", { value: formState.notes, onChange: e => setFormState(prev => ({ ...prev, notes: e.target.value })), placeholder: "Any additional info about this draw...", rows: 2, className: "w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" })] }), _jsxs("div", { className: "flex gap-2 pt-4 border-t", children: [_jsx("button", { type: "submit", className: "flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors", children: existingRecord ? 'Update Record' : 'Save Record' }), onCancel && (_jsx("button", { type: "button", onClick: onCancel, className: "px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium rounded-lg transition-colors", children: "Cancel" }))] })] }));
}
