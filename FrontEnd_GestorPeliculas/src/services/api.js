import axios from 'axios';

// 1. Conexión con tu Backend Spring Boot
export const localApi = axios.create({
    baseURL: 'http://localhost:8081' 
});

// 2. Configuración de la API de TMDB
const TMDB_KEY = 'b6dcb548bcd012eb804e5f24ee492467'; 
const TMDB_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/original'; 

// --- GESTIÓN DE FILTROS ---

export const getDirectores = async () => {
    try {
        const response = await localApi.get('/directores');
        return response.data;
    } catch (error) {
        console.error("Error cargando directores:", error);
        return [];
    }
};

// ✅ NUEVO: Obtener Actores
export const getActores = async () => {
    try {
        const response = await localApi.get('/actores');
        return response.data;
    } catch (error) {
        console.error("Error cargando actores:", error);
        return [];
    }
};

export const getPeliculasPorDirector = async (id) => {
    try {
        const response = await localApi.get(`/directores/${id}/peliculas`);
        return response.data;
    } catch (error) {
        console.error("Error cargando películas del director:", error);
        return [];
    }
};

export const getPeliculasPorCategoria = async (nombreCategoria) => {
    try {
        const response = await localApi.get(`/api/peliculas/categoria/${nombreCategoria}`);
        return response.data;
    } catch (error) {
        console.error("Error cargando películas por categoría:", error);
        return [];
    }
};

// --- GESTIÓN DE CRÍTICAS ---
export const getReviewsByMovie = async (movieId) => {
    try {
        const response = await localApi.get(`/criticas/pelicula/${movieId}`);
        return response.data;
    } catch (error) {
        console.error("Error cargando críticas:", error);
        return [];
    }
};

// --- IMÁGENES Y TRAILERS (TMDB) ---
export const getMovieImage = async (title) => {
    if (!TMDB_KEY) return 'https://via.placeholder.com/500x750?text=No+Key';
    try {
        const response = await axios.get(`${TMDB_URL}/search/movie`, {
            params: { api_key: TMDB_KEY, query: title, language: 'es-ES' }
        });
        if (response.data.results.length > 0 && response.data.results[0].poster_path) {
            return `${IMAGE_BASE_URL}${response.data.results[0].poster_path}`;
        }
    } catch (error) { console.error("Error imagen TMDB:", error); }
    return 'https://via.placeholder.com/500x750?text=No+Image'; 
};

export const getMovieTrailer = async (title) => {
    if (!TMDB_KEY) return null;
    try {
        const searchRes = await axios.get(`${TMDB_URL}/search/movie`, {
            params: { api_key: TMDB_KEY, query: title, language: 'es-ES' }
        });
        if (searchRes.data.results.length > 0) {
            const movieId = searchRes.data.results[0].id;
            const videoRes = await axios.get(`${TMDB_URL}/movie/${movieId}/videos`, {
                params: { api_key: TMDB_KEY, language: 'es-ES' }
            });
            let trailer = videoRes.data.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');
            if (!trailer) {
                const videoResEn = await axios.get(`${TMDB_URL}/movie/${movieId}/videos`, {
                    params: { api_key: TMDB_KEY, language: 'en-US' }
                });
                trailer = videoResEn.data.results.find(vid => vid.site === 'YouTube' && vid.type === 'Trailer');
            }
            if (trailer) return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&loop=1&playlist=${trailer.key}`;
        }
    } catch (error) { console.error("Error trailer TMDB:", error); }
    return null;
};

// Autocompletado para Admin
export const getMovieDetailsFromTMDB = async (query) => {
    if (!TMDB_KEY) return null;
    try {
        const searchRes = await axios.get(`${TMDB_URL}/search/movie`, {
            params: { api_key: TMDB_KEY, query: query, language: 'es-ES' }
        });
        if (searchRes.data.results.length === 0) return null;

        const movie = searchRes.data.results[0];
        const detailsRes = await axios.get(`${TMDB_URL}/movie/${movie.id}`, {
            params: { api_key: TMDB_KEY, language: 'es-ES', append_to_response: 'credits' }
        });

        const data = detailsRes.data;
        const directorData = data.credits.crew.find(person => person.job === 'Director');

        return {
            titulo: data.title,
            sinopsis: data.overview,
            fechaEstreno: data.release_date, 
            duracion: data.runtime, 
            director: directorData ? directorData.name : '',
            actores: data.credits.cast.slice(0, 5).map(actor => actor.name) 
        };
    } catch (error) {
        console.error("Error buscando detalles en TMDB:", error);
        return null;
    }
};