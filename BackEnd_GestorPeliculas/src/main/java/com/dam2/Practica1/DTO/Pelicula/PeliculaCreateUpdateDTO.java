package com.dam2.Practica1.DTO.Pelicula;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PeliculaCreateUpdateDTO {

    @NotBlank(message = "Título requerido")
    private String titulo;

    @NotNull(message = "Duración requerida")
    private int duracion;

    @NotNull(message = "Fecha de estreno requerida")
    private LocalDate fechaEstreno;

    @NotBlank(message = "Sinopsis requerida")
    private String sinopsis;

    private List<Long> categoriaIds;
}
