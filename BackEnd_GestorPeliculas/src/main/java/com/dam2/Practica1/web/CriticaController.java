package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Critica.CriticaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Critica.CriticaDTO;
import com.dam2.Practica1.domain.Critica;
import com.dam2.Practica1.mapper.CriticaMapper;
import com.dam2.Practica1.service.CriticaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/criticas")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CriticaController {

    @Autowired
    private CriticaService criticaService;

    @GetMapping
    public List<CriticaDTO> obtenerCriticas(){
        return criticaService.criticas();
    }

    @GetMapping("/{id}")
    public CriticaDTO criticaPorId(@PathVariable Long id){
        return criticaService.buscarPorId(id);
    }

    @GetMapping("/pelicula/{id}")
    public List<CriticaDTO> obtenerCriticasDePelicula(@PathVariable Long id){
        return criticaService.obtenerCriticasPorPelicula(id);
    }

    @PostMapping
    public CriticaDTO crear(@RequestBody CriticaCreateUpdateDTO dto){
        return criticaService.crear(dto);
    }

    @PutMapping("/{id}")
    public CriticaDTO actualizarCritica(@PathVariable Long id, @RequestBody CriticaCreateUpdateDTO dto){
        return criticaService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminarCritica(@PathVariable Long id){
        criticaService.eliminar(id);
    }
}
