import React, { useState, useEffect } from 'react';
import { mockVehicles, mockDrivers, mockTrips } from '../mockData';
import TripForm from './TripForm';
import TripTable from './TripTable';
import { useAuth } from '../../context/AuthContext';
import { LogOut, Ship } from 'lucide-react';

export default function TripDispatcher() {
    // Helper to safely load from localStorage
    const getSaved = (key, fallback) => {
        try {
            const saved = localStorage.getItem(key);
            return saved ? JSON.parse(saved) : fallback;
        } catch (e) {
            console.error(`Error loading ${key} from storage:`, e);
            return fallback;
        }
    };

    const [vehicles, setVehicles] = useState(() => getSaved('fleet_vehicles', mockVehicles));
    const [drivers, setDrivers] = useState(() => getSaved('fleet_drivers', mockDrivers));
    const [trips, setTrips] = useState(() => getSaved('fleet_trips', mockTrips));
    const { logout } = useAuth();

    // Persistence Effect
    useEffect(() => {
        localStorage.setItem('fleet_vehicles', JSON.stringify(vehicles));
    }, [vehicles]);

    useEffect(() => {
        localStorage.setItem('fleet_drivers', JSON.stringify(drivers));
    }, [drivers]);

    useEffect(() => {
        localStorage.setItem('fleet_trips', JSON.stringify(trips));
    }, [trips]);

    // Business logic: Create Trip
    const createTrip = (newTrip) => {
        const randomId = 'TRIP-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        setTrips([...trips, { ...newTrip, id: randomId }]);
    };

    // Business logic: Dispatch Trip
    const dispatchTrip = (tripId) => {
        setTrips(trips.map(t => {
            if (t.id === tripId) {
                setVehicles(vs => vs.map(v => v.id === t.vehicleId ? { ...v, status: 'On Trip' } : v));
                setDrivers(ds => ds.map(d => d.id === t.driverId ? { ...d, status: 'On Trip' } : d));
                return { ...t, status: 'Dispatched' };
            }
            return t;
        }));
    };

    // Business logic: Complete Trip
    const completeTrip = (tripId, endOdometer) => {
        setTrips(trips.map(t => {
            if (t.id === tripId) {
                setVehicles(vs => vs.map(v => v.id === t.vehicleId ? { ...v, status: 'Available' } : v));
                setDrivers(ds => ds.map(d => d.id === t.driverId ? { ...d, status: 'On Duty' } : d));
                return { ...t, status: 'Completed', endOdometer: endOdometer };
            }
            return t;
        }));
    };

    // Business logic: Cancel Trip
    const cancelTrip = (tripId) => {
        setTrips(trips.map(t => {
            if (t.id === tripId) {
                if (t.status === 'Dispatched') {
                    setVehicles(vs => vs.map(v => v.id === t.vehicleId ? { ...v, status: 'Available' } : v));
                    setDrivers(ds => ds.map(d => d.id === t.driverId ? { ...d, status: 'On Duty' } : d));
                }
                return { ...t, status: 'Cancelled' };
            }
            return t;
        }));
    };

    return (
        <div className="custom-app-container">
            <header className="dispatcher-header">
                <div className="flex justify-between items-start">
                    <div>
                        <h1>FleetFlow Dispatch Engine</h1>
                        <p>Real-time vehicle assignments, load verification, and lifecycle management</p>
                    </div>
                    <button
                        onClick={logout}
                        className="btn-secondary-outline flex items-center gap-2"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Logout
                    </button>
                </div>
            </header>

            <main className="dispatcher-stack">
                <section className="form-section">
                    <h2 className="section-headline">Create New Dispatch</h2>
                    <TripForm
                        vehicles={vehicles}
                        drivers={drivers}
                        createTrip={createTrip}
                    />
                </section>

                <section className="table-section">
                    <h2 className="section-headline">Active & Historical Dispatches</h2>
                    <TripTable
                        trips={trips}
                        vehicles={vehicles}
                        drivers={drivers}
                        dispatchTrip={dispatchTrip}
                        completeTrip={completeTrip}
                        cancelTrip={cancelTrip}
                    />
                </section>
            </main>
        </div>
    );
}
