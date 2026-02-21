import React, { useState } from 'react';

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
            setError('Please select a vehicle, driver, and fill out all details.');
            return;
        }

        const weightNum = Number(cargoWeight);
        const startOdoNum = Number(startOdometer);

        // Validation 2: Positive cargo weight
        if (weightNum <= 0) {
            setError('Cargo weight must be a positive number.');
            return;
        }

        // Validation 3: Positive start odometer
        if (startOdoNum < 0) {
            setError('Start odometer cannot be negative.');
            return;
        }

        const selectedVehicle = vehicles.find(v => v.id === vehicleId);

        // Validation 4: Cargo weight vs maxCapacity
        if (weightNum > selectedVehicle.maxCapacity) {
            setError(`Cargo weight (${weightNum.toLocaleString()} lbs) exceeds max capacity of ${selectedVehicle.nameModel} (${selectedVehicle.maxCapacity.toLocaleString()} lbs).`);
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
                <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg mb-4">
                    <p className="text-red-800 text-[10px] font-bold uppercase tracking-widest">{error}</p>
                </div>
            )}

            <div>
                <label className="input-label">ASSIGNMENTS</label>
                <div className="field-row">
                    <select className="custom-input" value={vehicleId} onChange={e => setVehicleId(e.target.value)}>
                        <option value="">-- Select Available Vehicle --</option>
                        {availableVehicles.map(v => (
                            <option key={v.id} value={v.id}>
                                {v.nameModel} ({v.PlateNumber})
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

            <div>
                <label className="input-label">CARGO DETAILS</label>
                <input
                    className="custom-input"
                    type="number"
                    placeholder="Cargo Weight (lbs)"
                    value={cargoWeight}
                    onChange={e => setCargoWeight(e.target.value)}
                />
            </div>

            <div>
                <label className="input-label">ROUTING & TELEMETRY</label>
                <div className="field-row mb-4">
                    <input
                        className="custom-input"
                        type="text"
                        placeholder="Origin (e.g., Dallas, TX)"
                        value={origin}
                        onChange={e => setOrigin(e.target.value)}
                    />
                    <input
                        className="custom-input"
                        type="text"
                        placeholder="Destination (e.g., Austin, TX)"
                        value={destination}
                        onChange={e => setDestination(e.target.value)}
                    />
                </div>
                <input
                    className="custom-input"
                    type="number"
                    placeholder="Start Odometer Reading (mi)"
                    value={startOdometer}
                    onChange={e => setStartOdometer(e.target.value)}
                />
            </div>

            <button type="submit" className="btn-submit-blue">
                + Create Draft Trip
            </button>
        </form>
    );
}
