package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Idioma.IdiomaCreateUpdateDTO;
import com.dam2.Practica1.domain.Idioma;
import com.dam2.Practica1.mapper.IdiomaMapper;
import com.dam2.Practica1.repository.IdiomaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IdiomaService {

    @Autowired
    private IdiomaRepository idiomaRepository;

    public Idioma crear(IdiomaCreateUpdateDTO dto){
        Idioma idioma = IdiomaMapper.toEntity(dto);
        return idiomaRepository.save(idioma);
    }

    public Idioma actualizar(Long id, IdiomaCreateUpdateDTO dto){
        Idioma idioma = idiomaRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado el idioma"));
        IdiomaMapper.updateEntity(idioma, dto);

        return idiomaRepository.save(idioma);
    }

    public List<Idioma> idiomas(){
        return idiomaRepository.findAll();
    }

    public Idioma buscarPorId(Long id){
        Idioma idioma = idiomaRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado el idioma"));
        return idioma;
    }

    public void eliminar(Long id){
        idiomaRepository.deleteById(id);
    }
}
