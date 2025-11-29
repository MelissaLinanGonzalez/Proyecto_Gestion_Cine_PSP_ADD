package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Idioma.IdiomaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Idioma.IdiomaDTO;
import com.dam2.Practica1.domain.Idioma;
import com.dam2.Practica1.mapper.IdiomaMapper;
import com.dam2.Practica1.service.IdiomaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/idiomas")
@RequiredArgsConstructor
public class IdiomaController {

    @Autowired
    private IdiomaService idiomaService;

    @GetMapping
    public List<IdiomaDTO> obtenerIdiomas(){
        return idiomaService.idiomas();
    }

    @GetMapping("/{id}")
    public IdiomaDTO idiomaPorId(@PathVariable Long id){
        return idiomaService.buscarPorId(id);
    }

    @PostMapping
    public IdiomaDTO crearIdioma(@RequestBody IdiomaCreateUpdateDTO dto){
        return idiomaService.crear(dto);
    }

    @PutMapping("/{id}")
    public IdiomaDTO actualizarIdioma(@PathVariable Long id, @RequestBody IdiomaCreateUpdateDTO dto){
        return idiomaService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminarIdioma(@PathVariable Long id){
        idiomaService.eliminar(id);
    }

}
