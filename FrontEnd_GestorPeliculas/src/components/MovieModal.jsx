import { useEffect, useState } from 'react';
import { X, Star, Save, Clock, Calendar } from 'lucide-react';
import { localApi, getMovieImage } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MovieModal({ movie, onClose, onVoteSuccess }) {
    const { user } = useAuth();
    const [imageUrl, setImageUrl] = useState('');
    const [rating, setRating] = useState(0); // Nota seleccionada (0-10)
    const [hoverRating, setHoverRating] = useState(0); // Para efecto visual al pasar ratón
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Cargar imagen en alta calidad
        getMovieImage(movie.titulo).then(setImageUrl);
        // Bloquear scroll del body cuando el modal está abierto
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = 'auto'; };
    }, [movie]);

    const handleVote = async () => {
        if (rating === 0) return alert("Por favor, selecciona una puntuación.");
        setLoading(true);

        try {
            // Objeto Critica para el Backend
            const critica = {
                comentario: comment || "Sin comentarios",
                nota: rating,
                fecha: new Date().toISOString().split('T')[0], // Fecha de hoy YYYY-MM-DD
                peliculaId: movie.id,
                usuarioId: user?.id
            };

            await localApi.post('/criticas', critica);
            
            alert(`¡Gracias por votar a "${movie.titulo}"!`);
            onVoteSuccess(); // Avisar al Home para que recargue la media
            onClose(); // Cerrar modal
        } catch (error) {
            console.error(error);
            alert("Error al enviar la votación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        // FONDO OSCURO (Overlay)
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            
            {/* TARJETA DEL MODAL */}
            <div className="relative w-full max-w-4xl bg-[#0a192f] border border-[#00F0FF]/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
                
                {/* Botón Cerrar */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-[#00F0FF] hover:text-black transition-all"
                >
                    <X size={24} />
                </button>

                {/* IZQUIERDA: IMAGEN */}
                <div className="w-full md:w-2/5 h-64 md:h-auto relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent md:bg-gradient-to-r"></div>
                    <img 
                        src={imageUrl} 
                        alt={movie.titulo} 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* DERECHA: INFO Y VOTACIÓN */}
                <div className="w-full md:w-3/5 p-8 overflow-y-auto custom-scrollbar">
                    
                    {/* Título y Datos */}
                    <h2 className="text-4xl font-black text-white mb-2 tracking-tight">{movie.titulo}</h2>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-blue-300/80 mb-6">
                        <span className="flex items-center gap-1"><Calendar size={14}/> {movie.fechaEstreno}</span>
                        <span className="flex items-center gap-1"><Clock size={14}/> {movie.duracion} min</span>
                        <span className="flex items-center gap-1 text-[#00F0FF] font-bold border border-[#00F0FF]/30 px-2 py-0.5 rounded bg-[#00F0FF]/10">
                            <Star size={12} fill="currentColor"/> {movie.valoracion} / 10
                        </span>
                    </div>

                    <p className="text-gray-300 leading-relaxed mb-8 text-sm">
                        {movie.sinopsis}
                    </p>

                    {/* SECCIÓN DE VOTACIÓN */}
                    <div className="bg-[#020b14]/50 p-6 rounded-xl border border-white/5">
                        <h3 className="text-[#00F0FF] font-bold mb-4 uppercase tracking-widest text-xs">
                            Valorar Película
                        </h3>

                        {/* Estrellas Interactivas (Sistema de 10 puntos usando 5 estrellas dobles o 10 estrellas) */}
                        {/* Para simplificar UI, usaremos 10 estrellas pequeñas */}
                        <div className="flex gap-1 mb-4">
                            {[...Array(10)].map((_, index) => {
                                const starValue = index + 1;
                                return (
                                    <Star
                                        key={index}
                                        size={24}
                                        className={`cursor-pointer transition-all ${
                                            starValue <= (hoverRating || rating)
                                                ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.6)]'
                                                : 'text-gray-600'
                                        }`}
                                        onMouseEnter={() => setHoverRating(starValue)}
                                        onMouseLeave={() => setHoverRating(0)}
                                        onClick={() => setRating(starValue)}
                                    />
                                );
                            })}
                        </div>
                        <p className="text-right text-xs text-yellow-400 font-mono mb-4 h-4">
                            {hoverRating || rating > 0 ? `${hoverRating || rating} / 10` : 'Haz clic para puntuar'}
                        </p>

                        {/* Comentario */}
                        <textarea
                            className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-lg p-3 text-sm focus:border-[#00F0FF] focus:outline-none transition-all resize-none placeholder-blue-400/30"
                            rows="3"
                            placeholder="Escribe tu opinión (opcional)..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        ></textarea>

                        {/* Botón Enviar */}
                        <button
                            onClick={handleVote}
                            disabled={loading || rating === 0}
                            className={`w-full mt-4 py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-all
                                ${rating > 0 
                                    ? 'bg-[#0066FF] hover:bg-[#0052cc] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]' 
                                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}
                        >
                            {loading ? 'Enviando...' : <><Save size={18}/> Enviar Voto</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}