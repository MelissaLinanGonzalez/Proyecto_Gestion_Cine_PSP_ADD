package com.dam2.Practica1.DTO.FichaTecnica;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FichaTecnicaCreateUpdateDTO {
    private Long directorId;
    private Integer duracion;
    private String pais;
}
