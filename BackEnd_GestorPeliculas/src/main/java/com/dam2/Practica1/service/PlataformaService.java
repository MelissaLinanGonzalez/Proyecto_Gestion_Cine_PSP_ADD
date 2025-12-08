package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Plataforma.PlataformaCreateUpdateDTO;
import com.dam2.Practica1.domain.Plataforma;
import com.dam2.Practica1.mapper.PlataformaMapper;
import com.dam2.Practica1.repository.PlataformaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlataformaService {

    @Autowired
    private PlataformaRepository plataformaRepository;

    public Plataforma crear(PlataformaCreateUpdateDTO dto){
        Plataforma plataforma = PlataformaMapper.toEntity(dto);
        return plataformaRepository.save(plataforma);
    }

    public Plataforma actualizar(Long id, PlataformaCreateUpdateDTO dto){
        Plataforma plataforma = plataformaRepository.findById(id).orElseThrow(() -> new RuntimeException("Plataforma no encontrado"));

        PlataformaMapper.updateEntity(plataforma, dto);

        return plataformaRepository.save(plataforma);
    }

    public List<Plataforma> plataformas(){
        return plataformaRepository.findAll();
    }

    public Plataforma buscarPorId(Long id){
        return plataformaRepository.findById(id).orElseThrow(() -> new RuntimeException("Plataforma no encontrado"));
    }

    public void eliminar(Long id){
        plataformaRepository.deleteById(id);
    }
}
