import { useEffect, useState } from 'react';
import { localApi, getMovieImage, getMovieTrailer } from '../services/api';
import Row from '../components/Row'; // ✅ Importamos el nuevo componente Row
import MovieModal from '../components/MovieModal';
import { useAuth } from '../context/AuthContext';
import { Search, LogOut, User, Settings, Clapperboard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [movies, setMovies] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados Modal y Hero
    const [selectedMovie, setSelectedMovie] = useState(null); 
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [featuredImage, setFeaturedImage] = useState('');
    const [featuredVideo, setFeaturedVideo] = useState(null); 

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const cargarDatos = async () => {
        try {
            const [resMovies, resCats] = await Promise.all([
                localApi.get('/api/peliculas'),
                localApi.get('/categorias')
            ]);
            
            setMovies(resMovies.data);
            setCategorias(resCats.data);
            
            // Hero aleatorio
            if (resMovies.data.length > 0) {
                const randomMovie = resMovies.data[Math.floor(Math.random() * resMovies.data.length)];
                setFeaturedMovie(randomMovie);
                getMovieImage(randomMovie.titulo).then(url => setFeaturedImage(url));
                getMovieTrailer(randomMovie.titulo).then(url => setFeaturedVideo(url));
            }
        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    useEffect(() => { 
        const cargarDatos = async () => {
            
        };
        cargarDatos(); 
    }, []);

    // Helper: Filtrar películas por nombre de categoría (usando el array que viene del backend)
    const getMoviesByCategory = (catName) => {
        return movies.filter(m => m.categorias && m.categorias.includes(catName));
    };

    // Helper: Filtrar y ordenar resultados de búsqueda
    const getFilteredMovies = () => {
        if (!searchTerm) return movies;
        return movies.filter(m => m.titulo.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    return (
        <div className="min-h-screen bg-[#020b14] pb-20 overflow-x-hidden font-sans text-blue-100">
            
            {/* Modal */}
            {selectedMovie && (
                <MovieModal 
                    movie={selectedMovie} 
                    onClose={() => setSelectedMovie(null)} 
                    onVoteSuccess={cargarDatos}
                />
            )}

            {/* Navbar */}
            <nav className="fixed w-full z-50 bg-[#0a192f]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center shadow-lg transition-all duration-300">
                <div onClick={cargarDatos} className="flex items-center gap-2 cursor-pointer group">
                    <h1 className="text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-[#0066FF] to-[#00F0FF] bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(0,240,255,0.3)] group-hover:scale-105 transition-transform">
                        MELIFLIX
                    </h1>
                </div>
                
                <div className="flex items-center gap-6">
                    <div className="relative hidden md:block group">
                        <Search className="absolute left-3 top-2.5 text-blue-400 group-focus-within:text-[#00F0FF] transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar títulos..." 
                            className="bg-[#0d2137] border border-blue-900/50 text-blue-100 text-sm pl-10 pr-4 py-2 rounded-full focus:outline-none focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/50 w-64 transition-all shadow-inner placeholder-blue-400/50"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="flex items-center gap-4 text-sm font-medium">
                        <button onClick={() => navigate('/reviews')} className="text-sm font-bold text-blue-300 hover:text-[#00F0FF] transition-colors">Comunidad</button>
                        {user?.esAdmin && (
                            <button onClick={() => navigate('/admin')} className="flex items-center gap-2 bg-[#0066FF] hover:bg-[#0052cc] text-white px-4 py-2 rounded-full transition-all shadow-[0_0_15px_rgba(0,102,255,0.4)]">
                                <Settings size={16} /> <span className="hidden sm:inline">Panel</span>
                            </button>
                        )}
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0d2137] border border-blue-900/30">
                            <User size={18} className="text-[#00F0FF]" />
                            <span className="text-blue-100">{user?.username}</span>
                        </div>
                        <button onClick={logout}><LogOut size={20} className="hover:text-[#00F0FF]" /></button>
                    </div>
                </div>
            </nav>

            {/* Si estamos buscando, mostramos grid simple. Si no, mostramos Hero + Filas */}
            {searchTerm ? (
                <div className="pt-32 px-6 md:px-16 min-h-screen">
                    <h2 className="text-2xl font-bold text-white mb-6">Resultados para: "{searchTerm}"</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {getFilteredMovies().map(peli => (
                            <MovieCard key={peli.id} movie={peli} onClick={setSelectedMovie} />
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    <div className="relative h-[60vh] md:h-[85vh] w-full group overflow-hidden bg-black mb-12">
                        {featuredVideo ? (
                            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                                <iframe src={featuredVideo} className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 object-cover opacity-60" allow="autoplay; encrypted-media" title="Trailer"></iframe>
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: `url('${featuredImage}')` }}></div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020b14] via-[#020b14]/70 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020b14] via-transparent to-transparent"></div>
                        <div className="relative z-10 flex flex-col justify-center h-full px-8 md:px-16 max-w-3xl space-y-6 pt-20 animate-fade-in-up">
                            <span className="text-[#00F0FF] font-bold tracking-widest text-sm uppercase drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] border border-[#00F0FF]/30 px-3 py-1 rounded w-fit bg-[#00F0FF]/10 backdrop-blur-sm">
                                {featuredMovie ? "Película Destacada" : "Cargando..."}
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">{featuredMovie?.titulo}</h1>
                            <p className="text-lg md:text-xl text-blue-100/90 drop-shadow-md max-w-2xl leading-relaxed line-clamp-3">{featuredMovie?.sinopsis}</p>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => featuredMovie && setSelectedMovie(featuredMovie)} className="bg-white text-[#020b14] px-8 py-3.5 rounded-lg font-bold hover:bg-[#00F0FF] hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2"><Clapperboard size={20} /> Reproducir</button>
                                <button onClick={() => featuredMovie && setSelectedMovie(featuredMovie)} className="bg-[#0a192f]/60 backdrop-blur-md border border-blue-500/30 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-blue-900/50 hover:border-[#00F0FF] transition-all flex items-center gap-2">Más Info</button>
                            </div>
                        </div>
                    </div>

                    {/* FILAS DE PELÍCULAS (Estilo Netflix) */}
                    <div className="-mt-32 relative z-20 space-y-4">
                        
                        {/* 1. Novedades (Ordenadas por fecha) */}
                        <Row 
                            title="Novedades en Meliflix" 
                            movies={[...movies].sort((a,b) => new Date(b.fechaEstreno) - new Date(a.fechaEstreno))} 
                            onMovieClick={setSelectedMovie} 
                        />

                        {/* 2. Top Rated (Ordenadas por nota) */}
                        <Row 
                            title="Aclamadas por la Crítica" 
                            movies={[...movies].sort((a,b) => b.valoracion - a.valoracion).slice(0, 10)} 
                            onMovieClick={setSelectedMovie} 
                        />

                        {/* 3. Filas por Categoría Dinámica */}
                        {categorias.map(cat => (
                            <Row 
                                key={cat.id} 
                                title={cat.nombre} 
                                movies={getMoviesByCategory(cat.nombre)} 
                                onMovieClick={setSelectedMovie} 
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}