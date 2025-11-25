package com.dam2.Practica1.web;


import com.dam2.Practica1.DTO.Categoria.CategoriaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Categoria.CategoriaDTO;

import com.dam2.Practica1.domain.Categoria;
import com.dam2.Practica1.service.CategoriaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/categorias")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public List<CategoriaDTO> obtenerCategorias(){
        return categoriaService.categorias().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public CategoriaDTO categoriaPorId(@PathVariable Long id){
        Categoria categoria = categoriaService.buscarPorId(id);
        return mapToDTO(categoria);
    }

    @PostMapping
    public void crear(@RequestBody CategoriaCreateUpdateDTO dto){
        Categoria categoria = categoriaService.crear(dto);
    }

    @PutMapping("/{id}")
    public CategoriaDTO actualizarCategoria(@PathVariable Long id, @RequestBody CategoriaCreateUpdateDTO dto){
        Categoria categoria = categoriaService.actualizar(id, dto);
        return mapToDTO(categoria);
    }

    @DeleteMapping("/{id}")
    public void eliminarCategoria(@PathVariable Long id){
        categoriaService.eliminar(id);
    }

    private CategoriaDTO mapToDTO(Categoria categoria){
    return new CategoriaDTO(categoria.getId(), categoria.getNombre());
    }
}
