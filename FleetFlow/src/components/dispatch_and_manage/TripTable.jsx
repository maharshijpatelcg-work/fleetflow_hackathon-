import React from 'react';
import TripRow from './TripRow';
import { Truck, Users, Weight, Map, Activity, Ruler, Cog, Fingerprint } from 'lucide-react';

export default function TripTable({ trips, vehicles, drivers, dispatchTrip, completeTrip, cancelTrip }) {
    // Sort trips: active ones first, completed/cancelled last
    const sortedTrips = [...trips].sort((a, b) => {
        const statusOrder = { Draft: 1, Dispatched: 2, Completed: 3, Cancelled: 4 };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    return (
        <div className="premium-table-container animate-in stagger-2">
            <table className="premium-table">
                <thead>
                    <tr>
                        <th className="w-[120px]"><div className="flex items-center gap-2"><Fingerprint className="w-3 h-3" /> Trip ID</div></th>
                        <th className="min-w-[200px]"><Truck className="w-3 h-3 inline mr-2" /> Vehicle & Driver</th>
                        <th className="min-w-[120px]"><Weight className="w-3 h-3 inline mr-2" /> Cargo</th>
                        <th className="min-w-[220px]"><Map className="w-3 h-3 inline mr-2" /> Route Details</th>
                        <th className="text-center w-[140px]"><Activity className="w-3 h-3 inline mr-2" /> Status</th>
                        <th className="text-center w-[120px]"><Ruler className="w-3 h-3 inline mr-2" /> Distance</th>
                        <th className="text-right w-[240px]"><Cog className="w-3 h-3 inline mr-2" /> Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedTrips.map(trip => (
                        <TripRow
                            key={trip.id}
                            trip={trip}
                            vehicle={vehicles.find(v => v.id === trip.vehicleId)}
                            driver={drivers.find(d => d.id === trip.driverId)}
                            dispatchTrip={dispatchTrip}
                            completeTrip={completeTrip}
                            cancelTrip={cancelTrip}
                        />
                    ))}
                    {sortedTrips.length === 0 && (
                        <tr>
                            <td colSpan="7" className="text-center text-slate-400 py-12">
                                <p className="text-sm font-bold uppercase tracking-widest">No trips initialized.</p>
                                <p className="text-[10px] uppercase tracking-widest mt-1">Create a new dispatch to begin monitoring.</p>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
