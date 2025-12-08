package com.dam2.Practica1.mapper;

import com.dam2.Practica1.DTO.Pelicula.PeliculaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Pelicula.PeliculaDTO;
import com.dam2.Practica1.domain.Pelicula;

public class PeliculaMapper {

    public static PeliculaDTO toDTO(Pelicula pelicula){
        if (pelicula == null) return null;

        return new PeliculaDTO(
                pelicula.getId(),
                pelicula.getTitulo(),
                pelicula.getDuracion(),
                pelicula.getFechaEstreno(),
                pelicula.getSinopsis(),
                pelicula.getValoracion()
        );
    }

    public static Pelicula toEntity(PeliculaCreateUpdateDTO dto){
        if (dto == null) return null;

        Pelicula pelicula = new Pelicula();
        pelicula.setTitulo(dto.getTitulo());
        pelicula.setDuracion(dto.getDuracion());
        pelicula.setFechaEstreno(dto.getFechaEstreno());
        pelicula.setSinopsis(dto.getSinopsis());
        pelicula.setValoracion(dto.getValoracion());
        return pelicula;
    }

    public static void updateEntity(Pelicula pelicula, PeliculaCreateUpdateDTO dto){
        pelicula.setTitulo(dto.getTitulo());
        pelicula.setDuracion(dto.getDuracion());
        pelicula.setFechaEstreno(dto.getFechaEstreno());
        pelicula.setSinopsis(dto.getSinopsis());
        pelicula.setValoracion(dto.getValoracion());
    }
}
