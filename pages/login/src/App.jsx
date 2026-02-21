import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './pages/Login'
import Signup from './pages/Signup'
import { Ship, LogOut } from 'lucide-react'
import TripDispatcher from './components/dispatch_and_manage/TripDispatcher'

// Placeholder for the dashboard content
const Dashboard = () => {
  const { user, logout } = useAuth()
  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center text-center p-6 md:p-8">
      <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl flex items-center justify-center text-5xl mb-8 border border-slate-100 relative group">
        <div className="absolute inset-0 bg-primary-500/5 rounded-[2rem] scale-0 group-hover:scale-100 transition-transform duration-500"></div>
        <span className="relative z-10">
          {user.role === 'FLEET_MANAGER' ? '👨‍💼' :
            user.role === 'DISPATCHER' ? '📦' :
              user.role === 'ADMIN' ? '🛡️' : '📊'}
        </span>
      </div>

      <div className="max-w-xl space-y-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Welcome aboard, <br className="sm:hidden" /> <span className="text-primary-600 font-extrabold">{user?.name || 'Commander'}</span>!
        </h1>
        <p className="text-slate-500 text-sm sm:text-lg leading-relaxed">
          You are authenticated as a <span className="text-slate-900 font-bold uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-lg text-sm">{user?.role?.replace('_', ' ') || 'User'}</span>.
          The full maritime ERP suite is currently initializing for your terminal.
        </p>
      </div>

      <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 w-full px-6">
        <div className="flex items-center justify-center gap-3 px-6 py-3 bg-white border border-slate-200 rounded-2xl shadow-sm w-full sm:w-auto">
          <Ship className="w-5 h-5 text-primary-600" />
          <span className="text-sm font-black text-slate-700 uppercase tracking-widest">FleetFlow Global</span>
        </div>

        <button
          onClick={logout}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl text-sm font-black uppercase tracking-widest transition-all cursor-pointer shadow-lg hover:-translate-y-0.5 w-full sm:w-auto"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/signup" element={user ? <Navigate to="/" /> : <Signup />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            {user?.role === 'DISPATCHER' ? <TripDispatcher /> : <Dashboard />}
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  )
}
