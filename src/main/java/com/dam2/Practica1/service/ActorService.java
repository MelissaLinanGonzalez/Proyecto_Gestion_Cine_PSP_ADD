package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Actor.ActorCreateUpdateDTO;
import com.dam2.Practica1.domain.Actor;
import com.dam2.Practica1.repository.ActorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ActorService {

    @Autowired
    private ActorRepository actorRepository;

    public Actor crear(ActorCreateUpdateDTO dto){
        Actor actor = new Actor();
        actor.setNombre(dto.getNombre());
        return actor;
    }

     public Actor actualizar(Long id, ActorCreateUpdateDTO dto){
        Actor actor = actorRepository.findById(id).orElseThrow(() -> new RuntimeException("Actor no encontrado"));

        actor.setNombre(dto.getNombre());
        return actorRepository.save(actor);
     }

     public List<Actor> actores(){
        return actorRepository.findAll();
     }

     public Actor buscarPorId(Long id){
        return actorRepository.findById(id).orElseThrow(() -> new RuntimeException("Actor no encontrado"));
     }

     public void eliminar(Long id){
        actorRepository.deleteById(id);
     }
}
