package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Plataforma.PlataformaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Plataforma.PlataformaDTO;
import com.dam2.Practica1.domain.Plataforma;
import com.dam2.Practica1.mapper.PlataformaMapper;
import com.dam2.Practica1.service.PlataformaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/plataformas")
public class PlataformaController {

    @Autowired
    private PlataformaService plataformaService;

    @GetMapping
    public List<PlataformaDTO> obtenerPlataformas(){
        return plataformaService.plataformas()
                .stream()
                .map(PlataformaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public PlataformaDTO plataformaPorId(@PathVariable Long id){
        Plataforma plataforma = plataformaService.buscarPorId(id);
        return PlataformaMapper.toDTO(plataforma);
    }

    @PostMapping
    public PlataformaDTO crear(@RequestBody PlataformaCreateUpdateDTO dto){
        Plataforma plataforma = plataformaService.crear(dto);
        return PlataformaMapper.toDTO(plataforma);
    }

    @PutMapping("/{id}")
    public PlataformaDTO actualizarPlatraforma(@PathVariable Long id,
                                    @RequestBody PlataformaCreateUpdateDTO dto){
        Plataforma plataforma = plataformaService.actualizar(id, dto);
        return PlataformaMapper.toDTO(plataforma);
    }

    @DeleteMapping("/{id}")
    public void eliminarPlataforma(@PathVariable Long id){
        plataformaService.eliminar(id);
    }
}
