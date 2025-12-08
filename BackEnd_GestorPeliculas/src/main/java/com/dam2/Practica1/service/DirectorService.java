package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Director.DirectorCreateUpdateDTO;
import com.dam2.Practica1.DTO.Director.DirectorDTO;
import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.mapper.DirectorMapper;
import com.dam2.Practica1.repository.DirectorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DirectorService {

    @Autowired
    private DirectorRepository directorRepository;

    @Transactional
    public DirectorDTO crear(DirectorCreateUpdateDTO dto){
        Director director = DirectorMapper.toEntity(dto);
        directorRepository.save(director);
        return DirectorMapper.toDTO(director);
    }

    @Transactional
    public DirectorDTO actualizar(Long id, DirectorCreateUpdateDTO dto){
        Director director = directorRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado el director"));
        DirectorMapper.updateEntity(director, dto);
        directorRepository.save(director);
        return DirectorMapper.toDTO(director);
    }

    public List<DirectorDTO> directores(){
        return directorRepository.findAll()
                .stream()
                .map(DirectorMapper::toDTO)
                .toList();
    }

    public DirectorDTO buscarPorId(Long id){
        Director director = directorRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado el director"));

        return DirectorMapper.toDTO(director);
    }

    @Transactional
    public void eliminar(Long id){
        directorRepository.deleteById(id);
    }
}
