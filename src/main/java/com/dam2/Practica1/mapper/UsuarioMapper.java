package com.dam2.Practica1.mapper;

import com.dam2.Practica1.DTO.Usuario.UsuarioCreateUpdateDTO;
import com.dam2.Practica1.DTO.Usuario.UsuarioDTO;
import com.dam2.Practica1.domain.Usuario;

public class UsuarioMapper {

    public static UsuarioDTO toDTO(Usuario usuario){
        if (usuario == null) return null;

        return new UsuarioDTO(
                usuario.getId(),
                usuario.getUsername(),
                usuario.getEmail(),
                usuario.getPassword(),
                usuario.getEsAdmin()
        );
    }

    public static Usuario toEntity(UsuarioCreateUpdateDTO dto){
        if (dto == null) return null;

        Usuario usuario = new Usuario();
        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(dto.getPassword());
        usuario.setEsAdmin(dto.getEsAdmin());

        return usuario;
    }

    public static void updateEntity(Usuario usuario, UsuarioCreateUpdateDTO dto){
        usuario.setUsername(dto.getUsername());
        usuario.setEmail(dto.getEmail());
        usuario.setPassword(dto.getPassword());
        usuario.setEsAdmin(dto.getEsAdmin());
    }
}
