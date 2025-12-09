package com.dam2.Practica1.DTO.Critica;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CriticaCreateUpdateDTO {

    @NotBlank(message = "Comentario requerido")
    private String comentario;

    @NotNull(message = "Nota requerida")
    @Min(value = 0, message = "No puedes dar una nota negativa")
    @Max(value = 10, message = "Nota máxima 10")
    private Float nota;

    @NotNull(message = "Fecha requerida")
    private LocalDate fecha;

    // ✅ CAMPOS NUEVOS NECESARIOS
    private Long peliculaId;
    private Long usuarioId;
}