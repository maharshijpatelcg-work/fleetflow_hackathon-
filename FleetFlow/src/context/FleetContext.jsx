import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockVehicles } from '../data/analyticsMock';

const FleetContext = createContext();

export const useFleet = () => {
    const context = useContext(FleetContext);
    if (!context) {
        throw new Error('useFleet must be used within a FleetProvider');
    }
    return context;
};

export const FleetProvider = ({ children }) => {
    // Initial data for service logs
    const initialLogs = [
        {
            id: 'LOG-001',
            vehicleId: 'V1',
            serviceType: 'Engine Oil Change',
            category: 'Preventative',
            description: 'Regular 10k mile service. Full synthetic oil used.',
            cost: 450.00,
            status: 'Completed',
            dateCreated: '2023-10-15',
            dateCompleted: '2023-10-15'
        },
        {
            id: 'LOG-002',
            vehicleId: 'V2',
            serviceType: 'Brake Pad Replacement',
            category: 'Reactive',
            description: 'Front brake pads worn down to 2mm. Replaced with OEM parts.',
            cost: 850.00,
            status: 'Completed',
            dateCreated: '2023-10-20',
            dateCompleted: '2023-10-21'
        },
        {
            id: 'LOG-003',
            vehicleId: 'V3',
            serviceType: 'Tire Rotation & Balance',
            category: 'Preventative',
            description: 'Standard tire maintenance and alignment check.',
            cost: 120.00,
            status: 'Open',
            dateCreated: '2023-10-25',
            dateCompleted: null
        }
    ];

    const [vehicles, setVehicles] = useState(() => {
        const saved = localStorage.getItem('fleet_v2_vehicles') || localStorage.getItem('fleetFlow_v2_vehicles');
        return saved ? JSON.parse(saved) : mockVehicles;
    });

    const [serviceLogs, setServiceLogs] = useState(() => {
        const saved = localStorage.getItem('fleet_v2_service_logs');
        return saved ? JSON.parse(saved) : initialLogs;
    });

    useEffect(() => {
        localStorage.setItem('fleet_v2_service_logs', JSON.stringify(serviceLogs));
    }, [serviceLogs]);

    const createServiceLog = (logData) => {
        const newLog = {
            ...logData,
            id: `LOG-${Math.floor(1000 + Math.random() * 9000)}`,
            status: 'Open',
            dateCreated: new Date().toISOString().split('T')[0],
            dateCompleted: null
        };
        setServiceLogs(prev => [newLog, ...prev]);
    };

    const completeService = (logId, vehicleId) => {
        setServiceLogs(prev => prev.map(log =>
            log.id === logId
                ? { ...log, status: 'Completed', dateCompleted: new Date().toISOString().split('T')[0] }
                : log
        ));

        // Optionally update vehicle status if it was "In Shop"
        setVehicles(prev => prev.map(v =>
            v.id === vehicleId ? { ...v, status: 'Available' } : v
        ));
    };

    return (
        <FleetContext.Provider value={{
            vehicles,
            serviceLogs,
            createServiceLog,
            completeService
        }}>
            {children}
        </FleetContext.Provider>
    );
};
