package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Director.DirectorCreateUpdateDTO;
import com.dam2.Practica1.DTO.Director.DirectorDTO;
import com.dam2.Practica1.DTO.Pelicula.PeliculaDTO;
import com.dam2.Practica1.domain.Director;
import com.dam2.Practica1.mapper.DirectorMapper;
import com.dam2.Practica1.service.DirectorService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/directores")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class DirectorController {

    @Autowired
    private DirectorService directorService;

    @GetMapping
    public List<DirectorDTO> obtenerDirectores(){
        return directorService.directores();
    }

    @GetMapping("/{id}")
    public DirectorDTO directorPorId(@PathVariable Long id){
        return directorService.buscarPorId(id);
    }

    @GetMapping("/{id}/peliculas")
    public List<PeliculaDTO> obtenerPeliculasDeDirector(@PathVariable Long id) {
        // Le pedimos al servicio las películas de este director concreto
        return directorService.obtenerPeliculasPorDirector(id);
    }

    @PostMapping
    public DirectorDTO crear(@RequestBody DirectorCreateUpdateDTO dto){
        return directorService.crear(dto);
    }

    @PutMapping("/{id}")
    public DirectorDTO actualizarDirector(@PathVariable Long id, @RequestBody DirectorCreateUpdateDTO dto){
        return directorService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminarDirector(@PathVariable Long id){
        directorService.eliminar(id);
    }
}
