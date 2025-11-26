package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.FichaTecnica.FichaTecnicaCreateUpdateDTO;
import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.domain.FichaTecnica;
import com.dam2.Practica1.mapper.FichaTecnicaMapper;
import com.dam2.Practica1.repository.DirectorRepository;
import com.dam2.Practica1.repository.FichaTecnicaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FichaTecnicaService {

    @Autowired
    private FichaTecnicaRepository fichaTecnicaRepository;

    @Autowired
    private DirectorRepository directorRepository;

    // CREATE
    public FichaTecnica crear(FichaTecnicaCreateUpdateDTO dto){

        FichaTecnica ficha = FichaTecnicaMapper.toEntity(dto);

        // Asignar director
        if (dto.getDirectorId() != null) {
            Director director = directorRepository.findById(dto.getDirectorId())
                    .orElseThrow(() -> new RuntimeException("Director no encontrado"));
            ficha.setDirector(director);
        }

        return fichaTecnicaRepository.save(ficha);
    }

    // UPDATE
    public FichaTecnica actualizar(Long id, FichaTecnicaCreateUpdateDTO dto){

        FichaTecnica ficha = fichaTecnicaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ficha técnica no encontrada"));

        // Actualiza campos simples
        FichaTecnicaMapper.updateEntity(ficha, dto);

        // Si viene directorId, actualizar director
        if (dto.getDirectorId() != null) {
            Director director = directorRepository.findById(dto.getDirectorId())
                    .orElseThrow(() -> new RuntimeException("Director no encontrado"));
            ficha.setDirector(director);
        }

        return fichaTecnicaRepository.save(ficha);
    }

    // GET ALL
    public List<FichaTecnica> fichasTecnicas(){
        return fichaTecnicaRepository.findAll();
    }

    // GET BY ID
    public FichaTecnica buscarPorId(Long id){
        return fichaTecnicaRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ficha técnica no encontrada"));
    }

    // DELETE
    public void eliminar(Long id){
        fichaTecnicaRepository.deleteById(id);
    }
}
