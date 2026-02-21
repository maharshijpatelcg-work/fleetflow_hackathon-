import React, { useState, useMemo, useEffect } from 'react';
import KpiCard from '../components/KpiCard';
import FilterBar from '../components/FilterBar';
import FleetTable from '../components/FleetTable';

const MOCK_VEHICLES = [
    { id: 'V001', name: 'Freightliner M2', plate: 'XYZ-1234', type: 'Truck', region: 'North', status: 'On Trip', capacity: '10,000 lbs', odometer: 125000 },
    { id: 'V002', name: 'Ford Transit', plate: 'ABC-9876', type: 'Van', region: 'South', status: 'Available', capacity: '3,500 lbs', odometer: 45000 },
    { id: 'V003', name: 'Volvo VNL', plate: 'LMN-4567', type: 'Truck', region: 'East', status: 'In Shop', capacity: '15,000 lbs', odometer: 210000 },
    { id: 'V004', name: 'Trek eBike', plate: 'N/A', type: 'Bike', region: 'West', status: 'Available', capacity: '50 lbs', odometer: 1200 },
    { id: 'V005', name: 'Mercedes Sprinter', plate: 'DEF-3456', type: 'Van', region: 'North', status: 'On Trip', capacity: '4,000 lbs', odometer: 32000 },
    { id: 'V006', name: 'Peterbilt 579', plate: 'GHI-7890', type: 'Truck', region: 'South', status: 'Retired', capacity: '18,000 lbs', odometer: 450000 },
    { id: 'V007', name: 'RadPower RadRunner', plate: 'N/A', type: 'Bike', region: 'East', status: 'On Trip', capacity: '60 lbs', odometer: 800 },
    { id: 'V008', name: 'Chevy Express', plate: 'JKL-1122', type: 'Van', region: 'West', status: 'In Shop', capacity: '3,000 lbs', odometer: 60000 },
    { id: 'V009', name: 'Kenworth T680', plate: 'MNO-3344', type: 'Truck', region: 'North', status: 'Available', capacity: '20,000 lbs', odometer: 85000 },
    { id: 'V010', name: 'Cargo Freighter 9000', plate: 'IMO-1234567', type: 'Ship', region: 'East', status: 'On Trip', capacity: '50,000 tons', odometer: 450000 },
];

const MOCK_TRIPS = [
    { id: 'T001', vehicleId: 'V001', destination: 'Chicago, IL', status: 'In Transit' },
    { id: 'T002', vehicleId: 'V005', destination: 'New York, NY', status: 'In Transit' },
    { id: 'T003', vehicleId: 'V007', destination: 'Boston, MA', status: 'In Transit' },
    { id: 'T004', vehicleId: null, destination: 'Miami, FL', status: 'Draft' },
    { id: 'T005', vehicleId: null, destination: 'Seattle, WA', status: 'Draft' },
    { id: 'T006', vehicleId: null, destination: 'Austin, TX', status: 'Draft' },
];

export default function CommandCenter() {
    const [filters, setFilters] = useState({
        type: 'All',
        status: 'All',
        region: 'All',
    });

    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    // Filter vehicles
    const filteredVehicles = useMemo(() => {
        return MOCK_VEHICLES.filter((v) => {
            const matchType = filters.type === 'All' || v.type === filters.type;
            const matchStatus = filters.status === 'All' || v.status === filters.status;
            const matchRegion = filters.region === 'All' || v.region === filters.region;
            return matchType && matchStatus && matchRegion;
        });
    }, [filters]);

    // Derived KPIs based on filtered vehicles and mock trips
    const activeFleetCount = filteredVehicles.filter(v => v.status === 'On Trip').length;
    const maintenanceAlertsCount = filteredVehicles.filter(v => v.status === 'In Shop').length;

    const nonRetiredVehicles = filteredVehicles.filter(v => v.status !== 'Retired');
    const utilizationRate = nonRetiredVehicles.length > 0
        ? ((activeFleetCount / nonRetiredVehicles.length) * 100).toFixed(1)
        : '0.0';

    const pendingCargoCount = MOCK_TRIPS.filter(t => t.status === 'Draft').length;

    return (
        <div className="min-h-screen bg-slate-50 font-sans p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Command Center</h1>
                        <p className="text-gray-500 mt-1">High-level real-time fleet oversight and indicators.</p>
                    </div>
                    <div className="mt-4 md:mt-0 flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100 text-sm font-medium text-gray-500">
                        <span className="relative flex h-3 w-3 mr-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        Last Updated: <span className="text-gray-900 ml-1 font-mono">{currentTime}</span>
                    </div>
                </header>

                {/* KPI Section */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <KpiCard
                        title="Active Fleet"
                        value={activeFleetCount}
                        bgClass="bg-blue-50"
                        iconColorClass="text-blue-600"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2" /><rect width="6" height="6" x="9" y="9" rx="1" /><path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" /><path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" /></svg>
                        }
                    />
                    <KpiCard
                        title="Maintenance Alerts"
                        value={maintenanceAlertsCount}
                        bgClass="bg-amber-50"
                        iconColorClass="text-amber-600"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15.4 15.4-2.8-2.8" /><path d="M20 9h-1a2 2 0 0 0-2-2V6a2 2 0 0 0-2-2h-1c-.55 0-1-.45-1-1V2a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1c0 .55-.45 1-1 1H5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1c.55 0 1 .45 1 1v1c0 .55-.45 1-1 1H5a2 2 0 0 0-2 2v1a2 2 0 0 0 2 2h1c.55 0 1 .45 1 1v1a2 2 0 0 0 2 2h1c.55 0 1-.45 1-1v-1a2 2 0 0 0 2-2h1a2 2 0 0 0 2-2v-1c0-.55.45-1 1-1h1a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2h-1c-.55 0-1-.45-1-1V9Z" /></svg>
                        }
                    />
                    <KpiCard
                        title="Utilization Rate"
                        value={`${utilizationRate}%`}
                        bgClass="bg-emerald-50"
                        iconColorClass="text-emerald-600"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" /><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
                        }
                    />
                    <KpiCard
                        title="Pending Cargo"
                        value={pendingCargoCount}
                        bgClass="bg-indigo-50"
                        iconColorClass="text-indigo-600"
                        icon={
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14" /><path d="M16.5 9.4 7.55 4.24" /><polyline points="3.29 7 12 12 20.71 7" /><line x1="12" x2="12" y1="22" y2="12" /><path d="m19 16-3 3 3 3" /><path d="m15 16 3 3-3 3" /></svg>
                        }
                    />
                </div>

                {/* Filters and Table Section */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">Fleet Overview</h2>
                    </div>
                    <FilterBar filters={filters} setFilters={setFilters} />
                    <FleetTable vehicles={filteredVehicles} />
                </section>
            </div>
        </div>
    );
}
