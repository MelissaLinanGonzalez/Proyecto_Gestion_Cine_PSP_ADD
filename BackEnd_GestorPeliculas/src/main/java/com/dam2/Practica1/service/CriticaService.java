package com.dam2.Practica1.service;

import com.dam2.Practica1.DTO.Critica.CriticaCreateUpdateDTO;
import com.dam2.Practica1.DTO.Critica.CriticaDTO;
import com.dam2.Practica1.domain.Critica;
import com.dam2.Practica1.mapper.CriticaMapper;
import com.dam2.Practica1.repository.CriticaRepository;
import com.dam2.Practica1.repository.PeliculaRepository;
import com.dam2.Practica1.repository.UsuarioRepository;
import com.dam2.Practica1.domain.Pelicula;
import com.dam2.Practica1.domain.Usuario;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CriticaService {

    @Autowired
    private CriticaRepository criticaRepository;
    private final PeliculaRepository peliculaRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public CriticaDTO actualizar(Long id, CriticaCreateUpdateDTO dto){
        Critica critica = criticaRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha podido encontrar la crítica"));

        CriticaMapper.updateEntity(critica, dto);
        criticaRepository.save(critica);

        return CriticaMapper.toDTO(critica);
    }

    public List<CriticaDTO> criticas(){
        return criticaRepository.findAll()
                .stream()
                .map(CriticaMapper::toDTO)
                .toList();
    }

    @Transactional
    public CriticaDTO crear(CriticaCreateUpdateDTO dto){
        Critica critica = CriticaMapper.toEntity(dto);

        // 1. Asociar Película
        if(dto.getPeliculaId() != null) {
            Pelicula pelicula = peliculaRepository.findById(dto.getPeliculaId())
                    .orElseThrow(() -> new RuntimeException("Película no encontrada"));
            critica.setPelicula(pelicula);

            // 2. Guardamos la crítica primero
            criticaRepository.save(critica);

            // 3. Recalcular la media de la película
            actualizarMediaPelicula(pelicula);
        } else {
            // Si no hay película, solo guardamos (o lanzamos error según tu lógica)
            criticaRepository.save(critica);
        }

        // Asociar Usuario si viene
        if(dto.getUsuarioId() != null){
            Usuario usuario = usuarioRepository.findById(dto.getUsuarioId()).orElse(null);
            critica.setUsuario(usuario);
        }

        return CriticaMapper.toDTO(critica);
    }

    private void actualizarMediaPelicula(Pelicula pelicula) {
        List<Critica> criticas = pelicula.getCriticas();
        if (criticas.isEmpty()) {
            pelicula.setValoracion(0.0);
        } else {
            double suma = 0;
            for (Critica c : criticas) {
                suma += c.getNota();
            }
            double media = suma / criticas.size();
            // Redondear a 1 decimal
            media = Math.round(media * 10.0) / 10.0;
            pelicula.setValoracion(media);
        }
        peliculaRepository.save(pelicula);
    }

    @Transactional
    public CriticaDTO buscarPorId(Long id){
        Critica critica = criticaRepository.findById(id).orElseThrow(() -> new RuntimeException("No se ha encontrado la crítica"));
        return CriticaMapper.toDTO(critica);
    }

    public void eliminar(Long id){
        criticaRepository.deleteById(id);
    }

}
