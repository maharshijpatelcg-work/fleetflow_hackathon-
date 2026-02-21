import { createContext, useContext, useState } from 'react'

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
        label: 'Security Officer (Admin)',
        icon: '🛡️',
        image: 'https://images.unsplash.com/photo-1590650046871-92c8872c5f16?q=80&w=400&h=400&auto=format&fit=crop',
        description: 'Manage user approvals and system security.',
        color: 'warning',
        isAdmin: true
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        try {
            const saved = localStorage.getItem('currentUser')
            return saved ? JSON.parse(saved) : null
        } catch (e) {
            console.error('Core: Auth session initialization failed', e)
            return null
        }
    })
    const [selectedRole, setSelectedRole] = useState(null)

    // Helper to get all registered users
    const getStoredUsers = () => JSON.parse(localStorage.getItem('registeredUsers')) || []

    const signup = (userData) => {
        const users = getStoredUsers()
        const normalizedEmail = userData.email?.toLowerCase().trim()

        if (!normalizedEmail) throw new Error('Terminal ID (Email) is required.')

        // Prevent duplicate emails (case-insensitive)
        if (users.find(u => u.email?.toLowerCase().trim() === normalizedEmail)) {
            throw new Error('This Terminal ID is already registered in the network.')
        }

        const newUser = {
            ...userData,
            email: normalizedEmail,
            status: 'APPROVED' // Default for local simulation
        }

        users.push(newUser)
        localStorage.setItem('registeredUsers', JSON.stringify(users))

        setUser(newUser)
        localStorage.setItem('currentUser', JSON.stringify(newUser))
    }

    const login = (email, password) => {
        const users = getStoredUsers()
        const normalizedEmail = email?.toLowerCase().trim()

        const foundUser = users.find(u =>
            u.email?.toLowerCase().trim() === normalizedEmail &&
            u.password === password
        )

        if (!foundUser) {
            throw new Error('Invalid credentials. Check your Terminal ID and Auth Key.')
        }

        // Check if user is trying to login with a different role than they registered with
        if (selectedRole && foundUser.role !== selectedRole) {
            const registeredRole = ROLES[foundUser.role]?.label || foundUser.role
            throw new Error(`Unauthorized: This ID is restricted to the ${registeredRole} terminal.`)
        }

        setUser(foundUser)
        localStorage.setItem('currentUser', JSON.stringify(foundUser))
    }

    const logout = () => {
        setUser(null)
        setSelectedRole(null)
        localStorage.removeItem('currentUser')
    }

    return (
        <AuthContext.Provider value={{ user, signup, login, logout, selectedRole, setSelectedRole, ROLES }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) throw new Error('useAuth must be used within AuthProvider')
    return context
}
