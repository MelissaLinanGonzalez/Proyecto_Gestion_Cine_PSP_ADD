package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Actor.ActorCreateUpdateDTO;
import com.dam2.Practica1.DTO.Actor.ActorDTO;
import com.dam2.Practica1.domain.Actor;
import com.dam2.Practica1.mapper.ActorMapper;
import com.dam2.Practica1.repository.ActorRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActorService {

    @Autowired
    private ActorRepository actorRepository;

    @Transactional
    public ActorDTO crear(ActorCreateUpdateDTO dto){
        Actor actor = ActorMapper.toEntity(dto);
        actorRepository.save(actor);
        return ActorMapper.toDTO(actor);
    }

    @Transactional
    public ActorDTO actualizar(Long id, ActorCreateUpdateDTO dto){
        Actor actor = actorRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Actor con id: " + id + " no contrado"));

        ActorMapper.updateEntity(actor, dto);
        actorRepository.save(actor);

        return ActorMapper.toDTO(actor);
    }

    public List<ActorDTO> actores(){
        return actorRepository.findAll()
                .stream()
                .map(ActorMapper::toDTO)
                .toList();
    }

    public ActorDTO buscarPorId(Long id){
        Actor actor = actorRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Actor con id: " + id + " no contrado"));
        return ActorMapper.toDTO(actor);
    }

    @Transactional
    public void eliminar(Long id){
        Actor actor = actorRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND, "Actor con id: " + id + " no contrado"));
        actorRepository.deleteById(id);
    }
}
