package com.dam2.Practica1.mapper;

import com.dam2.Practica1.DTO.Critica.CriticaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Critica.CriticaDTO;
import com.dam2.Practica1.domain.Critica;

public class CriticaMapper {

    public static CriticaDTO toDTO(Critica critica){
        if (critica == null) return null;

        String usuario = (critica.getUsuario() != null) ? critica.getUsuario().getUsername() : "Anónimo";
        String peli = (critica.getPelicula() != null) ? critica.getPelicula().getTitulo() : "Película desconocida";

        return new CriticaDTO(
                critica.getId(),
                critica.getComentario(),
                critica.getNota(),
                critica.getFecha(),
                usuario, // ✅ Mapeamos el nombre
                peli     // ✅ Mapeamos el título
        );
    }

    public static Critica toEntity(CriticaCreateUpdateDTO dto){
        if (dto == null) return null;

        Critica critica = new Critica();
        critica.setComentario(dto.getComentario());
        critica.setNota(dto.getNota());
        critica.setFecha(dto.getFecha());
        return critica;
    }

    public static void updateEntity(Critica critica, CriticaCreateUpdateDTO dto){
        critica.setComentario(dto.getComentario());
        critica.setNota(dto.getNota());
        critica.setFecha(dto.getFecha());
    }
}