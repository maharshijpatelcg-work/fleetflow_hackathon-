import React, { useState } from 'react';
import { Truck, Users, Weight, MapPin, Navigation, AlertCircle, Plus } from 'lucide-react';

export default function TripForm({ vehicles, drivers, createTrip }) {
    const [vehicleId, setVehicleId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [cargoWeight, setCargoWeight] = useState('');
    const [origin, setOrigin] = useState('');
    const [destination, setDestination] = useState('');
    const [startOdometer, setStartOdometer] = useState('');
    const [error, setError] = useState('');

    // Determine current datestring for license expiry check
    const today = new Date().toISOString().split('T')[0];

    // Filter rules
    const availableVehicles = vehicles.filter(v => v.status === 'Available');
    const availableDrivers = drivers.filter(d => d.status === 'On Duty' && d.licenseExpiry > today);

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');

        // Validation 1: All fields filled
        if (!vehicleId || !driverId || !cargoWeight || !origin || !destination || startOdometer === '') {
            setError('Missing Fields: Please select a vehicle, driver, and complete all route parameters.');
            return;
        }

        const weightNum = Number(cargoWeight);
        const startOdoNum = Number(startOdometer);

        // Validation 2: Positive cargo weight
        if (weightNum <= 0) {
            setError('Invalid Weight: Cargo weight must be a positive integer.');
            return;
        }

        // Validation 3: Positive start odometer
        if (startOdoNum < 0) {
            setError('Invalid Telemetry: Start odometer cannot be negative.');
            return;
        }

        const selectedVehicle = vehicles.find(v => v.id === vehicleId);

        // Validation 4: Cargo weight vs maxCapacity
        if (weightNum > selectedVehicle.maxCapacity) {
            setError(`Capacity Warning: Cargo weight (${weightNum.toLocaleString()} lbs) exceeds max capacity of ${selectedVehicle.nameModel} (${(selectedVehicle.maxCapacity || 0).toLocaleString()} lbs).`);
            return;
        }

        // Success logic
        createTrip({
            vehicleId,
            driverId,
            cargoWeight: weightNum,
            origin,
            destination,
            status: 'Draft',
            startOdometer: startOdoNum,
            endOdometer: null,
        });

        // Reset Form
        setVehicleId('');
        setDriverId('');
        setCargoWeight('');
        setOrigin('');
        setDestination('');
        setStartOdometer('');
    };

    return (
        <form className="field-group" onSubmit={handleSubmit}>
            {error && (
                <div className="p-4 bg-red-50 border-l-4 border-red-500 rounded-xl mb-6 flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="text-red-900 text-sm font-bold">{error}</p>
                </div>
            )}

            <div className="space-y-4">
                <label className="input-label flex items-center gap-2">
                    <Truck className="w-4 h-4" /> Operational Assignments
                </label>
                <div className="field-row">
                    <select className="custom-input" value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
                        <option value="">-- Select Available Vehicle --</option>
                        {availableVehicles.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.nameModel} • {v.PlateNumber}
                            </option>
                        ))}
                    </select>

                    <select className="custom-input" value={driverId} onChange={e => setDriverId(e.target.value)}>
                        <option value="">-- Select On-Duty Driver --</option>
                        {availableDrivers.map(d => (
                            <option key={d.id} value={d.id}>
                                {d.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <label className="input-label flex items-center gap-2">
                    <Weight className="w-4 h-4" /> Load Parameters
                </label>
                <input
                    className="custom-input"
                    type="number"
                    placeholder="Total Cargo Weight (LBS)"
                    value={cargoWeight}
                    onChange={e => setCargoWeight(e.target.value)}
                />
            </div>

            <div className="space-y-4">
                <label className="input-label flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> Logistical Routing
                </label>
                <div className="field-row">
                    <input
                        className="custom-input"
                        type="text"
                        placeholder="Origin Point (e.g., Dallas Hub)"
                        value={origin}
                        onChange={e => setOrigin(e.target.value)}
                    />
                    <input
                        className="custom-input"
                        type="text"
                        placeholder="Destination Point (e.g., Austin Terminal)"
                        value={destination}
                        onChange={e => setDestination(e.target.value)}
                    />
                </div>
                <div className="mt-4">
                    <label className="input-label flex items-center gap-2">
                        <Navigation className="w-4 h-4" /> Initial Telemetry
                    </label>
                    <input
                        className="custom-input"
                        type="number"
                        placeholder="Starting Odometer Reading (MI)"
                        value={startOdometer}
                        onChange={e => setStartOdometer(e.target.value)}
                    />
                </div>
            </div>

            <button type="submit" className="btn-submit-blue group">
                <Plus className="w-5 h-5 inline-block mr-2 group-hover:rotate-90 transition-transform" />
                Initialize Operational Dispatch
            </button>
        </form>
    );
}
