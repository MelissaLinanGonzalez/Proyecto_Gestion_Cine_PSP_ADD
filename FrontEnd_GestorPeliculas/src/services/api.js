import axios from 'axios';

// 1. Conexión con tu Backend Spring Boot
// Asegúrate de que tu backend esté corriendo en el puerto 8081
export const localApi = axios.create({
    baseURL: 'http://localhost:8081' 
});

// 2. Configuración de la API de Imágenes (TMDB)
// Regístrate gratis en https://www.themoviedb.org/ para obtener tu API KEY real.
// Mientras no tengas una, usaremos un valor temporal, pero las imágenes no cargarán.
const TMDB_KEY = 'api_key'; 
const TMDB_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const getMovieImage = async (title) => {
    // Si no has puesto la clave, devolvemos una imagen gris por defecto
    if (!TMDB_KEY || TMDB_KEY === 'api_key') {
        return 'https://via.placeholder.com/500x750?text=Sin+API+Key';
    }

    try {
        const response = await axios.get(`${TMDB_URL}/search/movie`, {
            params: { 
                api_key: TMDB_KEY, 
                query: title,
                language: 'es-ES' // Priorizar resultados en español
            }
        });
        
        if (response.data.results.length > 0 && response.data.results[0].poster_path) {
            return `${IMAGE_BASE_URL}${response.data.results[0].poster_path}`;
        }
    } catch (error) {
        console.error("Error buscando imagen en TMDB:", error);
    }
    
    // Imagen de respaldo si no se encuentra en TMDB
    return 'https://via.placeholder.com/500x750?text=No+Image'; 
};