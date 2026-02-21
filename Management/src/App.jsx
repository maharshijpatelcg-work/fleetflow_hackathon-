import React from 'react';
import { FleetProvider } from './context/FleetContext';
import MaintenanceLogs from './pages/MaintenanceLogs';

function App() {
  return (
    <FleetProvider>
      <MaintenanceLogs />
    </FleetProvider>
  );
}

export default App;
