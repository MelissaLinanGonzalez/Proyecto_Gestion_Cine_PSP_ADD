import { createContext, useState, useContext } from 'react';

// 1. Crear el contexto (IMPORTANTE: NO pongas 'export' aquí)
const AuthContext = createContext();

// 2. Componente Provider (Este sí se exporta)
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

// 3. Hook personalizado (Este también se exporta)
// La siguiente línea evita el error de "Fast refresh"
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    return useContext(AuthContext);
};