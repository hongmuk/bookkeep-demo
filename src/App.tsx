import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Sales from './pages/Sales';
import Settlement from './pages/Settlement';
import Staff from './pages/Staff';
import Customers from './pages/Customers';
import Integration from './pages/Integration';
import SettingsPage from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/settlement" element={<Settlement />} />
        <Route path="/staff" element={<Staff />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/integration" element={<Integration />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  );
}
