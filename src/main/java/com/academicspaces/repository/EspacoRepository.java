package com.academicspaces.repository;

import com.academicspaces.entity.Espaco;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface EspacoRepository extends JpaRepository<Espaco, UUID> {

    // Método para encontrar espaços disponíveis (exemplo)
    List<Espaco> findByStatus(com.academicspaces.enums.StatusEspaco status);

    // Você pode adicionar outros métodos de consulta personalizados aqui
    // Ex: findBySigla(String sigla);
} 