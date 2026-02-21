import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity, LayoutDashboard, PieChart, FileText, Settings, Bell, Users, DollarSign, LogOut, Truck } from 'lucide-react';

const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { id: 'dashboard', label: 'Control Center', icon: <Activity className="w-4 h-4" />, roles: ['FLEET_MANAGER', 'ADMIN'], path: '/dashboard' },
        { id: 'vehicles', label: 'Vehicle Registry', icon: <Truck className="w-4 h-4" />, roles: ['DISPATCHER', 'FLEET_MANAGER', 'ADMIN'], path: '/vehicles' },
        { id: 'dispatch', label: 'Trip Dispatch', icon: <LayoutDashboard className="w-4 h-4" />, roles: ['DISPATCHER', 'FLEET_MANAGER', 'ADMIN'], path: '/dispatch' },
        { id: 'analytics', label: 'Operational Analytics', icon: <PieChart className="w-4 h-4" />, roles: ['FINANCIAL_ANALYST', 'FLEET_MANAGER', 'ADMIN'], path: '/analytics' },
        { id: 'drivers', label: 'Drivers', icon: <Users className="w-4 h-4" />, roles: ['FLEET_MANAGER', 'ADMIN'], path: '/drivers' },
        { id: 'expenses', label: 'Expenses', icon: <DollarSign className="w-4 h-4" />, roles: ['FINANCIAL_ANALYST', 'FLEET_MANAGER', 'ADMIN'], path: '/expenses' },
        { id: 'maintenance', label: 'Maintenance Logs', icon: <FileText className="w-4 h-4" />, roles: ['FLEET_MANAGER', 'ADMIN'], path: '/maintenance' },
    ];

    const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

    return (
        <div className="min-h-screen flex flex-col font-sans relative bg-gray-50">
            {/* Decorative Blob */}
            <div className="absolute top-0 left-0 w-full h-96 bg-primary-100/30 rounded-full blur-3xl -z-10 transform -translate-y-1/2 rounded-[100%]"></div>

            {/* Top Navigation Bar */}
            <header className="glass-panel sticky top-0 z-30 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-20">
                        {/* Logo & Nav */}
                        <div className="flex items-center">
                            <div className="flex-shrink-0 flex items-center gap-3 pr-6 border-r border-gray-200/50 h-10">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-primary-500 rounded-xl flex items-center justify-center shadow-md shadow-primary-500/20 transform transition hover:scale-105">
                                    <Activity className="w-6 h-6 text-white" />
                                </div>
                                <span className="font-extrabold text-2xl text-gray-900 tracking-tight">FleetFlow</span>
                            </div>
                            <nav className="hidden sm:ml-6 sm:flex sm:space-x-4 h-full">
                                {filteredNavItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => navigate(item.path)}
                                        className={`inline-flex items-center px-3 pt-1 border-b-2 gap-2 text-sm font-medium transition-colors ${location.pathname === item.path
                                            ? 'border-primary-500 text-primary-900 font-bold'
                                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                                            }`}
                                    >
                                        {item.icon} {item.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                        {/* Right Actions */}
                        <div className="flex items-center gap-4">
                            <button className="text-gray-400 hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-gray-100">
                                <Bell className="w-5 h-5" />
                            </button>
                            <button className="text-gray-400 hover:text-gray-500 transition-colors p-2 rounded-full hover:bg-gray-100 hidden sm:block">
                                <Settings className="w-5 h-5" />
                            </button>
                            <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-sm font-semibold text-gray-900 leading-none">{user.name || user.fullName}</p>
                                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest font-bold">{user.role?.replace('_', ' ')}</p>
                                </div>
                                <div className="relative group">
                                    <img className="h-9 w-9 rounded-full border border-gray-200 shadow-sm cursor-pointer" src={`https://ui-avatars.com/api/?name=${user.name || user.fullName}&background=f2e8e5&color=3f2c27`} alt="User" />
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 font-bold"
                                        >
                                            <LogOut className="w-4 h-4" /> Sign Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full animate-in fade-in duration-500">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
