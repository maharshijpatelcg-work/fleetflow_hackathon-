import React from 'react';

const StatusBadge = ({ status }) => {
    const getBadgeStyle = (status) => {
        switch (status) {
            case 'Available':
            case 'Completed':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'On Trip':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'In Shop':
            case 'Open':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'Retired':
                return 'bg-gray-100 text-gray-800 border-gray-200';
            case 'Preventative':
                return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'Reactive':
                return 'bg-orange-100 text-orange-800 border-orange-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getBadgeStyle(status)}`}>
            {status}
        </span>
    );
};

export default StatusBadge;
