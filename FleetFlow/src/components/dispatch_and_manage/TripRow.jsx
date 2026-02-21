import React, { useState } from 'react';
import StatusBadge from './StatusBadge';
import { Truck, User, MapPin, Gauge, AlertTriangle, CheckCircle2, X, Loader2, Map } from 'lucide-react';

export default function TripRow({ trip, vehicle, driver, dispatchTrip, completeTrip, cancelTrip }) {
    const [endOdo, setEndOdo] = useState('');
    const [isConfirming, setIsConfirming] = useState(false);
    const [confirmType, setConfirmType] = useState(null); // 'complete' or 'cancel'
    const [isProcessing, setIsProcessing] = useState(false);

    const handleInitiateComplete = () => {
        if (!endOdo) {
            alert("Please enter the end odometer reading to complete the trip.");
            return;
        }
        const endV = Number(endOdo);
        if (isNaN(endV) || endV <= trip.startOdometer) {
            alert(`Operational Validation Error: End odometer must be greater than start odometer (${trip.startOdometer.toLocaleString()} mi).`);
            return;
            0
        }
        setConfirmType('complete');
        setIsConfirming(true);
    };

    const handleInitiateCancel = () => {
        setConfirmType('cancel');
        setIsConfirming(true);
    };

    const executeAction = async () => {
        setIsProcessing(true);
        // Simulate network latency for enterprise feel
        await new Promise(resolve => setTimeout(resolve, 800));

        if (confirmType === 'complete') {
            completeTrip(trip.id, Number(endOdo));
        } else if (confirmType === 'cancel') {
            cancelTrip(trip.id);
        }

        setIsProcessing(false);
        setIsConfirming(false);
        setConfirmType(null);
    };

    const isCancelled = trip.status === 'Cancelled';
    const isCompleted = trip.status === 'Completed';
    const canComplete = endOdo && Number(endOdo) > trip.startOdometer;

    let distanceLabel = '-';
    if (trip.endOdometer != null && trip.startOdometer != null) {
        const diff = Number(trip.endOdometer) - Number(trip.startOdometer);
        if (!isNaN(diff)) {
            distanceLabel = `${diff.toLocaleString()} mi`;
        }
    }

    return (
        <tr className={`hover:bg-slate-50/50 transition-colors ${isCancelled ? 'opacity-50 grayscale' : ''} border-b border-slate-50 last:border-0`}>
            <td className="w-[120px] py-6 px-1">
                <span className="font-mono text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                    {trip.id.substring(0, 10)}
                </span>
            </td>
            <td>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-white transition-colors">
                        <Truck className="w-4 h-4 text-slate-600" />
                    </div>
                    <div>
                        <span className="text-bold-dark leading-none block mb-0.5">{vehicle ? vehicle.nameModel : 'Unknown Vehicle'}</span>
                        <div className="flex items-center gap-1.5">
                            <User className="w-3 h-3 text-slate-400" />
                            <span className="text-muted-small !mt-0 !normal-case tracking-normal !text-[11px]">{driver ? driver.name : 'Unknown Driver'}</span>
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div className="text-bold-dark">
                    {trip.cargoWeight?.toLocaleString() || '0'} <span className="text-[10px] text-slate-400 font-bold ml-1 uppercase">Lbs</span>
                </div>
            </td>
            <td>
                <span className="text-bold-dark flex items-center gap-2">
                    {trip.origin} <X className="w-2.5 h-2.5 text-slate-300 rotate-90" /> {trip.destination}
                </span>
                <span className="text-muted-small">Start: {trip.startOdometer.toLocaleString()} MI</span>
            </td>
            <td className="text-center">
                <div className="flex justify-center">
                    <StatusBadge status={trip.status} />
                </div>
            </td>
            <td className="text-center font-bold text-slate-900 text-sm">
                {distanceLabel}
            </td>
            <td className="text-right">
                <div className="flex justify-end items-center gap-3">
                    {trip.status === 'Draft' && (
                        <div className="flex gap-2">
                            <button className="btn-secondary-outline hover:bg-primary-50 hover:border-primary-200 uppercase tracking-widest text-[10px] py-1.5" onClick={() => dispatchTrip(trip.id)}>Initialize</button>
                            <button className="btn-secondary-outline hover:text-red-600 hover:border-red-200 uppercase tracking-widest text-[10px] py-1.5" onClick={handleInitiateCancel}>Void</button>
                        </div>
                    )}

                    {trip.status === 'Dispatched' && (
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="End Odo"
                                    className="w-24 px-3 py-2 bg-slate-100/50 border-2 border-slate-200 rounded-lg text-xs font-bold focus:outline-none focus:bg-white focus:border-primary-500 transition-all text-center placeholder:text-slate-400"
                                    value={endOdo}
                                    onChange={e => setEndOdo(e.target.value)}
                                />
                                <div className="absolute -top-2 left-2 bg-white px-1 text-[8px] font-black text-slate-400 uppercase tracking-tighter">Mi</div>
                            </div>
                            <button
                                disabled={!canComplete}
                                className={`group relative flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${canComplete ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-100' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                                onClick={handleInitiateComplete}
                            >
                                <CheckCircle2 className={`w-3.5 h-3.5 ${canComplete ? 'animate-pulse' : ''}`} />
                                Complete Trip
                            </button>
                        </div>
                    )}

                    {(isCompleted || isCancelled) && (
                        <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest italic flex items-center gap-1.5 opacity-60">
                            <div className={`w-2 h-2 rounded-full ${isCancelled ? 'bg-rose-300' : 'bg-slate-300'}`}></div>
                            Permanent Record
                        </span>
                    )}
                </div>

                {/* HIGH FIDELITY CONFIRMATION MODAL */}
                {isConfirming && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-100">
                            {/* Header */}
                            <div className={`p-6 flex items-center gap-4 ${confirmType === 'cancel' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                <div className={`p-3 rounded-2xl ${confirmType === 'cancel' ? 'bg-red-100/50' : 'bg-emerald-100/50'}`}>
                                    {confirmType === 'cancel' ? <AlertTriangle className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                                </div>
                                <div className="text-left">
                                    <h3 className="text-xl font-black uppercase tracking-tight leading-none">Operational Verification</h3>
                                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mt-1">Audit Trail # {trip.id.substring(0, 8)}</p>
                                </div>
                            </div>

                            <div className="p-8 text-left space-y-6">
                                {/* Core Details Grid */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-4">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Assigned Asset</label>
                                            <p className="text-sm font-bold text-slate-800 uppercase tracking-tight truncate">{vehicle?.nameModel || 'N/A'}</p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Assigned Operator</label>
                                            <p className="text-sm font-bold text-slate-800 uppercase tracking-tight">{driver?.name || 'N/A'}</p>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Route Vector</label>
                                            <p className="text-[11px] font-bold text-slate-800 uppercase flex items-center gap-1">
                                                {trip.origin} <X className="w-2 h-2 rotate-90 text-slate-300" /> {trip.destination}
                                            </p>
                                        </div>
                                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-1">Start Odometer</label>
                                            <p className="text-sm font-bold text-slate-800">{trip.startOdometer.toLocaleString()} <span className="text-[10px] text-slate-400">MI</span></p>
                                        </div>
                                    </div>
                                </div>

                                {confirmType === 'complete' && (
                                    <div className="p-6 bg-emerald-50/40 rounded-3xl border-2 border-emerald-100/50">
                                        <div className="flex justify-between items-end">
                                            <div>
                                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Calculated Trip Distance</label>
                                                <p className="text-4xl font-black text-emerald-900 tracking-tighter">
                                                    {(Number(endOdo) - Number(trip.startOdometer)).toLocaleString()} <span className="text-lg">MI</span>
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Target End Odo</label>
                                                <p className="text-xl font-black text-emerald-700">{Number(endOdo).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {confirmType === 'cancel' && (
                                    <div className="p-6 bg-red-50/40 rounded-3xl border-2 border-red-100/50">
                                        <p className="text-sm font-bold text-red-900 leading-relaxed uppercase tracking-tight text-center">
                                            Status Update Target: <span className="underline decoration-red-300 decoration-2">Cancelled</span>
                                            <br />
                                            <span className="text-[10px] opacity-60">This action will immediately release all associated assets.</span>
                                        </p>
                                    </div>
                                )}

                                <div className="flex gap-4 pt-2">
                                    <button
                                        disabled={isProcessing}
                                        onClick={() => setIsConfirming(false)}
                                        className="flex-1 py-4 text-slate-400 font-black uppercase tracking-widest text-[11px] hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all disabled:opacity-50"
                                    >
                                        Abort Change
                                    </button>
                                    <button
                                        disabled={isProcessing}
                                        onClick={executeAction}
                                        className={`flex-[2] py-4 text-white font-black uppercase tracking-widest text-[11px] rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 ${confirmType === 'cancel' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                Processing Audit...
                                            </>
                                        ) : (
                                            'Confirm Operational Status'
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </td>
        </tr>
    );
}
