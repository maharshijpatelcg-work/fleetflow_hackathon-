import React from 'react';
import { useFleet } from '../../context/FleetContext';
import StatusBadge from './StatusBadge';
import { CheckCircle2 } from 'lucide-react';

const ServiceRow = ({ log }) => {
    const { vehicles, completeService } = useFleet();
    const vehicle = vehicles.find(v => v.id === log.vehicleId);

    const isCompleted = log.status === 'Completed';

    const handleComplete = () => {
        if (!isCompleted) {
            completeService(log.id, log.vehicleId);
        }
    };

    return (
        <tr className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0 group">
            <td className="px-8 py-6">
                <div className="flex flex-col">
                    <span className="text-bold-dark">{vehicle?.nameModel || 'Unknown Asset'}</span>
                    <span className="text-muted-small">{vehicle?.licensePlate || vehicle?.PlateNumber || 'N/A'}</span>
                </div>
            </td>
            <td className="px-8 py-6">
                <span className="text-bold-dark">{log.serviceType}</span>
                <span className="text-muted-small truncate max-w-[200px]">{log.description}</span>
            </td>
            <td className="px-8 py-6">
                <StatusBadge status={log.category} />
            </td>
            <td className="px-8 py-6">
                <span className="text-bold-dark">₹{log.cost.toLocaleString()}</span>
            </td>
            <td className="px-8 py-6">
                <StatusBadge status={log.status} />
            </td>
            <td className="px-8 py-6">
                <div className="text-bold-dark text-[13px]">{log.dateCreated}</div>
                {log.dateCompleted && (
                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1 flex items-center gap-1">
                        <CheckCircle2 size={10} /> {log.dateCompleted}
                    </div>
                )}
            </td>
            <td className="px-8 py-6 text-right">
                <button
                    onClick={handleComplete}
                    disabled={isCompleted}
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ml-auto ${isCompleted
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100'}`}
                >
                    <CheckCircle2 size={14} className={!isCompleted ? 'group-hover:scale-110 transition-transform' : ''} />
                    {isCompleted ? 'Finalized' : 'Authorize Completion'}
                </button>
            </td>
        </tr>
    );
};

export default ServiceRow;
