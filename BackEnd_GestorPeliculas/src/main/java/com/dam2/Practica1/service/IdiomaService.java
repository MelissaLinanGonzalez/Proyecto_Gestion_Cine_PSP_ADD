package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Idioma.IdiomaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Idioma.IdiomaDTO;
import com.dam2.Practica1.domain.Idioma;
import com.dam2.Practica1.mapper.IdiomaMapper;
import com.dam2.Practica1.repository.IdiomaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class IdiomaService {

    @Autowired
    private IdiomaRepository idiomaRepository;

    @Transactional
    public IdiomaDTO crear(IdiomaCreateUpdateDTO dto){
        Idioma idioma = IdiomaMapper.toEntity(dto);
        idiomaRepository.save(idioma);
        return IdiomaMapper.toDTO(idioma);
    }

    @Transactional
    public IdiomaDTO actualizar(Long id, IdiomaCreateUpdateDTO dto){
        Idioma idioma = idiomaRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado el idioma"));
        IdiomaMapper.updateEntity(idioma, dto);
        idiomaRepository.save(idioma);

        return IdiomaMapper.toDTO(idioma);
    }

    public List<IdiomaDTO> idiomas(){
        return idiomaRepository.findAll()
                .stream()
                .map(IdiomaMapper::toDTO)
                .toList();
    }

    public IdiomaDTO buscarPorId(Long id){
        Idioma idioma = idiomaRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado el idioma"));
        return IdiomaMapper.toDTO(idioma);
    }

    @Transactional
    public void eliminar(Long id){
        idiomaRepository.deleteById(id);
    }
}
