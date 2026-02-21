import React from 'react';
import { useFleet } from '../../context/FleetContext';
import ServiceRow from './ServiceRow';
import { FileText } from 'lucide-react';

const ServiceTable = () => {
    const { serviceLogs } = useFleet();

    return (
        <div className="premium-table-container">
            <div className="overflow-x-auto w-full">
                <table className="premium-table">
                    <thead>
                        <tr>
                            <th>Operational Asset</th>
                            <th>Technical Context</th>
                            <th>Category</th>
                            <th>Opex Cost</th>
                            <th>Cycle Status</th>
                            <th>Audit Timeline</th>
                            <th className="text-right">Operational Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {serviceLogs.length > 0 ? (
                            serviceLogs.map((log) => (
                                <ServiceRow key={log.id} log={log} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan="7" className="px-8 py-20 text-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <div className="p-4 bg-slate-50 rounded-2xl text-slate-300">
                                            <FileText size={48} strokeWidth={1} />
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-slate-900 uppercase tracking-tight">No Service Records Detected</p>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Initialize a technical log entry to begin tracking</p>
                                        </div>
                                    </div>
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
