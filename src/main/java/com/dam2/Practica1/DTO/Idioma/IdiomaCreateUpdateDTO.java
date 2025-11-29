package com.dam2.Practica1.DTO.Idioma;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IdiomaCreateUpdateDTO {

    @NotBlank(message = "Nomenclatura de idioma requerida")
    private String nombre;
}
