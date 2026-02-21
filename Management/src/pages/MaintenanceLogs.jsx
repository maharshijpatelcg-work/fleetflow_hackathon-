import React, { useMemo } from 'react';
import { useFleet } from '../context/FleetContext';
import ServiceForm from '../components/ServiceForm';
import ServiceTable from '../components/ServiceTable';
import { ShieldAlert, FileCode2, CheckCircle, CircleDollarSign } from 'lucide-react';

const MaintenanceLogs = () => {
    const { vehicles, serviceLogs } = useFleet();

    const metrics = useMemo(() => {
        return {
            vehiclesInShop: vehicles.filter(v => v.status === 'In Shop').length,
            openJobs: serviceLogs.filter(log => log.status === 'Open').length,
            completedJobs: serviceLogs.filter(log => log.status === 'Completed').length,
            totalCost: serviceLogs
                .filter(log => log.status === 'Completed')
                .reduce((sum, current) => sum + current.cost, 0)
        };
    }, [vehicles, serviceLogs]);

    return (
        <div className="max-w-[1400px] mx-auto p-4 sm:p-6 lg:p-8 space-y-8 animate-in fade-in duration-500 min-h-screen bg-slate-50/50">

            <div className="flex flex-col gap-3">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">Maintenance & Service Logs</h1>
                <p className="text-lg text-gray-500 font-medium">Track and manage fleet preventative and reactive maintenance.</p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">

                {/* Vehicles in Shop */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-base font-semibold text-gray-500 tracking-wide uppercase mb-1">Vehicles in Shop</p>
                        <h3 className="text-4xl font-black text-gray-800">{metrics.vehiclesInShop}</h3>
                    </div>
                    <div className="p-4 bg-yellow-50 text-yellow-500 rounded-xl group-hover:scale-110 transition-transform shadow-inner">
                        <ShieldAlert size={32} />
                    </div>
                </div>

                {/* Open Jobs */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-base font-semibold text-gray-500 tracking-wide uppercase mb-1">Open Jobs</p>
                        <h3 className="text-4xl font-black text-blue-600">{metrics.openJobs}</h3>
                    </div>
                    <div className="p-4 bg-blue-50 text-blue-500 rounded-xl group-hover:scale-110 transition-transform shadow-inner">
                        <FileCode2 size={32} />
                    </div>
                </div>

                {/* Completed Jobs */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-base font-semibold text-gray-500 tracking-wide uppercase mb-1">Completed Jobs</p>
                        <h3 className="text-4xl font-black text-green-600">{metrics.completedJobs}</h3>
                    </div>
                    <div className="p-4 bg-green-50 text-green-500 rounded-xl group-hover:scale-110 transition-transform shadow-inner">
                        <CheckCircle size={32} />
                    </div>
                </div>

                {/* Total Cost */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] p-6 border border-gray-100 flex items-center justify-between group hover:shadow-md transition-shadow">
                    <div>
                        <p className="text-base font-semibold text-gray-500 tracking-wide uppercase mb-1">Total Maint. Cost</p>
                        <h3 className="text-4xl font-black text-purple-600">
                            ${metrics.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h3>
                    </div>
                    <div className="p-4 bg-purple-50 text-purple-500 rounded-xl group-hover:scale-110 transition-transform shadow-inner">
                        <CircleDollarSign size={32} />
                    </div>
                </div>

            </div>

            <div className="flex flex-col gap-8">
                <div className="w-full">
                    <ServiceForm />
                </div>
                <div className="w-full">
                    <ServiceTable />
                </div>
            </div>
        </div>
    );
};

export default MaintenanceLogs;
