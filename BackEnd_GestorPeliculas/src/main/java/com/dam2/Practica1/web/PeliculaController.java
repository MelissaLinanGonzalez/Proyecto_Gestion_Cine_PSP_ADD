package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Pelicula.PeliculaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Pelicula.PeliculaDTO;
import com.dam2.Practica1.domain.Pelicula;
import com.dam2.Practica1.service.PeliculaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.List;

@RestController
@RequestMapping("/api/peliculas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PeliculaController {

    private final PeliculaService service;

    @GetMapping
    public List<PeliculaDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public PeliculaDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @GetMapping("/buscar")
    public List<PeliculaDTO> buscarPorTitulo(@RequestParam String query) {
        return service.buscarPorTitulo(query);
    }

    @GetMapping("/categoria/{nombre}")
    public List<PeliculaDTO> peliculasPorCategoria(@PathVariable String nombre) {
        // ✅ Ahora llamamos al servicio, NO al repositorio directamente
        return service.buscarPorCategoria(nombre);
    }

    @PostMapping
    public PeliculaDTO crear(@RequestBody PeliculaCreateUpdateDTO dto) {
        return service.guardar(dto);
    }

    @PutMapping("/{id}")
    public PeliculaDTO actualizar(@PathVariable Long id,
                                  @RequestBody PeliculaCreateUpdateDTO dto) {
        return service.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void borrar(@PathVariable Long id) {
        service.borrar(id);
    }

    @GetMapping("/peliculas_mejores")
    public List<Pelicula> mejores_peliculas() {
        return service.mejores_peliculas(5);
    }

    /*@GetMapping("/procesar")
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

        CompletableFuture.allOf(t1, t2, t3, t4, t5, t6).join();

        long fin = System.currentTimeMillis();
        return "Tiempo total (asíncrono): " + (fin - inicio) + " ms";
    }*/

    @GetMapping("/reproducir")
    public String reproducirAsync() {
        long inicio = System.currentTimeMillis();

        var t1 = service.reproducir("🍿 Interstellar");
        var t2 = service.reproducir("🦇 The Dark Knight");
        var t3 = service.reproducir("🎵 Soul");

        CompletableFuture.allOf(t1, t2, t3).join();

        long fin = System.currentTimeMillis();
        return "Tiempo total (asíncrono): " + (fin - inicio) + " ms";
    }

    // Importar
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

    // Votación Oscar
    @GetMapping("/oscar")
    public Map<String, Integer> votar(@RequestParam int numJurados){
        return service.votarOscar(numJurados);
    }
}
