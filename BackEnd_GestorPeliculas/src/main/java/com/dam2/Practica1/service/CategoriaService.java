package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Categoria.CategoriaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Categoria.CategoriaDTO;
import com.dam2.Practica1.domain.Categoria;
import com.dam2.Practica1.mapper.CategoriaMapper;
import com.dam2.Practica1.repository.CategoriaRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoriaService {

    @Autowired
    private CategoriaRepository categoriaRepository;

    @Transactional
    public CategoriaDTO crear(CategoriaCreateUpdateDTO dto){
        Categoria categoria = CategoriaMapper.toEntity(dto);
        categoriaRepository.save(categoria);
        return CategoriaMapper.toDTO(categoria);
    }

    @Transactional
    public CategoriaDTO actualizar(Long id, CategoriaCreateUpdateDTO dto){
        Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoria no encontrada"));

        CategoriaMapper.updateEntity(categoria, dto);
        categoriaRepository.save(categoria);
        return CategoriaMapper.toDTO(categoria);
    }

    public List<CategoriaDTO> categorias() {
        return categoriaRepository.findAll()
                .stream()
                .map(CategoriaMapper::toDTO)
                .toList();

    }

    public CategoriaDTO buscarPorId(Long id){
        Categoria categoria = categoriaRepository.findById(id).orElseThrow(() -> new RuntimeException("Categoría no encontrado"));

        return CategoriaMapper.toDTO(categoria);
    }

    @Transactional
    public void eliminar(Long id){
        categoriaRepository.deleteById(id);
    }
}
