import { useEffect, useState } from 'react';
import { getMovieImage } from '../services/api'; // Tu función que habla con TMDB
import { Star } from 'lucide-react'; // Icono de estrella

export default function MovieCard({ movie }) {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        // Nada más cargar, buscamos la foto basada en el título
        getMovieImage(movie.titulo).then(url => setImageUrl(url));
    }, [movie.titulo]);

    return (
        <div className="relative group cursor-pointer transition-transform hover:scale-105 duration-300">
            {/* Imagen de portada */}
            <img 
                src={imageUrl} 
                alt={movie.titulo} 
                className="rounded-md object-cover w-full h-[300px] shadow-lg" 
            />
            
            {/* Información que aparece al pasar el ratón (efecto Netflix) */}
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-b-md">
                <h3 className="text-white font-bold text-sm mb-1">{movie.titulo}</h3>
                
                <div className="flex items-center gap-2 text-xs text-gray-300">
                    <span className="flex items-center text-green-400 font-bold">
                        {movie.valoracion * 10}% Match
                    </span>
                    <span className="border border-gray-500 px-1 rounded text-[10px]">HD</span>
                </div>

                <div className="flex items-center gap-1 mt-1 text-yellow-500">
                    <Star size={12} fill="currentColor" />
                    <span className="text-xs">{movie.valoracion}/10</span>
                </div>
            </div>
        </div>
    );
}