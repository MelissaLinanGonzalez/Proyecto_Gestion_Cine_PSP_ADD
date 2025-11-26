package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Critica.CriticaCreateUpdateDTO;
import com.dam2.Practica1.domain.Critica;
import com.dam2.Practica1.mapper.CriticaMapper;
import com.dam2.Practica1.repository.CriticaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CriticaService {

    @Autowired
    private CriticaRepository criticaRepository;

    public Critica crear(CriticaCreateUpdateDTO dto){
        Critica critica = CriticaMapper.toEntity(dto);
        return criticaRepository.save(critica);
    }

    public Critica actualizar(Long id, CriticaCreateUpdateDTO dto){
        Critica critica = criticaRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha podido encontrar la crítica"));

        CriticaMapper.updateEntity(critica, dto);

        return criticaRepository.save(critica);
    }

    public List<Critica> criticas(){
        return criticaRepository.findAll();
    }

    public Critica buscarPorId(Long id){
        Critica critica = criticaRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado la crítica"));
        return critica;
    }

    public void eliminar(Long id){
        criticaRepository.deleteById(id);
    }

}
