package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Critica.CriticaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Critica.CriticaDTO;
import com.dam2.Practica1.domain.Critica;
import com.dam2.Practica1.mapper.CriticaMapper;
import com.dam2.Practica1.repository.CriticaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CriticaService {

    @Autowired
    private CriticaRepository criticaRepository;

    @Transactional
    public CriticaDTO crear(CriticaCreateUpdateDTO dto){
        Critica critica = CriticaMapper.toEntity(dto);
        criticaRepository.save(critica);
        return CriticaMapper.toDTO(critica);
    }

    @Transactional
    public CriticaDTO actualizar(Long id, CriticaCreateUpdateDTO dto){
        Critica critica = criticaRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha podido encontrar la crítica"));

        CriticaMapper.updateEntity(critica, dto);
        criticaRepository.save(critica);

        return CriticaMapper.toDTO(critica);
    }

    public List<CriticaDTO> criticas(){
        return criticaRepository.findAll()
                .stream()
                .map(CriticaMapper::toDTO)
                .toList();
    }

    @Transactional
    public CriticaDTO buscarPorId(Long id){
        Critica critica = criticaRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado la crítica"));
        return CriticaMapper.toDTO(critica);
    }

    public void eliminar(Long id){
        criticaRepository.deleteById(id);
    }

}
