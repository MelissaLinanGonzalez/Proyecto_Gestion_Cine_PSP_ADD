import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import MovieCard from './MovieCard';

export default function Row({ title, movies, onMovieClick }) {
    const rowRef = useRef(null);

    const scroll = (direction) => {
        if (rowRef.current) {
            const { current } = rowRef;
            const scrollAmount = direction === 'left' ? -window.innerWidth / 2 : window.innerWidth / 2;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    // Si no hay películas en esta categoría, no renderizamos nada
    if (!movies || movies.length === 0) return null;

    return (
        <div className="mb-8 space-y-4 px-6 md:px-16 relative group">
            {/* Título de la Fila */}
            <h2 className="text-xl md:text-2xl font-bold text-white flex items-center gap-3">
                <div className="w-1 h-6 bg-[#00F0FF] rounded-full shadow-[0_0_10px_#00F0FF]"></div>
                {title}
            </h2>

            {/* Contenedor del Scroll */}
            <div className="relative">
                
                {/* Flecha Izquierda */}
                <button 
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-0 bottom-0 z-20 bg-black/50 hover:bg-[#00F0FF]/20 text-white hover:text-[#00F0FF] p-2 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center w-12 backdrop-blur-sm"
                >
                    <ChevronLeft size={40} />
                </button>

                {/* Lista de Películas */}
                <div 
                    ref={rowRef}
                    className="flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth py-4 px-1"
                >
                    {movies.map(movie => (
                        <div key={movie.id} className="min-w-[160px] md:min-w-[200px]">
                            <MovieCard movie={movie} onClick={onMovieClick} />
                        </div>
                    ))}
                </div>

                {/* Flecha Derecha */}
                <button 
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-0 bottom-0 z-20 bg-black/50 hover:bg-[#00F0FF]/20 text-white hover:text-[#00F0FF] p-2 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center w-12 backdrop-blur-sm"
                >
                    <ChevronRight size={40} />
                </button>
            </div>
        </div>
    );
}