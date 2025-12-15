import { useEffect, useState, useRef } from 'react';
import { localApi, getMovieImage, getMovieTrailer } from '../services/api';
import Row from '../components/Row';
import MovieModal from '../components/MovieModal';
import MovieCard from '../components/MovieCard'; 
import { useAuth } from '../context/AuthContext';
import { Search, LogOut, User, Settings, Clapperboard, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    // --- ESTADOS ---
    const [movies, setMovies] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [selectedCat, setSelectedCat] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Estados Modal y Hero
    const [selectedMovie, setSelectedMovie] = useState(null); 
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [featuredImage, setFeaturedImage] = useState('');
    const [featuredVideo, setFeaturedVideo] = useState(null); 

    // Refs
    const scrollContainerRef = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Hooks
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // --- HELPER: OBTENER DATOS ---
    const fetchAllData = async () => {
        try {
            const [resMovies, resCats] = await Promise.all([
                localApi.get('/api/peliculas'),
                localApi.get('/categorias')
            ]);
            return { 
                movies: Array.isArray(resMovies.data) ? resMovies.data : [],
                cats: Array.isArray(resCats.data) ? resCats.data : []
            };
        } catch (error) {
            console.error("Error obteniendo datos:", error);
            return { movies: [], cats: [] };
        }
    };

    // --- EFFECT: CARGA INICIAL ---
    useEffect(() => {
        let isMounted = true; 

        const init = async () => {
            const data = await fetchAllData();
            
            if (isMounted) {
                const sortedMovies = data.movies.sort((a, b) => b.id - a.id);
                setMovies(sortedMovies);
                setCategorias(data.cats);

                if (sortedMovies.length > 0) {
                    const randomMovie = sortedMovies[Math.floor(Math.random() * sortedMovies.length)];
                    setFeaturedMovie(randomMovie);
                    setFeaturedVideo(null); // Reset video
                    
                    getMovieImage(randomMovie.titulo).then(url => {
                        if (isMounted) setFeaturedImage(url);
                    });
                    getMovieTrailer(randomMovie.titulo).then(url => {
                        if (isMounted) setFeaturedVideo(url);
                    });
                }
            }
        };

        init();
        return () => { isMounted = false; };
    }, []); 

    // --- RECARGAR / RESET ---
    const handleRecargar = async () => {
        setFeaturedVideo(null);
        setFeaturedImage('');
        
        const data = await fetchAllData();
        const sortedMovies = data.movies.sort((a, b) => b.id - a.id);
        
        setMovies(sortedMovies);
        setCategorias(data.cats);
        setSearchTerm('');
        setSelectedCat(null);

        if (sortedMovies.length > 0) {
            const randomMovie = sortedMovies[Math.floor(Math.random() * sortedMovies.length)];
            setFeaturedMovie(randomMovie);
            getMovieImage(randomMovie.titulo).then(url => setFeaturedImage(url));
            getMovieTrailer(randomMovie.titulo).then(url => setFeaturedVideo(url));
        }
    };

    // --- BÚSQUEDA ---
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        setSelectedCat(null);
        
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(async () => {
            try {
                let res;
                if (!query.trim()) {
                    res = await localApi.get('/api/peliculas');
                } else {
                    res = await localApi.get('/api/peliculas/buscar', { params: { query } });
                }

                if (res && res.data && Array.isArray(res.data)) {
                    setMovies(res.data);
                } else {
                    setMovies([]); 
                }
            } catch (error) {
                console.error("Error en búsqueda:", error);
                setMovies([]); 
            }
        }, 300);
    };

    // --- FILTROS ---
    const filtrarPorCategoria = async (nombreCategoria) => {
        try {
            const res = await localApi.get(`/api/peliculas/categoria/${nombreCategoria}`);
            if (Array.isArray(res.data)) {
                setMovies(res.data);
                setSelectedCat(nombreCategoria);
                setSearchTerm('');
            }
        } catch (error) {
            console.error("Error filtrando:", error);
        }
    };

    const handleVoteSuccess = () => {
        if (selectedCat) {
            filtrarPorCategoria(selectedCat);
        } else {
            fetchAllData().then(data => {
                setMovies(data.movies.sort((a, b) => b.id - a.id));
            });
        }
    };

    // --- UI HELPERS ---
    const scrollCategories = (direction) => {
        const container = scrollContainerRef.current;
        if (container) {
            const scrollAmount = direction === 'left' ? -400 : 400;
            container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const getMoviesByCategory = (catName) => {
        return movies.filter(m => m && m.categorias && m.categorias.includes(catName));
    };

    const renderSearchResults = () => {
        if (!Array.isArray(movies)) return [];
        return movies.filter(movie => movie && movie.id);
    };

    return (
        <div className="min-h-screen bg-[#020b14] pb-20 overflow-x-hidden font-sans text-blue-100">
            
            {/* MODAL */}
            {selectedMovie && (
                <MovieModal 
                    movie={selectedMovie} 
                    onClose={() => setSelectedMovie(null)} 
                    onVoteSuccess={handleVoteSuccess}
                />
            )}

            {/* NAVBAR */}
            <nav className="fixed w-full z-50 bg-[#0a192f]/90 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center shadow-lg transition-all duration-300">
                <div onClick={handleRecargar} className="flex items-center gap-2 cursor-pointer group">
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
                            onChange={handleSearch}
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

            {/* BARRA DE CATEGORÍAS */}
            <div className={`relative z-40 px-6 md:px-16 space-y-4 transition-all duration-500 ${searchTerm || selectedCat ? 'pt-32' : '-mt-16'}`}>
                {(searchTerm || selectedCat) && (
                    <h2 className="text-2xl font-bold text-white mb-6 pl-2 border-l-4 border-[#0066FF] flex items-center gap-3">
                        {searchTerm ? `Resultados para: "${searchTerm}"` : `Explorando: ${selectedCat}`}
                    </h2>
                )}

                <div className="relative group">
                    <button onClick={() => scrollCategories('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-[#00F0FF] text-white hover:text-black p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all -ml-4 shadow-lg border border-white/10"><ChevronLeft size={24} /></button>
                    <button onClick={() => scrollCategories('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-[#00F0FF] text-white hover:text-black p-2 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all -mr-4 shadow-lg border border-white/10"><ChevronRight size={24} /></button>
                    
                    <div ref={scrollContainerRef} className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide scroll-smooth px-1">
                        <button 
                            onClick={handleRecargar}
                            className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-300 border backdrop-blur-sm whitespace-nowrap 
                                ${selectedCat === null ? 'bg-[#00F0FF] border-[#00F0FF] text-[#020b14] shadow-[0_0_15px_rgba(0,240,255,0.4)] scale-105' : 'bg-[#0a192f]/60 border-blue-900/50 text-blue-300 hover:border-[#00F0FF]/50 hover:text-white'}`}
                        >
                            Todas
                        </button>
                        {categorias.map(cat => (
                            <button 
                                key={cat.id}
                                onClick={() => filtrarPorCategoria(cat.nombre)}
                                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all duration-300 border backdrop-blur-sm whitespace-nowrap 
                                    ${selectedCat === cat.nombre ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-[0_0_15px_rgba(0,102,255,0.5)] scale-105' : 'bg-[#0a192f]/60 border-blue-900/50 text-blue-300 hover:border-[#0066FF]/50 hover:text-white'}`}
                            >
                                {cat.nombre}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONTENIDO PRINCIPAL */}
            {searchTerm || selectedCat ? (
                <div className="px-6 md:px-16 pb-20 mt-8">
                    {renderSearchResults().length > 0 ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                            {renderSearchResults().map(peli => (
                                <div key={peli.id} className="relative">
                                    <MovieCard movie={peli} onClick={(m) => setSelectedMovie(m)} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-blue-400/50">
                            <Search size={48} className="mb-4 opacity-50"/>
                            <p className="text-xl">No se encontraron películas.</p>
                        </div>
                    )}
                </div>
            ) : (
                <>
                    {/* Hero Section */}
                    {/* ZONA AJUSTADA: padding-bottom aumentado (pb-24 md:pb-40) para empujar el texto hacia arriba */}
                    <div className="relative h-[80vh] w-full group overflow-hidden bg-black -mt-32">
                        {featuredVideo ? (
                            <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
                                <iframe src={featuredVideo} className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 object-cover opacity-60" allow="autoplay; encrypted-media" title="Trailer"></iframe>
                            </div>
                        ) : (
                            <div className="absolute inset-0 bg-cover bg-center opacity-60 transition-opacity duration-700" 
                                 style={{ backgroundImage: featuredImage ? `url('${featuredImage}')` : 'none' }}>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#020b14] via-[#020b14]/70 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#020b14] via-transparent to-transparent"></div>
                        
                        {/* Texto del Hero: Ahora tiene más espacio abajo para que no choque */}
                        <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-16 max-w-4xl space-y-4 pb-24 md:pb-40 pt-20 animate-fade-in-up">
                            <span className="text-[#00F0FF] font-bold tracking-widest text-xs md:text-sm uppercase drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] border border-[#00F0FF]/30 px-2 py-1 rounded w-fit bg-[#00F0FF]/10 backdrop-blur-sm">
                                {featuredMovie ? "Película Destacada" : "Cargando..."}
                            </span>
                            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black text-white leading-tight drop-shadow-2xl">{featuredMovie?.titulo}</h1>
                            <p className="text-sm sm:text-base md:text-xl text-blue-100/90 drop-shadow-md max-w-2xl leading-relaxed line-clamp-3 md:line-clamp-4">{featuredMovie?.sinopsis}</p>
                            
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => featuredMovie && setSelectedMovie(featuredMovie)} className="bg-white text-[#020b14] px-8 py-3.5 rounded-lg font-bold hover:bg-[#00F0FF] hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center gap-2 text-sm md:text-base"><Clapperboard size={20} /> Reproducir</button>
                                <button onClick={() => featuredMovie && setSelectedMovie(featuredMovie)} className="bg-[#0a192f]/60 backdrop-blur-md border border-blue-500/30 text-white px-8 py-3.5 rounded-lg font-bold hover:bg-blue-900/50 hover:border-[#00F0FF] transition-all flex items-center gap-2 text-sm md:text-base">Más Info</button>
                            </div>
                        </div>
                    </div>

                    {/* FILAS DE PELÍCULAS */}
                    {/* ZONA AJUSTADA: Margen negativo reducido (-mt-12 md:-mt-20) para que empiece más abajo */}
                    <div className="-mt-12 md:-mt-20 relative z-20 space-y-4 pl-2 md:pl-4">
                        <Row 
                            title="Novedades en Meliflix" 
                            movies={[...renderSearchResults()].sort((a,b) => new Date(b.fechaEstreno) - new Date(a.fechaEstreno))} 
                            onMovieClick={setSelectedMovie} 
                        />
                        <Row 
                            title="Aclamadas por la Crítica" 
                            movies={[...renderSearchResults()].sort((a,b) => b.valoracion - a.valoracion).slice(0, 10)} 
                            onMovieClick={setSelectedMovie} 
                        />
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