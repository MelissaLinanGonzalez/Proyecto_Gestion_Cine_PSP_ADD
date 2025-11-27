package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Usuario.UsuarioCreateUpdateDTO;
import com.dam2.Practica1.DTO.Usuario.UsuarioDTO;
import com.dam2.Practica1.domain.Usuario;
import com.dam2.Practica1.mapper.UsuarioMapper;
import com.dam2.Practica1.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;
    
    @GetMapping
    public List<UsuarioDTO> obtenerUsuarios(){
        return usuarioService.usuarios()
                .stream()
                .map(UsuarioMapper::toDTO)
                .collect(Collectors.toList());
    }
    
    @GetMapping("/{id}")
    public UsuarioDTO usuarioPorId(@PathVariable Long id){
        Usuario usuario = usuarioService.buscarPorId(id);
        return UsuarioMapper.toDTO(usuario);
    }
    
    @PostMapping
    public UsuarioDTO crear(@RequestBody UsuarioCreateUpdateDTO dto){
        Usuario usuario = usuarioService.crear(dto);
        return UsuarioMapper.toDTO(usuario);
    }
    
    @PutMapping("/{id}")
    public UsuarioDTO actualizarUsuario(@PathVariable Long id, @RequestBody UsuarioCreateUpdateDTO dto){
        Usuario usuario = usuarioService.actualizar(id, dto);
        return UsuarioMapper.toDTO(usuario);
    }

    @DeleteMapping("/{id}")
    public void eliminarUsuario(@PathVariable Long id){
        usuarioService.eliminar(id);
    }
}
