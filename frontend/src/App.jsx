import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import MenSalons from './pages/MenSalons';
import WomenSalons from './pages/WomenSalons';
import AddSalon from './pages/AddSalon';
import UpdateSalon from './pages/UpdateSalon';

// Redirect logged-in users away from auth pages
const GuestRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? <Navigate to="/" replace /> : children;
};

// Protect routes that require login
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="w-6 h-6 border-2 border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-white rounded-full animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col bg-white dark:bg-zinc-950 transition-colors duration-200">
              <Navbar />
              {/* This wrapper ensures all page content (main + footer) sits
                  above the position:fixed hero video (z-index:0).
                  Un-positioned elements are below z-index:0 fixed elements
                  in the CSS stacking order, which caused the video to bleed
                  through the footer. Making this wrapper position:relative
                  with z-index:1 fixes it for every page at once. */}
              <div className="relative z-[1] flex flex-col flex-1">
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
                    <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

                    {/* Customer Routes: Men & Women Salons */}
                    <Route
                      path="/men"
                      element={
                        <ProtectedRoute>
                          <MenSalons />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/women"
                      element={
                        <ProtectedRoute>
                          <WomenSalons />
                        </ProtectedRoute>
                      }
                    />

                    {/* Salon Owner Routes: Add Salon & Update Salon */}
                    <Route
                      path="/add-salon"
                      element={
                        <ProtectedRoute requiredRole="owner">
                          <AddSalon />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/update-salon"
                      element={
                        <ProtectedRoute requiredRole="owner">
                          <UpdateSalon />
                        </ProtectedRoute>
                      }
                    />

                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            </div>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;
