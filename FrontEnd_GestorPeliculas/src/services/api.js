import axios from 'axios';

// 1. Conexión con tu Backend Spring Boot
export const localApi = axios.create({
    baseURL: 'http://localhost:8081' 
});

// 2. Configuración de la API de Imágenes y Vídeos (TMDB)
const TMDB_KEY = 'b6dcb548bcd012eb804e5f24ee492467'; 
const TMDB_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'; 

// Función para obtener la Imagen
export const getMovieImage = async (title) => {
    if (!TMDB_KEY || TMDB_KEY === 'API_KEY') return 'https://via.placeholder.com/500x750?text=Sin+API+Key';

    try {
        const response = await axios.get(`${TMDB_URL}/search/movie`, {
            params: { api_key: TMDB_KEY, query: title, language: 'es-ES' }
        });
        
        if (response.data.results.length > 0 && response.data.results[0].poster_path) {
            return `${IMAGE_BASE_URL}${response.data.results[0].poster_path}`;
        }
    } catch (error) {
        console.error("Error imagen TMDB:", error);
    }
    return 'https://via.placeholder.com/500x750?text=No+Image'; 
};

// ✅ NUEVA FUNCIÓN: Obtener Trailer de YouTube
export const getMovieTrailer = async (title) => {
    if (!TMDB_KEY) return null;

    try {
        // 1. Buscamos la película para obtener su ID
        const searchRes = await axios.get(`${TMDB_URL}/search/movie`, {
            params: { api_key: TMDB_KEY, query: title, language: 'es-ES' }
        });

        if (searchRes.data.results.length > 0) {
            const movieId = searchRes.data.results[0].id;

            // 2. Pedimos los vídeos de esa película
            const videoRes = await axios.get(`${TMDB_URL}/movie/${movieId}/videos`, {
                params: { api_key: TMDB_KEY, language: 'es-ES' } // Probamos primero en español
            });

            // Buscamos un trailer en YouTube
            let trailer = videoRes.data.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');

            // Si no hay en español, probamos en inglés (fallback)
            if (!trailer) {
                const videoResEn = await axios.get(`${TMDB_URL}/movie/${movieId}/videos`, {
                    params: { api_key: TMDB_KEY, language: 'en-US' }
                });
                trailer = videoResEn.data.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');
            }

            // Si encontramos trailer, devolvemos la URL de "embed" preparada para fondo
            if (trailer) {
                // Parámetros: autoplay, mute, controls=0, loop, playlist (necesario para el loop)
                return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&loop=1&playlist=${trailer.key}`;
            }
        }
    } catch (error) {
        console.error("Error trailer TMDB:", error);
    }
    return null;
};