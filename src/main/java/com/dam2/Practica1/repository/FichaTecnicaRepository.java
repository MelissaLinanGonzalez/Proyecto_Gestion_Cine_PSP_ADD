package com.dam2.Practica1.repository;

import com.dam2.Practica1.domain.FichaTecnica;
import com.dam2.Practica1.domain.Pelicula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FichaTecnicaRepository extends JpaRepository<FichaTecnica, Long> {
}
