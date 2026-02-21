
// Helper for random picking
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

// --- VEHICLE GENERATION ---
const brands = ['Volvo', 'Scania', 'Mercedes-Benz', 'MAN', 'BharatBenz', 'Ashok Leyland', 'Tata Motors', 'Eicher'];
const models = {
    'Volvo': ['FH16', 'FMX', 'FM', 'VNL 860'],
    'Scania': ['R500', 'G410', 'P250', 'Next Gen S'],
    'Mercedes-Benz': ['Actros', 'Arocs', 'Atego', 'Unimog'],
    'MAN': ['TGX', 'TGS', 'TGM', 'TGL'],
    'BharatBenz': ['3528C', '1923R', '2823R', '4228R'],
    'Ashok Leyland': ['Ecomet 1215', 'U-3518', 'Captain 2523', 'Boss 1215'],
    'Tata Motors': ['Prima 5530.S', 'Signa 4825.TK', 'Ultra 1918.T', 'LPT 1613'],
    'Eicher': ['Pro 6055', 'Pro 3015', 'Pro 2049', 'Pro 8040']
};

const statuses = ['Available', 'On Trip', 'Maintenance', 'In Shop'];
const types = ['Heavy Duty', 'Medium Duty', 'Delivery Van', 'Reefer'];

const generateVehicles = (count) => {
    const list = [];
    for (let i = 1; i <= count; i++) {
        const brand = pick(brands);
        const model = pick(models[brand]);
        list.push({
            id: `V${i}`,
            nameModel: `${brand} ${model}`,
            PlateNumber: `${brand.substring(0, 2).toUpperCase()}-${Math.floor(1000 + Math.random() * 8999)}`,
            type: pick(types),
            status: pick(statuses),
            maxCapacity: pick([15000, 28000, 42000, 45000, 52000]),
            milesDriven: Math.floor(Math.random() * 150000) + 10000,
            fuelUsed: Math.floor(Math.random() * 20000) + 2000
        });
    }
    return list;
};

// --- DRIVER GENERATION ---
const firstNames = ['Amit', 'Rajesh', 'Suresh', 'Michael', 'Jane', 'Sarah', 'Priya', 'Vikram', 'Anjali', 'David', 'James', 'Linda', 'Robert', 'Maria', 'Arjun', 'Sanjay', 'Komal', 'Deepak'];
const lastNames = ['Sharma', 'Verma', 'Singh', 'Smith', 'Doe', 'Kapoor', 'Patel', 'Das', 'Roy', 'Choudhury', 'Iyer', 'Menon', 'Reddy', 'Khan', 'Wilson', 'García'];

const generateDrivers = (count) => {
    const list = [];
    for (let i = 1; i <= count; i++) {
        const name = `${pick(firstNames)} ${pick(lastNames)}`;
        const status = pick(['On Duty', 'Off Duty', 'Suspended']);
        list.push({
            id: `D${i}`,
            name,
            status,
            license: `DL-${Math.floor(100000 + Math.random() * 899999)}`,
            licenseExpiry: `202${pick([5, 6, 7])}-${pick(['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'])}-20`,
            completionRate: Math.floor(Math.random() * (100 - 85) + 85),
            safetyScore: Math.floor(Math.random() * (100 - 80) + 80),
            complaints: pick([0, 0, 0, 1, 2, 0, 0]),
            assignedVehicle: null
        });
    }
    return list;
};

