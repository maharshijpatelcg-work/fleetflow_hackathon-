import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const ROLES = {
    FLEET_MANAGER: {
        id: 'FLEET_MANAGER',
        label: 'Fleet Manager',
        icon: '👨‍💼',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=400&h=400&auto=format&fit=crop',
        description: 'Oversee vehicle health, asset lifecycle, and scheduling.',
        color: 'primary',
    },
    DISPATCHER: {
        id: 'DISPATCHER',
        label: 'Dispatcher',
        icon: '📦',
        image: 'https://images.unsplash.com/photo-1586528116311-ad86629ec024?q=80&w=400&h=400&auto=format&fit=crop',
        description: 'Create trips, assign drivers, and validate cargo loads.',
        color: 'accent',
    },
    FINANCIAL_ANALYST: {
        id: 'FINANCIAL_ANALYST',
        label: 'Financial Analyst',
        icon: '📊',
        image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?q=80&w=400&h=400&auto=format&fit=crop',
        description: 'Audit fuel spend, maintenance ROI, and operational costs.',
        color: 'danger',
    },
    ADMIN: {
        id: 'ADMIN',
        label: 'Security Officer',
        icon: '🛡️',
        image: 'https://images.unsplash.com/photo-1590650046871-92c8872c5f16?q=80&w=400&h=400&auto=format&fit=crop',
        description: 'Manage user approvals, system security, and audit logs.',
        color: 'warning',
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('currentUser')
            return saved ? JSON.parse(saved) : null
        } catch (e) {
            console.error('Auth Context: session initialization failed', e)
            return null
        }
    })

    const login = (email, password, roleId) => {
        const roleInfo = ROLES[roleId]
        if (!roleInfo) throw new Error('Invalid terminal access.')

        // Create a realistic user profile
        const authenticatedUser = {
            id: `USR-${Math.floor(1000 + Math.random() * 9000)}`,
            email: email,
            name: email.split('@')[0], // Extract name from email for demo
            role: roleId,
            status: 'APPROVED',
            lastLogin: new Date().toISOString()
        }

        setUser(authenticatedUser)
        localStorage.setItem('currentUser', JSON.stringify(authenticatedUser))
    }

    const logout = () => {
        setUser(null)
        localStorage.removeItem('currentUser')
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, ROLES }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
