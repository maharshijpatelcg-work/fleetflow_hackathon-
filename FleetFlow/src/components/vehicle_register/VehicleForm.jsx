import React, { useState, useEffect } from 'react';
import { Pencil, Plus, AlertCircle } from 'lucide-react';

export default function VehicleForm({ onSubmit, editingVehicle, onCancelEdit, existingPlates }) {
    const [formData, setFormData] = useState({
        nameModel: '',
        licensePlate: '',
        maxCapacity: '',
        odometer: ''
    });
    const [error, setError] = useState('');

    // Update form data when editing a different vehicle
    useEffect(() => {
        if (editingVehicle) {
            setFormData({
                nameModel: editingVehicle.nameModel,
                licensePlate: editingVehicle.licensePlate,
                maxCapacity: editingVehicle.maxCapacity,
                odometer: editingVehicle.odometer
            });
            setError('');
        } else {
            setFormData({ nameModel: '', licensePlate: '', maxCapacity: '', odometer: '' });
            setError('');
        }
    }, [editingVehicle]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Field extraction and basic validation
        const { nameModel, licensePlate, maxCapacity, odometer } = formData;

        if (!nameModel.trim() || !licensePlate.trim() || !maxCapacity || !odometer) {
            setError('All fields are required.');
            return;
        }

        const capacityNum = Number(maxCapacity);
        const odometerNum = Number(odometer);

        if (isNaN(capacityNum) || capacityNum <= 0) {
            setError('Max Capacity must be a positive number greater than 0.');
            return;
        }

        if (isNaN(odometerNum) || odometerNum < 0) {
            setError('Odometer cannot be a negative number.');
            return;
        }

        if (editingVehicle) {
            // Edit mode checks
            if (odometerNum < editingVehicle.odometer) {
                setError(`Odometer cannot be decreased. Current is ${editingVehicle.odometer.toLocaleString()} mi.`);
                return;
            }
        } else {
            // Add mode checks
            if (existingPlates.includes(licensePlate.trim().toUpperCase())) {
                setError('License Plate already exists in the registry. It must be unique.');
                return;
            }
        }

        // Pass data back up
        onSubmit({
            id: editingVehicle ? editingVehicle.id : Date.now().toString(),
            nameModel: nameModel.trim(),
            licensePlate: editingVehicle ? editingVehicle.licensePlate : licensePlate.trim().toUpperCase(),
            maxCapacity: capacityNum,
            odometer: odometerNum,
            status: editingVehicle ? editingVehicle.status : 'Available'
        });

        // Reset if it was an add action
        if (!editingVehicle) {
            setFormData({ nameModel: '', licensePlate: '', maxCapacity: '', odometer: '' });
        }
    };

    return (
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-all">
            <div className="flex items-center gap-4 mb-8">
                <div className={`p-3 rounded-xl ${editingVehicle ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {editingVehicle ? (
                        <Pencil className="w-7 h-7" />
                    ) : (
                        <Plus className="w-7 h-7" />
                    )}
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {editingVehicle ? 'Edit Vehicle Details' : 'Register New Vehicle'}
                </h2>
            </div>

            {error && (
                <div className="mb-6 p-4 bg-red-50 text-red-700 text-base font-medium rounded-xl border border-red-100 flex items-start gap-3 animate-pulse transition-opacity">
                    <AlertCircle className="mt-0.5 shrink-0 w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-lg font-bold text-gray-700 mb-2">Name / Model</label>
                    <input
                        type="text"
                        name="nameModel"
                        value={formData.nameModel}
                        onChange={handleChange}
                        className="w-full rounded-xl border-gray-200 border px-5 py-3.5 text-lg placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm"
                        placeholder="e.g. Ford Transit XLT"
                    />
                </div>

                <div>
                    <label className="block text-lg font-bold text-gray-700 mb-2 flex justify-between items-center">
                        <span>License Plate</span>
                        {editingVehicle && <span className="text-sm font-semibold text-amber-700 bg-amber-100 px-3 py-1 rounded-md">Locked for Safety</span>}
                    </label>
                    <input
                        type="text"
                        name="licensePlate"
                        value={formData.licensePlate}
                        onChange={handleChange}
                        disabled={!!editingVehicle}
                        className={`w-full rounded-xl border px-5 py-3.5 text-lg outline-none transition-all uppercase shadow-sm ${editingVehicle
                            ? 'bg-slate-50 border-slate-200 text-slate-500 cursor-not-allowed font-mono'
                            : 'border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 font-mono text-gray-900 tracking-wider'
                            }`}
                        placeholder="e.g. ABC-1234"
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-lg font-bold text-gray-700 mb-2">Capacity (lbs)</label>
                        <input
                            type="number"
                            name="maxCapacity"
                            value={formData.maxCapacity}
                            onChange={handleChange}
                            className="w-full rounded-xl border-gray-200 border px-5 py-3.5 text-lg placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm font-mono"
                            placeholder="e.g. 5000"
                            min="1"
                        />
                    </div>
                    <div>
                        <label className="block text-lg font-bold text-gray-700 mb-2">Odometer (mi)</label>
                        <input
                            type="number"
                            name="odometer"
                            value={formData.odometer}
                            onChange={handleChange}
                            className="w-full rounded-xl border-gray-200 border px-5 py-3.5 text-lg placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all shadow-sm font-mono"
                            placeholder="e.g. 12000"
                            min="0"
                        />
                    </div>
                </div>

                <div className="pt-5 flex flex-col sm:flex-row gap-4">
                    <button
                        type="submit"
                        className={`flex-1 text-white font-bold text-xl py-4 px-6 rounded-xl shadow-md hover:shadow-lg transition-all focus:ring-4 outline-none ${editingVehicle
                            ? 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-200 border border-amber-500'
                            : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-200 border border-blue-500'
                            }`}
                    >
                        {editingVehicle ? 'Update Vehicle Details' : 'Add Vehicle to System'}
                    </button>

                    {editingVehicle && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="bg-white hover:bg-gray-50 text-gray-700 font-bold text-lg py-4 px-8 rounded-xl transition-colors border-2 border-gray-200 shadow-sm"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
