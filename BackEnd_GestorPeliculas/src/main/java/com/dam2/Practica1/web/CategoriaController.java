package com.dam2.Practica1.web;


import com.dam2.Practica1.DTO.Categoria.CategoriaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Categoria.CategoriaDTO;

import com.dam2.Practica1.domain.Categoria;
import com.dam2.Practica1.mapper.CategoriaMapper;
import com.dam2.Practica1.service.CategoriaService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/categorias")
@RequiredArgsConstructor
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @GetMapping
    public List<CategoriaDTO> obtenerCategorias(){
        return categoriaService.categorias();
    }

    @GetMapping("/{id}")
    public CategoriaDTO categoriaPorId(@PathVariable Long id){
        return categoriaService.buscarPorId(id);
    }

    @PostMapping
    public CategoriaDTO crear(@RequestBody CategoriaCreateUpdateDTO dto){
        return categoriaService.crear(dto);
    }

    @PutMapping("/{id}")
    public CategoriaDTO actualizarCategoria(@PathVariable Long id, @RequestBody CategoriaCreateUpdateDTO dto){
        return categoriaService.actualizar(id,dto);
    }

    @DeleteMapping("/{id}")
    public void eliminarCategoria(@PathVariable Long id){
        categoriaService.eliminar(id);
    }
}
