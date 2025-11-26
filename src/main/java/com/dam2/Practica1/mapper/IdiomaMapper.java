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

    // DTO -> Entity (para crear)
    public static Idioma toEntity(IdiomaCreateUpdateDTO dto) {
        if (dto == null) return null;

        Idioma idioma = new Idioma();
        idioma.setNombre(dto.getNombre());
        return idioma;
    }

    // DTO -> Actualizar entity existente
    public static void updateEntity(Idioma idioma, IdiomaCreateUpdateDTO dto) {
        idioma.setNombre(dto.getNombre());
    }
}
