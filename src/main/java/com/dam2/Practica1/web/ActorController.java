package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Actor.ActorCreateUpdateDTO;
import com.dam2.Practica1.DTO.Actor.ActorDTO;
import com.dam2.Practica1.domain.Actor;
import com.dam2.Practica1.mapper.ActorMapper;
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
        return actorService.actores()
                .stream()
                .map(ActorMapper::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ActorDTO actorPorId(@PathVariable Long id){
        Actor actor = actorService.buscarPorId(id);
        return ActorMapper.toDTO(actor);
    }

    @PostMapping
    public ActorDTO crear(@RequestBody ActorCreateUpdateDTO dto){
        Actor actor = actorService.crear(dto);
        return ActorMapper.toDTO(actor);
    }

    @PutMapping("/{id}")
    public ActorDTO actualizarActor(@PathVariable Long id,
                                    @RequestBody ActorCreateUpdateDTO dto){
        Actor actor = actorService.actualizar(id, dto);
        return ActorMapper.toDTO(actor);
    }

    @DeleteMapping("/{id}")
    public void eliminarActor(@PathVariable Long id){
        actorService.eliminar(id);
    }
}
