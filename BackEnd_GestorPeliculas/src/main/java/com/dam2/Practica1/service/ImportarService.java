package com.dam2.Practica1.service;

import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.domain.Pelicula;
import com.dam2.Practica1.repository.DirectorRepository;
import com.dam2.Practica1.repository.PeliculaRepository;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
@Getter
@RequiredArgsConstructor
public class ImportarService {
    private final PeliculaRepository peliculaRepository;
    private final DirectorRepository directorRepository;

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
}
