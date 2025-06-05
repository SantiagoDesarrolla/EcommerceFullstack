package com.tienda.backend.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String nombre;
    
    @Column(nullable = false)
    private Double precio;
    
    @Column(nullable = false)
    private String talla;
    
    @Column(nullable = false)
    private String color;
    
    @Column(nullable = false)
    private Integer stock;

    @Column(name = "imagen_url")
    private String imagenUrl; 
}
