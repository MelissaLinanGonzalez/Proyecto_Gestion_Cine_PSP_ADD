package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Pelicula.PeliculaDTO;
import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.domain.Pelicula;
import com.dam2.Practica1.repository.DirectorRepository;
import com.dam2.Practica1.repository.PeliculaRepository;
import lombok.*;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

import org.springframework.scheduling.annotation.Async;

import java.util.concurrent.*;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;
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

    public List<Pelicula> mejores_peliculas(int valoracion){
        List<Pelicula> peliculas_aux= new ArrayList<>();
        for (Pelicula p : peliculas) {
            if (p.getValoracion()>=valoracion) {
                peliculas_aux.add(p);
            }
        }
        return peliculas_aux;
    }

//    public List<Pelicula> listar() {
//        return peliculaRepository.findAll();
//    }

    public List<PeliculaDTO> listar(){
        return peliculaRepository.findAll()
                .stream()
                .map(this::toDTO) //Convertimos Pelicula a lista de DTO
                .toList();
    }

    private PeliculaDTO toDTO(Pelicula p) {
        return new PeliculaDTO(
                p.getId(),
                p.getTitulo(),
                p.getDuracion(),
                p.getFechaEstreno(),
                p.getSinopsis(),
                p.getValoracion()
        );
    }

    public Pelicula buscarPorId(Long id) {
        for (Pelicula p : peliculas) {
            if (p.getId().equals(id)) {
                return p;
            }
        }
        return null;
        /*
        * return peliculas.stream()                 // convierte la lista en un flujo de datos
        .filter(p -> p.getId().equals(id)) // se queda solo con las películas cuyo id coincide
        .findFirst()                       // toma la primera coincidencia (si existe)
        .orElse(null);                     // devuelve esa película o null si no hay
        * */
    }

    public void agregar(Pelicula pelicula) {
        peliculas.add(pelicula);
    }

    public String tareaLenta(String titulo) {
        try {
            System.out.println("Iniciando tarea para " + titulo + " en " + Thread.currentThread().getName());
            Thread.sleep(3000); // simula proceso lento (3 segundos)
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
        // Esperar a que terminen todas las tareas asíncronas
        CompletableFuture.allOf(futures.toArray(new CompletableFuture[0])).join();

        long fin = System.currentTimeMillis();
        System.out.println("Importación completa en " + (fin - inicio) + " ms");
    }


    @Async("taskExecutor")
    public CompletableFuture<Void> importarCsvAsync(Path fichero) {
        try {
            System.out.println("Procesando CSV: " + fichero + " en " + Thread.currentThread().getName());

            List<Pelicula> lista = new ArrayList<>();

            List<String> lineas = Files.readAllLines(fichero);
            lineas.remove(0); // suponemos encabezado

            for (String linea : lineas) {
                String[] campos = linea.split(";");
                Pelicula p = new Pelicula();
                p.setTitulo(campos[0]);
                p.setDuracion(Integer.parseInt(campos[1]));
                p.setFechaEstreno(LocalDate.parse(campos[2]));
                p.setSinopsis(campos[3]);
                Director directorDefault = directorRepository.findById(1L)
                        .orElseThrow();
                p.setDirector(directorDefault);
                lista.add(p);
            }

            peliculaRepository.saveAll(lista);

            System.out.println("Finalizado CSV: " + fichero);

        } catch (Exception e) {
            System.err.println("Error en CSV " + fichero + ": " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
    }

    @Async("taskExecutor")
    public CompletableFuture<Void> importarXmlAsync(Path fichero) {
        try {
            System.out.println("Procesando XML: " + fichero + " en " + Thread.currentThread().getName());

            List<Pelicula> lista = new ArrayList<>();

            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();

            Document doc = builder.parse(fichero.toFile());
            NodeList nodos = doc.getElementsByTagName("pelicula");

            for (int i = 0; i < nodos.getLength(); i++) {
                Element e = (Element) nodos.item(i);

                Pelicula p = new Pelicula();
                p.setTitulo(e.getElementsByTagName("titulo").item(0).getTextContent());
                p.setDuracion(Integer.parseInt(e.getElementsByTagName("duracion").item(0).getTextContent()));
                p.setFechaEstreno(LocalDate.parse(e.getElementsByTagName("fechaEstreno").item(0).getTextContent()));
                p.setSinopsis(e.getElementsByTagName("sinopsis").item(0).getTextContent());
                Director directorDefault = directorRepository.findById(1L)
                        .orElseThrow();
                p.setDirector(directorDefault);

                lista.add(p);
            }

            peliculaRepository.saveAll(lista);

            System.out.println("Finalizado XML: " + fichero);

        } catch (Exception e) {
            System.err.println("Error en XML " + fichero + ": " + e.getMessage());
        }

        return CompletableFuture.completedFuture(null);
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
