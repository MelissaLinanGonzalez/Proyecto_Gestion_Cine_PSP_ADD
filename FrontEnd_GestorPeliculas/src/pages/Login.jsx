import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { localApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    const [creds, setCreds] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const res = await localApi.post('/usuarios/login', creds);
            login(res.data);
            navigate('/'); 
        } catch (err) {
            setError("Usuario o contraseña incorrectos.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setCreds({ ...creds, [e.target.name]: e.target.value });
    };

    return (
        // CONTENEDOR PRINCIPAL
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
            
            {/* 1. FONDO DE CARÁTULAS (Collage) */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center opacity-60 scale-105"
                style={{ 
                    // Usamos una imagen de collage de pósters de cine
                    backgroundImage: "url('https://wallpapers.com/images/hd/movie-poster-background-1920-x-1080-8t55s08q8r9q09d6.jpg')" 
                }}
            ></div>

            {/* 2. CAPA DE OSCURECIMIENTO (Para que el texto se lea bien) */}
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black via-black/80 to-black/60"></div>

            {/* LOGO (Esquina superior) */}
            <div className="absolute top-8 left-8 z-30">
                <h1 className="text-[#E50914] text-5xl font-extrabold tracking-tighter drop-shadow-lg cursor-pointer hover:scale-105 transition">
                    MELIFLIX
                </h1>
            </div>

            {/* 3. EL CUADRADO CENTRAL (Login Box) */}
            <div className="relative z-20 w-full max-w-md p-10 bg-black/75 backdrop-blur-md rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 animate-fade-in-up">
                
                <h2 className="text-3xl font-bold text-white mb-8 text-center">Bienvenido de nuevo</h2>
                
                {/* Mensaje de error */}
                {error && (
                    <div className="mb-6 bg-[#e87c03]/20 border border-[#e87c03] text-[#e87c03] px-4 py-3 rounded text-sm text-center font-semibold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* Campo Usuario */}
                    <div className="relative group">
                        <input 
                            type="text" 
                            name="username"
                            className="w-full bg-[#1a1a1a] text-white border border-gray-600 rounded px-4 pt-5 pb-2 focus:border-[#E50914] focus:outline-none transition peer"
                            placeholder=" "
                            onChange={handleChange}
                            required
                        />
                        <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#E50914]">
                            Usuario o Email
                        </label>
                    </div>

                    {/* Campo Contraseña */}
                    <div className="relative group">
                        <input 
                            type="password" 
                            name="password"
                            className="w-full bg-[#1a1a1a] text-white border border-gray-600 rounded px-4 pt-5 pb-2 focus:border-[#E50914] focus:outline-none transition peer"
                            placeholder=" "
                            onChange={handleChange}
                            required
                        />
                        <label className="absolute left-4 top-4 text-gray-400 text-sm transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-focus:top-1 peer-focus:text-xs peer-focus:text-[#E50914]">
                            Contraseña
                        </label>
                    </div>

                    {/* Botón de Entrar */}
                    <button 
                        disabled={loading}
                        className={`w-full bg-[#E50914] hover:bg-[#ff0a16] text-white font-bold py-4 rounded shadow-lg transform hover:scale-[1.02] transition-all duration-200 mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? (
                            <div className="flex justify-center items-center gap-2">
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Entrando...
                            </div>
                        ) : 'Iniciar Sesión'}
                    </button>
                </form>

                {/* Pie del formulario */}
                <div className="mt-8 text-gray-400 text-sm flex justify-between items-center">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-white transition">
                        <input type="checkbox" className="w-4 h-4 rounded accent-[#E50914] bg-gray-700 border-none" />
                        Recuérdame
                    </label>
                    <span className="hover:text-white hover:underline cursor-pointer transition">¿Ayuda?</span>
                </div>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    ¿Nuevo en Cine App? <span className="text-white font-bold hover:underline cursor-pointer ml-1">Regístrate gratis</span>
                </div>
            </div>
        </div>
    );
}