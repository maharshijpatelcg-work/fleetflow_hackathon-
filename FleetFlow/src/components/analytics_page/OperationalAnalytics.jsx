import React, { useState, useMemo, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowUpRight, TrendingUp, TrendingDown, Activity, DollarSign, Download, Filter, Car, AlertTriangle, Info, Clock, CheckCircle, Wrench, ShieldAlert } from 'lucide-react';
import {
    generateFinancialData,
    generateEfficiencyData,
    generateVehicleData,
    calculateROI,
    calculateUtilization,
    identifyDeadStock,
    generateActivityFeed,
    generateAiInsights,
    getExpenses,
    subscribeToExpenses
} from '../../data/analyticsMock';

const AdvancedKPICard = ({ title, value, change, changeType, icon: Icon, sparklineData, dataKey, sparklineColor, tooltip }) => (
    <div className="fleet-card p-5 flex flex-col group cursor-default relative overflow-hidden">
        <div className="flex justify-between items-start mb-2 relative z-10">
            <div className="flex items-center gap-2">
                <div className="p-2.5 bg-primary-50 rounded-xl group-hover:bg-primary-100 transition-colors duration-300">
                    <Icon className="w-5 h-5 text-primary-600" />
                </div>
                <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                    {title}
                    <div className="group/tooltip relative">
                        <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:block w-48 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-xl z-50 text-center">
                            {tooltip}
                        </div>
                    </div>
                </h3>
            </div>
            <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-md shadow-sm border ${changeType === 'positive' ? 'bg-success-500/10 text-success-500 border-success-500/20' : 'bg-danger-500/10 text-danger-500 border-danger-500/20'}`}>
                {changeType === 'positive' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {change}
            </span>
        </div>
        <div className="flex justify-between items-end relative z-10">
            <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{value}</p>
        </div>
        {sparklineData && (
            <div className="absolute bottom-0 left-0 w-full h-16 opacity-30 group-hover:opacity-50 transition-opacity">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sparklineData.map((val, i) => ({ [dataKey]: val, index: i }))}>
                        <defs>
                            <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={sparklineColor} stopOpacity={0.8} />
                                <stop offset="95%" stopColor={sparklineColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey={dataKey} stroke={sparklineColor} fillOpacity={1} fill={`url(#gradient-${dataKey})`} strokeWidth={2} isAnimationActive={true} />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        )}
    </div>
);

export default function OperationalAnalytics({ onNavigateToDrivers }) {
    const [financialData, setFinancialData] = useState([]);
    const [efficiencyData, setEfficiencyData] = useState([]);
    const [vehicleData, setVehicleData] = useState([]);
    const [activityFeed, setActivityFeed] = useState([]);
    const [aiInsights, setAiInsights] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30D');

    useEffect(() => {
        setExpenses(getExpenses());
        const unsubscribe = subscribeToExpenses(setExpenses);
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        // Simulate API fetch
        setIsLoading(true);
        setTimeout(() => {
            setFinancialData(generateFinancialData());
            setEfficiencyData(generateEfficiencyData());
            setVehicleData(generateVehicleData());
            setActivityFeed(generateActivityFeed());
            setAiInsights(generateAiInsights());
            setIsLoading(false);
        }, 800);
    }, [dateRange]);

    const metrics = useMemo(() => {
        if (!financialData.length || !vehicleData.length) return null;

        const currentMonth = { ...financialData[financialData.length - 1] };
        const prevMonth = financialData[financialData.length - 2];

        // Add live expenses to the current month's baseline
        const liveFuelCost = expenses.reduce((sum, exp) => sum + exp.fuelCost, 0);
        const liveMiscCost = expenses.reduce((sum, exp) => sum + exp.miscExpense, 0);

        currentMonth.fuelCost += liveFuelCost;
        currentMonth.maintenance += liveMiscCost;
        currentMonth.revenue -= (liveFuelCost + liveMiscCost); // Adjust net logically for demo
        currentMonth.netProfit = currentMonth.revenue - currentMonth.fuelCost - currentMonth.maintenance;

        const totalRevenue = currentMonth.revenue;
        const totalCosts = currentMonth.fuelCost + currentMonth.maintenance;

        const prevRevenue = prevMonth.revenue;
        const prevCosts = prevMonth.fuelCost + prevMonth.maintenance;

        const currentROI = calculateROI(totalRevenue, totalCosts);
        const prevROI = calculateROI(prevRevenue, prevCosts);
        const roiChange = (currentROI - prevROI).toFixed(1);

        const utilization = calculateUtilization(vehicleData);

        const activeVehicles = vehicleData.filter(v => v.status === 'Active').length;
        const idleVehicles = vehicleData.filter(v => v.status === 'Idle').length;

        // Cost per km calculation (Simulation)
        const totalMiles = vehicleData.reduce((acc, v) => acc + v.milesDriven, 0);
        const costPerKm = totalMiles ? (currentMonth.fuelCost / totalMiles).toFixed(2) : 0;

        const distributionData = [
            { name: 'Active', value: activeVehicles },
            { name: 'On Maintenance', value: vehicleData.filter(v => v.status === 'Maintenance').length },
            { name: 'Idle', value: idleVehicles }
        ].filter(item => item.value > 0);

        return {
            totalRevenueVal: `Rs. ${(totalRevenue / 100000).toFixed(1)}L`,
            revenueChange: `${((totalRevenue - prevRevenue) / prevRevenue * 100).toFixed(1)}%`,
            totalFuelCost: `Rs. ${(currentMonth.fuelCost / 100000).toFixed(1)}L`,
            fuelCostChange: `${((currentMonth.fuelCost - prevMonth.fuelCost) / prevMonth.fuelCost * 100).toFixed(1)}%`,
            fleetROI: `+${currentROI}%`,
            roiChange: `${roiChange}%`,
            utilizationRate: `${utilization}%`,
            utilizationChange: '+2.5%',
            costPerKm: `Rs. ${costPerKm}`,
            costPerKmChange: '-1.2%',
            activeVehicles,
            idleVehicles,
            distributionData,
            revenueSparklines: currentMonth.sparklineRevenue,
            fuelSparklines: currentMonth.sparklineFuel,
            adjustedFinancialData: [
                ...financialData.slice(0, financialData.length - 1),
                currentMonth
            ]
        };
    }, [financialData, vehicleData, expenses]);

    const deadStock = identifyDeadStock(vehicleData);
    const formatCurrency = (value) => `Rs. ${(value / 100000).toFixed(1)}L`;

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px]">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-500 font-medium">Loading Enterprise Data...</p>
            </div>
        );
    }

    const InsightIcon = ({ type }) => {
        if (type === 'negative') return <TrendingDown className="w-5 h-5 text-red-500" />;
        if (type === 'warning') return <AlertTriangle className="w-5 h-5 text-amber-500" />;
        if (type === 'info') return <Info className="w-5 h-5 text-blue-500" />;
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
    };

    const ActivityIcon = ({ type }) => {
        if (type === 'maintenance') return <Wrench className="w-4 h-4 text-blue-600" />;
        if (type === 'alert') return <ShieldAlert className="w-4 h-4 text-amber-600" />;
        if (type === 'compliance') return <AlertTriangle className="w-4 h-4 text-red-600" />;
        return <CheckCircle className="w-4 h-4 text-emerald-600" />;
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header Actions */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-2">
                <div>
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Enterprise Analytics</h2>
                    <p className="text-sm text-gray-500 mt-1">Real-time data telemetry and financial modeling for your fleet.</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    {/* Date Range Chips */}
                    <div className="p-1 bg-white border border-gray-200 rounded-xl flex shadow-sm">
                        {['7D', '30D', '90D', 'YTD'].map(range => (
                            <button
                                key={range}
                                onClick={() => setDateRange(range)}
                                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-colors ${dateRange === range ? 'bg-primary-50 text-primary-700' : 'text-gray-500 hover:text-gray-900'}`}
                            >
                                {range}
                            </button>
                        ))}
                    </div>
                    <button className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        <Filter className="w-3.5 h-3.5" /> Filters
                    </button>
                    <button className="btn-premium inline-flex justify-center items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-white shadow-sm" onClick={() => alert('Exporting Enterprise Report')}>
                        <Download className="w-3.5 h-3.5" /> Export Data
                    </button>
                </div>
            </div>

            {/* KPI Grid - Dense Layout */}
            {metrics && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 xl:gap-6">
                    <AdvancedKPICard
                        title="Monthly Revenue"
                        value={metrics.totalRevenueVal}
                        change={metrics.revenueChange}
                        changeType={parseFloat(metrics.revenueChange) >= 0 ? 'positive' : 'negative'}
                        icon={DollarSign}
                        sparklineData={metrics.revenueSparklines}
                        dataKey="value"
                        sparklineColor="#3b82f6"
                        tooltip="Total revenue generated over the active date range."
                    />
                    <AdvancedKPICard
                        title="Fuel Expenses"
                        value={metrics.totalFuelCost}
                        change={metrics.fuelCostChange}
                        changeType={parseFloat(metrics.fuelCostChange) < 0 ? 'positive' : 'negative'}
                        icon={Activity}
                        sparklineData={metrics.fuelSparklines}
                        dataKey="value"
                        sparklineColor="#f59e0b"
                        tooltip="Consolidated fuel expense across all tracking cards."
                    />
                    <AdvancedKPICard
                        title="Cost Per Km"
                        value={metrics.costPerKm}
                        change={metrics.costPerKmChange}
                        changeType="positive"
                        icon={TrendingDown}
                        tooltip="Average operational cost per kilometer driven."
                    />
                    <AdvancedKPICard
                        title="Utilization Rate"
                        value={metrics.utilizationRate}
                        change={metrics.utilizationChange}
                        changeType="positive"
                        icon={Car}
                        tooltip="Percentage of active vehicles vs total fleet size."
                    />
                </div>
            )}

            {/* Middle Section: Insights & Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* AI Insights Panel */}
                <div className="fleet-card p-6 lg:col-span-2 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                                <span className="bg-primary-100 text-primary-700 px-2 py-0.5 rounded-md text-[10px] tracking-widest uppercase">AI Engine</span>
                                Automated Fleet Insights
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5">Machine learning driven observations from this period.</p>
                        </div>
                    </div>
                    <div className="space-y-4 flex-1">
                        {aiInsights.map(insight => (
                            <div key={insight.id} className="group relative overflow-hidden rounded-xl border border-gray-100 bg-gray-50/50 p-4 hover:bg-white hover:border-primary-100 transition-all hover:shadow-sm">
                                <div className="flex items-start gap-4">
                                    <div className="mt-1 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                                        <InsightIcon type={insight.type} />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-bold text-gray-900">{insight.title}</h4>
                                        <p className="text-xs text-gray-600 mt-1 pr-4">{insight.description}</p>
                                        <button className="text-[11px] font-bold text-primary-600 mt-2 hover:text-primary-800 transition-colors">
                                            {insight.actionText} &rarr;
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="fleet-card p-6 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Recent Activity</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Live operational events.</p>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="relative border-l border-gray-100 ml-3 space-y-6">
                            {activityFeed.map((activity, idx) => (
                                <div key={activity.id} className="relative pl-6">
                                    <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full flex items-center justify-center border-4 border-white shadow-sm ${activity.bgColor}`}>
                                        <ActivityIcon type={activity.type} />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-gray-900">{activity.title}</h4>
                                        <p className="text-[11px] text-gray-500 mt-0.5">{activity.description}</p>
                                        <span className="text-[10px] font-medium text-gray-400 mt-1 flex items-center gap-1">
                                            <Clock className="w-3 h-3" /> {activity.time}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <button className="w-full mt-4 py-2 border border-gray-200 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors">
                        View All Logs
                    </button>
                </div>
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 xl:gap-8 hover-effect">
                {/* Fuel Efficiency Trend */}
                <div className="fleet-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Fuel Efficiency Trend (km/L)</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Comparing fleet average against designated targets</p>
                        </div>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={efficiencyData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', padding: '10px 14px', fontSize: '12px', fontWeight: 600 }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} iconType="circle" />
                                <Line type="monotone" dataKey="fleetAvg" name="Fleet Average" stroke="url(#colorUv)" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6, strokeWidth: 0 }} />
                                <Line type="monotone" dataKey="target" name="Target" stroke="#cbd5e1" strokeWidth={2} strokeDasharray="6 6" dot={false} />
                                <defs>
                                    <linearGradient id="colorUv" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#3b82f6" />
                                        <stop offset="100%" stopColor="#60a5fa" />
                                    </linearGradient>
                                </defs>
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Revenue vs Costs */}
                <div className="fleet-card p-6">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Financial Distribution</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Monthly revenue vs expenses (Rs)</p>
                        </div>
                    </div>
                    <div className="h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={(metrics?.adjustedFinancialData || financialData).slice(-6)} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} tickFormatter={(val) => `${val / 100000}L`} />
                                <RechartsTooltip
                                    cursor={{ fill: '#f8fafc', opacity: 0.5 }}
                                    formatter={(value) => formatCurrency(value)}
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', padding: '10px 14px', fontSize: '12px', fontWeight: 600 }}
                                />
                                <Legend wrapperStyle={{ paddingTop: '16px', fontSize: '12px' }} iconType="circle" />
                                <Bar dataKey="revenue" name="Revenue" fill="#1e3a8a" radius={[4, 4, 0, 0]} maxBarSize={32} />
                                <Bar dataKey="fuelCost" name="Fuel Cost" fill="#f59e0b" radius={[4, 4, 0, 0]} stackId="costs" maxBarSize={32} />
                                <Bar dataKey="maintenance" name="Maintenance" fill="#94a3b8" radius={[4, 4, 0, 0]} stackId="costs" maxBarSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Fleet Utilization Distribution */}
                <div className="fleet-card p-6 lg:col-span-2 relative">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-base font-bold text-gray-900">Fleet Allocation Status</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Current distribution of all tracked vehicles</p>
                        </div>
                        {onNavigateToDrivers && (
                            <button
                                onClick={onNavigateToDrivers}
                                className="text-xs font-bold bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800 px-3 py-1.5 rounded-lg border border-primary-100 transition-colors"
                            >
                                View Driver Roster
                            </button>
                        )}
                    </div>
                    <div className="h-[280px] flex items-center justify-center relative">
                        {/* Center Metric */}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-4">
                            <span className="text-3xl font-extrabold text-gray-900">{metrics?.activeVehicles}</span>
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Active</span>
                        </div>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={metrics?.distributionData || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={110}
                                    paddingAngle={4}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {(metrics?.distributionData || []).map((entry, index) => {
                                        const colors = {
                                            'Active': '#10b981',
                                            'On Maintenance': '#94a3b8',
                                            'Idle': '#f59e0b'
                                        };
                                        return <Cell key={`cell-${index}`} fill={colors[entry.name] || '#3b82f6'} />;
                                    })}
                                </Pie>
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)', padding: '10px 14px', fontSize: '12px', fontWeight: 600 }}
                                    formatter={(value, name) => [`${value} Vehicles`, name]}
                                />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: '10px', fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Financial Summary Table */}
            <div className="fleet-card overflow-hidden mt-6">
                <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Detailed Financial Register</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Line-item breakdown of revenue and expenditures</p>
                    </div>
                    <button className="text-xs font-bold text-primary-600 hover:text-primary-800 transition-colors">
                        View Full Ledger
                    </button>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-white">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Month</th>
                                <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Gross Revenue</th>
                                <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Fuel Expenditure</th>
                                <th scope="col" className="px-6 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Maintenance Cost</th>
                                <th scope="col" className="px-6 py-3 text-right text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">Net Margin</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {[...(metrics?.adjustedFinancialData || financialData)].reverse().map((row, index) => (
                                <tr key={index} className="hover:bg-primary-50/30 transition-colors group cursor-pointer">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{row.month}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{formatCurrency(row.revenue)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-amber-600 bg-amber-50/20 group-hover:bg-amber-50/50 transition-colors">{formatCurrency(row.fuelCost)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-500 bg-gray-50/50 group-hover:bg-gray-100/50 transition-colors">{formatCurrency(row.maintenance)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-success-600 text-right bg-success-50/10 group-hover:bg-success-50/30 transition-colors">
                                        {formatCurrency(row.netProfit)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
