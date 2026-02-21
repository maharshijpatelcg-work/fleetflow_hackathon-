import React, { useState, useEffect } from 'react';
import { Truck, Database, CheckCircle2, Archive, Weight } from 'lucide-react';
import VehicleForm from './VehicleForm.jsx';
import VehicleTable from './VehicleTable.jsx';


import { mockVehicles } from '../../data/analyticsMock';

export default function VehicleRegistry() {
    const [vehicles, setVehicles] = useState(() => {
        const saved = localStorage.getItem('fleetFlow_v2_vehicles');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse vehicles from local storage');
            }
        }
        // Map mockVehicles to the local structure if needed
        return mockVehicles.map(v => ({
            id: v.id,
            nameModel: v.nameModel,
            licensePlate: v.PlateNumber || v.licensePlate,
            maxCapacity: v.maxCapacity,
            odometer: v.milesDriven,
            status: v.status === 'On Trip' ? 'In Shop' : v.status
        }));
    });

    const [editingVehicle, setEditingVehicle] = useState(null);

    useEffect(() => {
        localStorage.setItem('fleetFlow_v2_vehicles', JSON.stringify(vehicles));
    }, [vehicles]);

    const addVehicle = (newVehicle) => {
        setVehicles(prev => [...prev, newVehicle]);
    };

    const updateVehicle = (updatedVehicle) => {
        setVehicles(prev => prev.map(v => v.id === updatedVehicle.id ? updatedVehicle : v));
        setEditingVehicle(null);
    };

    const toggleRetire = (id) => {
        setVehicles(prev => prev.map(v => {
            if (v.id === id) {
                return { ...v, status: v.status === 'Available' ? 'Retired' : 'Available' };
            }
            return v;
        }));
        // Cancel edit state if a user retires the vehicle currently being edited
        if (editingVehicle && editingVehicle.id === id) {
            setEditingVehicle(null);
        }
    };

    const handleFormSubmit = (vehicleData) => {
        if (editingVehicle) {
            updateVehicle(vehicleData);
        } else {
            addVehicle(vehicleData);
        }
    };

    // Real-time calculations
    const activeVehicles = vehicles.filter(v => v.status === 'Available');
    const retiredVehicles = vehicles.filter(v => v.status === 'Retired');
    const totalCapacity = activeVehicles.reduce((sum, v) => sum + v.maxCapacity, 0);

    // Extract all uppercase plates for validation (ignore currently edited vehicle's plate)
    const existingPlates = vehicles.map(v => v.licensePlate.toUpperCase());

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-8 selection:bg-blue-100">
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="h-10 w-10 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 border border-indigo-500 flex items-center justify-center text-white">
                                <Truck className="w-5 h-5" />
                            </div>
                            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">Asset Management</h1>
                        </div>
                        <p className="text-slate-500 font-medium">Manage and register physical fleet vehicles, track capacities, and maintenance status.</p>
                    </div>
                </header>

                {/* Real-Time Summary Strip */}
                <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-slate-300 transition-colors">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">Total Registry</p>
                            <h3 className="text-2xl font-black text-slate-800 tracking-tight">{vehicles.length}</h3>
                        </div>
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:scale-110 transition-transform">
                            <Database className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-colors">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">Active Fleet</p>
                            <h3 className="text-2xl font-black text-emerald-600 tracking-tight">{activeVehicles.length}</h3>
                        </div>
                        <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-amber-200 transition-colors">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">Retired</p>
                            <h3 className="text-2xl font-black text-amber-600 tracking-tight">{retiredVehicles.length}</h3>
                        </div>
                        <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
                            <Archive className="w-6 h-6" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-indigo-200 transition-colors">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">Active Capacity</p>
                            <div className="flex items-baseline gap-1 mt-1">
                                <h3 className="text-2xl font-black text-indigo-600 tracking-tight">{totalCapacity.toLocaleString()}</h3>
                                <span className="text-sm font-bold text-indigo-400">lbs</span>
                            </div>
                        </div>
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                            <Weight className="w-6 h-6" />
                        </div>
                    </div>
                </section>

                {/* Main Interface Layout - Vertical Strategy */}
                <div className="flex flex-col gap-10">
                    <div className="w-full">
                        <VehicleForm
                            onSubmit={handleFormSubmit}
                            editingVehicle={editingVehicle}
                            onCancelEdit={() => setEditingVehicle(null)}
                            existingPlates={existingPlates}
                        />
                    </div>

                    <div className="w-full">
                        <VehicleTable
                            vehicles={vehicles}
                            onEdit={setEditingVehicle}
                            onToggleRetire={toggleRetire}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
