export const initialVehicles = [
    { id: 'v1', nameModel: 'Ford Transit 250', licensePlate: 'FL-2041', status: 'Available', odometer: 42000 },
    { id: 'v2', nameModel: 'Freightliner Cascadia', licensePlate: 'TX-9021', status: 'On Trip', odometer: 185000 },
    { id: 'v3', nameModel: 'Mercedes Sprinter', licensePlate: 'CA-3392', status: 'In Shop', odometer: 67000 },
    { id: 'v4', nameModel: 'Kenworth T680', licensePlate: 'NY-1102', status: 'Retired', odometer: 450000 },
    { id: 'v5', nameModel: 'Ram Promaster', licensePlate: 'FL-2042', status: 'Available', odometer: 22000 }
];

export const initialServiceLogs = [
    {
        id: 's1',
        vehicleId: 'v3',
        serviceType: 'Engine Overhaul',
        category: 'Reactive',
        description: 'Transmission slipping on higher gears',
        cost: 4500,
        status: 'Open',
        dateCreated: '2026-02-20',
        dateCompleted: null
    },
    {
        id: 's2',
        vehicleId: 'v1',
        serviceType: 'Oil Change & Brake Pads',
        category: 'Preventative',
        description: 'Scheduled maintenance 40k miles',
        cost: 350,
        status: 'Completed',
        dateCreated: '2026-02-15',
        dateCompleted: '2026-02-16'
    }
];
