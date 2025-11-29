package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Usuario.UsuarioCreateUpdateDTO;
import com.dam2.Practica1.DTO.Usuario.UsuarioDTO;
import com.dam2.Practica1.domain.Usuario;
import com.dam2.Practica1.mapper.UsuarioMapper;
import com.dam2.Practica1.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @GetMapping
    public List<UsuarioDTO> obtenerUsuarios(){
        return usuarioService.usuarios();
    }
    
    @GetMapping("/{id}")
    public UsuarioDTO usuarioPorId(@PathVariable Long id){
        return usuarioService.buscarPorId(id);
    }
    
    @PostMapping
    public UsuarioDTO crear(@RequestBody UsuarioCreateUpdateDTO dto){
        return usuarioService.crear(dto);
    }
    
    @PutMapping("/{id}")
    public UsuarioDTO actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioCreateUpdateDTO dto){
        return usuarioService.actualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Long id){
        usuarioService.eliminar(id);
    }
}
