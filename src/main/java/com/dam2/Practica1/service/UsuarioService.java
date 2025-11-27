package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Usuario.UsuarioCreateUpdateDTO;
import com.dam2.Practica1.domain.Usuario;
import com.dam2.Practica1.mapper.UsuarioMapper;
import com.dam2.Practica1.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Usuario crear(UsuarioCreateUpdateDTO dto){
        Usuario usuario = UsuarioMapper.toEntity(dto);
        return usuarioRepository.save(usuario);
    }

    public Usuario actualizar(Long id, UsuarioCreateUpdateDTO dto){
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UsuarioMapper.updateEntity(usuario, dto);

        return usuarioRepository.save(usuario);
    }

    public List<Usuario> usuarios(){
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id){
        return usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public void eliminar(Long id){
        usuarioRepository.deleteById(id);
    }
}
