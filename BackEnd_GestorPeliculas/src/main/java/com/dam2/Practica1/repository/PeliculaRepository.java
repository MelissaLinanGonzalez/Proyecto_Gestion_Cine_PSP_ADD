package com.dam2.Practica1.repository;

import com.dam2.Practica1.domain.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PeliculaRepository extends JpaRepository<Pelicula, Long> {
    List<Pelicula> findByTituloContainingIgnoreCase(String titulo);

    List<Pelicula> findByCategorias_Nombre(String nombre);
}
