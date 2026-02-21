import React, { useState } from 'react';
import { useFleet } from '../context/FleetContext';
import { Wrench, AlertTriangle } from 'lucide-react';

const ServiceForm = () => {
    const { vehicles, createServiceLog } = useFleet();

    const [formData, setFormData] = useState({
        vehicleId: '',
        serviceType: '',
        category: 'Preventative',
        description: '',
        cost: ''
    });

    const [errors, setErrors] = useState({});
    const [warningModal, setWarningModal] = useState(false);
    const [attemptedVehicle, setAttemptedVehicle] = useState(null);

    const availableVehicles = vehicles.filter(v => v.status === 'Available');

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'vehicleId') {
            const selected = vehicles.find(v => v.id === value);
            if (selected && selected.status === 'On Trip') {
                setAttemptedVehicle(selected);
                setWarningModal(true);
                return;
            }
        }

        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.vehicleId) newErrors.vehicleId = 'Vehicle is required';
        if (!formData.serviceType.trim()) newErrors.serviceType = 'Service type is required';
        if (formData.cost === '' || Number(formData.cost) < 0) newErrors.cost = 'Cost must be 0 or greater';
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        createServiceLog({
            vehicleId: formData.vehicleId,
            serviceType: formData.serviceType,
            category: formData.category,
            description: formData.description,
            cost: Number(formData.cost)
        });

        // Reset form
        setFormData({
            vehicleId: '',
            serviceType: '',
            category: 'Preventative',
            description: '',
            cost: ''
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8 relative">
            <div className="flex items-center gap-2 mb-6 border-b pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Wrench size={20} />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Create Service Log</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Vehicle Selection */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Select Vehicle*</label>
                        <select
                            name="vehicleId"
                            value={formData.vehicleId}
                            onChange={handleChange}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${errors.vehicleId ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        >
                            <option value="">-- Select Available Vehicle --</option>
                            {availableVehicles.map(v => (
                                <option key={v.id} value={v.id}>
                                    {v.nameModel} ({v.licensePlate})
                                </option>
                            ))}
                        </select>
                        {errors.vehicleId && <span className="text-red-500 text-xs mt-1">{errors.vehicleId}</span>}
                    </div>

                    {/* Service Type */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Service Type*</label>
                        <input
                            type="text"
                            name="serviceType"
                            value={formData.serviceType}
                            onChange={handleChange}
                            placeholder="e.g. Oil Change, Tire Mount"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${errors.serviceType ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        />
                        {errors.serviceType && <span className="text-red-500 text-xs mt-1">{errors.serviceType}</span>}
                    </div>

                    {/* Category */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        >
                            <option value="Preventative">Preventative</option>
                            <option value="Reactive">Reactive</option>
                        </select>
                    </div>

                    {/* Cost */}
                    <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-gray-700">Cost ($)*</label>
                        <input
                            type="number"
                            name="cost"
                            value={formData.cost}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow ${errors.cost ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                        />
                        {errors.cost && <span className="text-red-500 text-xs mt-1">{errors.cost}</span>}
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1.5 lg:col-span-2">
                        <label className="text-sm font-medium text-gray-700">Description</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Provide details about the service performed or needed..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
                        />
                    </div>
                </div>

                <div className="flex justify-end pt-4 border-t">
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors focus:ring-4 focus:ring-blue-100 flex items-center gap-2"
                    >
                        <Wrench size={18} />
                        Create Service Log
                    </button>
                </div>
            </form>

            {/* Warning Modal (Optional Bonus) */}
            {warningModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 transform transition-all">
                        <div className="flex items-center gap-3 text-red-600 mb-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertTriangle size={24} />
                            </div>
                            <h3 className="text-xl font-bold">Action Blocked</h3>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Vehicle <strong className="text-black">{attemptedVehicle?.nameModel}</strong> is currently <strong>On Trip</strong>.
                            You cannot schedule maintenance until the trip is completed.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setWarningModal(false)}
                                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium rounded-lg transition-colors"
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceForm;
