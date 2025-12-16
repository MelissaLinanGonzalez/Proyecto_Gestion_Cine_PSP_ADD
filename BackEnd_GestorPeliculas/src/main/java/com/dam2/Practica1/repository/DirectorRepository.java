package com.dam2.Practica1.repository;

import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.domain.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DirectorRepository extends JpaRepository<Director, Long> {

    Optional<Director> findByNombre(String nombre);
}
