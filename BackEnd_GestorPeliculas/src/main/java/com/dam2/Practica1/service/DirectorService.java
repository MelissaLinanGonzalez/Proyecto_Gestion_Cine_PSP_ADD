package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Director.DirectorCreateUpdateDTO;
import com.dam2.Practica1.DTO.Director.DirectorDTO;
import com.dam2.Practica1.DTO.Pelicula.PeliculaDTO;
import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.domain.Pelicula;
import com.dam2.Practica1.mapper.DirectorMapper;
import com.dam2.Practica1.mapper.PeliculaMapper;
import com.dam2.Practica1.repository.DirectorRepository;
import com.dam2.Practica1.repository.PeliculaRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DirectorService {

    // Al usar @RequiredArgsConstructor, lo mejor es hacer los campos 'final'
    // y quitar el @Autowired (Lombok hace el constructor solo).

    private final DirectorRepository directorRepository;

    // Inyectamos el repositorio de películas para poder buscarlas
    private final PeliculaRepository peliculaRepository; // <--- NUEVO


    @Transactional
    public DirectorDTO crear(DirectorCreateUpdateDTO dto){
        Director director = DirectorMapper.toEntity(dto);
        directorRepository.save(director);
        return DirectorMapper.toDTO(director);
    }

    @Transactional
    public DirectorDTO actualizar(Long id, DirectorCreateUpdateDTO dto){
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se ha encontrado el director"));
        DirectorMapper.updateEntity(director, dto);
        directorRepository.save(director);
        return DirectorMapper.toDTO(director);
    }

    public List<DirectorDTO> directores(){
        return directorRepository.findAll()
                .stream()
                .map(DirectorMapper::toDTO)
                .sorted(Comparator.comparing(DirectorDTO::getNombre))
                .toList();
    }

    public DirectorDTO buscarPorId(Long id){
        Director director = directorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se ha encontrado el director"));
        return DirectorMapper.toDTO(director);
    }

    @Transactional
    public void eliminar(Long id){
        directorRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<PeliculaDTO> obtenerPeliculasPorDirector(Long directorId) {

        // 1. (Opcional) Verificamos que el director existe
        if (!directorRepository.existsById(directorId)) {
            throw new RuntimeException("No se ha encontrado el director con id: " + directorId);
        }

        // 2. Buscamos las películas usando el repositorio de películas
        // Nota: Asegúrate de tener findByDirectorId en PeliculaRepository
        List<Pelicula> peliculas = peliculaRepository.findByDirectorId(directorId);

        // 3. Convertimos la lista de entidades a DTOs
        return peliculas.stream()
                .map(PeliculaMapper::toDTO)
                .toList();
    }
}