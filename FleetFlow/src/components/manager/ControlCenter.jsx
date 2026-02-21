import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity, Users, Ship, DollarSign, List,
    AlertCircle, TrendingUp, ArrowRight, ShieldCheck,
    Navigation, Inbox, LayoutDashboard, PieChart
} from 'lucide-react';
import { KPICard, StatusPill } from '../common/DashboardWidgets';
import {
    mockVehicles, mockDrivers, mockTrips,
    expenseDataStore
} from '../../data/analyticsMock';

const ControlCenter = () => {
    const navigate = useNavigate();

    // Compute Global KPIs
    const stats = useMemo(() => {
        const totalDrivers = mockDrivers.length;
        const availableDrivers = mockDrivers.filter(d => d.status === 'On Duty').length;
        const totalVehicles = mockVehicles.length;
        const onTripVehicles = mockVehicles.filter(v => v.status === 'On Trip').length;
        const totalExpenses = expenseDataStore.reduce((sum, e) => sum + e.fuelCost + e.miscExpense, 0);
        const pendingDispatches = mockTrips.filter(t => t.status === 'Draft').length;

        return {
            drivers: { value: totalDrivers, available: availableDrivers, pct: Math.round((availableDrivers / totalDrivers) * 100) },
            fleet: { value: totalVehicles, active: onTripVehicles, pct: Math.round((onTripVehicles / totalVehicles) * 100) },
            spend: { value: `₹${(totalExpenses / 1000).toFixed(1)}k`, label: 'MTD Opex' },
            trips: { value: pendingDispatches, label: 'Pending Dispatch' }
        };
    }, []);

    const modules = [
        { id: 'drivers', label: 'Driver Operations', path: '/drivers', icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-50', count: mockDrivers.length },
        { id: 'dispatch', label: 'Global Dispatch', path: '/dispatch', icon: LayoutDashboard, color: 'text-emerald-600', bg: 'bg-emerald-50', count: mockTrips.length },
        { id: 'analytics', label: 'Financial Intel', path: '/analytics', icon: PieChart, color: 'text-blue-600', bg: 'bg-blue-50', count: 'Active' },
        { id: 'expenses', label: 'Fuel & Logistics', path: '/expenses', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50', count: expenseDataStore.length },
        { id: 'maintenance', label: 'Maintenance Hub', path: '/maintenance', icon: Activity, color: 'text-rose-600', bg: 'bg-rose-50', count: 'Managed' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Control Center</h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1 ml-0.5">Global Fleet Command & Intelligence</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right mr-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">System Status</p>
                        <p className="text-xs font-bold text-emerald-600 flex items-center justify-end gap-1.5 uppercase tracking-tighter">
                            <ShieldCheck className="w-3.5 h-3.5" /> All Terminals Active
                        </p>
                    </div>
                    <button className="btn-premium px-6 py-3 rounded-xl flex items-center gap-2 text-sm font-black uppercase tracking-widest">
                        <Navigation className="w-4 h-4" /> Global Map
                    </button>
                </div>
            </div>

            {/* Global KPI Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Fleet Utilization"
                    value={`${stats.fleet.pct}%`}
                    icon={Ship}
                    trend="up"
                    trendValue={4.2}
                />
                <KPICard
                    title="Driver Availability"
                    value={`${stats.drivers.available}/${stats.drivers.value}`}
                    icon={Users}
                    colorClass="bg-indigo-50 text-indigo-600"
                />
                <KPICard
                    title="Pending Ops (Draft)"
                    value={stats.trips.value}
                    icon={Inbox}
                    colorClass="bg-amber-50 text-amber-600"
                />
                <KPICard
                    title="Monthly Logistics Spend"
                    value={stats.spend.value}
                    icon={DollarSign}
                    colorClass="bg-emerald-50 text-emerald-600"
                    trend="down"
                    trendValue={1.8}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Module Quick Access */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                            <Activity className="w-5 h-5 text-primary-600" /> Operational Matrix
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {modules.map((mod) => (
                            <button
                                key={mod.id}
                                onClick={() => navigate(mod.path)}
                                className="fleet-card p-6 flex items-center justify-between group cursor-pointer hover:border-primary-500 transition-all border-l-4 border-l-transparent hover:border-l-primary-500"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-2xl ${mod.bg} ${mod.color} group-hover:scale-110 transition-transform shadow-sm`}>
                                        <mod.icon className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-black text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-tight">{mod.label}</h4>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">{mod.count} Indicators</p>
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                            </button>
                        ))}
                    </div>

                    {/* Active Alerts */}
                    <div className="fleet-card overflow-hidden">
                        <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                <AlertCircle className="w-4 h-4 text-red-500" /> Critical Terminal Alerts
                            </h3>
                            <button className="text-[10px] font-black text-primary-600 uppercase tracking-widest hover:underline">View All</button>
                        </div>
                        <div className="divide-y divide-slate-50">
                            <div className="p-4 flex items-center justify-between hover:bg-red-50/30 transition-colors">
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">License Expiry: Mike Johnson</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Renewal Required in 24h</p>
                                    </div>
                                </div>
                                <button className="btn-secondary-outline text-[10px] py-1">Manage</button>
                            </div>
                            <div className="p-4 flex items-center justify-between hover:bg-amber-50/30 transition-colors">
                                <div className="flex gap-4">
                                    <div className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0"></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900">High Fuel Variance Detected</p>
                                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-widest mt-0.5">Terminal T1 • Scania R500</p>
                                    </div>
                                </div>
                                <button className="btn-secondary-outline text-[10px] py-1">Inspect</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Live Telemetry Feed (Mock) */}
                <div className="space-y-6">
                    <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary-600" /> Live Manifest
                    </h2>
                    <div className="fleet-card p-0 overflow-hidden bg-slate-900 border-slate-800">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Operations</p>
                            <StatusPill status="On Trip" />
                        </div>
                        <div className="p-4 space-y-4 max-h-[480px] overflow-auto custom-scrollbar">
                            {mockTrips.map((trip, idx) => (
                                <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                            <Ship className="w-3.5 h-3.5 text-blue-400" />
                                            <p className="text-xs font-black text-white uppercase tracking-wider">{trip.id}</p>
                                        </div>
                                        <StatusPill status={trip.status} />
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                                            <span className="text-slate-500">Route</span>
                                            <span className="text-slate-300">{trip.origin} &rarr; {trip.destination}</span>
                                        </div>
                                        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                            <div
                                                className="bg-primary-500 h-full rounded-full transition-all duration-1000"
                                                style={{ width: trip.status === 'Completed' ? '100%' : '65%' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ControlCenter;
