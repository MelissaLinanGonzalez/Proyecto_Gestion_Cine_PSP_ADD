package com.dam2.Practica1.DTO.Actor;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ActorCreateUpdateDTO {

    @NotBlank(message = "Nombre obligatorio")
    private String nombre;
}
