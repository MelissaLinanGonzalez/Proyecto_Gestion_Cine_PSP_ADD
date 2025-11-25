package com.dam2.Practica1.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ficha_tecnica")
@Data  // ✅ Lombok genera getters, setters, toString, equals, hashCode
// ✅ genera constructor con todos los campos
@NoArgsConstructor
public class FichaTecnica {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Director director;
    private Integer duracion;
    private String pais;

    public FichaTecnica(Long id, Director director, int duracion, String pais) {
        this.id = id;
        this.director = director;
        this.duracion = duracion;
        this.pais = pais;
    }
}
