import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin'; // ✅ Importamos la nueva página

// Componente que protege las rutas
const ProtectedRoute = ({ children, requireAdmin }) => {
    const { user } = useAuth();
    
    // 1. Si no hay usuario, al Login
    if (!user) return <Navigate to="/login" />;
    
    // 2. Si la ruta requiere admin y el usuario NO lo es, al Home
    if (requireAdmin && !user.esAdmin) return <Navigate to="/" />;
    
    return children;
};

export default function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    
                    {/* Ruta Normal (Usuarios y Admins) */}
                    <Route path="/" element={
                        <ProtectedRoute>
                            <Home />
                        </ProtectedRoute>
                    }/>
                    
                    {/* ✅ Ruta de Administración (Solo Admins) */}
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