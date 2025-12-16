import { useEffect, useState } from 'react';
import { X, Star, Save, Clock, Calendar, User, MessageCircle, Users } from 'lucide-react'; // Añadido Users icon
import { localApi, getMovieImage, getReviewsByMovie } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function MovieModal({ movie, onClose, onVoteSuccess }) {
    const { user } = useAuth();
    
    // Estados Visuales y Datos
    const [imageUrl, setImageUrl] = useState('');
    const [activeTab, setActiveTab] = useState('info'); // 'info' o 'reviews'
    
    // Estados para Votación
    const [rating, setRating] = useState(0); 
    const [hoverRating, setHoverRating] = useState(0); 
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(false);

    // Estados para Ver Valoraciones
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(false); 

    // 1. Efecto: Cargar Imagen y Bloquear Scroll
    useEffect(() => {
        let isMounted = true;
        
        getMovieImage(movie.titulo).then(url => {
            if (isMounted) setImageUrl(url);
        });
        
        document.body.style.overflow = 'hidden';
        return () => { 
            isMounted = false;
            document.body.style.overflow = 'auto'; 
        };
    }, [movie]);

    // 2. Efecto: Cargar Reviews (SOLO si la pestaña es 'reviews')
    useEffect(() => {
        let isMounted = true;

        if (activeTab === 'reviews' && movie) {
            setLoadingReviews(true);
            getReviewsByMovie(movie.id)
                .then(data => {
                    if (isMounted) setReviews(data);
                })
                .catch(err => console.error("Error cargando reviews", err))
                .finally(() => {
                    if (isMounted) setLoadingReviews(false);
                });
        }

        return () => { isMounted = false; };
    }, [activeTab, movie]);

    // Lógica de Votación
    const handleVote = async () => {
        if (rating === 0) return alert("Por favor, selecciona una puntuación.");
        setLoading(true);

        try {
            const critica = {
                comentario: comment || "Sin comentarios",
                nota: rating,
                fecha: new Date().toISOString().split('T')[0],
                peliculaId: movie.id,
                usuarioId: user?.id
            };

            await localApi.post('/criticas', critica);
            
            alert(`¡Gracias por votar a "${movie.titulo}"!`);
            onVoteSuccess(); 
            
            if(activeTab === 'reviews') {
                const data = await getReviewsByMovie(movie.id);
                setReviews(data);
            }
            setRating(0);
            setComment('');
        } catch (error) {
            console.error(error);
            alert("Error al enviar la votación.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            
            {/* TARJETA DEL MODAL (Altura fija h-[85vh]) */}
            <div className="relative w-full max-w-4xl bg-[#0a192f] border border-[#00F0FF]/30 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.2)] overflow-hidden flex flex-col md:flex-row h-[85vh]">
                
                {/* Botón Cerrar */}
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 bg-black/50 text-white rounded-full hover:bg-[#00F0FF] hover:text-black transition-all"
                >
                    <X size={24} />
                </button>

                {/* IZQUIERDA: IMAGEN */}
                <div className="w-full md:w-2/5 h-48 md:h-auto relative shrink-0 bg-black">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-transparent to-transparent md:bg-gradient-to-r"></div>
                    <img 
                        src={imageUrl} 
                        alt={movie.titulo} 
                        className="w-full h-full object-cover opacity-90"
                    />
                </div>

                {/* DERECHA: CONTENIDO */}
                <div className="w-full md:w-3/5 p-6 md:p-8 overflow-hidden flex flex-col">
                    
                    {/* Header Fijo */}
                    <div className="shrink-0 mb-4">
                        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight leading-none">{movie.titulo}</h2>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-blue-300/80 mb-6">
                            <span className="flex items-center gap-1"><Calendar size={14}/> {movie.fechaEstreno}</span>
                            <span className="flex items-center gap-1"><Clock size={14}/> {movie.duracion} min</span>
                            <span className="flex items-center gap-1 text-[#00F0FF] font-bold border border-[#00F0FF]/30 px-2 py-0.5 rounded bg-[#00F0FF]/10">
                                <Star size={12} fill="currentColor"/> {movie.valoracion} / 10
                            </span>
                        </div>

                        {/* Pestañas */}
                        <div className="flex gap-8 border-b border-white/10">
                            <button 
                                onClick={() => setActiveTab('info')}
                                className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'info' ? 'text-[#00F0FF]' : 'text-gray-400 hover:text-white'}`}
                            >
                                Información
                                {activeTab === 'info' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]"></span>}
                            </button>
                            <button 
                                onClick={() => setActiveTab('reviews')}
                                className={`pb-3 text-sm font-bold transition-all relative ${activeTab === 'reviews' ? 'text-[#00F0FF]' : 'text-gray-400 hover:text-white'}`}
                            >
                                Valoraciones
                                {activeTab === 'reviews' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]"></span>}
                            </button>
                        </div>
                    </div>

                    {/* Contenido Scrollable */}
                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                        
                        {/* PESTAÑA 1: INFORMACIÓN */}
                        {activeTab === 'info' && (
                            <div className="animate-fade-in space-y-6 pb-4">
                                <p className="text-gray-300 leading-relaxed text-sm">
                                    {movie.sinopsis}
                                </p>

                                {/* CAJA DE DETALLES (Director, Categorías, Actores) */}
                                <div className="space-y-4 text-sm bg-blue-900/10 p-4 rounded-lg border border-blue-900/30">
                                    
                                    {/* Director */}
                                    <div className="flex items-center gap-2">
                                        <span className="text-[#00F0FF] font-bold uppercase text-xs tracking-wider w-20 shrink-0">Director:</span>
                                        <span className="text-white font-medium">{typeof movie.director === 'object' ? movie.director.nombre : movie.director || 'Desconocido'}</span>
                                    </div>

                                    {/* Categorías */}
                                    <div className="flex items-start gap-2">
                                        <span className="text-[#00F0FF] font-bold uppercase text-xs tracking-wider w-20 shrink-0 mt-1">Géneros:</span>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.categorias && movie.categorias.length > 0 ? movie.categorias.map((cat, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-[#00F0FF]/10 border border-[#00F0FF]/20 rounded text-xs text-blue-200">
                                                    {typeof cat === 'object' ? cat.nombre : cat}
                                                </span>
                                            )) : <span className="text-gray-500 text-xs italic mt-1">No especificado</span>}
                                        </div>
                                    </div>

                                    {/* ✅ NUEVO: Actores */}
                                    <div className="flex items-start gap-2 border-t border-white/5 pt-3">
                                        <span className="text-[#00F0FF] font-bold uppercase text-xs tracking-wider w-20 shrink-0 mt-1 flex items-center gap-1">
                                            <Users size={12}/> Reparto:
                                        </span>
                                        <div className="flex flex-wrap gap-2">
                                            {movie.actores && movie.actores.length > 0 ? movie.actores.map((actor, idx) => (
                                                <span key={idx} className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs text-purple-200">
                                                    {actor}
                                                </span>
                                            )) : <span className="text-gray-500 text-xs italic mt-1">No disponible</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Votación */}
                                <div className="bg-[#020b14]/50 p-5 rounded-xl border border-white/5 mt-4">
                                    <h3 className="text-[#00F0FF] font-bold mb-3 uppercase tracking-widest text-xs flex items-center gap-2">
                                        <Star size={14}/> Tu Voto
                                    </h3>

                                    <div className="flex gap-1 mb-3 justify-center md:justify-start">
                                        {[...Array(10)].map((_, index) => {
                                            const starValue = index + 1;
                                            return (
                                                <Star
                                                    key={index}
                                                    size={22}
                                                    className={`cursor-pointer transition-all duration-200 ${
                                                        starValue <= (hoverRating || rating)
                                                            ? 'text-yellow-400 fill-yellow-400 scale-110 drop-shadow-[0_0_5px_rgba(250,204,21,0.5)]'
                                                            : 'text-gray-700 hover:text-gray-500'
                                                    }`}
                                                    onMouseEnter={() => setHoverRating(starValue)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(starValue)}
                                                />
                                            );
                                        })}
                                    </div>
                                    <p className="text-right text-xs text-yellow-400 font-mono mb-3 h-4">
                                        {hoverRating || rating > 0 ? `${hoverRating || rating} / 10` : ''}
                                    </p>

                                    <textarea
                                        className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-lg p-3 text-sm focus:border-[#00F0FF] focus:outline-none transition-all resize-none placeholder-blue-400/30"
                                        rows="2"
                                        placeholder="Escribe tu opinión (opcional)..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    ></textarea>

                                    <button
                                        onClick={handleVote}
                                        disabled={loading || rating === 0}
                                        className={`w-full mt-3 py-2.5 rounded-lg font-bold flex items-center justify-center gap-2 transition-all text-sm
                                            ${rating > 0 
                                                ? 'bg-[#0066FF] hover:bg-[#0052cc] text-white shadow-[0_0_15px_rgba(0,102,255,0.4)]' 
                                                : 'bg-gray-800 text-gray-500 cursor-not-allowed'}`}
                                    >
                                        {loading ? 'Enviando...' : <><Save size={16}/> Enviar Opinión</>}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PESTAÑA 2: VALORACIONES */}
                        {activeTab === 'reviews' && (
                            <div className="animate-fade-in space-y-3 pb-4">
                                {loadingReviews ? (
                                    <div className="flex flex-col items-center justify-center py-20 text-blue-400/50 h-full">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00F0FF] mb-3"></div>
                                        <p className="text-sm">Cargando opiniones...</p>
                                    </div>
                                ) : reviews.length > 0 ? (
                                    reviews.map((review) => (
                                        <div key={review.id} className="bg-[#0d2137]/50 p-4 rounded-xl border border-white/5 hover:border-[#00F0FF]/30 transition-all group">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="bg-[#00F0FF]/10 p-1.5 rounded-full group-hover:bg-[#00F0FF]/20 transition-colors">
                                                        <User size={14} className="text-[#00F0FF]" />
                                                    </div>
                                                    <span className="font-bold text-white text-sm">
                                                        {review.nombreUsuario || "Usuario de Meliflix"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded-lg border border-yellow-400/20">
                                                    <Star size={10} fill="currentColor"/>
                                                    <span className="text-xs font-bold">{review.nota}</span>
                                                </div>
                                            </div>
                                            
                                            {review.comentario ? (
                                                <p className="text-gray-300 text-sm mb-2 pl-8 leading-relaxed">"{review.comentario}"</p>
                                            ) : (
                                                <p className="text-gray-500 text-xs italic pl-8">Sin comentario escrito.</p>
                                            )}
                                            
                                            <div className="text-right border-t border-white/5 pt-2 mt-2">
                                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">{review.fecha}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="flex flex-col items-center justify-center py-20 text-gray-500 h-full">
                                        <MessageCircle size={48} className="mb-3 opacity-20"/>
                                        <p className="text-lg font-medium text-gray-400">Sin valoraciones</p>
                                        <p className="text-xs opacity-50 text-center max-w-xs mt-1">Esta película aún no tiene críticas. ¡Sé el primero en opinar!</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}