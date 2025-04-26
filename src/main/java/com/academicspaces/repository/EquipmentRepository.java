package com.academicspaces.repository;

import com.academicspaces.entity.Equipment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, UUID> {
    // Métodos de consulta personalizados podem ser adicionados aqui
} 