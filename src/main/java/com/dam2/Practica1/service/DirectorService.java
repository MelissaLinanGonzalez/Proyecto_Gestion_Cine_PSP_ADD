package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Director.DirectorCreateUpdateDTO;
import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.mapper.DirectorMapper;
import com.dam2.Practica1.repository.DirectorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DirectorService {

    @Autowired
    private DirectorRepository directorRepository;

    public Director crear(DirectorCreateUpdateDTO dto){
        Director director = DirectorMapper.toEntity(dto);
        return directorRepository.save(director);
    }

    public Director actualizar(Long id, DirectorCreateUpdateDTO dto){
        Director director = directorRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado el director"));
        DirectorMapper.updateEntity(director, dto);
        return directorRepository.save(director);
    }

    public List<Director> directores(){
        return directorRepository.findAll();
    }

    public Director buscarPorId(Long id){
        return directorRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado el director"));
    }

    public void eliminar(Long id){
        directorRepository.deleteById(id);
    }
}
