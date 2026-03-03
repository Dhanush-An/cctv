import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminLayout from './components/layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import Services from './pages/admin/Services';
import Branches from './pages/admin/Branches';
import Payments from './pages/admin/Payments';
import Reviews from './pages/admin/Reviews';
import Customers from './pages/admin/Customers';
import Employees from './pages/admin/Employees';
import Settings from './pages/admin/Settings';

import TechnicianLayout from './components/layouts/TechnicianLayout';
import TechnicianDashboard from './pages/technician/Dashboard';
import TechnicianJobs from './pages/technician/Jobs';
import TechnicianEarnings from './pages/technician/Earnings';
import TechnicianSchedule from './pages/technician/Schedule';
import TechnicianReviews from './pages/technician/Reviews';
import TechnicianProfile from './pages/technician/Profile';
import CustomerLayout from './components/layouts/CustomerLayout';
import CustomerDashboard from './pages/customer/Dashboard';
import CustomerProducts from './pages/customer/Products';
import CartPage from './pages/customer/Cart';
import CustomerServices from './pages/customer/Services';
import CustomerProfile from './pages/customer/Profile';
import CustomerOrders from './pages/customer/Orders';
import CustomerBookings from './pages/customer/Bookings';

import LandingPage from './pages/LandingPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />
          <Route path="/technician/login" element={<Navigate to="/login" replace />} />
          <Route path="/customer/login" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />

          {/* Admin Routes (Protected) */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="services" element={<Services />} />
            <Route path="branches" element={<Branches />} />
            <Route path="payments" element={<Payments />} />
            <Route path="reviews" element={<Reviews />} />
            <Route path="customers" element={<Customers />} />
            <Route path="employees" element={<Employees />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Technician Routes (Protected) */}
          <Route
            path="/technician"
            element={
              <ProtectedRoute allowedRole="technician">
                <TechnicianLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TechnicianDashboard />} />
            <Route path="jobs" element={<TechnicianJobs />} />
            <Route path="earnings" element={<TechnicianEarnings />} />
            <Route path="schedule" element={<TechnicianSchedule />} />
            <Route path="reviews" element={<TechnicianReviews />} />
            <Route path="profile" element={<TechnicianProfile />} />
          </Route>

          {/* Customer Routes (Protected) */}
          <Route
            path="/customer"
            element={
              <ProtectedRoute allowedRole="customer">
                <CustomerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CustomerDashboard />} />
            <Route path="products" element={<CustomerProducts />} />
            <Route path="services" element={<CustomerServices />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="orders" element={<CustomerOrders />} />
            <Route path="bookings" element={<CustomerBookings />} />
            <Route path="wishlist" element={<div className="text-2xl font-bold text-slate-800 p-4">Wishlist</div>} />
            <Route path="profile" element={<CustomerProfile />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
