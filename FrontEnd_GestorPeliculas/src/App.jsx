import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Reviews from './pages/Reviews';

const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user } = useAuth();
    if (!user) return <Navigate to="/login" />;
    if (requireAdmin && !user.esAdmin) return <Navigate to="/" />;
    return children;
};

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }/>
                    
                    {/* ✅ Nueva Ruta para Reseñas */}
                    <Route path="/reviews" element={
                        <ProtectedRoute>
                            <Reviews />
                        </ProtectedRoute>
                    }/>
                    
                    <Route path="/admin" element={
                        <ProtectedRoute requireAdmin={true}>
                            <Admin />
                        </ProtectedRoute>
                    }/>
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}