// --- TRIP GENERATION ---
const cities = ['New York', 'Chicago', 'Miami', 'Houston', 'San Francisco', 'Dallas', 'Austin', 'Seattle', 'Boston', 'Philadelphia', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Pune'];

const generateTrips = (count, vehicles, drivers) => {
    const list = [];
    const tripStatuses = ['Draft', 'Dispatched', 'Completed', 'Cancelled'];

    for (let i = 1; i <= count; i++) {
        const status = pick(tripStatuses);
        const origin = pick(cities);
        let destination = pick(cities);
        while (destination === origin) destination = pick(cities);

        const v = pick(vehicles);
        const d = pick(drivers);

        const trip = {
            id: `T${i}`,
            vehicleId: v.id,
            driverId: d.id,
            status,
            origin,
            destination,
            cargoWeight: Math.floor(Math.random() * (v.maxCapacity - 5000)) + 5000,
            startOdometer: v.milesDriven - Math.floor(Math.random() * 5000),
            date: `2023-11-${Math.floor(Math.random() * 20) + 10}T10:00:00Z`
        };

        if (status === 'Completed') {
            trip.endOdometer = trip.startOdometer + (Math.floor(Math.random() * 2000) + 300);
        }

        // Logical side effects for base mock (though components will override with state)
        if (status === 'Dispatched') {
            v.status = 'On Trip';
            d.status = 'On Trip';
        }

        list.push(trip);
    }
    return list;
};

// INITIALIZE MOCK DATASETS
export const mockVehicles = generateVehicles(50);
export const mockDrivers = generateDrivers(40);
export const mockTrips = generateTrips(75, mockVehicles, mockDrivers);

// --- ANALYTICS FUNCTIONS ---

export const generateFinancialData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let cumulativeProfit = 0;
    return months.map((month, idx) => {
        const baseRevenue = 1200000 + (idx * 50000); // Gradual growth
        const revenue = Math.floor(baseRevenue + (Math.random() * 400000 - 200000));
        const fuelCost = Math.floor(revenue * 0.22) + (Math.random() * 50000);
        const maintenance = Math.floor(revenue * 0.08) + (Math.random() * 30000);
        const netProfit = revenue - (fuelCost + maintenance);
        cumulativeProfit += netProfit;

        return {
            month,
            revenue,
            fuelCost,
            maintenance,
            netProfit,
            roi: ((netProfit / (fuelCost + maintenance)) * 100).toFixed(1),
            sparklineRevenue: Array.from({ length: 7 }, () => Math.floor(revenue / 30) + (Math.random() * 10000 - 5000)),
            sparklineFuel: Array.from({ length: 7 }, () => Math.floor(fuelCost / 30) + (Math.random() * 2000 - 1000))
        };
    });
};

export const generateEfficiencyData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((month) => ({
        month,
        fleetAvg: +(Math.random() * (12 - 8) + 8).toFixed(1),
        target: 10,
    }));
};

// Adapt legacy analytics logic to larger dynamic set
export const generateVehicleData = () => {
    return mockVehicles.map(v => ({
        id: v.id,
        type: v.type,
        milesDriven: v.milesDriven,
        fuelUsed: v.fuelUsed,
        status: v.status === 'On Trip' ? 'Active' : v.status === 'Available' ? 'Active' : v.status
    }));
};

export const calculateROI = (revenue, costs) => {
    if (costs === 0) return 0;
    return (((revenue - costs) / costs) * 100).toFixed(1);
};

export const calculateUtilization = (vehicles) => {
    if (vehicles.length === 0) return 0;
    const activeVehicles = vehicles.filter(v => v.status === 'Active' || v.status === 'On Trip' || v.status === 'Available').length;
    return ((activeVehicles / vehicles.length) * 100).toFixed(0);
};

export const identifyDeadStock = (vehicles) => {
    return vehicles.filter(v => v.status === 'Idle' || v.milesDriven < 500 || v.status === 'Maintenance');
};

