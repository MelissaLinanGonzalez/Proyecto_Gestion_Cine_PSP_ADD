package com.dam2.Practica1.DTO.Pelicula;

import com.dam2.Practica1.domain.Director;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeliculaDTO {
    private Long id;
    private String titulo;
    private int duracion;
    private LocalDate fechaEstreno;
    private String sinopsis;
    private Double valoracion;
    private String director;
    private List<String> categorias;
    private List<String> actores;
}
