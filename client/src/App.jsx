import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Users from './Users'
import CreateUser from './CreateUser'
import UpdateUser from './UpdateUser'
import SignUp from './SignUp'
import Login from './Login'
import { AuthProvider, useAuth } from './AuthContext'

// Protected Route Component using AuthContext
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // If authenticated, render child routes (Outlet)
  // If not, redirect to login page
  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

function App() {
  return (
    <>
      <div className='container'>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Login />} />
              <Route path="/register" element={<SignUp />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/main" element={<Users />} />
                <Route path="/create" element={<CreateUser />} />
                <Route path="/update/:id" element={<UpdateUser />} />
              </Route>

              {/* Catch all other routes and redirect to login */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </div>
    </>
  )
}

export default App