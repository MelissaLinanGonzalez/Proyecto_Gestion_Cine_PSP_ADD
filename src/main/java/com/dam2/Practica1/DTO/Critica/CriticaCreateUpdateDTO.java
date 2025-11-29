package com.dam2.Practica1.DTO.Critica;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CriticaCreateUpdateDTO {

    @NotBlank(message = "Comentario requeriod")
    private String comentario;

    @NotBlank(message = "Nota requerida")
    @Min(value = 0, message = "No puedes dar una nota negativa")
    @Max(value = 10, message = "Nota máxima 10")
    private Float nota;

    @NotBlank(message = "Nota requerida")
    private LocalDate fecha;
}
