package com.dam2.Practica1.web;


import com.dam2.Practica1.DTO.Pelicula.PeliculaDTO;
import com.dam2.Practica1.domain.Pelicula;
import com.dam2.Practica1.service.PeliculaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
public class PeliculaController {
    private final PeliculaService service;

    @GetMapping
    public List<PeliculaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public Pelicula buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/peliculas_mejores")
    public List<Pelicula> mejores_peliculas() {
        return service.mejores_peliculas(5);
    }
/*
    @GetMapping("/mejores_peliculas")
    public List<Pelicula> mejores_peliculas() {
        return service.mejores_peliculas();
    }
*/
    @PostMapping("/agregar")
    public void agregar(@RequestBody Pelicula pelicula) {
        service.agregar(pelicula);
    }

    @GetMapping("/procesar")
    public String procesarPeliculas() {
        long inicio = System.currentTimeMillis();
        service.tareaLenta("Interstellar");
        service.tareaLenta("The Dark Knight");
        service.tareaLenta("Soul");
        long fin = System.currentTimeMillis();
        return "Tiempo total: " + (fin - inicio) + " ms";
    }

    @GetMapping("/procesarAsync")
    public String procesarAsync() {
        long inicio = System.currentTimeMillis();

        var t1 = service.tareaLenta2("🍿 Interstellar");
        var t2 = service.tareaLenta2("🦇 The Dark Knight");
        var t3 = service.tareaLenta2("🎵 Soul");
        var t4 = service.tareaLenta2("🎵 Soul");
        var t5 = service.tareaLenta2("🎵 Soul");
        var t6 = service.tareaLenta2("🎵 Soul");
        //var t7 = service.tareaLenta2("🎵 Soul");

        // Espera a que terminen todas las tareas
        CompletableFuture.allOf(t1, t2, t3,t4,t5,t6).join();

        long fin = System.currentTimeMillis();
        return "Tiempo total (asíncrono): " + (fin - inicio) + " ms";
    }

    // A4 - Ejercicio 2
    @GetMapping("/reproducir")
    public String reproducirAsync() {
        long inicio = System.currentTimeMillis();

        var t1 = service.reproducir("🍿 Interstellar");
        var t2 = service.reproducir("🦇 The Dark Knight");
        var t3 = service.reproducir("🎵 Soul");

        // Espera a que terminen todas las tareas
        CompletableFuture.allOf(t1, t2, t3).join();

        long fin = System.currentTimeMillis();
        return "Tiempo total (asíncrono): " + (fin - inicio) + " ms";
    }

     //A4 - Ejercicio 3
    @PostMapping("/importar")
    public String importarCarpeta(@RequestParam String ruta){
        try {
            long inicio = System.currentTimeMillis();

            service.importarCarpeta(ruta);
            long fin = System.currentTimeMillis();
            return "Importación completa: " + (fin - inicio) + "ms";
        } catch (Exception e){
            return "Error al importar: " + e.getMessage();
        }
    }

    // Ejercicio 4
    @GetMapping("/oscar")
    public Map<String, Integer> votar(@RequestParam int numJurados){
        return service.votarOscar(numJurados);
    }


//    @GetMapping("/mostrarPeliculas")
//    public List<PeliculaDTO> mostrarPeliculas(){
//        return service.listarPeliculas();
//    }

}
