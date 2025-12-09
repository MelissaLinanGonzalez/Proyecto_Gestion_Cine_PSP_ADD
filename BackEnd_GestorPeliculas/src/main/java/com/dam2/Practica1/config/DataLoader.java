package com.dam2.Practica1.config;

import com.dam2.Practica1.domain.Actor;
import com.dam2.Practica1.domain.Categoria;
import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.domain.Pelicula;
import com.dam2.Practica1.repository.ActorRepository;
import com.dam2.Practica1.repository.CategoriaRepository;
import com.dam2.Practica1.repository.DirectorRepository;
import com.dam2.Practica1.repository.PeliculaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initData(ActorRepository actorRepo,
                               DirectorRepository directorRepo,
                               PeliculaRepository peliculaRepo,
                               CategoriaRepository categoriaRepo) {

        return args -> {

            // 🚨 Si ya hay directores, asumimos que ya hay datos y no hacemos nada
            if (directorRepo.count() > 0) {
                System.out.println(">>> Datos ya existentes. NO se carga DataLoader.");
                return;
            }

            System.out.println(">>> CARGANDO SAGA HARRY POTTER Y DATOS DE PRUEBA...");

            // ======================================
            // 1. CATEGORÍAS (Estándar TMDB)
            // ======================================
            List<String> nombresCategorias = Arrays.asList(
                    "Acción", "Aventura", "Animación", "Comedia", "Crimen",
                    "Documental", "Drama", "Familia", "Fantasía", "Historia",
                    "Terror", "Música", "Misterio", "Romance", "Ciencia Ficción",
                    "Película de TV", "Suspense", "Bélica", "Western"
            );

            List<Categoria> categoriasGuardadas = new ArrayList<>();
            for (String nombre : nombresCategorias) {
                Categoria cat = new Categoria(null, nombre, new ArrayList<>());
                categoriasGuardadas.add(categoriaRepo.save(cat));
            }

            // Helpers
            Categoria aventura = buscarCat(categoriasGuardadas, "Aventura");
            Categoria fantasia = buscarCat(categoriasGuardadas, "Fantasía");
            Categoria familia = buscarCat(categoriasGuardadas, "Familia");
            Categoria misterio = buscarCat(categoriasGuardadas, "Misterio");
            Categoria accion = buscarCat(categoriasGuardadas, "Acción");

            // ======================================
            // 2. DIRECTORES
            // ======================================
            Director columbus = directorRepo.save(new Director(null, "Chris Columbus", new ArrayList<>()));
            Director cuaron = directorRepo.save(new Director(null, "Alfonso Cuarón", new ArrayList<>()));
            Director newell = directorRepo.save(new Director(null, "Mike Newell", new ArrayList<>()));
            Director yates = directorRepo.save(new Director(null, "David Yates", new ArrayList<>()));
            Director nolan = directorRepo.save(new Director(null, "Christopher Nolan", new ArrayList<>()));

            // ======================================
            // 3. SAGA HARRY POTTER
            // ======================================

            // 1. La Piedra Filosofal
            Pelicula hp1 = crearPelicula(
                    "Harry Potter y la piedra filosofal", 152, LocalDate.of(2001, 11, 16),
                    "Un niño huérfano descubre en su 11º cumpleaños que es un mago y entra en la escuela Hogwarts.",
                    7.9, columbus
            );
            hp1.addCategoria(aventura); hp1.addCategoria(fantasia); hp1.addCategoria(familia);
            peliculaRepo.save(hp1);

            // 2. La Cámara Secreta
            Pelicula hp2 = crearPelicula(
                    "Harry Potter y la cámara secreta", 161, LocalDate.of(2002, 11, 15),
                    "Harry ignora las advertencias de no volver a Hogwarts, donde una fuerza oscura aterroriza la escuela.",
                    7.4, columbus
            );
            hp2.addCategoria(aventura); hp2.addCategoria(fantasia); hp2.addCategoria(misterio);
            peliculaRepo.save(hp2);

            // 3. El Prisionero de Azkaban
            Pelicula hp3 = crearPelicula(
                    "Harry Potter y el prisionero de Azkaban", 142, LocalDate.of(2004, 6, 4),
                    "Harry debe enfrentarse a los Dementores y al peligroso prisionero Sirius Black que ha escapado.",
                    7.9, cuaron
            );
            hp3.addCategoria(aventura); hp3.addCategoria(fantasia); hp3.addCategoria(misterio);
            peliculaRepo.save(hp3);

            // 4. El Cáliz de Fuego
            Pelicula hp4 = crearPelicula(
                    "Harry Potter y el cáliz de fuego", 157, LocalDate.of(2005, 11, 18),
                    "Harry es seleccionado misteriosamente para competir en el peligroso Torneo de los Tres Magos.",
                    7.7, newell
            );
            hp4.addCategoria(aventura); hp4.addCategoria(fantasia); hp4.addCategoria(accion);
            peliculaRepo.save(hp4);

            // 5. La Orden del Fénix
            Pelicula hp5 = crearPelicula(
                    "Harry Potter y la Orden del Fénix", 138, LocalDate.of(2007, 7, 11),
                    "Con su advertencia sobre el regreso de Voldemort ignorada, Harry entrena a un grupo de estudiantes para la guerra.",
                    7.5, yates
            );
            hp5.addCategoria(aventura); hp5.addCategoria(fantasia); hp5.addCategoria(misterio);
            peliculaRepo.save(hp5);

            // 6. El Misterio del Príncipe
            Pelicula hp6 = crearPelicula(
                    "Harry Potter y el misterio del príncipe", 153, LocalDate.of(2009, 7, 15),
                    "Harry descubre un libro antiguo y empieza a aprender más sobre el oscuro pasado de Voldemort.",
                    7.6, yates
            );
            hp6.addCategoria(aventura); hp6.addCategoria(fantasia); hp6.addCategoria(misterio);
            peliculaRepo.save(hp6);

            // 7. Las Reliquias de la Muerte - Parte 1
            Pelicula hp7 = crearPelicula(
                    "Harry Potter y las Reliquias de la Muerte - Parte 1", 146, LocalDate.of(2010, 11, 19),
                    "Harry, Ron y Hermione corren contra el tiempo para destruir los Horrocruxes y acabar con Voldemort.",
                    7.7, yates
            );
            hp7.addCategoria(aventura); hp7.addCategoria(fantasia); hp7.addCategoria(accion);
            peliculaRepo.save(hp7);

            // 8. Las Reliquias de la Muerte - Parte 2
            Pelicula hp8 = crearPelicula(
                    "Harry Potter y las Reliquias de la Muerte - Parte 2", 130, LocalDate.of(2011, 7, 15),
                    "La batalla final entre las fuerzas del bien y el mal comienza en Hogwarts.",
                    8.1, yates
            );
            hp8.addCategoria(aventura); hp8.addCategoria(fantasia); hp8.addCategoria(accion);
            peliculaRepo.save(hp8);

            // ======================================
            // OTRAS (Interstellar para probar)
            // ======================================
            Pelicula interstellar = crearPelicula(
                    "Interstellar", 169, LocalDate.of(2014, 11, 7),
                    "Exploradores viajan a través de un agujero de gusano para salvar a la humanidad.",
                    8.6, nolan
            );
            interstellar.addCategoria(buscarCat(categoriasGuardadas, "Ciencia Ficción"));
            interstellar.addCategoria(aventura);
            peliculaRepo.save(interstellar);

            System.out.println(">>> SAGA COMPLETA CARGADA CON ÉXITO");
        };
    }

    // Métodos auxiliares para limpiar el código
    private Categoria buscarCat(List<Categoria> categorias, String nombre) {
        return categorias.stream()
                .filter(c -> c.getNombre().equalsIgnoreCase(nombre))
                .findFirst()
                .orElse(null);
    }

    private Pelicula crearPelicula(String titulo, int duracion, LocalDate fecha, String sinopsis, double nota, Director director) {
        return new Pelicula(
                null, titulo, duracion, fecha, sinopsis, nota, director,
                new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>(), new ArrayList<>()
        );
    }
}