package com.dam2.Practica1.DTO.Pelicula;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeliculaCreateUpdateDTO {

    @NotBlank(message = "Título requerido")
    private String titulo;

    @NotBlank(message = "Duración requerida")
    private int duracion;

    @NotBlank(message = "Fecha de estreno requerida")
    private LocalDate fechaEstreno;

    @NotBlank(message = "Sinopsis requerida")
    private String sinopsis;

    @NotBlank(message = "Valoración requerida")
    private int valoracion;
}
