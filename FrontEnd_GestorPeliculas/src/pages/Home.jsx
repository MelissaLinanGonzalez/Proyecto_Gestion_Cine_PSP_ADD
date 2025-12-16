import { useEffect, useState, useRef } from 'react';
import { localApi, getMovieImage, getMovieTrailer, getDirectores, getPeliculasPorDirector, getPeliculasPorCategoria } from '../services/api';
import Row from '../components/Row';
import MovieModal from '../components/MovieModal';
import MovieCard from '../components/MovieCard'; 
import { useAuth } from '../context/AuthContext';
import { Search, LogOut, User, Settings, Clapperboard, Filter, X, ChevronLeft, ChevronRight, Tag, MessageCircle } from 'lucide-react'; // Añadido MessageCircle
import { useNavigate } from 'react-router-dom';

export default function Home() {
    // --- ESTADOS DE DATOS ---
    const [movies, setMovies] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [directores, setDirectores] = useState([]);
    
    // --- ESTADOS UI/BÚSQUEDA ---
    const [showFilters, setShowFilters] = useState(false); 
    const [filterMode, setFilterMode] = useState('directores'); // 'directores' o 'categorias'
    
    const [selectedFilter, setSelectedFilter] = useState(null); 
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredMovies, setFilteredMovies] = useState([]); 

    // --- HERO / MODAL ---
    const [selectedMovie, setSelectedMovie] = useState(null); 
    const [featuredMovie, setFeaturedMovie] = useState(null);
    const [featuredImage, setFeaturedImage] = useState('');
    const [featuredVideo, setFeaturedVideo] = useState(null); 

    const searchTimeoutRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    // --- CARGA DE DATOS ---
    const fetchAllData = async () => {
        try {
            const [resMovies, resCats, resDirs] = await Promise.all([
                localApi.get('/api/peliculas'),
                localApi.get('/categorias'),
                getDirectores()
            ]);

            return { 
                movies: Array.isArray(resMovies.data) ? resMovies.data : [],
                cats: Array.isArray(resCats.data) ? resCats.data : [],
                dirs: Array.isArray(resDirs) ? resDirs : []
            };
        } catch (error) {
            console.error("Error cargando datos:", error);
            return { movies: [], cats: [], dirs: [] };
        }
    };

    useEffect(() => {
        let isMounted = true; 
        const init = async () => {
            const data = await fetchAllData();
            if (isMounted) {
                const sorted = data.movies.sort((a, b) => b.id - a.id);
                setMovies(sorted);
                setCategorias(data.cats);
                setDirectores(data.dirs);

                if (sorted.length > 0) {
                    const random = sorted[Math.floor(Math.random() * sorted.length)];
                    setFeaturedMovie(random);
                    getMovieImage(random.titulo).then(url => isMounted && setFeaturedImage(url));
                    getMovieTrailer(random.titulo).then(url => isMounted && setFeaturedVideo(url));
                }
            }
        };
        init();
        return () => { isMounted = false; };
    }, []); 

    // --- HANDLERS ---
    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchTerm(query);
        setSelectedFilter(null); 
        
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(async () => {
            if (!query.trim()) {
                setFilteredMovies([]);
                return;
            }
            try {
                const res = await localApi.get('/api/peliculas/buscar', { params: { query } });
                setFilteredMovies(res.data || []);
            } catch (error) { console.error(error); }
        }, 300);
    };

    const handleFilterSelect = async (item) => {
        const id = filterMode === 'directores' ? item.id : item.nombre;
        
        if (selectedFilter === id) {
            setSelectedFilter(null);
            setFilteredMovies([]);
            return;
        }

        setSelectedFilter(id);
        setSearchTerm(''); 
        
        try {
            let data = [];
            if (filterMode === 'directores') {
                data = await getPeliculasPorDirector(item.id);
            } else {
                data = await getPeliculasPorCategoria(item.nombre);
            }
            setFilteredMovies(data);
        } catch (error) { console.error(error); }
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedFilter(null);
        setFilteredMovies([]);
    };

    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // UI Helpers
    const getMoviesByCategory = (catName) => movies.filter(m => m.categorias && m.categorias.includes(catName));
    const isSearching = searchTerm.length > 0 || selectedFilter !== null;

    const scrollList = (direction) => {
        if(scrollContainerRef.current){
            const amount = direction === 'left' ? -300 : 300;
            scrollContainerRef.current.scrollBy({ left: amount, behavior: 'smooth' });
        }
    };

    const listaActiva = filterMode === 'directores' ? directores : categorias;

    return (
        <div className="min-h-screen bg-[#020b14] overflow-x-hidden font-sans text-blue-100">
            
            {selectedMovie && <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} onVoteSuccess={() => {}} />}

            {/* --- NAVBAR --- */}
            <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a192f]/95 backdrop-blur-md border-b border-white/5 px-6 py-4 flex justify-between items-center shadow-lg h-[72px]">
                <div onClick={clearFilters} className="cursor-pointer group">
                    <h1 className="text-3xl font-extrabold tracking-tighter bg-gradient-to-r from-[#0066FF] to-[#00F0FF] bg-clip-text text-transparent group-hover:scale-105 transition-transform">MELIFLIX</h1>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="relative hidden md:block group">
                        <Search className="absolute left-3 top-2.5 text-blue-400 group-focus-within:text-[#00F0FF]" size={18} />
                        <input 
                            type="text" 
                            placeholder="Buscar por título..." 
                            className="bg-[#0d2137] border border-blue-900/50 text-blue-100 text-sm pl-10 pr-4 py-2 rounded-full focus:outline-none focus:border-[#00F0FF] w-64 transition-all"
                            value={searchTerm}
                            onChange={handleSearch}
                        />
                        {searchTerm && <button onClick={() => setSearchTerm('')} className="absolute right-3 top-2.5 text-blue-400 hover:text-white"><X size={14}/></button>}
                    </div>

                    {/* BOTÓN TOGGLE FILTROS */}
                    <button 
                        onClick={toggleFilters}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all border relative z-50
                            ${showFilters || selectedFilter 
                                ? 'bg-[#0066FF] text-white border-[#0066FF] shadow-[0_0_15px_rgba(0,102,255,0.5)]' 
                                : 'bg-[#0d2137] text-blue-300 border-blue-900/50 hover:border-[#00F0FF] hover:text-white'
                            }`}
                    >
                        {showFilters ? <X size={18}/> : <Filter size={18}/>}
                        <span className="hidden sm:inline">Filtros</span>
                    </button>

                    <div className="flex items-center gap-4 text-sm font-medium border-l border-white/10 pl-4 ml-2">
                        
                        {/* ✅ BOTÓN COMUNIDAD RESTAURADO */}
                        <button onClick={() => navigate('/reviews')} className="text-blue-300 hover:text-[#00F0FF] flex items-center gap-2 transition-colors">
                            <MessageCircle size={20} />
                            <span className="hidden md:inline">Comunidad</span>
                        </button>

                        {user?.esAdmin && <button onClick={() => navigate('/admin')} className="text-blue-300 hover:text-[#00F0FF]"><Settings size={20} /></button>}
                        <button onClick={logout} className="text-blue-300 hover:text-red-400"><LogOut size={20} /></button>
                    </div>
                </div>
            </nav>

            {/* --- CONTENEDOR PRINCIPAL --- */}
            <div className="pt-[72px]">
                
                {/* --- PANEL DE FILTROS STICKY --- */}
                <div 
                    className={`sticky top-[72px] z-40 w-full bg-[#0a192f] border-b border-[#00F0FF]/30 overflow-hidden transition-all duration-500 ease-in-out shadow-2xl
                    ${showFilters ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}`}
                >
                    <div className="px-6 md:px-16 relative group flex flex-col gap-4">
                        
                        {/* 1. SWITCHER DE MODO */}
                        <div className="flex items-center gap-4 border-b border-white/10 pb-2">
                            <h3 className="text-white/50 text-xs font-bold uppercase tracking-widest mr-2">Filtrar por:</h3>
                            
                            <button 
                                onClick={() => { setFilterMode('directores'); setSelectedFilter(null); }}
                                className={`px-3 py-1 rounded text-sm font-bold transition-all flex items-center gap-2
                                    ${filterMode === 'directores' ? 'bg-[#00F0FF] text-[#020b14]' : 'text-blue-400 hover:text-white'}`}
                            >
                                <User size={14}/> Directores
                            </button>
                            
                            <button 
                                onClick={() => { setFilterMode('categorias'); setSelectedFilter(null); }}
                                className={`px-3 py-1 rounded text-sm font-bold transition-all flex items-center gap-2
                                    ${filterMode === 'categorias' ? 'bg-[#00F0FF] text-[#020b14]' : 'text-blue-400 hover:text-white'}`}
                            >
                                <Tag size={14}/> Categorías
                            </button>
                        </div>

                        {/* 2. LISTA HORIZONTAL */}
                        <div className="relative w-full">
                            <button onClick={() => scrollList('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-[#00F0FF] hover:text-black transition-all"><ChevronLeft size={20}/></button>
                            <button onClick={() => scrollList('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 p-2 rounded-full hover:bg-[#00F0FF] hover:text-black transition-all"><ChevronRight size={20}/></button>

                            <div ref={scrollContainerRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide scroll-smooth px-8">
                                <button 
                                    onClick={clearFilters}
                                    className={`px-5 py-2 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 whitespace-nowrap
                                    ${selectedFilter === null ? 'bg-white text-black' : 'bg-[#0d2137] text-blue-300 border-blue-900/50 hover:bg-white/10'}`}
                                >
                                    Todos
                                </button>

                                {listaActiva.length > 0 ? (
                                    listaActiva.map(item => {
                                        const id = filterMode === 'directores' ? item.id : item.nombre;
                                        const label = item.nombre;
                                        const isSelected = selectedFilter === id;

                                        return (
                                            <button
                                                key={id}
                                                onClick={() => handleFilterSelect(item)}
                                                className={`px-5 py-2 rounded-lg text-sm font-bold border transition-all flex items-center gap-2 whitespace-nowrap
                                                    ${isSelected 
                                                        ? 'bg-[#0066FF] border-[#0066FF] text-white shadow-lg scale-105' 
                                                        : 'bg-[#0d2137] text-blue-300 border-blue-900/50 hover:border-[#00F0FF] hover:text-white hover:bg-white/5'
                                                    }`}
                                            >
                                                {filterMode === 'directores' && <User size={12} className={isSelected ? 'opacity-100' : 'opacity-50'}/>}
                                                {label}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <p className="text-gray-500 italic px-4">Cargando...</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- CONTENIDO --- */}
                {isSearching ? (
                    <div className="px-6 md:px-16 pt-8 pb-20 min-h-[60vh] animate-fade-in-up">
                        <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                {selectedFilter 
                                    ? (
                                        <>
                                            {filterMode === 'directores' ? '🎬 Películas de ' : '🏷️ Categoría: '}
                                            <span className="text-[#00F0FF]">
                                                {filterMode === 'directores' 
                                                    ? directores.find(d => d.id === selectedFilter)?.nombre 
                                                    : selectedFilter}
                                            </span>
                                        </>
                                      )
                                    : <>🔍 Resultados para <span className="text-[#00F0FF]">"{searchTerm}"</span></>
                                }
                            </h2>
                            <button onClick={clearFilters} className="text-sm text-blue-400 hover:text-white flex items-center gap-1"><X size={14}/> Limpiar filtro</button>
                        </div>

                        {filteredMovies.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                                {filteredMovies.map(peli => <MovieCard key={peli.id} movie={peli} onClick={(m) => setSelectedMovie(m)} />)}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-blue-400/30">
                                <Clapperboard size={64} className="mb-4 opacity-20"/>
                                <p className="text-xl font-medium">No se encontraron películas.</p>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="relative h-[80vh] w-full bg-black">
                            {featuredVideo ? (
                                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden">
                                    <iframe src={featuredVideo} className="absolute top-1/2 left-1/2 w-[150%] h-[150%] -translate-x-1/2 -translate-y-1/2 object-cover opacity-60" allow="autoplay; encrypted-media"></iframe>
                                </div>
                            ) : (
                                <div className="absolute inset-0 bg-cover bg-center opacity-60" style={{ backgroundImage: featuredImage ? `url('${featuredImage}')` : 'none' }}></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-[#020b14] via-[#020b14]/20 to-transparent"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-[#020b14] via-transparent to-transparent"></div>
                            
                            <div className="relative z-10 flex flex-col justify-end h-full px-6 md:px-16 pb-32 max-w-4xl">
                                <span className="text-[#00F0FF] font-bold tracking-widest text-sm uppercase mb-3 bg-[#0066FF]/10 backdrop-blur-sm w-fit px-3 py-1 rounded border border-[#00F0FF]/30">Recomendada para ti</span>
                                <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-2xl">{featuredMovie?.titulo}</h1>
                                <p className="text-blue-100/90 text-lg max-w-2xl line-clamp-3 mb-8 drop-shadow-md">{featuredMovie?.sinopsis}</p>
                                <div className="flex gap-4">
                                    <button onClick={() => featuredMovie && setSelectedMovie(featuredMovie)} className="bg-white text-black px-8 py-3.5 rounded-lg font-bold hover:bg-[#00F0FF] transition-all flex items-center gap-2 shadow-lg hover:scale-105"><Clapperboard size={20} /> Ver Detalles</button>
                                </div>
                            </div>
                        </div>

                        <div className="-mt-24 relative z-20 space-y-6 pl-4 md:pl-8 pb-10">
                            <Row title="Últimos Estrenos" movies={[...movies].sort((a,b) => new Date(b.fechaEstreno) - new Date(a.fechaEstreno)).slice(0, 10)} onMovieClick={setSelectedMovie} />
                            {categorias.map(cat => <Row key={cat.id} title={cat.nombre} movies={getMoviesByCategory(cat.nombre)} onMovieClick={setSelectedMovie} />)}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}