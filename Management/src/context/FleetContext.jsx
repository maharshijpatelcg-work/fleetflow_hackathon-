import React, { createContext, useState, useContext } from 'react';
import { initialVehicles, initialServiceLogs } from '../mockData';

const FleetContext = createContext();

export const useFleet = () => useContext(FleetContext);

export const FleetProvider = ({ children }) => {
    const [vehicles, setVehicles] = useState(initialVehicles);
    const [serviceLogs, setServiceLogs] = useState(initialServiceLogs);

    const updateVehicleStatus = (vehicleId, newStatus) => {
        setVehicles(prev => prev.map(v =>
            v.id === vehicleId ? { ...v, status: newStatus } : v
        ));
    };

    const createServiceLog = (logData) => {
        const newLog = {
            id: `s${Date.now()}`,
            ...logData,
            status: 'Open',
            dateCreated: new Date().toISOString().split('T')[0],
            dateCompleted: null
        };
        setServiceLogs(prev => [newLog, ...prev]);
        // Immediately update vehicle status
        updateVehicleStatus(logData.vehicleId, 'In Shop');
    };

    const completeService = (logId, vehicleId) => {
        setServiceLogs(prev => prev.map(log =>
            log.id === logId
                ? { ...log, status: 'Completed', dateCompleted: new Date().toISOString().split('T')[0] }
                : log
        ));
        // Immediately update vehicle status
        updateVehicleStatus(vehicleId, 'Available');
    };

    return (
        <FleetContext.Provider value={{
            vehicles,
            serviceLogs,
            createServiceLog,
            completeService,
            updateVehicleStatus
        }}>
            {children}
        </FleetContext.Provider>
    );
};
