import React from 'react';

export default function FilterBar({ filters, setFilters }) {
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const selectClass = "block w-full rounded-lg border-gray-200 bg-white py-2.5 px-4 text-sm font-medium focus:border-blue-500 focus:ring-blue-500 shadow-sm transition-all hover:border-gray-300 outline-none appearance-none cursor-pointer";

    return (
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex gap-2 items-center text-gray-500 mr-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" /></svg>
                <span className="font-semibold text-sm tracking-wide uppercase">Filters</span>
            </div>

            <div className="relative flex-1 w-full">
                <select name="type" value={filters.type} onChange={handleChange} className={selectClass}>
                    <option value="All">All Types</option>
                    <option value="Truck">Truck</option>
                    <option value="Van">Van</option>
                    <option value="Bike">Bike</option>
                    <option value="Ship">Ship</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            <div className="relative flex-1 w-full">
                <select name="status" value={filters.status} onChange={handleChange} className={selectClass}>
                    <option value="All">All Statuses</option>
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="In Shop">In Shop</option>
                    <option value="Retired">Retired</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>

            <div className="relative flex-1 w-full">
                <select name="region" value={filters.region} onChange={handleChange} className={selectClass}>
                    <option value="All">All Regions</option>
                    <option value="North">North</option>
                    <option value="South">South</option>
                    <option value="East">East</option>
                    <option value="West">West</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
            </div>
        </div>
    );
}
