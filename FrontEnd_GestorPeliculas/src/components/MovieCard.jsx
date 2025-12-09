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
            className="relative group cursor-pointer rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,240,255,0.4)] border border-transparent hover:border-[#00F0FF]/50"
        >
            {/* Imagen de portada */}
            <img 
                src={imageUrl} 
                alt={movie.titulo} 
                className="w-full h-[320px] object-cover transition-opacity duration-300 group-hover:opacity-80" 
            />
            
            {/* Icono de Play al hacer hover (Estilo Cyber) */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                <PlayCircle size={50} className="text-[#00F0FF] fill-[#00F0FF]/20 drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]" />
            </div>

            {/* Información flotante (Overlay Azulado) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#020b14] via-[#0a192f]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h3 className="text-white font-bold text-sm mb-1 truncate drop-shadow-md">{movie.titulo}</h3>
                
                <div className="flex items-center justify-between text-xs text-blue-200/80">
                    <div className="flex items-center gap-2">
                        <span className="text-[#00F0FF] font-bold drop-shadow-[0_0_5px_rgba(0,240,255,0.5)]">
                            {movie.valoracion * 10}% Match
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