package com.dam2.Practica1.DTO.Director;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DirectorCreateUpdateDTO {

    @NotBlank(message = "Nombre requerido")
    private String nombre;
}
