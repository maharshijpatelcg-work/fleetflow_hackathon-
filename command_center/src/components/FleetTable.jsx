import React from 'react';

const StatusBadge = ({ status }) => {
    let badgeClasses = "px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ";

    switch (status) {
        case 'Available':
            badgeClasses += "bg-green-100 text-green-800";
            break;
        case 'On Trip':
            badgeClasses += "bg-blue-100 text-blue-800";
            break;
        case 'In Shop':
            badgeClasses += "bg-yellow-100 text-yellow-800";
            break;
        case 'Retired':
            badgeClasses += "bg-gray-100 text-gray-800";
            break;
        default:
            badgeClasses += "bg-gray-100 text-gray-800";
    }

    return (
        <span className={badgeClasses}>
            {status}
        </span>
    );
};

export default function FleetTable({ vehicles }) {
    if (!vehicles || vehicles.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-1">No vehicles found</h3>
                <p className="text-gray-500">Adjust your filters to see more results.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Vehicle Name
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                License Plate
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Type
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Region
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Max Capacity
                            </th>
                            <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                                Odometer
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {vehicles.map((vehicle) => (
                            <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-semibold text-gray-900">{vehicle.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-mono text-gray-600 bg-gray-100 px-2 py-1 rounded inline-block">
                                        {vehicle.plate}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {vehicle.type}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {vehicle.region}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <StatusBadge status={vehicle.status} />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {vehicle.capacity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-medium">
                                    {vehicle.odometer.toLocaleString()} mi
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
