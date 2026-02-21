import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Ship, ArrowRight, ArrowLeft, Mail, Lock, User, Building, ShieldCheck } from 'lucide-react'

function Signup() {
    const { ROLES, setSelectedRole, selectedRole, signup } = useAuth()
    const [step, setStep] = useState(1) // 1: Role Selection, 2: Signup Form
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        company: '',
        password: '',
        receiveUpdates: true
    })

    const [passwordError, setPasswordError] = useState('')
    const [signupError, setSignupError] = useState('')

    const handleRoleSelect = (roleId) => {
        setSelectedRole(roleId)
        setStep(2)
        setPasswordError('')
        setSignupError('')
    }

    const validatePassword = (pass) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
        if (!regex.test(pass)) {
            return "Required: 8+ chars, uppercase, lowercase, number, & special char (@$!%*?&)."
        }
        return ""
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSignupError('')

        const pError = validatePassword(formData.password)
        if (pError) {
            setPasswordError(pError)
            return
        }

        try {
            setPasswordError('')
            signup({
                ...formData,
                role: selectedRole,
                name: formData.fullName
            })
        } catch (err) {
            setSignupError(err.message)
        }
    }

    // Filter roles to exclude ADMIN for signup
    const signupRoles = Object.values(ROLES).filter(role => role.id !== 'ADMIN')

    // Shared styling for constant professional feel
    const roleBtnStyles = "border-slate-200 bg-white hover:border-primary-500 hover:ring-4 hover:ring-primary-500/5 text-slate-700 shadow-sm"

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            <div className="flex-1 grid lg:grid-cols-2">

                {/* Left Side: Maritime Branding */}
                <div className="hidden lg:flex flex-col justify-between p-16 relative overflow-hidden">
                    {/* Background Image with Overlay */}
                    <div
                        className="absolute inset-0 z-0 bg-cover bg-center"
                        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1520437358207-323b43b50729?q=80&w=2070&auto=format&fit=crop')` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary-950/95 via-primary-900/80 to-slate-950/40 backdrop-blur-[1px]"></div>
                    </div>

                    <div className="relative z-10">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-xl border border-white/20">
                            <Ship className="w-9 h-9 text-primary-700" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter mb-4 leading-tight text-white">
                            Command the <br /> Corridors.
                        </h1>
                        <p className="text-primary-50 text-base sm:text-lgleading-relaxed max-w-sm font-medium">
                            Join the industry's most powerful maritime ERP network.
                        </p>
                    </div>

                    <div className="relative z-10 space-y-6">
                        <div className="flex items-center gap-4 p-5 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl max-w-sm">
                            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/10 shadow-inner">
                                <ShieldCheck className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase tracking-widest leading-none text-white">Security Verified</p>
                                <p className="text-[10px] font-bold text-primary-200 mt-1 uppercase tracking-[0.2em]">Regional Oversight</p>
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
                                    <div className="lg:hidden w-14 h-14 bg-primary-700 rounded-xl flex items-center justify-center mb-6 shadow-xl">
                                        <Ship className="w-8 h-8 text-white" />
                                    </div>
                                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 tracking-tighter uppercase">Terminal ID</h2>
                                    <p className="text-slate-500 text-[10px] sm:text-xs font-bold uppercase tracking-widest">Select Operational Designation</p>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    {signupRoles.map((role) => (
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
                                        Already registered? <Link to="/login" className="text-primary-600 font-black hover:text-primary-700 underline decoration-2 underline-offset-4">Sign In</Link>
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
                                    Reset ID Selection
                                </button>

                                <div className="mb-8">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center text-3xl border-2 border-primary-100 shadow-xl shadow-primary-500/10">
                                            {ROLES[selectedRole].icon}
                                        </div>
                                        <div>
                                            <h2 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{ROLES[selectedRole].label} <br /> Registration</h2>
                                        </div>
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-3 lg:space-y-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Operator Name</label>
                                        <div className="relative group">
                                            <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Admiral John Doe"
                                                className="w-full pl-12 pr-6 py-3 sm:py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-600 transition-all font-bold text-[13px] sm:text-sm placeholder:text-slate-200"
                                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Terminal Email</label>
                                        <div className="relative group">
                                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                            <input
                                                type="email"
                                                required
                                                placeholder="commander@fleetflow.io"
                                                className="w-full pl-12 pr-6 py-3 sm:py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-600 transition-all font-bold text-[13px] sm:text-sm placeholder:text-slate-200"
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Fleet Name</label>
                                        <div className="relative group">
                                            <Building className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                            <input
                                                type="text"
                                                required
                                                placeholder="Global Maritime Corp."
                                                className="w-full pl-12 pr-6 py-3 sm:py-3.5 bg-slate-50 border-2 border-slate-100 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 focus:border-primary-600 transition-all font-bold text-[13px] sm:text-sm placeholder:text-slate-200"
                                                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Auth Key</label>
                                        <div className="relative group">
                                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-primary-600 transition-colors" />
                                            <input
                                                type="password"
                                                required
                                                placeholder="••••••••••••"
                                                className={`${passwordError ? 'border-red-500 focus:border-red-600' : 'border-slate-100 focus:border-primary-600'} w-full pl-12 pr-6 py-3 sm:py-3.5 bg-slate-50 border-2 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-500/5 transition-all font-bold text-[13px] sm:text-sm placeholder:text-slate-200`}
                                                onChange={(e) => {
                                                    setFormData({ ...formData, password: e.target.value })
                                                    if (passwordError) setPasswordError(validatePassword(e.target.value))
                                                }}
                                            />
                                        </div>
                                        {passwordError && (
                                            <p className="text-[10px] font-bold text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                                                {passwordError}
                                            </p>
                                        )}
                                    </div>

                                    {signupError && (
                                        <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-lg animate-in fade-in slide-in-from-top-1">
                                            <p className="text-red-800 text-[10px] font-bold uppercase tracking-widest">{signupError}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        className="w-full py-4 sm:py-5 bg-slate-900 hover:bg-black text-white font-black rounded-xl shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer text-xs sm:text-sm uppercase tracking-[0.2em] mt-4"
                                    >
                                        Initialize Terminal
                                    </button>
                                </form>

                                <div className="mt-8 text-center font-bold">
                                    <p className="text-slate-400 text-xs uppercase tracking-widest">
                                        Ready? <Link to="/login" className="text-primary-600 font-black hover:text-primary-700 underline decoration-2 underline-offset-4">Authorize</Link>
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

export default Signup

