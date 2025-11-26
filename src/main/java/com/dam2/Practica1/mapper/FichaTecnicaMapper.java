package com.dam2.Practica1.mapper;

import com.dam2.Practica1.DTO.FichaTecnica.FichaTecnicaCreateUpdateDTO;
import com.dam2.Practica1.DTO.FichaTecnica.FichaTecnicaDTO;
import com.dam2.Practica1.domain.FichaTecnica;

public class FichaTecnicaMapper {

    public static FichaTecnicaDTO toDTO(FichaTecnica fichaTecnica){
        if (fichaTecnica == null) return null;

        return new FichaTecnicaDTO(
                fichaTecnica.getId(),
                fichaTecnica.getDirector().getId(),
                fichaTecnica.getDuracion(),
                fichaTecnica.getPais()
        );
    }

    public static FichaTecnica toEntity(FichaTecnicaCreateUpdateDTO dto){
        if (dto == null) return null;

        FichaTecnica ficha = new FichaTecnica();
        ficha.setDuracion(dto.getDuracion());
        ficha.setPais(dto.getPais());

        return ficha;
    }

    public static void updateEntity(FichaTecnica ficha, FichaTecnicaCreateUpdateDTO dto){
        if (dto.getDuracion() != null)
            ficha.setDuracion(dto.getDuracion());

        if (dto.getPais() != null)
            ficha.setPais(dto.getPais());
    }
}
