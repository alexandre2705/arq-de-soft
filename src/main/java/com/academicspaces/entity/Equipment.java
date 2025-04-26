package com.academicspaces.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "equipments") // Nome da tabela no banco
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Equipment {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(nullable = false, length = 100)
    private String name;

    // Adicionar outros campos como 'description', 'roomId', etc. se necessário
    // @Column(length = 255)
    // private String description;
    
    // @ManyToOne(fetch = FetchType.LAZY)
    // @JoinColumn(name = "espaco_id") // Chave estrangeira para Espaco
    // private Espaco espaco;
} 