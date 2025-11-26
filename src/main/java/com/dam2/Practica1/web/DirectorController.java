package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Director.DirectorCreateUpdateDTO;
import com.dam2.Practica1.DTO.Director.DirectorDTO;
import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.mapper.DirectorMapper;
import com.dam2.Practica1.service.DirectorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/directores")
public class DirectorController {

    @Autowired
    private DirectorService directorService;

    @GetMapping
    public List<DirectorDTO> obtenerDirectores(){
        return directorService.directores()
                .stream()
                .map(DirectorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public DirectorDTO directorPorId(@PathVariable Long id){
        Director director = directorService.buscarPorId(id);
        return DirectorMapper.toDTO(director);
    }

    @PostMapping
    public DirectorDTO crear(@RequestBody DirectorCreateUpdateDTO dto){
        Director director = directorService.crear(dto);
        return DirectorMapper.toDTO(director);
    }

    @PutMapping("/{id}")
    public DirectorDTO actualizarDirector(@PathVariable Long id, @RequestBody DirectorCreateUpdateDTO dto){
        Director director = directorService.actualizar(id, dto);
        return DirectorMapper.toDTO(director);
    }

    @DeleteMapping("/{id}")
    public void eliminarDirector(@PathVariable Long id){
        directorService.eliminar(id);
    }
}
