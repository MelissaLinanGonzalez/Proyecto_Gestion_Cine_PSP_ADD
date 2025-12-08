package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Usuario.UsuarioCreateUpdateDTO;
import com.dam2.Practica1.DTO.Usuario.UsuarioDTO;
import com.dam2.Practica1.domain.Usuario;
import com.dam2.Practica1.mapper.UsuarioMapper;
import com.dam2.Practica1.repository.UsuarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Transactional
    public UsuarioDTO crear(UsuarioCreateUpdateDTO dto){
        Usuario usuario = UsuarioMapper.toEntity(dto);
        usuarioRepository.save(usuario);
        return UsuarioMapper.toDTO(usuario);
    }

    @Transactional
    public UsuarioDTO actualizar(Long id, UsuarioCreateUpdateDTO dto){
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        UsuarioMapper.updateEntity(usuario, dto);
        usuarioRepository.save(usuario);

        return UsuarioMapper.toDTO(usuario);
    }

    public List<UsuarioDTO> usuarios(){
        return usuarioRepository.findAll()
                .stream()
                .map(UsuarioMapper::toDTO)
                .toList();
    }

    public UsuarioDTO buscarPorId(Long id){
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return UsuarioMapper.toDTO(usuario);
    }

    @Transactional
    public void eliminar(Long id){
        Usuario usuario = usuarioRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        usuarioRepository.delete(usuario);
    }
}
