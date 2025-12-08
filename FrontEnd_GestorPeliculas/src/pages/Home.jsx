import { useEffect, useState } from 'react';
import { localApi } from '../services/api';
import MovieCard from '../components/MovieCard';
import { useAuth } from '../context/AuthContext';
import { Search, LogOut, User, Settings } from 'lucide-react'; // Añadido icono Settings
import { useNavigate } from 'react-router-dom'; // Para navegar al Admin

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [categorias, setCategorias] = useState([]); // ✅ Nuevo estado para categorías
    const [selectedCat, setSelectedCat] = useState(null); // Para marcar el botón activo
    const [searchTerm, setSearchTerm] = useState('');
    
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // Función para cargar datos iniciales (Películas + Categorías)
    const cargarDatos = async () => {
        try {
            const [resMovies, resCats] = await Promise.all([
                localApi.get('/api/peliculas'),
                localApi.get('/categorias') // Asegúrate de que este endpoint existe en tu CategoriaController
            ]);
            
            setMovies(resMovies.data);
            setCategorias(resCats.data);
            setSelectedCat(null);
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    // Función para filtrar por categoría
    const filtrarPorCategoria = async (nombreCategoria) => {
        try {
            // Llama a tu nuevo endpoint del backend
            const res = await localApi.get(`/api/peliculas/categoria/${nombreCategoria}`);
            setMovies(res.data);
            setSelectedCat(nombreCategoria);
            setSearchTerm(''); // Limpiamos buscador si filtramos por categoría
        } catch (error) {
            console.error("Error filtrando:", error);
        }
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        setSelectedCat(null); // Si buscas, desmarcas la categoría
        
        // Búsqueda en tiempo real
        setTimeout(async () => {
            const url = query ? `/api/peliculas/buscar?query=${query}` : '/api/peliculas';
            const res = await localApi.get(url);
            setMovies(res.data);
        }, 300);
    };

    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            if (isMounted) {
                await cargarDatos();
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#141414] pb-20 overflow-x-hidden">
            {/* --- NAVBAR --- */}
            <nav className="fixed w-full z-50 bg-gradient-to-b from-black/90 to-transparent px-6 py-4 flex justify-between items-center">
                <h1 
                    onClick={cargarDatos} 
                    className="text-[#E50914] text-3xl font-bold tracking-tighter cursor-pointer"
                >
                    CINE APP
                </h1>
                
                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block">
                        <Search className="absolute left-2 top-2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Títulos, géneros..." 
                            className="bg-black/50 border border-white/30 text-white text-sm pl-8 pr-4 py-1.5 rounded-sm focus:outline-none focus:border-white w-64 transition-all"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                    </div>

                    <div className="flex items-center gap-4 text-white text-sm">
                        {/* ✅ Botón Admin (Solo visible si eres admin) */}
                        {user?.esAdmin && (
                            <button 
                                onClick={() => navigate('/admin')}
                                className="flex items-center gap-1 hover:text-[#E50914] transition"
                            >
                                <Settings size={18} /> Panel
                            </button>
                        )}

                        <span className="flex items-center gap-2 opacity-80">
                            <User size={20} /> {user?.username}
                        </span>
                        <button onClick={logout} className="hover:text-gray-300">
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </nav>

            {/* --- HERO --- */}
            <div className="relative h-[60vh] md:h-[80vh] w-full">
                <div className="absolute inset-0 bg-[url('https://image.tmdb.org/t/p/original/rAiYi051M3I.jpg')] bg-cover bg-center">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-transparent to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
                </div>
                <div className="relative z-10 flex flex-col justify-center h-full px-12 max-w-2xl text-white space-y-4 pt-20">
                    <h1 className="text-5xl md:text-6xl font-bold drop-shadow-lg">Interstellar</h1>
                    <p className="text-lg drop-shadow-md text-gray-200 hidden md:block">
                        Un equipo de exploradores viaja a través de un agujero de gusano...
                    </p>
                </div>
            </div>

            {/* --- CONTENIDO PRINCIPAL --- */}
            <div className="px-6 md:px-12 -mt-20 relative z-20 space-y-6">
                
                {/* ✅ BARRA DE CATEGORÍAS */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    <button 
                        onClick={cargarDatos}
                        className={`px-4 py-1.5 text-sm font-semibold rounded-full transition whitespace-nowrap 
                            ${selectedCat === null ? 'bg-white text-black' : 'bg-gray-800 text-white hover:bg-gray-700'}`}
                    >
                        Todas
                    </button>
                    
                    {categorias.map(cat => (
                        <button 
                            key={cat.id}
                            onClick={() => filtrarPorCategoria(cat.nombre)}
                            className={`px-4 py-1.5 text-sm font-semibold rounded-full transition whitespace-nowrap border border-gray-600
                                ${selectedCat === cat.nombre 
                                    ? 'bg-[#E50914] border-[#E50914] text-white' 
                                    : 'bg-black/60 text-white hover:border-white'}`}
                        >
                            {cat.nombre}
                        </button>
                    ))}
                </div>

                {/* RESULTADOS */}
                <div>
                    <h2 className="text-white text-xl font-semibold mb-4 pl-1">
                        {searchTerm ? `Resultados: "${searchTerm}"` : (selectedCat || "Tendencias")}
                    </h2>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {movies.length > 0 ? (
                            movies.map(peli => <MovieCard key={peli.id} movie={peli} />)
                        ) : (
                            <p className="text-gray-500 mt-10 text-center col-span-full">No se encontraron películas.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}