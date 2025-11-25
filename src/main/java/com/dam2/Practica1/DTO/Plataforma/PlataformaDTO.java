package com.dam2.Practica1.DTO.Plataforma;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PlataformaDTO {
    private Long id;
    private String nombre;
    private String url;
}
