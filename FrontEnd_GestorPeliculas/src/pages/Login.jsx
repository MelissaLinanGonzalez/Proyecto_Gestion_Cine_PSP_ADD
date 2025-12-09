import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { localApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
    // Estado para saber si estamos en Login o Registro
    const [isLoginView, setIsLoginView] = useState(true);

    // Un único estado para todos los datos del formulario
    const [formData, setFormData] = useState({
        username: '',
        email: '', // Solo se usa en registro
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    // Manejador genérico para escribir en los inputs
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            if (isLoginView) {
                // --- LÓGICA DE LOGIN ---
                const res = await localApi.post('/usuarios/login', {
                    username: formData.username,
                    password: formData.password
                });
                login(res.data);
                navigate('/'); 
            } else {
                // --- LÓGICA DE REGISTRO ---
                await localApi.post('/usuarios/register', {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    esAdmin: false // Seguridad extra desde front
                });
                
                // Si sale bien, avisamos y pasamos al login
                alert("¡Cuenta creada! Por favor, inicia sesión.");
                setIsLoginView(true);
                setFormData({ ...formData, password: '' }); // Limpiamos pass
            }
        } catch (err) {
            console.error(err);
            setError(isLoginView 
                ? "Usuario o contraseña incorrectos." 
                : "Error al registrarse. El usuario ya existe."
            );
        } finally {
            setLoading(false);
        }
    };

    // Función para alternar vistas y limpiar errores
    const toggleView = () => {
        setIsLoginView(!isLoginView);
        setError('');
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#020b14]">
            
            {/* FONDO */}
            <div 
                className="absolute inset-0 z-0 bg-cover bg-center opacity-50 scale-105"
                style={{ backgroundImage: "url('https://wallpapers.com/images/hd/movie-poster-background-1920-x-1080-8t55s08q8r9q09d6.jpg')" }}
            ></div>
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#020b14] via-[#041225]/90 to-[#001e3c]/60"></div>

            {/* LOGO */}
            <div className="absolute top-8 left-8 z-30">
                <h1 className="text-4xl font-extrabold tracking-tighter drop-shadow-[0_0_15px_rgba(0,240,255,0.5)] cursor-pointer bg-gradient-to-r from-[#0066FF] to-[#00F0FF] bg-clip-text text-transparent">
                    MELIFLIX
                </h1>
            </div>

            {/* TARJETA CENTRAL */}
            <div className="relative z-20 w-full max-w-md p-10 bg-[#0a192f]/80 backdrop-blur-md rounded-2xl shadow-[0_0_50px_rgba(0,100,255,0.15)] border border-white/5 animate-fade-in-up">
                
                <h2 className="text-3xl font-bold text-white mb-2 text-center">
                    {isLoginView ? 'Bienvenido' : 'Crear Cuenta'}
                </h2>
                <p className="text-blue-200/60 text-center mb-8 text-sm">
                    {isLoginView ? 'Tu portal de cine favorito' : 'Únete a la comunidad de Meliflix'}
                </p>
                
                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    
                    {/* Campo Usuario */}
                    <div className="relative group">
                        <input 
                            type="text" 
                            name="username"
                            value={formData.username}
                            className="w-full bg-[#0d2137] text-white border border-gray-700 rounded-lg px-4 pt-5 pb-2 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/50 focus:outline-none transition-all peer shadow-inner"
                            placeholder=" " 
                            onChange={handleChange}
                            required
                        />
                        <label className="absolute left-4 text-blue-300/50 transition-all duration-200 top-2 text-xs font-semibold tracking-wide peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#00F0FF] peer-focus:font-semibold">
                            Usuario
                        </label>
                    </div>

                    {/* Campo Email (Solo visible en Registro) */}
                    {!isLoginView && (
                        <div className="relative group animate-fade-in">
                            <input 
                                type="email" 
                                name="email"
                                value={formData.email}
                                className="w-full bg-[#0d2137] text-white border border-gray-700 rounded-lg px-4 pt-5 pb-2 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/50 focus:outline-none transition-all peer shadow-inner"
                                placeholder=" " 
                                onChange={handleChange}
                                required
                            />
                            <label className="absolute left-4 text-blue-300/50 transition-all duration-200 top-2 text-xs font-semibold tracking-wide peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#00F0FF] peer-focus:font-semibold">
                                Email
                            </label>
                        </div>
                    )}

                    {/* Campo Contraseña */}
                    <div className="relative group">
                        <input 
                            type="password" 
                            name="password"
                            value={formData.password}
                            className="w-full bg-[#0d2137] text-white border border-gray-700 rounded-lg px-4 pt-5 pb-2 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/50 focus:outline-none transition-all peer shadow-inner"
                            placeholder=" "
                            onChange={handleChange}
                            required
                        />
                        <label className="absolute left-4 text-blue-300/50 transition-all duration-200 top-2 text-xs font-semibold tracking-wide peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:font-normal peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#00F0FF] peer-focus:font-semibold">
                            Contraseña
                        </label>
                    </div>

                    {/* Botón Principal */}
                    <button 
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] hover:from-[#0052cc] hover:to-[#0099cc] text-white font-bold py-4 rounded-lg shadow-[0_4px_20px_rgba(0,194,255,0.3)] transform hover:scale-[1.02] transition-all duration-200 mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Procesando...' : (isLoginView ? 'Iniciar Sesión' : 'Crear Cuenta')}
                    </button>
                </form>

                {/* Pie de tarjeta (Cambiar entre Login/Registro) */}
                <div className="mt-8 text-center text-blue-200/40 text-sm">
                    {isLoginView ? "¿Nuevo en Meliflix?" : "¿Ya tienes cuenta?"}
                    <button 
                        onClick={toggleView}
                        className="text-white font-bold hover:text-[#00F0FF] hover:underline ml-2 transition outline-none"
                    >
                        {isLoginView ? "Regístrate gratis" : "Inicia sesión"}
                    </button>
                </div>
            </div>
        </div>
    );
}