export const generateActivityFeed = () => [
    { id: 1, type: 'maintenance', title: 'Asset Cycle Terminated', description: 'V4 has concluded its scheduled lifecycle audit.', time: '2 hours ago', iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
    { id: 2, type: 'alert', title: 'Route Deviation', description: 'V12 detected 24km outside planned operational vector.', time: '4 hours ago', iconColor: 'text-amber-500', bgColor: 'bg-amber-50' },
    { id: 3, type: 'compliance', title: 'License Renewal', description: 'D14 license audit required within 72 hours.', time: '1 day ago', iconColor: 'text-red-500', bgColor: 'bg-red-50' },
    { id: 4, type: 'system', title: 'Audit Report', description: 'November Financial Intel report is locked and ready.', time: '2 days ago', iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50' }
];

export const generateAiInsights = () => [
    { id: 1, title: 'Network Efficiency', description: 'Cross-hub routing optimization could reduce deadhead miles by 8%.', type: 'positive', actionText: 'View Network Heatmap' },
    { id: 2, title: 'Asset Reliability', description: 'Ashok Leyland units showing 12% higher uptime vs fleet average.', type: 'info', actionText: 'Compare Performance' },
    { id: 3, title: 'Operational Risk', description: '4 drivers approaching maximum duty hours. Schedule shift rotation.', type: 'warning', actionText: 'Manage Rosters' },
    { id: 4, title: 'Fuel Intel', description: 'Unusual fuel spikes detected in Eastern Hub. Validate terminal logs.', type: 'negative', actionText: 'Investigate Discrepancy' }
];

export const generateDriverData = () => {
    return mockDrivers.map(d => ({
        ...d,
        expiry: d.licenseExpiry,
        complaints: d.complaints
    }));
};

export const generateDriverHistory = (driverId) => [
    { id: 101, date: 'Today, 09:42 AM', type: 'compliance', title: 'Asset Check Complete', description: 'Pre-flight checklist verified with 0 safety bypasses.', iconColor: 'text-emerald-500', bgColor: 'bg-emerald-50' },
    { id: 102, date: 'Yesterday, 14:15 PM', type: 'alert', title: 'Telemetry Spike', description: 'Hard braking detected at Sector 7. Validation required.', iconColor: 'text-amber-500', bgColor: 'bg-amber-50' },
    { id: 103, date: 'Oct 12, 08:00 AM', type: 'system', title: 'Shift Initialization', description: 'Logged on and authenticated for regional dispatch.', iconColor: 'text-blue-500', bgColor: 'bg-blue-50' }
];

// --- EXPENSE MOCK DATA STORE (DYNAMICALLY POPULATED) ---
export let expenseDataStore = mockTrips.filter(t => t.status === 'Completed' || t.status === 'Dispatched').map((t, idx) => {
    const isCompleted = t.status === 'Completed';
    return {
        id: `EXP-${1000 + idx}`,
        tripId: t.id,
        driverId: t.driverId,
        distance: isCompleted ? (t.endOdometer - t.startOdometer) : Math.floor(Math.random() * 500) + 100,
        fuelCost: Math.floor(Math.random() * 15000) + 5000,
        miscExpense: pick([0, 0, 500, 1000, 250]),
        status: isCompleted ? pick(['Approved', 'Completed']) : 'Pending',
        date: t.date
    };
});

let expenseListeners = [];
export const getExpenses = () => [...expenseDataStore];
export const subscribeToExpenses = (listener) => {
    expenseListeners.push(listener);
    return () => { expenseListeners = expenseListeners.filter(l => l !== listener); };
};
const notifyExpenseListeners = () => { expenseListeners.forEach(l => l([...expenseDataStore])); };
export const addExpense = (expense) => {
    const newExpense = { ...expense, id: `EXP-${Math.floor(1000 + Math.random() * 9000)}`, date: new Date().toISOString() };
    expenseDataStore = [newExpense, ...expenseDataStore];
    notifyExpenseListeners();
    return newExpense;
};

export const getDriverExpenseStats = (driverId) => {
    const driverExpenses = expenseDataStore.filter(e => e.driverId === driverId);
    if (driverExpenses.length === 0) return { totalSpend: 0, avgPerTrip: 0, count: 0, trips: [] };
    const totalSpend = driverExpenses.reduce((sum, e) => sum + e.fuelCost + e.miscExpense, 0);
    return { totalSpend, avgPerTrip: Math.round(totalSpend / driverExpenses.length), count: driverExpenses.length, trips: driverExpenses };
};
