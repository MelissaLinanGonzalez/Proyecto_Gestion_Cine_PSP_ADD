import { useState, useEffect } from 'react';
import { localApi, getMovieDetailsFromTMDB, getDirectores, getPeliculasPorDirector, getActores } from '../services/api'; 
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Film, Calendar, Clock, FileText, Tag, Check, Wand2, Loader2, User, Search, Trash2, Edit, X } from 'lucide-react';

export default function Admin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [searching, setSearching] = useState(false); 
    
    // Datos maestros
    const [categoriasDisponibles, setCategoriasDisponibles] = useState([]);
    const [directoresDisponibles, setDirectoresDisponibles] = useState([]);
    const [actoresDisponibles, setActoresDisponibles] = useState([]); // Por si quieres usarlo luego
    
    // Gestión de listado
    const [listaPeliculas, setListaPeliculas] = useState([]);
    const [filtroDirector, setFiltroDirector] = useState('todos');

    // ✅ ESTADO PARA EDICIÓN
    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        titulo: '',
        duracion: '',
        fechaEstreno: '',
        sinopsis: '',
        categoriaIds: [],
        actores: [], // Lista de nombres (Strings)
        director: { nombre: '' } 
    });

    useEffect(() => {
        cargarDatosMaestros();
        cargarTodasLasPeliculas();
    }, []);

    const cargarDatosMaestros = () => {
        localApi.get('/categorias').then(res => setCategoriasDisponibles(res.data));
        getDirectores().then(data => setDirectoresDisponibles(data));
        getActores().then(data => setActoresDisponibles(data));
    };

    const cargarTodasLasPeliculas = async () => {
        try {
            const res = await localApi.get('/api/peliculas');
            setListaPeliculas(res.data);
        } catch (error) { console.error(error); }
    };

    // --- AUTOCOMPLETADO TMDB ---
    const handleAutoFill = async () => {
        if (!form.titulo) return alert("Escribe primero el título.");
        setSearching(true);
        const data = await getMovieDetailsFromTMDB(form.titulo);
        setSearching(false);

        if (data) {
            setForm(prev => ({
                ...prev,
                titulo: data.titulo,
                duracion: data.duracion || '',
                fechaEstreno: data.fechaEstreno || '',
                sinopsis: data.sinopsis || '',
                actores: data.actores || [],
                director: { nombre: data.director || prev.director.nombre }
            }));
        } else {
            alert("No encontrado en TMDB.");
        }
    };

    // --- ✅ NUEVO: ELIMINAR PELÍCULA ---
    const handleDelete = async (id) => {
        if (!window.confirm("¿Estás seguro de que quieres eliminar esta película?")) return;

        try {
            // Llama al endpoint DELETE definido en PeliculaController
            await localApi.delete(`/api/peliculas/${id}`); //
            alert("Película eliminada correctamente.");
            cargarTodasLasPeliculas(); // Recargar tabla
        } catch (error) {
            console.error("Error eliminando:", error);
            alert("Error al eliminar la película.");
        }
    };

    // --- ✅ NUEVO: CARGAR DATOS PARA EDITAR ---
    const handleEdit = (movie) => {
        setEditingId(movie.id); // Marcamos que estamos editando esta ID
        
        // Convertir nombres de categorías (que vienen en el DTO) a IDs para el formulario
        const catIds = movie.categorias.map(catName => {
            const catObj = categoriasDisponibles.find(c => c.nombre === catName);
            return catObj ? catObj.id : null;
        }).filter(id => id !== null);

        // Rellenar formulario
        setForm({
            titulo: movie.titulo,
            duracion: movie.duracion,
            fechaEstreno: movie.fechaEstreno,
            sinopsis: movie.sinopsis,
            categoriaIds: catIds,
            actores: movie.actores || [], // El DTO ahora trae actores
            director: { nombre: movie.director || '' } // El DTO trae director como String, lo convertimos a objeto
        });

        // Scroll suave hacia el formulario
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // --- CANCELAR EDICIÓN ---
    const resetForm = () => {
        setEditingId(null);
        setForm({ titulo: '', duracion: '', fechaEstreno: '', sinopsis: '', categoriaIds: [], actores: [], director: { nombre: '' } });
    };

    // --- ENVIAR FORMULARIO (CREAR O EDITAR) ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (editingId) {
                // ✅ MODO EDICIÓN: PUT
                await localApi.put(`/api/peliculas/${editingId}`, form); //
                alert('¡Película actualizada correctamente!');
            } else {
                // ✅ MODO CREACIÓN: POST
                await localApi.post('/api/peliculas', form);
                alert('¡Película guardada correctamente!');
            }
            
            resetForm(); // Limpiar y resetear modo
            cargarTodasLasPeliculas();
            cargarDatosMaestros(); 
        } catch (error) {
            console.error(error);
            alert('Error al guardar.');
        } finally {
            setLoading(false);
        }
    };

    const handleFiltrarPeliculas = async (directorId) => {
        setFiltroDirector(directorId);
        if(directorId === 'todos') {
            cargarTodasLasPeliculas();
        } else {
            const data = await getPeliculasPorDirector(directorId);
            setListaPeliculas(data);
        }
    };

    const handleCategoryToggle = (id) => {
        setForm(prev => {
            const newIds = prev.categoriaIds.includes(id)
                ? prev.categoriaIds.filter(catId => catId !== id)
                : [...prev.categoriaIds, id];
            return { ...prev, categoriaIds: newIds };
        });
    };

    return (
        <div className="min-h-screen bg-[#020b14] text-blue-100 p-6 md:p-12 pt-24 flex flex-col items-center font-sans">
            
            <div className="w-full max-w-4xl">
                <button onClick={() => navigate('/')} className="flex items-center gap-2 text-blue-400 hover:text-[#00F0FF] mb-8 transition-colors">
                    <ArrowLeft size={20} /> Volver al inicio
                </button>
                
                <div className="mb-8 border-b border-blue-900/50 pb-4 flex justify-between items-end">
                    <h2 className="text-4xl font-extrabold text-white tracking-tight flex items-center gap-3">
                        <Film className="text-[#00F0FF]" size={36} />
                        {editingId ? 'Editar Película' : 'Administrar Películas'}
                    </h2>
                    {editingId && (
                        <button onClick={resetForm} className="text-sm text-red-400 hover:text-red-300 flex items-center gap-1 border border-red-500/30 px-3 py-1 rounded-lg">
                            <X size={14}/> Cancelar Edición
                        </button>
                    )}
                </div>
                
                {/* FORMULARIO */}
                <form onSubmit={handleSubmit} className={`bg-[#0a192f]/60 backdrop-blur-xl p-8 rounded-2xl border transition-all duration-300 space-y-8 mb-16 shadow-[0_0_50px_rgba(0,100,255,0.1)] 
                    ${editingId ? 'border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.15)]' : 'border-white/5'}`}>
                    
                    {/* Título */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-blue-300">TÍTULO</label>
                        <div className="flex gap-2">
                            <input 
                                name="titulo" 
                                value={form.titulo} 
                                onChange={(e) => setForm({...form, titulo: e.target.value})} 
                                placeholder="Ej: Matrix" 
                                className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-xl px-5 py-3 focus:border-[#00F0FF] focus:outline-none" 
                                required 
                            />
                            <button type="button" onClick={handleAutoFill} disabled={searching || !form.titulo} className="bg-[#0066FF]/20 hover:bg-[#0066FF] text-[#00F0FF] hover:text-white border border-[#0066FF] px-4 rounded-xl transition-all">
                                {searching ? <Loader2 className="animate-spin" /> : <Wand2 />}
                            </button>
                        </div>
                    </div>

                    {/* Director */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                            <User size={16} className="text-[#00F0FF]" /> DIRECTOR
                        </label>
                        <input 
                            type="text"
                            value={form.director.nombre}
                            onChange={(e) => setForm({...form, director: { nombre: e.target.value }})}
                            placeholder="Nombre del Director"
                            className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-xl px-5 py-3 focus:border-[#00F0FF] focus:outline-none"
                            list="directores-list"
                            required
                        />
                        <datalist id="directores-list">
                            {directoresDisponibles.map(d => <option key={d.id} value={d.nombre} />)}
                        </datalist>
                    </div>

                    {/* Actores (Texto separado por comas visualmente o simple input por ahora) */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                            <User size={16} className="text-[#00F0FF]" /> ACTORES PRINCIPALES
                        </label>
                        <input 
                            type="text"
                            // Unimos el array para mostrarlo como string, y al escribir separamos por comas
                            value={form.actores.join(', ')} 
                            onChange={(e) => setForm({...form, actores: e.target.value.split(',').map(s => s.trim())})}
                            placeholder="Ej: Keanu Reeves, Laurence Fishburne (separados por comas)"
                            className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-xl px-5 py-3 focus:border-[#00F0FF] focus:outline-none"
                        />
                        <p className="text-xs text-gray-500">* Separa los nombres con comas.</p>
                    </div>

                    {/* Fecha y Duración */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                                <Clock size={16} className="text-[#00F0FF]" /> DURACIÓN (min)
                            </label>
                            <input type="number" name="duracion" value={form.duracion} onChange={(e) => setForm({...form, duracion: e.target.value})} className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-xl px-5 py-3 focus:border-[#00F0FF] focus:outline-none" required />
                        </div>
                        <div className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                                <Calendar size={16} className="text-[#00F0FF]" /> ESTRENO
                            </label>
                            <input type="date" name="fechaEstreno" value={form.fechaEstreno} onChange={(e) => setForm({...form, fechaEstreno: e.target.value})} className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-xl px-5 py-3 focus:border-[#00F0FF] focus:outline-none [color-scheme:dark]" required />
                        </div>
                    </div>

                    {/* Categorías */}
                    <div className="space-y-3">
                        <label className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                            <Tag size={16} className="text-[#00F0FF]" /> CATEGORÍAS
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                            {categoriasDisponibles.map(cat => {
                                const isSelected = form.categoriaIds.includes(cat.id);
                                return (
                                    <div key={cat.id} onClick={() => handleCategoryToggle(cat.id)} className={`cursor-pointer px-4 py-2 rounded-lg border text-sm font-medium transition-all flex items-center justify-between ${isSelected ? 'bg-[#0066FF]/20 border-[#00F0FF] text-[#00F0FF]' : 'bg-[#0d2137] border-blue-900/30 text-gray-400 hover:border-blue-500/50'}`}>
                                        {cat.nombre} {isSelected && <Check size={14} />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Sinopsis */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-semibold text-blue-300">
                            <FileText size={16} className="text-[#00F0FF]" /> SINOPSIS
                        </label>
                        <textarea name="sinopsis" rows="4" value={form.sinopsis} onChange={(e) => setForm({...form, sinopsis: e.target.value})} className="w-full bg-[#0d2137] text-white border border-blue-900/50 rounded-xl px-5 py-3 focus:border-[#00F0FF] focus:outline-none resize-none" required></textarea>
                    </div>

                    <button disabled={loading} className={`w-full bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-[1.01] transition-all flex justify-center items-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {loading ? 'Guardando...' : editingId ? <><Edit size={20}/> Actualizar Película</> : <><Save size={20}/> Guardar Película</>}
                    </button>
                </form>

                {/* --- GESTIÓN DE INVENTARIO --- */}
                <div className="bg-[#0a192f]/40 backdrop-blur-md p-8 rounded-2xl border border-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Search className="text-[#00F0FF]" /> Gestión de Inventario
                        </h3>
                        
                        <div className="flex items-center gap-2 bg-[#0d2137] px-4 py-2 rounded-lg border border-blue-900/50">
                            <span className="text-sm text-blue-300">Filtrar por Director:</span>
                            <select 
                                value={filtroDirector} 
                                onChange={(e) => handleFiltrarPeliculas(e.target.value)}
                                className="bg-transparent text-white font-bold focus:outline-none cursor-pointer"
                            >
                                <option value="todos" className="bg-[#0d2137]">Todos</option>
                                {directoresDisponibles.map(d => (
                                    <option key={d.id} value={d.id} className="bg-[#0d2137]">{d.nombre}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* TABLA */}
                    <div className="overflow-x-auto rounded-xl border border-blue-900/30">
                        <table className="w-full text-left">
                            <thead className="bg-[#0066FF]/20 text-blue-200 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Título</th>
                                    <th className="px-6 py-4">Director</th>
                                    <th className="px-6 py-4 text-center">Año</th>
                                    <th className="px-6 py-4 text-center">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-blue-900/30 bg-[#0d2137]/50">
                                {listaPeliculas.length > 0 ? (
                                    listaPeliculas.map(p => (
                                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-medium text-white">{p.titulo}</td>
                                            <td className="px-6 py-4 text-blue-300">
                                                {typeof p.director === 'object' ? p.director.nombre : (p.director || "Sin Asignar")}
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-400">{p.fechaEstreno ? p.fechaEstreno.split('-')[0] : '-'}</td>
                                            <td className="px-6 py-4 flex justify-center gap-3">
                                                {/* ✅ BOTÓN EDITAR */}
                                                <button 
                                                    onClick={() => handleEdit(p)} 
                                                    className="text-blue-400 hover:text-white transition-transform hover:scale-110" 
                                                    title="Editar"
                                                >
                                                    <Edit size={18}/>
                                                </button>
                                                
                                                {/* ✅ BOTÓN ELIMINAR */}
                                                <button 
                                                    onClick={() => handleDelete(p.id)} 
                                                    className="text-red-400 hover:text-red-200 transition-transform hover:scale-110" 
                                                    title="Eliminar"
                                                >
                                                    <Trash2 size={18}/>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">No se encontraron películas.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    );
}