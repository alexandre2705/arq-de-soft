package com.academicspaces.repository;

import com.academicspaces.entity.Professor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface ProfessorRepository extends JpaRepository<Professor, UUID> {
    // Métodos de consulta personalizados podem ser adicionados aqui
} 