import React, { useState } from 'react';
import { useFleet } from '../../context/FleetContext';
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
        <form onSubmit={handleSubmit} className="field-group">
            {warningModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
                        <div className="p-6 flex items-center gap-4 bg-red-50 text-red-600">
                            <div className="p-3 rounded-xl bg-red-100">
                                <AlertTriangle className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <h3 className="text-xl font-black uppercase tracking-tight leading-none">Action Blocked</h3>
                                <p className="text-sm font-bold opacity-80 mt-1">Operational Lifecycle Conflict</p>
                            </div>
                        </div>
                        <div className="p-8 text-left">
                            <p className="text-sm font-bold text-slate-600 leading-relaxed uppercase tracking-tight">
                                Vehicle <span className="text-slate-900 underline">{attemptedVehicle?.nameModel}</span> is currently <span className="text-blue-600">On Trip</span>.
                            </p>
                            <p className="text-xs font-medium text-slate-400 mt-4 leading-relaxed">
                                Maintenance logs can only be initialized for available assets. Please conclude active operations before scheduling technical service.
                            </p>
                            <button
                                onClick={() => setWarningModal(false)}
                                className="w-full mt-8 py-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black uppercase tracking-widest text-xs rounded-xl transition-all"
                            >
                                Understood
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Vehicle Selection */}
                <div>
                    <label className="input-label">Select Operational Asset</label>
                    <select
                        name="vehicleId"
                        value={formData.vehicleId}
                        onChange={handleChange}
                        className="custom-input"
                    >
                        <option value="">-- Choose Target Vehicle --</option>
                        {vehicles.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.nameModel} • {v.licensePlate || v.PlateNumber}
                            </option>
                        ))}
                    </select>
                    {errors.vehicleId && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 block ml-1">{errors.vehicleId}</span>}
                </div>

                {/* Service Type */}
                <div>
                    <label className="input-label">Technical Service Type</label>
                    <input
                        type="text"
                        name="serviceType"
                        value={formData.serviceType}
                        onChange={handleChange}
                        placeholder="e.g. Hydro-System Flush"
                        className="custom-input"
                    />
                    {errors.serviceType && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 block ml-1">{errors.serviceType}</span>}
                </div>

                {/* Category */}
                <div>
                    <label className="input-label">Audit Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="custom-input"
                    >
                        <option value="Preventative">Preventative Maintenance</option>
                        <option value="Reactive">Reactive Repair</option>
                    </select>
                </div>

                {/* Cost */}
                <div>
                    <label className="input-label">Projected Opex Cost (₹)</label>
                    <input
                        type="number"
                        name="cost"
                        value={formData.cost}
                        onChange={handleChange}
                        min="0"
                        placeholder="0.00"
                        className="custom-input"
                    />
                    {errors.cost && <span className="text-red-500 text-[10px] font-black uppercase tracking-widest mt-2 block ml-1">{errors.cost}</span>}
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                    <label className="input-label">Technical Directive Summary</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the technical scope and required parts..."
                        className="custom-input min-h-[120px] py-4"
                    />
                </div>
            </div>

            <button type="submit" className="btn-submit-blue group">
                <Wrench className="w-5 h-5 inline-block mr-2 group-hover:rotate-45 transition-transform" />
                Initialize Technical Log Entry
            </button>
        </form>
    );
};

export default ServiceForm;
