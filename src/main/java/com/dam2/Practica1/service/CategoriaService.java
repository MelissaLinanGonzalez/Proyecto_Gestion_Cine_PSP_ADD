package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Categoria.CategoriaCreateUpdateDTO;
import com.dam2.Practica1.domain.Categoria;
import com.dam2.Practica1.mapper.CategoriaMapper;
import com.dam2.Practica1.repository.CategoriaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    public Categoria crear(CategoriaCreateUpdateDTO dto){
        Categoria categoria = CategoriaMapper.toEntity(dto);
        return categoriaRepository.save(categoria);
    }

    public Categoria actualizar(Long id, CategoriaCreateUpdateDTO dto){
        Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        CategoriaMapper.updateEntity(categoria, dto);
        return categoriaRepository.save(categoria);
    }

    public List<Categoria> categorias(){
        return categoriaRepository.findAll();
    }

    public Categoria buscarPorId(Long id){
        return categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Actor no encontrado"));
    }

    public void eliminar(Long id){
        categoriaRepository.deleteById(id);
    }
}
