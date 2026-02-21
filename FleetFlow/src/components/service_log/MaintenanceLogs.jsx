import React, { useMemo } from 'react';
import { useFleet } from '../../context/FleetContext';
import ServiceForm from './ServiceForm';
import ServiceTable from './ServiceTable';
import { ShieldAlert, FileCode2, CheckCircle, CircleDollarSign, Activity } from 'lucide-react';

const MaintenanceLogs = () => {
    const { vehicles, serviceLogs } = useFleet();

    const metrics = useMemo(() => {
        return {
            vehiclesInShop: vehicles.filter(v => v.status === 'In Shop' || v.status === 'Maintenance').length,
            openJobs: serviceLogs.filter(log => log.status === 'Open').length,
            completedJobs: serviceLogs.filter(log => log.status === 'Completed').length,
            totalCost: serviceLogs
                .filter(log => log.status === 'Completed')
                .reduce((sum, current) => sum + current.cost, 0)
        };
    }, [vehicles, serviceLogs]);

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-none">Management & Service Logs</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-2 ml-0.5">Asset Technical Lifecycle & Maintenance Records</p>
                </div>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="fleet-card p-6 flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Vehicles in Shop</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">{metrics.vehiclesInShop}</h3>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:scale-110 transition-transform">
                        <ShieldAlert size={24} />
                    </div>
                </div>

                <div className="fleet-card p-6 flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Job Tickets</p>
                        <h3 className="text-3xl font-black text-indigo-600 tracking-tight">{metrics.openJobs}</h3>
                    </div>
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:scale-110 transition-transform">
                        <FileCode2 size={24} />
                    </div>
                </div>

                <div className="fleet-card p-6 flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Completed Cycles</p>
                        <h3 className="text-3xl font-black text-emerald-600 tracking-tight">{metrics.completedJobs}</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:scale-110 transition-transform">
                        <CheckCircle size={24} />
                    </div>
                </div>

                <div className="fleet-card p-6 flex items-center justify-between group">
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Gross Maint. Spend</p>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                            ₹{(metrics.totalCost / 1000).toFixed(1)}k
                        </h3>
                    </div>
                    <div className="p-3 bg-slate-100 text-slate-600 rounded-xl group-hover:scale-110 transition-transform">
                        <CircleDollarSign size={24} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-12">
                <div className="w-full">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                        <FileCode2 className="w-5 h-5 text-primary-600" /> Technical Log Entry
                    </h2>
                    <ServiceForm />
                </div>
                <div className="w-full">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-6 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-primary-600" /> Historical Audit Trail
                    </h2>
                    <ServiceTable />
                </div>
            </div>
        </div>
    );
};

export default MaintenanceLogs;
