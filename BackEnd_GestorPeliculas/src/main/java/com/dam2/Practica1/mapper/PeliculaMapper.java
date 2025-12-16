package com.dam2.Practica1.mapper;

import com.dam2.Practica1.DTO.Pelicula.PeliculaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Pelicula.PeliculaDTO;
import com.dam2.Practica1.domain.Actor;
import com.dam2.Practica1.domain.Categoria;
import com.dam2.Practica1.domain.Pelicula;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class PeliculaMapper {

    public static PeliculaDTO toDTO(Pelicula pelicula) {
        if (pelicula == null) return null;

        PeliculaDTO dto = new PeliculaDTO();
        dto.setId(pelicula.getId());
        dto.setTitulo(pelicula.getTitulo());
        dto.setDuracion(pelicula.getDuracion());
        dto.setFechaEstreno(pelicula.getFechaEstreno());
        dto.setSinopsis(pelicula.getSinopsis());
        dto.setValoracion(pelicula.getValoracion());

        // Mapear Director
        if (pelicula.getDirector() != null) {
            dto.setDirector(pelicula.getDirector().getNombre());
        }

        // Mapear Categorías
        if (pelicula.getCategorias() != null) {
            dto.setCategorias(pelicula.getCategorias().stream()
                    .map(Categoria::getNombre)
                    .collect(Collectors.toList()));
        }

        // ✅ NUEVO: Mapear Actores
        if (pelicula.getActors() != null) {
            dto.setActores(pelicula.getActors().stream()
                    .map(Actor::getNombre)
                    .collect(Collectors.toList()));
        }

        return dto;
    }

    public static Pelicula toEntity(PeliculaCreateUpdateDTO dto) {
        Pelicula pelicula = new Pelicula();
        pelicula.setTitulo(dto.getTitulo());
        pelicula.setDuracion(dto.getDuracion());
        pelicula.setFechaEstreno(dto.getFechaEstreno());
        pelicula.setSinopsis(dto.getSinopsis());
        return pelicula;
    }

    public static void updateEntity(Pelicula pelicula, PeliculaCreateUpdateDTO dto) {
        if (dto.getTitulo() != null) pelicula.setTitulo(dto.getTitulo());
        if (dto.getDuracion() > 0) pelicula.setDuracion(dto.getDuracion());
        if (dto.getFechaEstreno() != null) pelicula.setFechaEstreno(dto.getFechaEstreno());
        if (dto.getSinopsis() != null) pelicula.setSinopsis(dto.getSinopsis());
    }
}