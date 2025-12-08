package com.dam2.Practica1.mapper;

import com.dam2.Practica1.DTO.Plataforma.PlataformaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Plataforma.PlataformaDTO;
import com.dam2.Practica1.domain.Plataforma;

public class PlataformaMapper {

    public static PlataformaDTO toDTO(Plataforma plataforma){
        if (plataforma == null) return null;

        return new PlataformaDTO(
                plataforma.getId(),
                plataforma.getNombre(),
                plataforma.getUrl()
        );
    }

    public static Plataforma toEntity(PlataformaCreateUpdateDTO dto){
        if (dto == null) return null;

        Plataforma plataforma = new Plataforma();
        plataforma.setNombre(dto.getNombre());
        plataforma.setUrl(dto.getUrl());
        return plataforma;
    }

    public static void updateEntity(Plataforma plataforma, PlataformaCreateUpdateDTO dto){
        plataforma.setNombre(dto.getNombre());
        plataforma.setUrl(dto.getUrl());
    }
}
