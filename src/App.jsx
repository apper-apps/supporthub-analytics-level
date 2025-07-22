import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import Layout from '@/components/pages/Layout'
import Dashboard from '@/components/pages/Dashboard'
import UserDashboard from '@/components/pages/UserDashboard'
import AppsOverview from '@/components/pages/AppsOverview'
import AppDetail from '@/components/pages/AppDetail'
import Users from '@/components/pages/Users'
import AILogs from '@/components/pages/AILogs'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="users/:userId" element={<UserDashboard />} />
            <Route path="apps" element={<AppsOverview />} />
            <Route path="apps/:appId" element={<AppDetail />} />
            <Route path="logs" element={<AILogs />} />
          </Route>
        </Routes>
        <ToastContainer
          position="top-right"
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }}
        />
      </div>
    </Router>
  );
}

export default App;