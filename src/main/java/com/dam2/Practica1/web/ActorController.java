package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Actor.ActorCreateUpdateDTO;
import com.dam2.Practica1.DTO.Actor.ActorDTO;
import com.dam2.Practica1.service.ActorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/actores")
@RequiredArgsConstructor
public class ActorController {

    @Autowired
    private ActorService actorService;

    @GetMapping
    public List<ActorDTO> obtenerActores(){
        return actorService.actores();
    }

    @GetMapping("/{id}")
    public ActorDTO actorPorId(@PathVariable Long id){
        return actorService.buscarPorId(id);
    }

    @PostMapping
    public ActorDTO crear(@RequestBody ActorCreateUpdateDTO dto){
        return actorService.crear(dto);
    }

    @PutMapping("/{id}")
    public ActorDTO actualizarActor(@PathVariable Long id,
                                    @RequestBody ActorCreateUpdateDTO dto){
        return actorService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminarActor(@PathVariable Long id){
        actorService.eliminar(id);
    }
}
