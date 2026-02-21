import React from 'react';
import { Truck, Pencil, RefreshCcw, Slash, Inbox } from 'lucide-react';
import StatusBadge from './StatusBadge';

export default function VehicleTable({ vehicles, onEdit, onToggleRetire }) {
    if (vehicles.length === 0) {
        return (
            <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center flex flex-col items-center justify-center">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                    <Inbox className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Assets Active</h3>
                <p className="text-gray-500">Your vehicle registry is empty. Start by adding a new vehicle to track capacity.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-slate-50 border-b border-gray-100">
                        <tr>
                            <th scope="col" className="px-8 py-6 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">Vehicle Details</th>
                            <th scope="col" className="px-8 py-6 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">License Plate</th>
                            <th scope="col" className="px-8 py-6 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">Capacity</th>
                            <th scope="col" className="px-8 py-6 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">Odometer</th>
                            <th scope="col" className="px-8 py-6 text-left text-sm font-bold text-slate-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-8 py-6 text-right text-sm font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {vehicles.map((v) => {
                            const isRetired = v.status === 'Retired';
                            return (
                                <tr key={v.id} className={`${isRetired ? 'bg-slate-50/60' : 'hover:bg-slate-50'} transition-colors group`}>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center mr-4 ${isRetired ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-blue-600'}`}>
                                                <Truck className="w-5 h-5" />
                                            </div>
                                            <div className={`text-lg font-bold ${isRetired ? 'text-slate-500' : 'text-slate-900'}`}>{v.nameModel}</div>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <div className={`text-base font-mono tracking-wide px-3 py-1.5 rounded-lg inline-block ${isRetired ? 'bg-slate-200 text-slate-500' : 'bg-slate-100 text-slate-700'}`}>
                                            {v.licensePlate}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-base">
                                        <span className={`font-medium ${isRetired ? 'text-slate-400' : 'text-slate-700'}`}>
                                            {v.maxCapacity.toLocaleString()} <span className="text-sm text-slate-400 font-normal">lbs</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-base">
                                        <span className={`font-medium ${isRetired ? 'text-slate-400' : 'text-slate-700'}`}>
                                            {v.odometer.toLocaleString()} <span className="text-sm text-slate-400 font-normal">mi</span>
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap">
                                        <StatusBadge status={v.status} />
                                    </td>
                                    <td className="px-8 py-6 whitespace-nowrap text-right text-base font-medium">
                                        <div className="flex justify-end gap-3 items-center">
                                            <button
                                                onClick={() => onEdit(v)}
                                                disabled={isRetired}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-all ${isRetired
                                                    ? 'text-slate-300 cursor-not-allowed'
                                                    : 'text-blue-600 hover:bg-blue-50 hover:text-blue-800 opacity-0 group-hover:opacity-100 focus:opacity-100 font-bold'
                                                    }`}
                                                title="Edit Vehicle Specs"
                                            >
                                                <Pencil className="w-3.5 h-3.5" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onToggleRetire(v.id)}
                                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all border ${isRetired
                                                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300'
                                                    : 'bg-white text-rose-600 border-rose-200 hover:bg-rose-50 hover:border-rose-300 shadow-sm'
                                                    }`}
                                            >
                                                {isRetired ? (
                                                    <>
                                                        <RefreshCcw className="w-3.5 h-3.5" />
                                                        Restore
                                                    </>
                                                ) : (
                                                    <>
                                                        <Slash className="w-3.5 h-3.5 text-rose-400" />
                                                        Retire
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
