package com.dam2.Practica1.config;

import com.dam2.Practica1.domain.Actor;
import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.domain.FichaTecnica;
import com.dam2.Practica1.domain.Pelicula;
import com.dam2.Practica1.repository.ActorRepository;
import com.dam2.Practica1.repository.DirectorRepository;
import com.dam2.Practica1.repository.FichaTecnicaRepository;
import com.dam2.Practica1.repository.PeliculaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.ArrayList;
@Configuration
public class DataLoader {

    // Este código debe ejecutarse automáticamente justo DESPUÉS de que arranque toda la aplicación.
    @Bean
    CommandLineRunner initData(ActorRepository actorRepo,
                               DirectorRepository directorRepo,
                               FichaTecnicaRepository fichaRepo,
                               PeliculaRepository peliculaRepo) {

        return args -> {


            // =====================================================
            // 🚨 PROTECCIÓN: solo cargar datos si NO hay directores
            // =====================================================
            if (directorRepo.count() > 0) {
                System.out.println(">>> Datos ya existentes. NO se carga DataLoader.");
                return;
            }

            System.out.println(">>> CARGANDO DATOS DE PRUEBA...");

            // ======================================
            // DIRECTORES
            // ======================================
            Director nolan = new Director(null, "Christopher Nolan", new ArrayList<>());
            Director docter = new Director(null, "Pete Docter", new ArrayList<>());

            directorRepo.save(nolan);
            directorRepo.save(docter);

            // ======================================
            // FICHAS TÉCNICAS
            // ======================================
            // OJO: tus fichas solo tienen (id, director, duracion, pais)
            FichaTecnica f1 = new FichaTecnica(null, nolan, 169, "EE.UU.");
            FichaTecnica f2 = new FichaTecnica(null, docter, 100, "EE.UU.");

            fichaRepo.save(f1);
            fichaRepo.save(f2);

            // ======================================
            // PELÍCULAS
            // ======================================
            Pelicula interstellar = new Pelicula(
                    null,
                    "Interstellar",
                    169,
                    LocalDate.of(2014, 11, 7),
                    "Exploradores espaciales viajan a través de un agujero de gusano...",
                    9,
                    f1,
                    nolan,
                    new ArrayList<>(),  // lista de actores VACÍA
                    new ArrayList<>(),  // lista de plataforma VACÍA
                    new ArrayList<>(),  // lista de categorias VACÍA
                    new ArrayList<>(),  // lista de idiomas VACÍA
                    new ArrayList<>()  // lista de criticas VACÍA
            );

            Pelicula soul = new Pelicula(
                    null,
                    "Soul",
                    100,
                    LocalDate.of(2020, 12, 25),
                    "Un músico descubre el verdadero sentido de la vida...",
                    8,
                    f2,
                    docter,
                    new ArrayList<>(),
                    new ArrayList<>(),
                    new ArrayList<>(),
                    new ArrayList<>(),
                    new ArrayList<>()
            );

            peliculaRepo.save(interstellar);
            peliculaRepo.save(soul);

            // ======================================
            // ACTORES
            // ======================================
            Actor matthew = new Actor(null, "Matthew McConaughey", new ArrayList<>());
            Actor hathaway = new Actor(null, "Anne Hathaway", new ArrayList<>());
            Actor foxx = new Actor(null, "Jamie Foxx", new ArrayList<>());

            actorRepo.save(matthew);
            actorRepo.save(hathaway);
            actorRepo.save(foxx);

            // ======================================
            // RELACIÓN MANY-TO-MANY
            // (Usando tus métodos de sincronización)
            // ======================================
            matthew.addPelicula(interstellar);
            hathaway.addPelicula(interstellar);

            foxx.addPelicula(soul);

            actorRepo.save(matthew);
            actorRepo.save(hathaway);
            actorRepo.save(foxx);

            System.out.println(">>> DATOS DE PRUEBA INSERTADOS CORRECTAMENTE");
        };
    }
}