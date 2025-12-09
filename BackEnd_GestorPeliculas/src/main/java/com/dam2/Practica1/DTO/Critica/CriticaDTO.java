package com.dam2.Practica1.DTO.Critica;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CriticaDTO {
    private Long id;
    private String comentario;
    private Float nota;
    private LocalDate fecha;
    private String nombreUsuario;
    private String tituloPelicula;
}
