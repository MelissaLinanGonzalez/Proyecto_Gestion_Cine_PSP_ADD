package com.dam2.Practica1.DTO.Pelicula;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeliculaDTO {
    private Long id;
    private String titulo;
    private int duracion;
    private LocalDate fechaEstreno;
    private String sinopsis;
    private int valoracion;
}
