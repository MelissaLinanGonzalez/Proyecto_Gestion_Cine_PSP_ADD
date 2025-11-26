package com.dam2.Practica1.mapper;

import com.dam2.Practica1.DTO.Categoria.CategoriaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Categoria.CategoriaDTO;
import com.dam2.Practica1.domain.Categoria;

public class CategoriaMapper {

    public static CategoriaDTO toDTO(Categoria categoria){
        if (categoria == null) return null;

        return new CategoriaDTO(
                categoria.getId(),
                categoria.getNombre()
        );
    }

    public static Categoria toEntity(CategoriaCreateUpdateDTO dto){
        if (dto == null) return null;

        Categoria categoria = new Categoria();
        categoria.setNombre(dto.getNombre());
        return categoria;
    }

    public static void updateEntity(Categoria categoria, CategoriaCreateUpdateDTO dto){
        categoria.setNombre(dto.getNombre());
    }

}
