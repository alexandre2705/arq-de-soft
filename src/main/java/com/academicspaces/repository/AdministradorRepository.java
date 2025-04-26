package com.academicspaces.repository;

import com.academicspaces.entity.Administrador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdministradorRepository extends JpaRepository<Administrador, UUID> {
    // Exemplo: encontrar administrador por email (se necessário)
    Optional<Administrador> findByEmail(String email);
} 