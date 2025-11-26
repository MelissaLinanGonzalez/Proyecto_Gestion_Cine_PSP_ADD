package com.dam2.Practica1.mapper;

import com.dam2.Practica1.DTO.Director.DirectorCreateUpdateDTO;
import com.dam2.Practica1.DTO.Director.DirectorDTO;
import com.dam2.Practica1.domain.Director;

public class DirectorMapper {

    public static DirectorDTO toDTO(Director director){
        if (director == null) return null;

        return new DirectorDTO(
                director.getId(),
                director.getNombre()
        );
    }

    public static Director toEntity(DirectorCreateUpdateDTO dto){
        if (dto == null) return null;

        Director director = new Director();
        director.setNombre(dto.getNombre());
        return director;
    }

    public static void updateEntity(Director director, DirectorCreateUpdateDTO dto){
        director.setNombre(dto.getNombre());
    }

}

