package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Actor.ActorCreateUpdateDTO;
import com.dam2.Practica1.DTO.Actor.ActorDTO;
import com.dam2.Practica1.domain.Actor;
import com.dam2.Practica1.service.ActorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/actores")
public class ActorController {

    @Autowired
    private ActorService actorService;

    @GetMapping
    public List<ActorDTO> obtenerActores(){
        return actorService.actores().stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ActorDTO actorPorId(@PathVariable Long id){
        Actor actor = actorService.buscarPorId(id);
        return mapToDTO(actor);
    }

    @PostMapping
    public void crear(@RequestBody ActorCreateUpdateDTO dto){
        Actor actor = actorService.crear(dto);

    }

    @PutMapping("/{id}")
    public ActorDTO actualizarActor(@PathVariable Long id, @RequestBody ActorCreateUpdateDTO dto){
        Actor actor = actorService.actualizar(id, dto);
        return mapToDTO(actor);
    }

    @DeleteMapping("/ {id}")
    public void eliminarActor(@PathVariable Long id){
        actorService.eliminar(id);
    }

    private ActorDTO mapToDTO(Actor actor){
        return new ActorDTO(actor.getId(), actor.getNombre());
    }
}
