import React, { useState } from 'react';
import DriverList from './DriverList';
import DriverDetail from './DriverDetail';

export default function DriverManagement() {
    const [selectedDriverId, setSelectedDriverId] = useState(null);

    const handleDriverSelect = (driverId) => {
        setSelectedDriverId(driverId);
    };

    const handleBackToList = () => {
        setSelectedDriverId(null);
    };

    return (
        <div className="w-full">
            {selectedDriverId ? (
                <DriverDetail driverId={selectedDriverId} onBack={handleBackToList} />
            ) : (
                <DriverList onDriverSelect={handleDriverSelect} />
            )}
        </div>
    );
}
