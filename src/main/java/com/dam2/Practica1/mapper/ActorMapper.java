package com.dam2.Practica1.mapper;

import com.dam2.Practica1.DTO.Actor.ActorCreateUpdateDTO;
import com.dam2.Practica1.DTO.Actor.ActorDTO;
import com.dam2.Practica1.domain.Actor;

public class ActorMapper {

    // Entity -> DTO
    public static ActorDTO toDTO(Actor actor) {
        if (actor == null) return null;

        return new ActorDTO(
                actor.getId(),
                actor.getNombre()
        );
    }

    // DTO -> Entity (para crear)
    public static Actor toEntity(ActorCreateUpdateDTO dto) {
        if (dto == null) return null;

        Actor actor = new Actor();
        actor.setNombre(dto.getNombre());
        return actor;
    }

    // DTO -> Actualizar entity existente
    public static void updateEntity(Actor actor, ActorCreateUpdateDTO dto) {
        actor.setNombre(dto.getNombre());
    }
}
