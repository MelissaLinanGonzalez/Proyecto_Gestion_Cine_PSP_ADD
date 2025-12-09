import { useState, useEffect } from 'react';
import { localApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Film, Calendar, Clock, FileText, Tag, Check } from 'lucide-react';

export default function Admin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Estado para las categorías disponibles (las que vienen de la BD)
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);

    const [form, setForm] = useState({
        titulo: '',
        duracion: '',
        fechaEstreno: '',
        sinopsis: '',
        categoriaIds: [] // ✅ Array para guardar los IDs seleccionados
    });

    // Cargar categorías al montar el componente
    useEffect(() => {
        localApi.get('/categorias')
            .then(res => setCategoriasDisponibles(res.data))
            .catch(err => console.error("Error cargando categorías", err));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await localApi.post('/api/peliculas', form);
            alert('¡Película creada correctamente!');
            navigate('/'); 
        } catch (error) {
            console.error(error);
            alert('Error al crear. Revisa la consola.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Manejar selección de categorías (Checkbox)
    const handleCategoryToggle = (id) => {
        setForm(prev => {
            const newIds = prev.categoriaIds.includes(id)
                ? prev.categoriaIds.filter(catId => catId !== id) // Si ya está, lo quitamos
                : [...prev.categoriaIds, id]; // Si no está, lo añadimos
            return { ...prev, categoriaIds: newIds };
        });
    };

    return (
        <div className="min-h-screen bg-[#020b14] text-blue-100 p-6 md:p-12 pt-24 flex justify-center font-sans relative overflow-hidden">
            
            {/* Elementos decorativos */}
            <div className="absolute top-0 left-0 w-full h-[500px] bg-[#0066FF]/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-[#00F0FF]/5 blur-[100px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-3xl relative z-10 animate-fade-in-up">
                
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-blue-400 hover:text-[#00F0FF] mb-8 transition-colors group">
                    <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/> Volver al inicio
                </button>
                
                <div className="mb-8 border-b border-blue-900/50 pb-4">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <Film className="text-[#00F0FF]" size={36} />
                        Panel de Administración
                    </h2>
                    <p className="text-blue-300/60 mt-2">Añade nuevas películas y asígnales categorías.</p>
                </div>
                
                <form onSubmit={handleSubmit} className="bg-[#0a192f]/60 backdrop-blur-xl p-8 rounded-2xl border border-white/5 shadow-[0_0_50px_rgba(0,100,255,0.1)] space-y-8">
                    
                    {/* Título */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-blue-300 uppercase tracking-wider ml-1">Título de la película</label>
                        <input name="titulo" onChange={handleChange} placeholder="Ej: Dune: Parte Dos" className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-xl px-5 py-4 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/50 focus:outline-none transition-all placeholder-blue-400/30 text-lg shadow-inner" required />
                    </div>

                    {/* Grid Duración/Fecha */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-blue-300/80 ml-1">
                                <Clock size={16} className="text-[#00F0FF]" /> Duración (min)
                            </label>
                            <input type="number" name="duracion" onChange={handleChange} className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-xl px-5 py-3 focus:border-[#00F0FF] focus:outline-none transition-all" required />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-blue-300/80 ml-1">
                                <Calendar size={16} className="text-[#00F0FF]" /> Fecha de Estreno
                            </label>
                            <input type="date" name="fechaEstreno" onChange={handleChange} className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-xl px-5 py-3 focus:border-[#00F0FF] focus:outline-none transition-all [color-scheme:dark]" required />
                        </div>
                    </div>

                    {/* ✅ SECCIÓN DE CATEGORÍAS */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-blue-300/80 ml-1">
                            <Tag size={16} className="text-[#00F0FF]" /> Categorías (Selecciona al menos una)
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {categoriasDisponibles.map(cat => {
                                const isSelected = form.categoriaIds.includes(cat.id);
                                return (
                                    <div 
                                        key={cat.id}
                                        onClick={() => handleCategoryToggle(cat.id)}
                                        className={`cursor-pointer px-4 py-3 rounded-xl border transition-all duration-200 flex items-center justify-between group
                                            ${isSelected 
                                                ? 'bg-[#0066FF]/20 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]' 
                                                : 'bg-[#0d2137] border-blue-900/30 text-gray-400 hover:border-blue-500 hover:text-white'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">{cat.nombre}</span>
                                        {isSelected && <Check size={16} className="text-[#00F0FF]" />}
                                    </div>
                                );
                            })}
                        </div>
                        {categoriasDisponibles.length === 0 && <p className="text-xs text-yellow-500">No hay categorías cargadas en el sistema.</p>}
                    </div>

                    {/* Sinopsis */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-blue-300/80 ml-1">
                            <FileText size={16} className="text-[#00F0FF]" /> Sinopsis
                        </label>
                        <textarea name="sinopsis" rows="5" onChange={handleChange} placeholder="Escribe un breve resumen..." className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-xl px-5 py-4 focus:border-[#00F0FF] focus:ring-1 focus:ring-[#00F0FF]/50 focus:outline-none transition-all placeholder-blue-400/30 resize-none shadow-inner leading-relaxed" required></textarea>
                    </div>

                    <button disabled={loading} className={`w-full bg-gradient-to-r from-[#0066FF] to-[#00C2FF] hover:from-[#0052cc] hover:to-[#0099cc] text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(0,100,255,0.4)] transform hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex justify-center items-center gap-3 text-lg border border-white/10 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {loading ? 'Guardando...' : <><Save size={22}/> Publicar Película</>}
                    </button>
                </form>
            </div>
        </div>
    );
}