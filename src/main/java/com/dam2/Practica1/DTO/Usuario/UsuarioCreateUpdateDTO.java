package com.dam2.Practica1.DTO.Usuario;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UsuarioCreateUpdateDTO {

    @NotBlank(message = "Username requerido")
    private String username;

    @NotBlank(message = "Email requerido")
    private String email;

    @NotBlank(message = "COntraseña requerida")
    private String password;

    @NotBlank(message = "Se necesita saber si es Administrador o no")
    private Boolean esAdmin;
}
