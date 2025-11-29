package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Pelicula.PeliculaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Pelicula.PeliculaDTO;
import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.domain.Pelicula;
import com.dam2.Practica1.mapper.PeliculaMapper;
import com.dam2.Practica1.repository.DirectorRepository;
import com.dam2.Practica1.repository.PeliculaRepository;
import jakarta.transaction.Transactional;
import lombok.*;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Async;

import java.time.LocalDate;
import java.util.*;
import java.util.concurrent.*;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.stream.Stream;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;

@Service
@Getter
@RequiredArgsConstructor
public class PeliculaService {

    private final List<Pelicula> peliculas = new ArrayList<>();
    private final PeliculaRepository peliculaRepository;
    private final DirectorRepository directorRepository;
    private final Random random = new Random();
    private final ImportarService importarService;

    public List<PeliculaDTO> listar(){
        return peliculaRepository.findAll()
                .stream()
                .map(PeliculaMapper::toDTO)
                .toList();
    }

    public PeliculaDTO buscarPorId(Long id) {
        Pelicula pelicula = peliculaRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado la película"));
        return PeliculaMapper.toDTO(pelicula);
    }

    @Transactional
    public PeliculaDTO guardar(PeliculaCreateUpdateDTO dto){
        Pelicula pelicula = PeliculaMapper.toEntity(dto);
        peliculaRepository.save(pelicula);
        return PeliculaMapper.toDTO(pelicula);
    }

    @Transactional
    public PeliculaDTO actualizar(Long id, PeliculaCreateUpdateDTO dto){
        Pelicula pelicula = peliculaRepository.findById(id).orElseThrow(() -> new RuntimeException("Película no encontrada"));

        PeliculaMapper.updateEntity(pelicula, dto);

        peliculaRepository.save(pelicula);
        return PeliculaMapper.toDTO(pelicula);
    }

    @Transactional
    public void borrar(Long id){
        peliculaRepository.deleteById(id);
    }

    public void agregar(Pelicula pelicula) {
        peliculas.add(pelicula);
    }

    public List<Pelicula> mejores_peliculas(int valoracion){
        List<Pelicula> peliculas_aux= new ArrayList<>();
        for (Pelicula p : peliculas) {
            if (p.getValoracion()>=valoracion) {
                peliculas_aux.add(p);
            }
        }
        return peliculas_aux;
    }

    public String tareaLenta(String titulo) {
        try {
            System.out.println("Iniciando tarea para " + titulo + " en " + Thread.currentThread().getName());
            Thread.sleep(3000);
            System.out.println("Terminando tarea para " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return "Procesada " + titulo;
    }

    @Async("taskExecutor")
    public CompletableFuture<String> tareaLenta2(String titulo) {
        try {
            System.out.println("Iniciando " + titulo + " en " + Thread.currentThread().getName());
            Thread.sleep(3000);
            System.out.println("Terminando " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture("Procesada " + titulo);
    }

    @Async("taskExecutor")
    public CompletableFuture<String> reproducir(String titulo) {
        try {
            System.out.println("Reproduciendo " + titulo + " en " + Thread.currentThread().getName());
            Thread.sleep(3000);
            System.out.println("Terminando " + titulo);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        return CompletableFuture.completedFuture("Procesada " + titulo);
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
    public CompletableFuture<Void> votarPelicula(Pelicula pelicula, Map<String, Integer> resultados, Semaphore semaphore, int juradoId){
        try {
            semaphore.acquire();
            int puntos = ThreadLocalRandom.current().nextInt(0, 11);
            resultados.merge(pelicula.getTitulo(), puntos, Integer::sum);
            System.out.println("Jurado " + juradoId + " vota " + puntos + " puntos a " + pelicula.getTitulo());
            Thread.sleep(100);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        } finally {
            semaphore.release();
        }
        return CompletableFuture.completedFuture(null);
    }

    public Map<String, Integer> votarOscar(int numJurados){
        Map<String, Integer> resultados = new ConcurrentHashMap<>();
        Semaphore semaphore = new Semaphore(5);
        List<CompletableFuture<Void>> futures = new ArrayList<>();

        long inicio = System.currentTimeMillis();

        for (int i = 1; i <= numJurados; i++){
            int juradoId = i;
            for (Pelicula p : peliculas){
                futures.add(votarPelicula(p, resultados, semaphore, juradoId));
            }
        }

        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long fin = System.currentTimeMillis();
        System.out.println("Tiempo total de votación con: " + numJurados + " jurados " + (fin - inicio) + " ms");

        List<Map.Entry<String, Integer>> listaOrdenada = new ArrayList<>(resultados.entrySet());
        listaOrdenada.sort((e1, e2) -> e2.getValue().compareTo(e1.getValue()));

        Map<String, Integer> resultadosOrdenados = new LinkedHashMap<>();
        for (Map.Entry<String, Integer> entry : listaOrdenada) {
            resultadosOrdenados.put(entry.getKey(), entry.getValue());
        }

        return resultadosOrdenados;
    }
}
