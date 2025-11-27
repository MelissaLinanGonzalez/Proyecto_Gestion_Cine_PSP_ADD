package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Idioma.IdiomaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Idioma.IdiomaDTO;
import com.dam2.Practica1.domain.Idioma;
import com.dam2.Practica1.mapper.IdiomaMapper;
import com.dam2.Practica1.service.IdiomaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/idiomas")
public class IdiomaController {

    @Autowired
    private IdiomaService idiomaService;

    @GetMapping
    public List<IdiomaDTO> obtenerIdiomas(){
        return idiomaService.idiomas()
                .stream()
                .map(IdiomaMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public IdiomaDTO idiomaPorId(@PathVariable Long id){
        Idioma idioma = idiomaService.buscarPorId(id);
        return IdiomaMapper.toDTO(idioma);
    }

    @PostMapping
    public IdiomaDTO crearIdioma(@RequestBody IdiomaCreateUpdateDTO dto){
        Idioma idioma = idiomaService.crear(dto);
        return IdiomaMapper.toDTO(idioma);
    }

    @PutMapping("/{id}")
    public IdiomaDTO actualizarIdioma(@PathVariable Long id, @RequestBody IdiomaCreateUpdateDTO dto){
        Idioma idioma = idiomaService.actualizar(id, dto);
        return IdiomaMapper.toDTO(idioma);
    }

    @DeleteMapping("/{id}")
    public void eliminarIdioma(@PathVariable Long id){
        idiomaService.eliminar(id);
    }

}
