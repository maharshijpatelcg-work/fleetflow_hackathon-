import React from 'react';
import { useFleet } from '../context/FleetContext';
import ServiceRow from './ServiceRow';
import { FileText } from 'lucide-react';

const ServiceTable = () => {
    const { serviceLogs } = useFleet();

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden relative">
            <div className="flex items-center gap-2 p-6 border-b pb-4 bg-gray-50/30">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <FileText size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Maintenance & Service Logs</h2>
            </div>

            <div className="overflow-x-auto w-full">
                <table className="w-full text-left min-w-[800px]">
                    <thead className="bg-gray-50 text-gray-500 uppercase text-[11px] font-bold tracking-wider border-b">
                        <tr>
                            <th className="px-6 py-4 rounded-tl-lg">Vehicle</th>
                            <th className="px-6 py-4">Service Type</th>
                            <th className="px-6 py-4">Category</th>
                            <th className="px-6 py-4">Cost</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4">Date Details</th>
                            <th className="px-6 py-4 rounded-tr-lg text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {serviceLogs.length > 0 ? (
                            serviceLogs.map((log) => (
                                <ServiceRow key={log.id} log={log} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-6 py-10 text-center text-gray-500 italic">
                                    No service logs available.
                                    <div className="text-sm mt-1 text-gray-400 font-normal">Create one to see it listed here.</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ServiceTable;
