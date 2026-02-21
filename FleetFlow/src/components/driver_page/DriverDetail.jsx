import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, User, IdCard, ShieldAlert, Award, AlertTriangle, TrendingUp, Calendar, Clock, MapPin, CheckCircle, FileText, Ban } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { useParams, useNavigate } from 'react-router-dom';
import { generateDriverData, generateDriverHistory, getDriverExpenseStats, subscribeToExpenses } from '../../data/analyticsMock';

const DetailCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-start gap-4">
        <div className={`p-3 rounded-lg ${colorClass}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{title}</p>
            <h4 className="text-2xl font-extrabold text-gray-900 mt-1">{value}</h4>
            {subtitle && <p className="text-xs text-gray-400 mt-1 font-medium">{subtitle}</p>}
        </div>
    </div>
);

export default function DriverDetail({ driverId: propDriverId, onBack }) {
    const { id: urlDriverId } = useParams();
    const navigate = useNavigate();
    const driverId = propDriverId || urlDriverId;

    const [driver, setDriver] = useState(null);
    const [history, setHistory] = useState([]);
    const [expenseStats, setExpenseStats] = useState({ totalSpend: 0, avgPerTrip: 0, count: 0, trips: [] });
    const [isLoading, setIsLoading] = useState(true);

    const handleBack = () => {
        if (onBack) onBack();
        else navigate('/drivers');
    };

    useEffect(() => {
        setIsLoading(true);
        // Simulate fetch
        setTimeout(() => {
            const allDrivers = generateDriverData();
            const foundDriver = allDrivers.find(d => d.id === driverId);
            setDriver(foundDriver);
            setHistory(generateDriverHistory(driverId));

            // Set initial expense stats
            setExpenseStats(getDriverExpenseStats(driverId));

            setIsLoading(false);
        }, 400);

        // Subscribe to live expense updates
        const unsubscribe = subscribeToExpenses(() => {
            setExpenseStats(getDriverExpenseStats(driverId));
        });

        return () => unsubscribe();
    }, [driverId]);

    // Mock trend data for completion rate
    const trendData = useMemo(() => {
        if (!driver) return [];
        const baseRate = driver.completionRate;
        return Array.from({ length: 6 }, (_, i) => ({
            month: ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'][i],
            rate: Math.min(100, Math.max(0, baseRate + (Math.random() * 10 - 5)))
        }));
    }, [driver]);

    if (isLoading || !driver) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading Driver Profile...</p>
            </div>
        );
    }

    const { name, license, expiry, completionRate, safetyScore, complaints, status, assignedVehicle } = driver;
    const isLicenseExpiring = new Date(expiry) < new Date(new Date().setMonth(new Date().getMonth() + 2)); // Simple mock check

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header / Back Navigation */}
            <div className="flex items-center gap-4">
                <button
                    onClick={handleBack}
                    className="p-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 flex items-center gap-3">
                        Driver Profile: {name}
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${status === 'On Duty' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            status === 'Off Duty' ? 'bg-gray-100 text-gray-700 border-gray-300' :
                                'bg-red-50 text-red-700 border-red-200'
                            }`}>
                            {status}
                        </span>
                    </h2>
                </div>
            </div>

            {/* Top Overview Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Identity Card */}
                <div className="fleet-card p-6 lg:col-span-2 flex flex-col md:flex-row gap-6 items-start md:items-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>

                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shrink-0 border-4 border-white">
                        {name.charAt(0)}
                    </div>

                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 w-full z-10">
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Full Identity</p>
                            <p className="text-base font-bold text-gray-900 flex items-center gap-2"><User className="w-4 h-4 text-gray-400" /> {name}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">License No.</p>
                            <p className="text-base font-bold text-gray-900 font-mono">{license}</p>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">License Expiry</p>
                            <div className="flex items-center gap-2">
                                <p className={`text-base font-bold ${isLicenseExpiring ? 'text-amber-600' : 'text-gray-900'}`}>{expiry}</p>
                                {isLicenseExpiring && <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Renew Soon</span>}
                            </div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Current Assignment</p>
                            <p className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-gray-400" /> {assignedVehicle || 'Unassigned'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions Panel */}
                <div className="fleet-card p-6 border-l-4 border-l-primary-500">
                    <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">Fleet Admin Actions</h3>
                    <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 rounded-lg border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all font-semibold text-sm text-gray-700 flex items-center gap-3">
                            <FileText className="w-4 h-4 text-primary-600" /> View Internal Documents
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-amber-50 text-amber-700 hover:bg-amber-100 transition-all font-semibold text-sm border border-amber-200 flex items-center gap-3">
                            <AlertTriangle className="w-4 h-4" /> Issue Formal Warning
                        </button>
                        <button className="w-full text-left px-4 py-3 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition-all font-semibold text-sm border border-red-200 flex items-center gap-3">
                            <Ban className="w-4 h-4" /> Suspend Driver Credentials
                        </button>
                    </div>
                </div>
            </div>

            {/* Performance KPIs Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <DetailCard
                    title="Safety Score"
                    value={`${safetyScore}/100`}
                    icon={ShieldAlert}
                    colorClass={`bg-${safetyScore >= 90 ? 'emerald' : safetyScore >= 80 ? 'amber' : 'red'}-100 text-${safetyScore >= 90 ? 'emerald' : safetyScore >= 80 ? 'amber' : 'red'}-600`}
                    subtitle="Platform percentile: Top 15%"
                />
                <DetailCard
                    title="Completion Rate"
                    value={`${completionRate}%`}
                    icon={CheckCircle}
                    colorClass="bg-blue-100 text-blue-600"
                    subtitle="Last 30 days of assigned runs"
                />
                <DetailCard
                    title="Customer Complaints"
                    value={complaints}
                    icon={AlertTriangle}
                    colorClass={`bg-${complaints === 0 ? 'gray' : 'red'}-100 text-${complaints === 0 ? 'gray' : 'red'}-600`}
                    subtitle="Internal flags on record"
                />
            </div>

            {/* Financial Overview & Recent Expenses */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="fleet-card p-6 flex flex-col justify-center bg-gray-900 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full blur-3xl opacity-20 -z-0 translate-x-1/2 -translate-y-1/2"></div>
                    <h3 className="text-sm font-bold text-gray-400 mb-4 uppercase tracking-wider relative z-10">Financial Profile</h3>

                    <div className="space-y-4 relative z-10">
                        <div>
                            <p className="text-xs font-bold text-gray-500 mb-1">Total Fuel Spend</p>
                            <p className="text-3xl font-extrabold text-white">₹{expenseStats.totalSpend?.toLocaleString() || '0'}</p>
                        </div>
                        <div className="flex gap-8">
                            <div>
                                <p className="text-xs font-bold text-gray-500 mb-1">Avg. Cost / Trip</p>
                                <p className="text-lg font-bold text-gray-200">₹{expenseStats.avgPerTrip?.toLocaleString() || '0'}</p>
                            </div>
                            <div>
                                <p className="text-xs font-bold text-gray-500 mb-1">Trips Logged</p>
                                <p className="text-lg font-bold text-gray-200">{expenseStats.count}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="fleet-card p-6 lg:col-span-2 overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Recent Trip Expenses</h3>
                    </div>
                    {expenseStats.trips.length > 0 ? (
                        <div className="overflow-auto flex-1 custom-scrollbar">
                            <table className="min-w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500">
                                    <tr>
                                        <th className="px-4 py-2 text-left">Trip ID</th>
                                        <th className="px-4 py-2 text-left">Distance</th>
                                        <th className="px-4 py-2 text-right">Fuel Cost</th>
                                        <th className="px-4 py-2 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-50">
                                    {expenseStats.trips.slice(0, 4).map(trip => (
                                        <tr key={trip.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm font-bold text-gray-900">#{trip.tripId}</td>
                                            <td className="px-4 py-3 text-sm text-gray-600">{trip.distance} km</td>
                                            <td className="px-4 py-3 text-sm font-bold text-amber-600 text-right">₹{trip.fuelCost?.toLocaleString() || '0'}</td>
                                            <td className="px-4 py-3 text-sm text-center">
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${trip.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                                                    {trip.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
                            <p className="text-gray-400 text-sm font-medium">No recorded expenses for this driver yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Analytics & Feed Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Completion Rate Trend */}
                <div className="fleet-card p-6 lg:col-span-2">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Completion Rate Trend</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Historical route completion performance (%)</p>
                        </div>
                    </div>
                    <div className="h-[260px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                                <YAxis domain={[0, 100]} axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', fontWeight: 'bold' }}
                                    formatter={(value) => [`${value.toFixed(1)}%`, 'Completion Rate']}
                                />
                                <Area type="monotone" dataKey="rate" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRate)" activeDot={{ r: 6, strokeWidth: 0, fill: '#1e3a8a' }} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Driver Activity Feed */}
                <div className="fleet-card p-6 flex flex-col h-full bg-gray-50/30">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Driver Activity Log</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Automated telemetry & compliance events</p>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2">
                        <div className="relative border-l border-gray-200 ml-3 space-y-6">
                            {history.map((event) => (
                                <div key={event.id} className="relative pl-6">
                                    <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-white border-2 border-primary-500 shadow-sm"></div>
                                    <div className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:border-primary-200 transition-colors cursor-default">
                                        <div className="flex justify-between items-start mb-1">
                                            <h4 className={`text-xs font-bold ${event.iconColor}`}>{event.title}</h4>
                                            <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap ml-2 flex items-center gap-1">
                                                <Calendar className="w-3 h-3" /> {event.date}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-600 leading-snug">{event.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
