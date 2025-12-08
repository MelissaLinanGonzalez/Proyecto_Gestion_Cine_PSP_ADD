package com.dam2.Practica1.web;

import com.dam2.Practica1.DTO.Usuario.UsuarioCreateUpdateDTO;
import com.dam2.Practica1.DTO.Usuario.UsuarioDTO;
import com.dam2.Practica1.domain.Usuario;
import com.dam2.Practica1.mapper.UsuarioMapper;
import com.dam2.Practica1.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class UsuarioController {
    
    @Autowired
    private UsuarioService usuarioService;

    @Autowired
    private com.dam2.Practica1.repository.UsuarioRepository usuarioRepository;
    
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

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody UsuarioCreateUpdateDTO loginRequest) {
        Optional<Usuario> usuario = usuarioRepository.findByUsernameAndPassword(
                loginRequest.getUsername(), loginRequest.getPassword());

        if (usuario.isPresent()) {
            return ResponseEntity.ok(UsuarioMapper.toDTO(usuario.get()));
        } else {
            return ResponseEntity.status(401).body("Credenciales incorrectas");
        }
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
