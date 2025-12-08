package com.dam2.Practica1.DTO.Plataforma;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlataformaCreateUpdateDTO {
    private String nombre;
    private String url;
}
