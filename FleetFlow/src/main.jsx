import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { FleetProvider } from './context/FleetContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FleetProvider>
          <App />
        </FleetProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
