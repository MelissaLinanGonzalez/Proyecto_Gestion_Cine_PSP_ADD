package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Critica.CriticaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Critica.CriticaDTO;
import com.dam2.Practica1.domain.Critica;
import com.dam2.Practica1.mapper.CriticaMapper;
import com.dam2.Practica1.service.CriticaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/criticas")
public class CriticaController {

    @Autowired
    private CriticaService criticaService;

    @GetMapping
    public List<CriticaDTO> obtenerCriticas(){
        return criticaService.criticas()
                .stream()
                .map(CriticaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public CriticaDTO criticaPorId(@PathVariable Long id){
        Critica critica = criticaService.buscarPorId(id);
        return CriticaMapper.toDTO(critica);
    }

    @PostMapping
    public CriticaDTO crear(@RequestBody CriticaCreateUpdateDTO dto){
        Critica critica = criticaService.crear(dto);
        return CriticaMapper.toDTO(critica);
    }

    @PutMapping
    public CriticaDTO actualizarCritica(@PathVariable Long id, @RequestBody CriticaCreateUpdateDTO dto){
        Critica critica = criticaService.actualizar(id, dto);
        return CriticaMapper.toDTO(critica);
    }

    @DeleteMapping("/{id}")
    public void eliminarCritica(@PathVariable Long id){
        criticaService.eliminar(id);
    }
}
