import React, { useState, useEffect } from 'react';
import { Search, Filter, ArrowUpDown } from 'lucide-react';
import { generateDriverData } from '../../data/analyticsMock';

export default function DriverList({ onDriverSelect }) {
    const [drivers, setDrivers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Simulate fetch
        setTimeout(() => {
            setDrivers(generateDriverData());
        }, 300);
    }, []);

    const filteredDrivers = drivers.filter(d =>
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.license.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header & Controls */}
            <div className="fleet-card p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Driver Performance & Safety Profiles</h2>
                        <p className="text-sm text-gray-500 mt-1">Manage and monitor your fleet personnel</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name or license..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                            Group by
                        </button>
                        <button className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                            <Filter className="w-3.5 h-3.5" /> Filter
                        </button>
                        <button className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                            <ArrowUpDown className="w-3.5 h-3.5" /> Sort by...
                        </button>
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl relative z-10">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Driver Name</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">License#</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Completion Rate</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Safety Score</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Complaints</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {filteredDrivers.map((driver) => (
                                <tr
                                    key={driver.id}
                                    onClick={() => onDriverSelect(driver.id)}
                                    className="hover:bg-primary-50/50 transition-colors cursor-pointer group"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs ring-2 ring-white">
                                                {driver.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{driver.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{driver.license}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{driver.expiry}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">{driver.completionRate}%</span>
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${driver.completionRate}%` }}></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900">{driver.safetyScore}%</span>
                                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${driver.safetyScore >= 90 ? 'bg-emerald-500' : driver.safetyScore >= 80 ? 'bg-amber-500' : 'bg-red-500'}`}
                                                    style={{ width: `${driver.safetyScore}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-center">
                                        <span className={`inline-flex items-center justify-center min-w-[2rem] px-2 py-1 text-xs font-bold rounded-md ${driver.complaints === 0 ? 'bg-emerald-50 text-emerald-700' :
                                            driver.complaints <= 2 ? 'bg-amber-50 text-amber-700' :
                                                'bg-red-50 text-red-700'
                                            }`}>
                                            {driver.complaints}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filteredDrivers.length === 0 && (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            No drivers found matching your search.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
