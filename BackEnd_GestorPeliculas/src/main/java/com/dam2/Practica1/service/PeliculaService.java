package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Pelicula.PeliculaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Pelicula.PeliculaDTO;
import com.dam2.Practica1.domain.Categoria;
import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.domain.Pelicula;
import com.dam2.Practica1.domain.Actor;
import com.dam2.Practica1.mapper.PeliculaMapper;
import com.dam2.Practica1.repository.ActorRepository;
import com.dam2.Practica1.repository.CategoriaRepository;
import com.dam2.Practica1.repository.DirectorRepository;
import com.dam2.Practica1.repository.PeliculaRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
// ✅ IMPORTANTE: Usar la de Spring, no Jakarta para readOnly
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Stream;

@Service
@Getter
@RequiredArgsConstructor
public class PeliculaService {

    private final PeliculaRepository peliculaRepository;
    private final DirectorRepository directorRepository;
    private final CategoriaRepository categoriaRepository;
    private final ImportarService importarService;
    private final ActorRepository actorRepository;

    @Transactional(readOnly = true)
    public List<PeliculaDTO> buscarPorTitulo(String titulo) {
        return peliculaRepository.findByTituloContainingIgnoreCase(titulo)
                .stream()
                .map(PeliculaMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PeliculaDTO> buscarPorCategoria(String nombreCategoria) {
        return peliculaRepository.findByCategorias_Nombre(nombreCategoria)
                .stream()
                .map(PeliculaMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PeliculaDTO> listar(){
        return peliculaRepository.findAll()
                .stream()
                .map(PeliculaMapper::toDTO)
                .toList();
    }

    @Transactional(readOnly = true)
    public PeliculaDTO buscarPorId(Long id) {
        Pelicula pelicula = peliculaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se ha encontrado la película"));
        return PeliculaMapper.toDTO(pelicula);
    }

    @Transactional
    public PeliculaDTO guardar(PeliculaCreateUpdateDTO dto){
        Pelicula pelicula = PeliculaMapper.toEntity(dto);

        if (dto.getDirector() != null && dto.getDirector().getNombre() != null && !dto.getDirector().getNombre().isEmpty()) {
            String nombreDirector = dto.getDirector().getNombre();

            Optional<Director> directorExistente = directorRepository.findAll().stream()
                    .filter(d -> d.getNombre().equalsIgnoreCase(nombreDirector))
                    .findFirst();

            if (directorExistente.isPresent()) {
                pelicula.setDirector(directorExistente.get());
            } else {
                Director nuevoDirector = new Director();
                nuevoDirector.setNombre(nombreDirector);
                nuevoDirector = directorRepository.save(nuevoDirector);
                pelicula.setDirector(nuevoDirector);
            }
        }

        if (dto.getCategoriaIds() != null && !dto.getCategoriaIds().isEmpty()) {
            for (Long catId : dto.getCategoriaIds()) {
                categoriaRepository.findById(catId).ifPresent(pelicula::addCategoria);
            }
        }

        if (dto.getActores() != null && !dto.getActores().isEmpty()) {
            for (String nombreActor : dto.getActores()) {
                Actor actor = actorRepository.findAll().stream()
                        .filter(a -> a.getNombre().equalsIgnoreCase(nombreActor))
                        .findFirst()
                        .orElseGet(() -> {
                            Actor nuevo = new Actor();
                            nuevo.setNombre(nombreActor);
                            return actorRepository.save(nuevo);
                        });
                pelicula.addActor(actor);
            }
        }

        peliculaRepository.save(pelicula);
        return PeliculaMapper.toDTO(pelicula);
    }

    @Transactional
    public PeliculaDTO actualizar(Long id, PeliculaCreateUpdateDTO dto){
        Pelicula pelicula = peliculaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Película no encontrada"));

        PeliculaMapper.updateEntity(pelicula, dto);

        if (dto.getDirector() != null && dto.getDirector().getNombre() != null) {
            String nombreDirector = dto.getDirector().getNombre();

            Director director = directorRepository.findAll().stream()
                    .filter(d -> d.getNombre().equalsIgnoreCase(nombreDirector))
                    .findFirst()
                    .orElseGet(() -> {
                        Director nuevo = new Director();
                        nuevo.setNombre(nombreDirector);
                        return directorRepository.save(nuevo);
                    });
            pelicula.setDirector(director);
        }

        if (dto.getCategoriaIds() != null) {
            new ArrayList<>(pelicula.getCategorias()).forEach(pelicula::removeCategoria);
            for (Long catId : dto.getCategoriaIds()) {
                categoriaRepository.findById(catId).ifPresent(pelicula::addCategoria);
            }
        }

        if (dto.getActores() != null) {
            new ArrayList<>(pelicula.getActors()).forEach(pelicula::removeActor);
            for (String nombreActor : dto.getActores()) {
                Actor actor = actorRepository.findAll().stream()
                        .filter(a -> a.getNombre().equalsIgnoreCase(nombreActor))
                        .findFirst()
                        .orElseGet(() -> {
                            Actor nuevo = new Actor();
                            nuevo.setNombre(nombreActor);
                            return actorRepository.save(nuevo);
                        });
                pelicula.addActor(actor);
            }
        }

        peliculaRepository.save(pelicula);
        return PeliculaMapper.toDTO(pelicula);
    }

    @Transactional
    public void borrar(Long id){
        peliculaRepository.deleteById(id);
    }

    public List<Pelicula> mejores_peliculas(int valoracion){
        return peliculaRepository.findAll().stream()
                .filter(p -> p.getValoracion() >= valoracion)
                .toList();
    }

    public void importarCarpeta(String rutaCarpeta) throws IOException {
        long inicio = System.currentTimeMillis();
        List<CompletableFuture<Void>> futures = new ArrayList<>();
        try (Stream<Path> paths = Files.list(Paths.get(rutaCarpeta))) {
            paths.filter(Files::isRegularFile).forEach(path -> {
                String nombre = path.toString().toLowerCase();
                if (nombre.endsWith(".csv") || nombre.endsWith(".txt")) {
                    futures.add(importarService.importarCsvAsync(path));
                } else if (nombre.endsWith(".xml")) {
                    futures.add(importarService.importarXmlAsync(path));
                }
            });
        }
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();
        long fin = System.currentTimeMillis();
        System.out.println("Importación completa en " + (fin - inicio) + " ms");
    }

    @Async("taskExecutor")
    public CompletableFuture<String> reproducir(String titulo) {
        return CompletableFuture.completedFuture("Procesada " + titulo);
    }

    public Map<String, Integer> votarOscar(int numJurados){
        return new HashMap<>();
    }
}