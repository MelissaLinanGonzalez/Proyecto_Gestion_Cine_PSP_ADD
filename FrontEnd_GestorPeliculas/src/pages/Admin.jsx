import { useState } from 'react';
import { localApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';

export default function Admin() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    // Estado del formulario
    const [form, setForm] = useState({
        titulo: '',
        duracion: '',
        fechaEstreno: '',
        sinopsis: '',
        valoracion: 5
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Envía los datos al Backend (POST /api/peliculas)
            await localApi.post('/api/peliculas', form);
            alert('¡Película creada correctamente!');
            navigate('/'); // Redirige al Home para verla
        } catch (error) {
            console.error(error);
            alert('Error al crear la película. Revisa la consola.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-[#141414] text-white p-6 md:p-12 pt-24 flex justify-center">
            <div className="w-full max-w-2xl animate-fade-in">
                
                {/* Botón Volver */}
                <button 
                    onClick={() => navigate('/')} 
                    className="flex items-center gap-2 text-gray-400 mb-6 hover:text-white transition"
                >
                    <ArrowLeft size={20}/> Volver al inicio
                </button>
                
                <h2 className="text-4xl font-bold mb-8 text-[#E50914] border-b border-gray-800 pb-4">
                    Añadir Película
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Título */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Título de la película</label>
                        <input 
                            name="titulo" 
                            onChange={handleChange} 
                            placeholder="Ej: Avatar 3"
                            className="w-full bg-[#333] border border-transparent focus:border-[#E50914] p-4 rounded text-white outline-none transition" 
                            required 
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Duración */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Duración (minutos)</label>
                            <input 
                                type="number" 
                                name="duracion" 
                                onChange={handleChange} 
                                className="w-full bg-[#333] border border-transparent focus:border-[#E50914] p-4 rounded text-white outline-none" 
                                required 
                            />
                        </div>
                        {/* Valoración */}
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">Valoración (0-10)</label>
                            <input 
                                type="number" 
                                max="10" 
                                min="0" 
                                name="valoracion" 
                                onChange={handleChange} 
                                className="w-full bg-[#333] border border-transparent focus:border-[#E50914] p-4 rounded text-white outline-none" 
                                required 
                            />
                        </div>
                    </div>

                    {/* Fecha */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Fecha de Estreno</label>
                        <input 
                            type="date" 
                            name="fechaEstreno" 
                            onChange={handleChange} 
                            className="w-full bg-[#333] border border-transparent focus:border-[#E50914] p-4 rounded text-white outline-none" 
                            required 
                        />
                    </div>

                    {/* Sinopsis */}
                    <div>
                        <label className="block text-sm text-gray-400 mb-2">Sinopsis</label>
                        <textarea 
                            name="sinopsis" 
                            rows="4" 
                            onChange={handleChange} 
                            placeholder="Escribe un resumen..."
                            className="w-full bg-[#333] border border-transparent focus:border-[#E50914] p-4 rounded text-white outline-none resize-none" 
                            required
                        ></textarea>
                    </div>

                    {/* Botón Submit */}
                    <button 
                        disabled={loading}
                        className="w-full bg-[#E50914] py-4 rounded font-bold hover:bg-red-700 transition flex justify-center items-center gap-2 text-lg"
                    >
                        {loading ? 'Guardando...' : <><Save size={20}/> Guardar Película</>}
                    </button>
                </form>
            </div>
        </div>
    );
}