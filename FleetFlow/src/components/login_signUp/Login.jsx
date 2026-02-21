import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Ship, ArrowRight, Mail, Lock, ChevronLeft } from 'lucide-react'

function Login() {
    const { ROLES, login } = useAuth()
    const [step, setStep] = useState(1) // 1: Role Selection, 2: Credentials
    const [selectedRole, setSelectedRole] = useState(null)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [errors, setErrors] = useState({})

    const handleRoleSelect = (role) => {
        setSelectedRole(role)
        setStep(2)
    }

    const handleLoginSubmit = (e) => {
        e.preventDefault()
        const newErrors = {}

        if (!email) newErrors.email = 'Email required for terminal access.'
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Invalid format.'

        if (!password) newErrors.password = 'Password required.'

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        try {
            login(email, password, selectedRole.id)
        } catch (err) {
            console.error(err.message)
        }
    }

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
            <div className="flex-1 grid lg:grid-cols-2">

                {/* Left Side: Branding */}
                <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden bg-slate-900 border-r border-slate-800">
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center opacity-30"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1516738901171-4475440787fa?q=80&w=1920&auto=format&fit=crop')` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900/40 to-transparent"></div>
                    </div>

                    <div className="relative z-10 animate-in fade-in slide-in-from-left-8 duration-700">
                        <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center mb-8 shadow-2xl shadow-primary-600/30">
                            <Ship className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tighter mb-4 leading-tight text-white uppercase italic">
                            FleetFlow <br /> <span className="text-primary-400 not-italic">Operator Node</span>
                        </h1>
                        <p className="text-slate-400 text-lg leading-relaxed max-w-sm font-medium">
                            Cloud-native infrastructure for intelligent fleet synchronization and logistics monitoring.
                        </p>
                    </div>

                    <div className="relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        <div className="p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 max-w-md shadow-2xl border-l-4 border-l-primary-500">
                            <p className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] mb-2">Notice</p>
                            <p className="text-sm font-medium text-slate-200 leading-relaxed">
                                Terminal encryption is active. Please select your operational role to proceed to credential verification.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Side: Flow */}
                <div className="flex-1 flex flex-col justify-center p-6 sm:p-12 lg:p-20">
                    <div className="max-w-md mx-auto w-full">

                        {step === 1 ? (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <div>
                                    <div className="lg:hidden w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-6">
                                        <Ship className="w-7 h-7 text-white" />
                                    </div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase leading-none">Select Role</h2>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Global Fleet Access Gateway</p>
                                </div>

                                <div className="grid grid-cols-1 gap-4">
                                    {Object.values(ROLES).map((role) => (
                                        <button
                                            key={role.id}
                                            onClick={() => handleRoleSelect(role)}
                                            className="group relative p-6 rounded-3xl border-2 border-slate-100 bg-white hover:border-primary-500 hover:shadow-xl transition-all duration-300 text-left flex items-center gap-5"
                                        >
                                            <div className="w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center text-3xl group-hover:bg-primary-50 transition-colors">
                                                {role.icon}
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-black text-base text-slate-900 group-hover:text-primary-600 uppercase tracking-tight leading-none mb-1">{role.label}</p>
                                                <p className="text-[11px] text-slate-500 font-medium leading-tight">{role.description}</p>
                                            </div>
                                            <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-primary-600 transition-colors" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
                                <button
                                    onClick={() => setStep(1)}
                                    className="flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-primary-600 uppercase tracking-widest transition-colors mb-4"
                                >
                                    <ChevronLeft size={14} /> Back to Role Selection
                                </button>

                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 mb-1 tracking-tighter uppercase leading-none">
                                        Login as {selectedRole?.label}
                                    </h2>
                                    <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Initialize Terminal Credentials</p>
                                </div>

                                <form onSubmit={handleLoginSubmit} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fleet ID (Email)</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="email"
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                placeholder="mail@fleet.com"
                                                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-100 rounded-2xl font-bold focus:outline-none focus:border-primary-500 transition-all outline-none"
                                            />
                                        </div>
                                        {errors.email && <p className="text-[10px] font-bold text-red-500 uppercase ml-1">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Credential (Password)</label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                                            <input
                                                type="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                placeholder="••••••••"
                                                className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-100 rounded-2xl font-bold focus:outline-none focus:border-primary-500 transition-all outline-none"
                                            />
                                        </div>
                                        {errors.password && <p className="text-[10px] font-bold text-red-500 uppercase ml-1">{errors.password}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full h-14 bg-primary-600 hover:bg-primary-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary-500/10 transition-all active:scale-98"
                                    >
                                        Confirm Authorization
                                    </button>
                                </form>

                                <div className="text-center pt-10">
                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.3em]">
                                        Secure Node: {selectedRole?.id} Terminal 01
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
