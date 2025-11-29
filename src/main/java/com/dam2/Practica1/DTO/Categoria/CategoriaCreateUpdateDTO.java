package com.dam2.Practica1.DTO.Categoria;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CategoriaCreateUpdateDTO {

    @NotBlank(message = "Nombre requerido")
    private String nombre;
}
