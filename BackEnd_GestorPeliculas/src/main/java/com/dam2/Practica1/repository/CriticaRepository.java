package com.dam2.Practica1.repository;

import com.dam2.Practica1.domain.Critica;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CriticaRepository extends JpaRepository<Critica, Long> {

    List<Critica> findByPeliculaId(Long peliculaId);
}
