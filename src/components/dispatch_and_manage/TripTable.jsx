import React from 'react';
import TripRow from './TripRow';

export default function TripTable({ trips, vehicles, drivers, dispatchTrip, completeTrip, cancelTrip }) {
    // Sort trips: active ones first, completed/cancelled last
    const sortedTrips = [...trips].sort((a, b) => {
        const statusOrder = { Draft: 1, Dispatched: 2, Completed: 3, Cancelled: 4 };
        return statusOrder[a.status] - statusOrder[b.status];
    });

    return (
        <div className="table-outer">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Trip ID</th>
                        <th>Vehicle & Driver</th>
                        <th>Cargo</th>
                        <th>Route Details</th>
                        <th>Status</th>
                        <th>Distance</th>
                        <th>Actions</th>
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
                            <td colSpan="7" className="text-center text-muted empty-state py-8">
                                No trips available. Create a new trip to get started.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
