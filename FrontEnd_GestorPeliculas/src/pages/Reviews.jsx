import { useEffect, useState } from 'react';
import { localApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, User, MessageSquare, Quote } from 'lucide-react';

export default function Reviews() {
    const [reviews, setReviews] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Cargar todas las críticas del backend
        localApi.get('/criticas')
            .then(res => {
                // Ordenar por fecha (las más nuevas primero)
                const ordenadas = res.data.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                setReviews(ordenadas);
            })
            .catch(err => console.error("Error cargando críticas", err));
    }, []);

    return (
        <div className="min-h-screen bg-[#020b14] text-blue-100 p-6 md:p-12 pt-24 font-sans relative overflow-x-hidden">
            
            {/* Decoración de fondo */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#0066FF]/5 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-[#00F0FF]/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="relative z-10 max-w-6xl mx-auto animate-fade-in-up">
                
                {/* Cabecera */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-10 border-b border-blue-900/50 pb-6 gap-4">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={() => navigate('/')} 
                            className="p-2 bg-[#0a192f] rounded-full hover:bg-[#00F0FF] hover:text-black transition-all group"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h2 className="text-4xl font-black text-white tracking-tight flex items-center gap-3">
                                <MessageSquare className="text-[#00F0FF]" size={32} />
                                Muro de la Comunidad
                            </h2>
                            <p className="text-blue-300/60 mt-1">Descubre qué opinan otros usuarios sobre el catálogo.</p>
                        </div>
                    </div>
                </div>

                {/* Grid de Reseñas */}
                {reviews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {reviews.map(review => (
                            <div key={review.id} className="bg-[#0a192f]/60 backdrop-blur-md border border-white/5 p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.2)] hover:border-[#00F0FF]/30 transition-all hover:-translate-y-1 group">
                                
                                {/* Encabezado de la tarjeta: Película y Nota */}
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-bold text-xl text-white truncate pr-2" title={review.tituloPelicula}>
                                        {review.tituloPelicula}
                                    </h3>
                                    <div className="flex items-center gap-1 bg-[#0066FF]/20 px-2 py-1 rounded-lg border border-[#0066FF]/30">
                                        <Star size={14} className="text-yellow-400 fill-yellow-400" />
                                        <span className="font-bold text-yellow-400 text-sm">{review.nota}</span>
                                    </div>
                                </div>

                                {/* Comentario */}
                                <div className="mb-6 relative">
                                    <Quote size={20} className="absolute -top-1 -left-1 text-blue-500/20 rotate-180" />
                                    <p className="text-blue-200/80 text-sm italic pl-6 leading-relaxed line-clamp-4">
                                        "{review.comentario}"
                                    </p>
                                </div>

                                {/* Pie de la tarjeta: Usuario y Fecha */}
                                <div className="flex justify-between items-center border-t border-white/5 pt-4 mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-[#0d2137] rounded-full border border-blue-900">
                                            <User size={14} className="text-[#00F0FF]" />
                                        </div>
                                        <span className="text-xs font-semibold text-blue-300">
                                            {review.nombreUsuario}
                                        </span>
                                    </div>
                                    <span className="text-xs text-blue-500/60">
                                        {review.fecha}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-blue-400/50">
                        <MessageSquare size={64} className="mx-auto mb-4 opacity-30" />
                        <p className="text-xl">Aún no hay reseñas. ¡Sé el primero en opinar!</p>
                    </div>
                )}
            </div>
        </div>
    );
}