import { useEffect, useState } from 'react';
import { getMovieImage } from '../services/api';
import { Star, PlayCircle } from 'lucide-react';

export default function MovieCard({ movie, onClick }) {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        getMovieImage(movie.titulo).then(url => setImageUrl(url));
    }, [movie.titulo]);

    return (
        <div 
            onClick={() => onClick && onClick(movie)}
            // CAMBIO 2: Usamos 'group/card' para aislar el hover de la tarjeta
            className="relative group/card cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] border border-transparent hover:border-[#00F0FF]/50"
        >
            {/* Imagen: Escucha a 'group-hover/card' */}
            {imageUrl ? (
                <img 
                    src={imageUrl} 
                    alt={movie.titulo} 
                    className="w-full h-[320px] object-cover transition-opacity duration-300 group-hover/card:opacity-80" 
                />
            ) : (
                <div className="w-full h-[320px] bg-[#0d2137] animate-pulse"></div>
            )}
            
            {/* Icono Play: Escucha a 'group-hover/card' */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 z-10">
                <PlayCircle size={50} className="text-[#00F0FF] fill-[#00F0FF]/20 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            </div>

            {/* Info: Escucha a 'group-hover/card' */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#020b14] via-[#0a192f]/90 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-bold text-sm mb-1 truncate drop-shadow-md">{movie.titulo}</h3>
                
                <div className="flex items-center justify-between text-xs text-blue-200/80">
                    <div className="flex items-center gap-2">
                        <span className="text-[#00F0FF] font-bold drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                            {movie.valoracion ? Math.round(movie.valoracion * 10) : 0}% Match
                        </span>
                        <span className="border border-blue-500/50 px-1.5 rounded-[4px] text-[10px] bg-blue-900/30">HD</span>
                    </div>

                    <div className="flex items-center gap-1 text-yellow-400">
                        <Star size={12} fill="currentColor" />
                        <span className="text-xs font-semibold">{movie.valoracion}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}