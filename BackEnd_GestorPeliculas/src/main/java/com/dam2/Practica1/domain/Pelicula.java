package com.dam2.Practica1.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "peliculas")
@Data  // ✅ Lombok genera getters, setters, toString, equals, hashCode
@AllArgsConstructor      // ✅ genera constructor con todos los campos
@NoArgsConstructor
public class Pelicula {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String titulo;

    private int duracion;              // minutos

    @Column(name = "fecha_estreno")
    private LocalDate fechaEstreno;

    private String sinopsis;

    private Integer valoracion;

    @ManyToOne
    @JoinColumn(name = "director_id", nullable = true) // FK en PELICULA
    @JsonManagedReference
    private Director director;

    @ManyToMany(mappedBy = "peliculas")
    @JsonIgnore
    private List<Actor> actors = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "pelicula_plataforma",
            joinColumns = @JoinColumn(name = "pelicula_id"),
            inverseJoinColumns = @JoinColumn(name = "plataforma_id"))
    private List<Plataforma> plataformas = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "pelicula_categoria",
            joinColumns = @JoinColumn(name = "pelicula_id"),
            inverseJoinColumns = @JoinColumn(name = "categoria_id"))
    private List<Categoria> categorias = new ArrayList<>();

    @ManyToMany
    @JoinTable(
            name = "pelicula_idioma",
            joinColumns = @JoinColumn(name = "pelicula_id"),
            inverseJoinColumns = @JoinColumn(name = "idioma_id"))
    private List<Idioma> idiomas = new ArrayList<>();

    @OneToMany(mappedBy = "pelicula", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Critica> criticas = new ArrayList<>();


    // Mantener sincronizada una relación bidireccional Actor <-> Película
    public void addActor(Actor a){
        actors.add(a);
        a.getPeliculas().add(this);
    }

    public void removeActor(Actor a) {
        if (actors.contains(a)) {
            actors.remove(a);
        }
        if (a.getPeliculas().contains(this)) {
            a.getPeliculas().remove(this);
        }
    }

    // Metodos helpers para añadir y eliminar plataformas
    public void addPlataforma(Plataforma p){
        plataformas.add(p);
        p.getPeliculas().add(this);
    }

    public void removePlataforma(Plataforma p){
        if(plataformas.contains(p)){
            plataformas.remove(p);
        }

        if (p.getPeliculas().contains(this)){
            p.getPeliculas().remove(this);
        }
    }

    // Metodos helpers para añadir y elinminar categorias
    public void addCategoria(Categoria c){
        categorias.add(c);
        c.getPeliculas().add(this);
    }

        public void removeCategoria(Categoria c){
        if(categorias.contains(c)){
            categorias.remove(c);
        }

        if (c.getPeliculas().contains(this)){
            c.getPeliculas().remove(this);
        }
    }

    // Metodos helpers para añadir y elinminar idiomas
    public void addIdioma(Idioma i){
        idiomas.add(i);
        i.getPeliculas().add(this);
    }

    public void removeIdioma(Idioma i){
        if(idiomas.contains(i)){
            idiomas.remove(i);
        }

        if (i.getPeliculas().contains(this)){
            i.getPeliculas().remove(this);
        }
    }

    // Metodos helpers para añadir y elinminar la critica, ya que este es el lado One
    public void addCritica(Critica c) {
        criticas.add(c);
        c.setPelicula(this);
    }

    public void removeCritica(Critica c) {
        criticas.remove(c);
        c.setPelicula(null);
    }

}
