import { Routes, Route } from 'react-router-dom'
import Layout from '@/Layout'
import HoardingDetail from '@/components/utils/HoardingDetail'
import Pending from './components/pending_hoardings/Pending'
import Dashboard from './components/dashboard/Dashboard'
import Approved from './components/approved_hoardings/Approved'
import Rejected from './components/rejected_hoardings/Rejected'
import AllHoardings from './components/all-hoardings/AllHoardings'
import { LoginPage } from './components/auth/Login'
import { ProtectedRoute } from './ProtectedRoute'

const App = () => {
  return (
    <Routes>
    <Route path="/login" element={<LoginPage />} />
    {/* Wrap the protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/pending" element={<Pending />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/approved" element={<Approved />} />
          <Route path="/rejected" element={<Rejected />} />
          <Route path="/all-hoardings" element={<AllHoardings />} />
          <Route path="/hoarding/:id" element={<HoardingDetail />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App