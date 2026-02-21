import React from 'react';
import { useFleet } from '../context/FleetContext';
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
        <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100 last:border-0 group">
            <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">{vehicle?.nameModel || 'Unknown Vehicle'}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{vehicle?.licensePlate || 'N/A'}</span>
                </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-medium">
                {log.serviceType}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={log.category} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-semibold">
                ${log.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={log.status} />
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                <div>{log.dateCreated}</div>
                {log.dateCompleted && (
                    <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
                        <CheckCircle2 size={12} />
                        Done {log.dateCompleted}
                    </div>
                )}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                <button
                    onClick={handleComplete}
                    disabled={isCompleted}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${isCompleted
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-sm border border-green-200'
                        }`}
                >
                    <CheckCircle2 size={16} />
                    {isCompleted ? 'Completed' : 'Mark Completed'}
                </button>
            </td>
        </tr>
    );
};

export default ServiceRow;
