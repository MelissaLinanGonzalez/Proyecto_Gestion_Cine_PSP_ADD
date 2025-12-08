package com.dam2.Practica1.mapper;

import com.dam2.Practica1.DTO.Idioma.IdiomaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Idioma.IdiomaDTO;
import com.dam2.Practica1.domain.Idioma;

public class IdiomaMapper {

    public static IdiomaDTO toDTO(Idioma idioma) {
        if (idioma == null) return null;

        return new IdiomaDTO(
                idioma.getId(),
                idioma.getNombre()
        );
    }

    public static Idioma toEntity(IdiomaCreateUpdateDTO dto) {
        if (dto == null) return null;

        Idioma idioma = new Idioma();
        idioma.setNombre(dto.getNombre());
        return idioma;
    }

    public static void updateEntity(Idioma idioma, IdiomaCreateUpdateDTO dto) {
        idioma.setNombre(dto.getNombre());
    }
}
