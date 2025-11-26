package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.FichaTecnica.FichaTecnicaCreateUpdateDTO;
import com.dam2.Practica1.DTO.FichaTecnica.FichaTecnicaDTO;
import com.dam2.Practica1.domain.FichaTecnica;
import com.dam2.Practica1.mapper.FichaTecnicaMapper;
import com.dam2.Practica1.service.FichaTecnicaService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/fichastecnicas")
public class FichaTecnicaController {

    @Autowired
    private FichaTecnicaService fichaTecnicaService;

    // GET ALL
    @GetMapping
    public List<FichaTecnicaDTO> obtenerFichasTecnicas() {
        return fichaTecnicaService.fichasTecnicas()
                .stream()
                .map(FichaTecnicaMapper::toDTO)
                .collect(Collectors.toList());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public FichaTecnicaDTO fichaTecnicaPorId(@PathVariable Long id) {
        FichaTecnica ficha = fichaTecnicaService.buscarPorId(id);
        return FichaTecnicaMapper.toDTO(ficha);
    }

    // CREATE
    @PostMapping
    public FichaTecnicaDTO crear(@RequestBody FichaTecnicaCreateUpdateDTO dto) {
        FichaTecnica ficha = fichaTecnicaService.crear(dto);
        return FichaTecnicaMapper.toDTO(ficha);
    }

    // UPDATE
    @PutMapping("/{id}")
    public FichaTecnicaDTO actualizarFicha(
            @PathVariable Long id,
            @RequestBody FichaTecnicaCreateUpdateDTO dto) {

        FichaTecnica ficha = fichaTecnicaService.actualizar(id, dto);
        return FichaTecnicaMapper.toDTO(ficha);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void eliminarFicha(@PathVariable Long id) {
        fichaTecnicaService.eliminar(id);
    }
}
