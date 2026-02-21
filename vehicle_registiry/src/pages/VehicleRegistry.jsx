import React, { useState, useEffect } from 'react';
import VehicleForm from '../components/VehicleForm';
import VehicleTable from '../components/VehicleTable';

const INITIAL_MOCK_DATA = [
    { id: '1', nameModel: 'Ford Transit Van', licensePlate: 'ABC-1234', maxCapacity: 3500, odometer: 45000, status: 'Available' },
    { id: '2', nameModel: 'Volvo VNL Truck', licensePlate: 'LMN-4567', maxCapacity: 15000, odometer: 210000, status: 'Available' },
    { id: '3', nameModel: 'Peterbilt 579', licensePlate: 'GHI-7890', maxCapacity: 18000, odometer: 450000, status: 'Retired' }
];

export default function VehicleRegistry() {
    const [vehicles, setVehicles] = useState(() => {
        const saved = localStorage.getItem('fleetFlow_vehicles');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse vehicles from local storage');
            }
        }
        return INITIAL_MOCK_DATA;
    });

    const [editingVehicle, setEditingVehicle] = useState(null);

    useEffect(() => {
        localStorage.setItem('fleetFlow_vehicles', JSON.stringify(vehicles));
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
                            <div className="h-10 w-10 bg-indigo-600 rounded-xl shadow border border-indigo-700 flex items-center justify-center text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.4-1.7-1-2.2l-3.3-2.5a4 4 0 0 0-2.4-.8H13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v10c0 .6.4 1 1 1h2" /><circle cx="7" cy="17" r="2" /><circle cx="17" cy="17" r="2" /></svg>
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
                        <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-emerald-200 transition-colors">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">Active Fleet</p>
                            <h3 className="text-2xl font-black text-emerald-600 tracking-tight">{activeVehicles.length}</h3>
                        </div>
                        <div className="h-12 w-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 group-hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><path d="m9 11 3 3L22 4" /></svg>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center justify-between group hover:border-amber-200 transition-colors">
                        <div>
                            <p className="text-sm font-semibold text-slate-500 mb-1">Retired</p>
                            <h3 className="text-2xl font-black text-amber-600 tracking-tight">{retiredVehicles.length}</h3>
                        </div>
                        <div className="h-12 w-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /><path d="m9 16 3-3 3 3" /></svg>
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
                        <div className="h-12 w-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7h-3a2 2 0 0 1-2-2V2" /><path d="M9 18a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h7l4 4v10a2 2 0 0 1-2 2Z" /><path d="M3 15h6" /><path d="M3 18h6" /></svg>
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
