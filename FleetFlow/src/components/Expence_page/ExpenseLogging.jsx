import React, { useState, useEffect } from 'react';
import { Search, Filter, Plus, FileText, CheckCircle, Clock } from 'lucide-react';
import { getExpenses, subscribeToExpenses, addExpense, generateDriverData } from '../../data/analyticsMock';

export default function ExpenseLogging() {
    const [expenses, setExpenses] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Form State
    const [tripId, setTripId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [distance, setDistance] = useState('');
    const [fuelCost, setFuelCost] = useState('');
    const [miscExpense, setMiscExpense] = useState('');

    useEffect(() => {
        // Load initial data
        setExpenses(getExpenses());
        setDrivers(generateDriverData());

        // Subscribe to store updates
        const unsubscribe = subscribeToExpenses((updatedExpenses) => {
            setExpenses(updatedExpenses);
        });

        return () => unsubscribe();
    }, []);

    const handleAddExpense = (e) => {
        e.preventDefault();

        if (!tripId || !driverId || !distance || !fuelCost) {
            alert('Please fill out all required fields.');
            return;
        }

        const newExpense = {
            tripId,
            driverId,
            distance: parseInt(distance),
            fuelCost: parseFloat(fuelCost),
            miscExpense: parseFloat(miscExpense) || 0,
            status: 'Pending'
        };

        addExpense(newExpense);

        // Reset form & close
        setTripId('');
        setDriverId('');
        setDistance('');
        setFuelCost('');
        setMiscExpense('');
        setIsModalOpen(false);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    const filteredExpenses = expenses.filter(exp => {
        const d = drivers.find(d => d.id === exp.driverId);
        const searchTarget = `${exp.tripId} ${d?.name || ''}`.toLowerCase();
        return searchTarget.includes(searchQuery.toLowerCase());
    });

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Completed': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
            case 'Approved': return 'bg-blue-50 text-blue-700 border-blue-200';
            case 'Pending': default: return 'bg-amber-50 text-amber-700 border-amber-200';
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            {/* Header & Controls */}
            <div className="fleet-card p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10">
                    <div>
                        <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                            <FileText className="w-6 h-6 text-primary-600" />
                            Expense & Fuel Logging
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">Track trip costs, fuel expenditure, and approvals</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search Trip ID or Driver..."
                                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button className="inline-flex justify-center items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                            <Filter className="w-3.5 h-3.5" /> Filter
                        </button>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-premium px-4 py-2 rounded-lg text-xs font-bold inline-flex justify-center items-center gap-2"
                        >
                            <Plus className="w-4 h-4" /> Add an Expense
                        </button>
                    </div>
                </div>

                {/* Data Table */}
                <div className="overflow-x-auto border border-gray-100 rounded-xl relative z-10">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/80">
                            <tr>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Trip ID</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Driver</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Distance</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Fuel Expense</th>
                                <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Misc. Expense</th>
                                <th scope="col" className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-50">
                            {filteredExpenses.map((exp) => {
                                const driver = drivers.find(d => d.id === exp.driverId);
                                return (
                                    <tr key={exp.id} className="hover:bg-primary-50/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                                            #{exp.tripId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center gap-3">
                                                <div className="h-7 w-7 rounded-md bg-primary-100 flex items-center justify-center text-primary-700 font-bold text-xs">
                                                    {driver?.name?.charAt(0) || '?'}
                                                </div>
                                                <span className="text-sm font-semibold text-gray-700">{driver?.name || 'Unknown'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-600">{exp.distance} km</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-amber-600 bg-amber-50/20">{formatCurrency(exp.fuelCost)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-500 bg-gray-50/50">{formatCurrency(exp.miscExpense)}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center">
                                            <span className={`inline-flex items-center justify-center gap-1.5 min-w-[6rem] px-2.5 py-1 text-xs font-bold rounded-md border ${getStatusStyle(exp.status)}`}>
                                                {exp.status === 'Completed' && <CheckCircle className="w-3.5 h-3.5" />}
                                                {exp.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                                                {exp.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    {filteredExpenses.length === 0 && (
                        <div className="p-12 text-center flex flex-col items-center">
                            <FileText className="w-12 h-12 text-gray-300 mb-3" />
                            <p className="text-gray-500 text-sm font-medium">No expense records found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Floating Modal for Add Expense */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in slide-in-from-bottom-8 duration-300">
                        <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
                            <h3 className="text-lg font-bold text-gray-900">New Expense Log</h3>
                            <p className="text-xs text-gray-500 mt-1">Record a new trip financial entry</p>
                        </div>
                        <form onSubmit={handleAddExpense} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5 max-w-[200px]">Trip ID</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                                    value={tripId}
                                    onChange={e => setTripId(e.target.value)}
                                    placeholder="e.g. 321"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Driver</label>
                                <select
                                    required
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
                                    value={driverId}
                                    onChange={e => setDriverId(e.target.value)}
                                >
                                    <option value="" disabled>Select Driver...</option>
                                    {drivers.map(d => (
                                        <option key={d.id} value={d.id}>{d.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Distance (km)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-shadow"
                                        value={distance}
                                        onChange={e => setDistance(e.target.value)}
                                        placeholder="1000"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Fuel Cost (₹)</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-shadow"
                                        value={fuelCost}
                                        onChange={e => setFuelCost(e.target.value)}
                                        placeholder="19000"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">Misc. Expense (₹)</label>
                                <input
                                    type="number"
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 transition-shadow mb-4"
                                    value={miscExpense}
                                    onChange={e => setMiscExpense(e.target.value)}
                                    placeholder="Optional"
                                />
                            </div>

                            <div className="flex gap-3 pt-2 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 btn-premium px-4 py-2 rounded-lg text-sm font-bold shadow-md"
                                >
                                    Create Log
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
