import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Ship, ArrowRight, ArrowLeft, Mail, Lock } from 'lucide-react'

function Login() {
    const { ROLES, setSelectedRole, selectedRole, login } = useAuth()
    const [step, setStep] = useState(1) // 1: Role Selection, 2: Login Form
    const [formData, setFormData] = useState({ email: '', password: '' })
    const [error, setError] = useState('')

    const handleRoleSelect = (roleId) => {
        setSelectedRole(roleId)
        setStep(2)
        setError('')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setError('')

        try {
            login(formData.email, formData.password)
            // AuthContext will update 'user' and cause a redirect via ProtectedRoute in App.jsx
        } catch (err) {
            setError(err.message)
        }
    }

    // Shared styling for all roles to keep it constant & professional
    const roleBtnStyles = "border-slate-200 bg-white hover:border-primary-500 hover:ring-4 hover:ring-primary-500/5 text-slate-700 shadow-sm"

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <div className="flex-1 grid lg:grid-cols-2">

                {/* Left Side: Maritime Branding */}
                <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=2071&auto=format&fit=crop')` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/95 via-slate-900/80 to-primary-900/40 backdrop-blur-[2px]"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-8 shadow-2xl border border-white/20">
                            <Ship className="w-9 h-9 text-white" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mb-4 leading-tight text-white">
                            FleetFlow <br /> Global
                        </h1>
                        <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-sm font-medium">
                            Intelligent maritime ERP for fleet surveillance and logistics optimization.
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="p-6 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 max-w-md shadow-2xl">
                            <p className="text-base font-medium text-slate-200 mb-4 italic leading-relaxed">
                                "Fleetflow revolutionized our port dispatching efficiency with real-time intelligence."
                            </p>
                            <div className="flex items-center gap-3">
                                <img
                                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=100&h=100&auto=format&fit=crop"
                                    className="w-10 h-10 rounded-xl object-cover border border-white/20"
                                    alt="Profile"
                                />
                                <div>
                                    <p className="text-xs font-black text-white uppercase tracking-widest">Captain Anirudh V.</p>
                                    <p className="text-[10px] text-slate-400 uppercase font-black mt-0.5">Maritime Lead</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Form Area */}
                <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-16 bg-white">
                    <div className="max-w-md mx-auto w-full py-6 lg:py-12">
                        {step === 1 ? (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <div className="mb-8">
                                    <div className="lg:hidden w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-6 shadow-lg shadow-primary-600/20">
                                        <Ship className="w-7 h-7 text-white" />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Sign In</h2>
                                    <p className="text-slate-500 text-[10px] sm:text-sm font-bold uppercase tracking-widest">Choose operational terminal</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {Object.values(ROLES).map((role) => (
                                        <button
                                            key={role.id}
                                            onClick={() => handleRoleSelect(role.id)}
                                            className={`group relative p-5 rounded-2xl border-2 text-left transition-all duration-300 cursor-pointer overflow-hidden ${roleBtnStyles}`}
                                        >
                                            <div className="flex items-center gap-4 relative z-10">
                                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-50 group-hover:bg-primary-50 flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300 grayscale group-hover:grayscale-0">
                                                    {role.icon}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-bold text-xs sm:text-sm text-slate-900 group-hover:text-primary-600 transition-colors uppercase tracking-widest truncate">{role.label}</p>
                                                    <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 font-medium line-clamp-1">{role.description}</p>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-primary-600 group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-10 text-center">
                                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">
                                        No account? <Link to="/signup" className="text-primary-600 font-black hover:text-primary-700 underline decoration-2 underline-offset-4">Join Fleet</Link>
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-slate-400 hover:text-primary-600 text-[10px] font-black mb-8 transition-colors group cursor-pointer uppercase tracking-[0.2em]"
                                >
                                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                                    Back to Terminals
                                </button>

                                <div className="mb-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl border-2 border-primary-100 shadow-xl shadow-primary-500/10">
                                            {ROLES[selectedRole].icon}
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tighter leading-none">{ROLES[selectedRole].label}</h2>
                                            <div className="flex items-center gap-2 mt-1.5 text-primary-600 font-black text-[10px] uppercase tracking-[0.2em]">
                                                <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
                                                Secure Access
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-4 lg:space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Terminal ID (Email)</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="commander@fleetflow.io"
                                                className="w-full pl-12 pr-6 py-3.5 sm:py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-600 transition-all text-slate-900 font-bold text-[13px] sm:text-sm placeholder:text-slate-200"
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between px-1">
                                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Auth Key (Password)</label>
                                            <a href="#" className="text-[10px] font-black text-primary-600 hover:text-primary-800 transition-colors uppercase tracking-widest">Recover</a>
                                        </div>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                placeholder="••••••••••••"
                                                className="w-full pl-12 pr-6 py-3.5 sm:py-4 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-600 transition-all text-slate-900 font-bold text-[13px] sm:text-sm placeholder:text-slate-200"
                                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg mb-4 animate-in fade-in slide-in-from-top-1">
                                            <p className="text-red-800 text-[10px] font-bold uppercase tracking-widest">{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full py-4 sm:py-5 bg-slate-900 hover:bg-black text-white font-black rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-xs sm:text-sm uppercase tracking-[0.2em]"
                                    >
                                        Authorize Terminal
                                    </button>
                                </form>

                                <div className="mt-10 text-center font-bold">
                                    <p className="text-slate-400 text-xs uppercase tracking-widest">
                                        Setup required? <Link to="/signup" className="text-primary-600 font-black hover:text-primary-700 underline decoration-2 underline-offset-4">Register Terminal</Link>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Login
